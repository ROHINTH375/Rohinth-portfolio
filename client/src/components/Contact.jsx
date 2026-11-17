import { useState } from 'react';
import Section, { Stagger } from './Section';
import Icon from './Icons';
import { socials } from '../data/portfolio';

const API_URL = import.meta.env.VITE_API_URL || '';
const empty = { name: '', email: '', message: '', company: '' }; // "company" is a hidden spam trap

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', msg: '' });
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setForm(empty);
      setStatus({ state: 'ok', msg: "Thanks! Your message is in. I'll get back to you soon." });
    } catch (err) {
      const reason = err instanceof TypeError ? "Couldn't reach the server." : err.message;
      setStatus({
        state: 'err',
        msg: `${reason} You can also reach me on LinkedIn, WhatsApp or email below.`,
      });
    }
  };

  return (
    <Section id="contact" className="contact">
      <div className="eyebrow">// contact</div>
      <h2>Let's build something together</h2>
      <p className="sub">
        I'm open to full-stack developer roles in Chennai and other cities, on-site, hybrid or remote. If you're hiring
        or have a project in mind, I'd like to hear about it.
      </p>

      <form className="contact-form" onSubmit={submit} noValidate={false}>
        <div className="row">
          <input name="name" placeholder="Your name" value={form.name} onChange={update} required maxLength={80} />
          <input name="email" type="email" placeholder="Your email" value={form.email} onChange={update} required maxLength={120} />
        </div>
        <textarea name="message" placeholder="Your message" value={form.message} onChange={update} required maxLength={2000} />
        <input className="hp" name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={update} aria-hidden="true" />
        <button className="btn primary" type="submit" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Sending…' : 'Send message →'}
        </button>
        {status.msg && <div className={`form-msg ${status.state}`}>{status.msg}</div>}
      </form>

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
