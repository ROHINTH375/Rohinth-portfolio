import { useCallback, useEffect, useState } from 'react';
import CharacterHero from './CharacterHero';
import { profile, resumeUrl, socials } from '../data/portfolio';
import { prefersReducedMotion } from '../hooks/useReveal';
import Icon from './Icons';

const C = ({ c, children }) => <span className={c}>{children}</span>;

const termLines = [
  <><C c="c4">$</C> cat rohinth.json</>,
  <>{'{'}</>,
  <>  <C c="c2">"role"</C>: <C c="c1">"Full Stack Developer"</C>,</>,
  <>  <C c="c2">"stack"</C>: [<C c="c1">"MongoDB"</C>, <C c="c1">"Express"</C>,</>,
  <>            <C c="c1">"React"</C>, <C c="c1">"Node.js"</C>],</>,
  <>  <C c="c2">"current"</C>: <C c="c1">"Trueline Research"</C>,</>,
  <>  <C c="c2">"shipping"</C>: <C c="c3">true</C></>,
  <>{'}'}</>,
  <><C c="c4">$</C> git log --oneline | wc -l</>,
  <><C c="c1">∞ commits and counting</C></>,
];

function Terminal() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(termLines.length);
      return;
    }
    const timers = termLines.map((_, i) => setTimeout(() => setShown(i + 1), 900 + i * 170));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="term enter" aria-hidden="true" style={{ animationDelay: '.35s' }}>
      <div className="term-bar"><i /><i /><i /></div>
      <pre>
        {termLines.map((line, i) => (
          <span key={i} className={`ln ${i < shown ? 'on' : ''}`}>
            {line}
            {i === termLines.length - 1 && <span className="cursor" />}
          </span>
        ))}
      </pre>
    </div>
  );
}

export default function Hero() {
  const d = (s) => ({ animationDelay: `${s}s` });
  // Show the interactive character when its frames exist; otherwise fall back to the terminal.
  const [hasCharacter, setHasCharacter] = useState(true);
  const noCharacter = useCallback(() => setHasCharacter(false), []);
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <div className="status enter" style={d(0.05)}>
            <span className="dot" />
            {profile.status}
          </div>
          <h1 className="enter" style={d(0.15)}>
            Hi, I'm Rohinth.
            <br />
            <span className="grad">I build for the web, end to end.</span>
          </h1>
          <p className="lead enter" style={d(0.3)}>
            Full Stack Developer at <b>Trueline Research</b>, building production web apps with the <b>MERN stack</b>:
            React UIs, secure Node.js/Express APIs, and MongoDB data models.
          </p>
          <div className="ctas enter" style={d(0.42)}>
            <a className="btn primary" href="#projects">View my work →</a>
            <a className="btn ghost" href={resumeUrl} target="_blank" rel="noreferrer">Résumé ↓</a>
            <a className="btn ghost" href="#contact">Get in touch</a>
          </div>
          <div className="meta enter" style={d(0.54)}>
            <span>📍 {profile.location}</span>
            <span>💼 1+ yr full-time · 3 dev internships</span>
          </div>
          <div className="hero-socials enter" style={d(0.66)}>
            {socials.map((s) => (
              <a key={s.name} href={s.url} aria-label={s.name} style={{ '--brand': s.color }} target="_blank" rel="noreferrer">
                <Icon name={s.icon} />
              </a>
            ))}
          </div>
        </div>
        {hasCharacter ? <CharacterHero onUnavailable={noCharacter} /> : <Terminal />}
      </div>
    </header>
  );
}
