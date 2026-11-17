import Section, { SectionHeading, Stagger } from './Section';
import SpotlightCard from './SpotlightCard';
import { experience, projects, skills, stats } from '../data/portfolio';

export function About() {
  return (
    <Section id="about" innerClassName="about-grid">
      <div>
        <div className="eyebrow">// about</div>
        <h2>From the shop floor to the full stack</h2>
        <p>
          I'm a Full Stack Developer who works on the whole MERN stack. At Trueline Research I build end-to-end web
          applications. I design responsive interfaces with React and Tailwind CSS, build secure REST APIs with Node.js
          and Express, and model backend data in MongoDB.
        </p>
        <p>
          I began my career in manufacturing. At Ashok Leyland I worked on a robotic automation line, using Kaizen
          improvements to raise reliability, and at Nexteer Automotive I managed purchasing, maintenance stores and capex
          budgets. That's where I learned to think in systems, costs and real users. I then moved into software through
          three development internships and have been building full-time ever since.
        </p>
      </div>
      <Stagger className="stats">
        {stats.map((s) => (
          <SpotlightCard key={s.label} className="stat">
            <b>{s.value}</b>
            <span>{s.label}</span>
          </SpotlightCard>
        ))}
      </Stagger>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="skills"
        title="What I work with"
        sub="The tools I use every day to take a feature from mockup to deployed product, with AI coding tools to move faster."
      />
      <Stagger className="skills">
        {skills.map((g) => (
          <SpotlightCard key={g.group} className="skill-card">
            <h3>{g.group}</h3>
            <div className="tags">
              {g.items.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </Stagger>
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
