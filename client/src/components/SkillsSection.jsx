import Section, { SectionHeading, Stagger } from './Section';
import SpotlightCard from './SpotlightCard';
import { skills } from '../data/portfolio';

const icons = {
  layout: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></>,
  server: <><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
  database: <><ellipse cx="12" cy="5.5" rx="8" ry="3" /><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  sparkles: <><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.5 17.3a1.6 1.6 0 0 0 2.3 2.3l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.2-.4-.4-2.2z" />,
  rocket: <><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M9 15l-3-3c1-4 4.5-8.5 12-9-.5 7.5-5 11-9 12z" /><circle cx="14.5" cy="9.5" r="1.5" /></>,
};

function SkillIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Marquee({ items, reverse }) {
  // the list is doubled so the loop is seamless
  return (
    <div className={`marquee ${reverse ? 'reverse' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((s, i) => (
          <span key={i} className="marquee-chip" style={{ '--accent': s.accent }}>
            <i />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const all = skills.flatMap((g) => g.items.map((name) => ({ name, accent: g.accent })));
  const half = Math.ceil(all.length / 2);

  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="skills"
        title="What I work with"
        sub="The tools I use every day to take a feature from mockup to deployed product, with AI coding tools to move faster."
      />

      <div className="marquees">
        <Marquee items={all.slice(0, half)} />
        <Marquee items={all.slice(half)} reverse />
      </div>

      <Stagger className="bento">
        {skills.map((g) => (
          <SpotlightCard
            key={g.group}
            className={`bento-card ${g.span === 2 ? 'wide' : ''}`}
            style={{ '--accent': g.accent }}
          >
            <div className="bento-bar">
              <span className="dots"><i /><i /><i /></span>
              <span className="file">{g.file}</span>
              <span className="count">{String(g.items.length).padStart(2, '0')}</span>
            </div>
            <div className="bento-body">
              <div className="bento-head">
                <span className="bento-icon"><SkillIcon name={g.icon} /></span>
                <div>
                  <h3>{g.group}</h3>
                  <p>{g.blurb}</p>
                </div>
              </div>
              <div className="chips">
                {g.items.map((t, i) => (
                  <span key={t} className="chip" style={{ '--i': i }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </Stagger>
    </Section>
  );
}
