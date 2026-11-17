import { useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useReveal';

// Card with a glow that follows the cursor and an optional subtle 3D tilt.
export default function SpotlightCard({ as: Tag = 'div', tilt = false, className = '', style, children, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    if (tilt) {
      const rx = (y / r.height - 0.5) * -6;
      const ry = (x / r.width - 0.5) * 6;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    }
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Tag ref={ref} className={className} style={style} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </Tag>
  );
}
