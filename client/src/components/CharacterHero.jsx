import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useReveal';

/*
  Interactive character driven by a frame sequence (video → frames → cursor control).

  Frames live in client/public/character/ and are described by config.json:
  {
    "count": 120, "fps": 15, "pattern": "frame_%04d.webp",
    "segments": {            // in seconds of the source video
      "idleEnd": 2.0,        // 0 → idleEnd: working on the laptop (loops)
      "lookLeft": 2.6,       // moment the character looks furthest left
      "lookRight": 3.6,      // moment the character looks furthest right
      "greetStart": 4.0      // greetStart → end: notices you, removes headset, waves, points
    }
  }

  Behaviour
  - Cursor in the left third  → plays to the "look left" frame and holds.
  - Cursor in the right third → plays to the "look right" frame and holds.
  - Cursor in the centre for a moment (or a tap/click) → plays the greeting once and holds the last frame.
  - Otherwise → gently loops the working/idle frames.
  - Phones/tablets (no mouse): the greeting plays once when the hero is visible.
  - Reduced motion: no idle loop; the cursor still controls it.
*/

const pad = (n, w) => String(n).padStart(w, '0');
const frameUrl = (pattern, i) =>
  '/character/' + pattern.replace(/%0(\d)d/, (_, w) => pad(i + 1, Number(w)));

export default function CharacterHero({ onUnavailable }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const state = useRef({
    cfg: null, imgs: [], cur: 0, target: 0, mode: 'idle', idleDir: 1,
    greeted: false, centreSince: 0, last: 0, raf: 0,
  });

  // Load config + frames
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/character/config.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('no character config');
        const cfg = await res.json();
        const f = (sec) => Math.max(0, Math.min(cfg.count - 1, Math.round(sec * cfg.fps)));
        cfg.idx = {
          idleEnd: f(cfg.segments.idleEnd),
          left: f(cfg.segments.lookLeft),
          right: f(cfg.segments.lookRight),
          greetStart: f(cfg.segments.greetStart),
          end: cfg.count - 1,
        };
        const s = state.current;
        s.cfg = cfg;

        // Load idle frames first so it can start quickly, then the rest.
        const load = (i) =>
          new Promise((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = frameUrl(cfg.pattern, i);
            s.imgs[i] = img;
          });
        const first = Array.from({ length: cfg.idx.idleEnd + 1 }, (_, i) => load(i));
        const firstImgs = await Promise.all(first);
        if (cancelled) return;
        if (!firstImgs[0]) throw new Error('frames missing');
        setReady(true);
        for (let i = cfg.idx.idleEnd + 1; i < cfg.count; i++) load(i);
      } catch {
        if (!cancelled) onUnavailable?.();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onUnavailable]);

  // Animation loop + input
  useEffect(() => {
    if (!ready) return;
    const s = state.current;
    const { cfg } = s;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    const step = 1000 / cfg.fps;

    const draw = (i) => {
      const img = s.imgs[i];
      if (!img || !img.complete || !img.naturalWidth) return false;
      if (canvas.width !== img.naturalWidth) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return true;
    };

    const greet = () => {
      if (s.greeted) return;
      s.greeted = true;
      s.mode = 'greet';
      s.target = cfg.idx.end;
    };

    const tick = (t) => {
      s.raf = requestAnimationFrame(tick);
      if (t - s.last < step) return;
      s.last = t;

      const prev = s.cur;
      if (s.mode === 'idle' && reduce) {
        // reduced motion: no idle loop, just rest on the first frame
        if (s.cur > 0) s.cur -= Math.max(1, Math.ceil(s.cur / 5));
      } else if (s.mode === 'idle') {
        // ping-pong through the working frames
        let next = s.cur + s.idleDir;
        if (s.cur > cfg.idx.idleEnd) next = Math.max(cfg.idx.idleEnd, s.cur - Math.max(1, Math.ceil((s.cur - cfg.idx.idleEnd) / 5))); // coming back from a look
        else if (next > cfg.idx.idleEnd || next < 0) {
          s.idleDir *= -1;
          next = s.cur + s.idleDir;
        }
        s.cur = Math.max(0, next);
      } else if (s.cur !== s.target) {
        const dist = Math.abs(s.target - s.cur);
        let speed;
        if (s.mode === 'greet') {
          // hurry through the look-around frames, then play the greeting at natural speed
          speed = s.cur < cfg.idx.greetStart ? 4 : 1;
        } else {
          // follow the cursor quickly: big jumps when far away, easing in as it arrives
          speed = Math.max(1, Math.min(6, Math.ceil(dist / 5)));
        }
        s.cur += Math.sign(s.target - s.cur) * Math.min(speed, dist);
      }

      // Centre dwell triggers the greeting
      if (!s.greeted && s.mode === 'centre' && s.centreSince && t - s.centreSince > 450) greet();

      if (!draw(s.cur)) s.cur = prev; // frame not loaded yet: hold the previous one
    };

    const onMove = (e) => {
      if (s.greeted) return;
      const x = e.clientX / window.innerWidth;
      if (x < 0.36) {
        s.mode = 'left';
        s.target = cfg.idx.left;
        s.centreSince = 0;
      } else if (x > 0.64) {
        s.mode = 'right';
        s.target = cfg.idx.right;
        s.centreSince = 0;
      } else {
        if (s.mode !== 'centre') s.centreSince = performance.now();
        s.mode = 'centre';
        s.target = s.cur;
      }
    };
    const onLeave = () => {
      if (!s.greeted) {
        s.mode = 'idle';
        s.centreSince = 0;
      }
    };

    draw(0);
    // Any mouse/trackpad → cursor control. Only devices with no fine pointer (phones) auto-greet.
    const hasMouse = window.matchMedia('(any-pointer: fine)').matches;
    let io;
    if (!hasMouse) {
      io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) setTimeout(greet, 900);
      }, { threshold: 0.5 });
      io.observe(canvas);
    } else {
      window.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
    }
    canvas.addEventListener('click', greet);
    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', greet);
      io?.disconnect();
    };
  }, [ready]);

  return (
    <div className={`character enter ${ready ? 'is-ready' : ''}`} style={{ animationDelay: '.35s' }}>
      <div className="character-frame">
        <canvas ref={canvasRef} aria-label="Animated character of Rohinth that reacts to your cursor" role="img" />
      </div>
      <div className="character-hint">move your cursor ↔ · hover the centre to say hi</div>
    </div>
  );
}
