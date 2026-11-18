import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useReveal';

/*
  Full-screen interactive character, driven by a frame sequence (video → frames → cursor control).

  Frames live in client/public/character/ and are described by config.json:
  {
    "count": 119, "fps": 15, "pattern": "frame_%04d.webp",
    "segments": { "idleEnd": 2.9, "lookLeft": 3.25, "lookRight": 5.2, "greetStart": 5.9 },  // seconds
    "subject": { "x": 0.64, "left": 0.37, "right": 0.9, "top": 0.05 }  // where the person is in the frame (0–1)
  }

  Behaviour
  - Cursor left of the character  → looks left.  Right of it → looks right.
  - Cursor over the character     → notices you and greets; goes back to typing when you leave.
  - Cursor still for 3 s          → goes back to typing.
  - Phones/tablets (no mouse): greets once when visible; tap toggles.
  - Reduced motion: no idle typing loop; the cursor still controls it.
*/

const pad = (n, w) => String(n).padStart(w, '0');
const frameUrl = (pattern, i) => '/character/' + pattern.replace(/%0(\d)d/, (_, w) => pad(i + 1, Number(w)));
const DEFAULT_SUBJECT = { x: 0.64, left: 0.37, right: 0.9, top: 0.05 };

export default function CharacterHero({ onUnavailable, onReady }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const state = useRef({ cfg: null, imgs: [], cur: 0, target: 0, mode: 'idle', idleDir: 1, last: 0, raf: 0 });

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
        cfg.subject = { ...DEFAULT_SUBJECT, ...(cfg.subject || {}) };
        const s = state.current;
        s.cfg = cfg;

        const load = (i) =>
          new Promise((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = frameUrl(cfg.pattern, i);
            s.imgs[i] = img;
          });
        // typing frames first so it can start quickly, then the rest in the background
        const firstImgs = await Promise.all(Array.from({ length: cfg.idx.idleEnd + 1 }, (_, i) => load(i)));
        if (cancelled) return;
        if (!firstImgs[0]) throw new Error('frames missing');
        setReady(true);
        onReady?.();
        for (let i = cfg.idx.idleEnd + 1; i < cfg.count; i++) load(i);
      } catch {
        if (!cancelled) onUnavailable?.();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onUnavailable, onReady]);

  // Drawing, animation loop and input
  useEffect(() => {
    if (!ready) return;
    const s = state.current;
    const { cfg } = s;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    const step = 1000 / cfg.fps;
    const hasMouse = window.matchMedia('(any-pointer: fine)').matches;
    let layout = null; // how the frame is fitted on screen (object-fit: cover, positioned)

    const BG = '#2b384b'; // matches the video's background so the edges blend

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      const img = s.imgs[0];
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const sub = cfg.subject;
      const personW = (sub.right - sub.left) * iw;
      const wide = r.width >= 880;
      let scale, cx, dy;
      if (wide) {
        // full height, but never wider than half the screen, standing on the right…
        scale = Math.min(r.height / ih, (0.5 * r.width) / personW);
        // …and never behind the text: keep his head to the right of the copy, shrinking if needed
        const copy = document.querySelector('.hero-copy');
        const copyRight = copy ? copy.getBoundingClientRect().right - r.left + 12 : 0.45 * r.width;
        const HEAD_L = 0.42, HEAD_R = 0.78; // head + headphones, as a fraction of the frame width
        for (let k = 0; k < 12; k++) {
          const dw = iw * scale;
          const dxCentre = 0.71 * r.width - sub.x * dw;
          const dxText = copyRight - HEAD_L * dw;
          const dx = Math.max(dxCentre, dxText);
          if (dx + HEAD_R * dw <= r.width - 16) break;
          scale *= 0.94;
        }
        const dw = iw * scale;
        cx = Math.max(0.71 * r.width - sub.x * dw, copyRight - HEAD_L * dw) + sub.x * dw;
        dy = r.height - ih * scale;
      } else {
        // phones: across the top of the screen, text below
        scale = Math.min(r.width / personW, (0.56 * r.height) / ih);
        cx = 0.5 * r.width;
        dy = 64;
      }
      const dw = iw * scale, dh = ih * scale;
      layout = { dx: (cx - sub.x * dw) * dpr, dy: dy * dpr, dw: dw * dpr, dh: dh * dpr, dpr, wide };
      draw(s.cur);
    };

    const fade = (x0, y0, x1, y1, rx, ry, rw, rh) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, BG);
      g.addColorStop(1, 'rgba(43,56,75,0)');
      ctx.fillStyle = g;
      ctx.fillRect(rx, ry, rw, rh);
    };

    const draw = (i) => {
      const img = s.imgs[i];
      if (!layout || !img || !img.complete || !img.naturalWidth) return false;
      const { dx, dy, dw, dh, wide } = layout;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, dx, dy, dw, dh);
      // soften the edges of the video into the background
      const fx = dw * 0.14, fy = dh * 0.16;
      fade(dx, 0, dx + fx, 0, dx, dy, fx, dh); // left
      fade(dx + dw, 0, dx + dw - fx * 0.5, 0, dx + dw - fx * 0.5, dy, fx * 0.5, dh); // right
      fade(0, dy, 0, dy + fy, dx, dy, dw, fy); // top
      if (!wide) fade(0, dy + dh, 0, dy + dh - fy, dx, dy + dh - fy, dw, fy); // bottom on phones
      return true;
    };

    // where the person is on screen, in CSS pixels
    const subjectRect = () => {
      const r = canvas.getBoundingClientRect();
      const { dx, dy, dw, dh, dpr } = layout;
      return {
        left: r.left + (dx + cfg.subject.left * dw) / dpr,
        right: r.left + (dx + cfg.subject.right * dw) / dpr,
        top: r.top + (dy + cfg.subject.top * dh) / dpr,
        bottom: r.top + (dy + dh) / dpr,
      };
    };

    const pointer = { x: -1, y: -1, movedAt: 0, inside: false };
    let hoverSince = 0;
    const greet = () => {
      s.mode = 'greet';
      s.target = cfg.idx.end;
    };

    const decide = (now) => {
      if (pointer.x < 0 || !layout) return;
      const p = subjectRect();
      const over = pointer.inside && pointer.x >= p.left && pointer.x <= p.right && pointer.y >= p.top && pointer.y <= p.bottom;
      if (over) {
        if (!hoverSince) hoverSince = now;
        if (s.mode !== 'greet' && now - hoverSince > 250) greet();
        return;
      }
      hoverSince = 0;
      if (!pointer.inside || now - pointer.movedAt > 3000) s.mode = 'idle';
      else if (pointer.x < p.left) {
        s.mode = 'left';
        s.target = cfg.idx.left;
      } else if (pointer.x > p.right) {
        s.mode = 'right';
        s.target = cfg.idx.right;
      } else s.mode = 'idle';
    };

    const tick = (t) => {
      s.raf = requestAnimationFrame(tick);
      if (hasMouse) decide(t);
      if (t - s.last < step) return;
      s.last = t;

      const prev = s.cur;
      if (s.mode === 'idle') {
        if (s.cur > cfg.idx.idleEnd) {
          s.cur = Math.max(cfg.idx.idleEnd, s.cur - Math.max(1, Math.ceil((s.cur - cfg.idx.idleEnd) / 4)));
        } else if (reduce) {
          s.cur = Math.max(0, s.cur - Math.max(1, Math.ceil(s.cur / 4)));
        } else {
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
            ? s.cur < cfg.idx.greetStart ? 5 : 1
            : Math.max(1, Math.min(6, Math.ceil(dist / 4)));
        s.cur += Math.sign(s.target - s.cur) * Math.min(speed, dist);
      }
      if (!draw(s.cur)) s.cur = prev;
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
    const onTap = () => (s.mode === 'greet' ? (s.mode = 'idle') : greet());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let io;
    if (!hasMouse) {
      io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) {
          setTimeout(greet, 900);
          io.disconnect();
        }
      }, { threshold: 0.4 });
      io.observe(canvas);
      canvas.addEventListener('click', onTap);
    } else {
      window.addEventListener('mousemove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
    }
    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onTap);
      io?.disconnect();
    };
  }, [ready]);

  return (
    <div className={`character-bg ${ready ? 'is-ready' : ''}`}>
      <canvas ref={canvasRef} aria-label="Animated character of Rohinth that reacts to your cursor" role="img" />
      <div className="character-shade" />
      <div className="character-hint">move your cursor around · hover over me to say hi</div>
    </div>
  );
}
