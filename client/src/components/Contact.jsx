import Section, { Stagger } from './Section';
import Icon from './Icons';
import { socials } from '../data/portfolio';

export default function Contact() {
  return (
    <Section id="contact" className="contact">
      <div className="eyebrow">// contact</div>
      <h2>Let's build something together</h2>
      <p className="sub">
        I'm open to full-stack developer roles in Chennai and other cities, on-site, hybrid or remote. If you're hiring
        or have a project in mind, I'd like to hear about it.
      </p>

      <Stagger className="socials">
        {socials.map((s) => (
          <a key={s.name} className="social" href={s.url} aria-label={s.name} style={{ '--brand': s.color }} target="_blank" rel="noreferrer">
            <Icon name={s.icon} />
            <span>{s.name}</span>
          </a>
        ))}
      </Stagger>
    </Section>
  );
}
