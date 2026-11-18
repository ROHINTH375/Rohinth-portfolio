import Section, { SectionHeading, Stagger } from './Section';
import SpotlightCard from './SpotlightCard';
import { education, experience, projects, resumeUrl, stats } from '../data/portfolio';

export function About() {
  return (
    <Section id="about" innerClassName="about-grid">
      <div>
        <div className="eyebrow">// about</div>
        <h2>From the shop floor to the full stack</h2>
        <p>
          I'm a MERN stack developer at Trueline Research, where I build and run four live production websites. I design
          responsive interfaces with React and Tailwind CSS, build secure REST APIs with Node.js, Express and JWT
          authentication, and model data in MongoDB.
        </p>
        <p>
          My path here was unusual. I studied Mechatronics, then worked on a robotic automation line at Ashok Leyland,
          using Kaizen improvements to raise reliability, and managed purchasing and capex budgets at Nexteer Automotive.
          That taught me to think in systems, costs and real users. I moved into software through three development
          internships and have been building full-time ever since.
        </p>
        <p className="looking">
          <span className="dot" /> Looking for a full-stack role on a product team, where I can own features end to end.
          Available to join immediately and open to relocating.
        </p>
        <div className="about-ctas">
          <a className="btn primary" href={resumeUrl} target="_blank" rel="noreferrer">Download résumé ↓</a>
          <a className="btn ghost" href="#contact">Get in touch</a>
        </div>
      </div>
      <div className="about-side">
        <Stagger className="stats">
          {stats.map((s) => (
            <SpotlightCard key={s.label} className="stat">
              <b>{s.value}</b>
              <span>{s.label}</span>
            </SpotlightCard>
          ))}
        </Stagger>
        <SpotlightCard className="edu">
          <div className="edu-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /><path d="M22 9v6" /></svg>
          </div>
          <div>
            <div className="edu-label">education</div>
            <h3>{education.degree}</h3>
            <p>{education.school} · {education.years} · {education.grade}</p>
          </div>
        </SpotlightCard>
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading eyebrow="experience" title="Where I've worked" sub="Full-time work and internships, most recent first." />
      <Stagger className="timeline">
        {experience.map((j) => (
          <div key={j.company + j.when} className={`job ${j.current ? 'now' : ''}`}>
            <div className="job-head">
              <h3>
                {j.title} <span className="co">@ {j.company}</span>
                {j.current && <span className="badge">current</span>}
              </h3>
              <span className="when">{j.when}</span>
            </div>
            <div className="loc">{j.loc}</div>
            <ul>
              {j.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="projects"
        title="Things I've built"
        sub="Live production websites I've built and maintain at Trueline Research. Click any card to visit the site."
      />
      <Stagger className="projects">
        {projects.map((p, i) => (
          <SpotlightCard key={p.url} as="a" tilt className="proj" href={p.url} target="_blank" rel="noreferrer">
            <div className="proj-top">
              <div className="folder">{String(i + 1).padStart(2, '0')}</div>
              <div className="proj-links"><span>{p.host} ↗</span></div>
            </div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </Stagger>
    </Section>
  );
}
