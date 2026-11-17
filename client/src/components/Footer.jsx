import Icon from './Icons';
import { socials } from '../data/portfolio';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="hero-socials footer-socials">
          {socials.map((s) => (
            <a key={s.name} href={s.url} aria-label={s.name} style={{ '--brand': s.color }} target="_blank" rel="noreferrer">
              <Icon name={s.icon} />
            </a>
          ))}
        </div>
        Designed & built by Rohinth S with the MERN stack ·{' '}
        <span style={{ color: 'var(--accent2)' }}>$ git commit -m "still shipping"</span>
      </div>
    </footer>
  );
}
