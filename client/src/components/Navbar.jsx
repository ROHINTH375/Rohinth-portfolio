import { useEffect, useState } from 'react';

const links = ['about', 'skills', 'experience', 'projects', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 10);
      setShowTop(y > 600);
      setProgress(h > 0 ? (y / h) * 100 : 0);
      let cur = null;
      links.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="progress" style={{ width: `${progress}%` }} />
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="wrap">
          <a href="#top" className="logo">
            rohinth<span>.dev</span>
          </a>
          <div className="links">
            {links.map((id) => (
              <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
                {id[0].toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <a href="#top" className={`to-top ${showTop ? 'show' : ''}`} aria-label="Back to top">
        ↑
      </a>
    </>
  );
}
