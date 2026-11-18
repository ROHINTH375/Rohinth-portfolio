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
  - Cursor left of the character  → looks left.  Right of it → looks right.
  - Cursor over the character     → notices you and greets; goes back to typing when you leave.
  - Cursor still for 3 s          → goes back to typing.
  - Phones/tablets (no mouse): greets once when visible; tap toggles.
  - Reduced motion: no idle typing loop; the cursor still controls it.
*/

const pad = (n, w) => String(n).padStart(w, '0');
const frameUrl = (pattern, i) =>
  '/character/' + pattern.replace(/%0(\d)d/, (_, w) => pad(i + 1, Number(w)));

export default function CharacterHero({ onUnavailable }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const state = useRef({
    cfg: null, imgs: [], cur: 0, target: 0, mode: 'idle', idleDir: 1,
    last: 0, raf: 0,
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
    // Any mouse/trackpad → cursor control. Devices without one (phones) greet once when visible; tap toggles.
    const hasMouse = window.matchMedia('(any-pointer: fine)').matches;

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

    // ---- behaviour, relative to where the character is on screen ----
    //  cursor left of the card   → looks left
    //  cursor right of the card  → looks right
    //  cursor over the card      → greets (holds while you stay), goes back to work when you leave
    //  cursor still for 3 s      → goes back to typing
    const pointer = { x: -1, y: -1, movedAt: 0, inside: false };
    let hoverSince = 0;

    const greet = () => {
      s.mode = 'greet';
      s.target = cfg.idx.end;
    };
    const ungreet = () => {
      s.mode = 'idle';
    };

    const decide = (now) => {
      if (pointer.x < 0) return;
      const r = canvas.getBoundingClientRect();
      const pad = 24;
      const over =
        pointer.inside &&
        pointer.x >= r.left - pad && pointer.x <= r.right + pad &&
        pointer.y >= r.top - pad && pointer.y <= r.bottom + pad;

      if (over) {
        if (!hoverSince) hoverSince = now;
        if (s.mode !== 'greet' && now - hoverSince > 250) greet();
        return;
      }
      hoverSince = 0;
      if (!pointer.inside || now - pointer.movedAt > 3000) {
        s.mode = 'idle';
        return;
      }
      if (pointer.x < r.left) {
        s.mode = 'left';
        s.target = cfg.idx.left;
      } else if (pointer.x > r.right) {
        s.mode = 'right';
        s.target = cfg.idx.right;
      } else {
        s.mode = 'idle'; // directly above/below the card
      }
    };

    const tick = (t) => {
      s.raf = requestAnimationFrame(tick);
      if (hasMouse) decide(t);
      if (t - s.last < step) return;
      s.last = t;

      const prev = s.cur;
      if (s.mode === 'idle') {
        if (s.cur > cfg.idx.idleEnd) {
          // coming back from a look or the greeting: rewind quickly
          s.cur = Math.max(cfg.idx.idleEnd, s.cur - Math.max(1, Math.ceil((s.cur - cfg.idx.idleEnd) / 4)));
        } else if (reduce) {
          s.cur = Math.max(0, s.cur - Math.max(1, Math.ceil(s.cur / 4)));
        } else {
          // ping-pong through the typing frames
          let next = s.cur + s.idleDir;
          if (next > cfg.idx.idleEnd || next < 0) {
            s.idleDir *= -1;
            next = s.cur + s.idleDir;
          }
          s.cur = Math.max(0, next);
        }
      } else if (s.cur !== s.target) {
        const dist = Math.abs(s.target - s.cur);
        const speed =
          s.mode === 'greet'
            ? s.cur < cfg.idx.greetStart ? 5 : 1 // rush to the greeting, then natural speed
            : Math.max(1, Math.min(6, Math.ceil(dist / 4))); // follow the cursor fast
        s.cur += Math.sign(s.target - s.cur) * Math.min(speed, dist);
      }

      if (!draw(s.cur)) s.cur = prev; // frame not loaded yet: hold the previous one
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.movedAt = performance.now();
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onTap = () => (s.mode === 'greet' ? ungreet() : greet());

    draw(0);
    let io;
    if (!hasMouse) {
      io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) {
          setTimeout(greet, 900);
          io.disconnect();
        }
      }, { threshold: 0.5 });
      io.observe(canvas);
      canvas.addEventListener('click', onTap);
    } else {
      window.addEventListener('mousemove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
    }
    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onTap);
      io?.disconnect();
    };
  }, [ready]);

  return (
    <div className={`character enter ${ready ? 'is-ready' : ''}`} style={{ animationDelay: '.35s' }}>
      <div className="character-frame">
        <canvas ref={canvasRef} aria-label="Animated character of Rohinth that reacts to your cursor" role="img" />
      </div>
      <div className="character-hint">move your cursor around · hover over me to say hi</div>
    </div>
  );
}
