import { Router } from 'express';
import connectDB from '../db.js';
import Message from '../models/Message.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Simple in-memory rate limit: 5 messages per IP per 10 minutes.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

// POST /api/contact — save a message from the portfolio contact form
router.post('/', async (req, res) => {
  const { name = '', email = '', message = '', company = '' } = req.body || {};

  // Honeypot: real visitors never fill the hidden "company" field.
  if (company) return res.status(200).json({ ok: true });

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages. Please try again in a few minutes.' });
  }

  const clean = { name: String(name).trim(), email: String(email).trim(), message: String(message).trim() };
  if (!clean.name || !clean.email || !clean.message) {
    return res.status(400).json({ error: 'Please fill in your name, email and message.' });
  }
  if (!EMAIL_RE.test(clean.email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (clean.name.length > 80 || clean.email.length > 120 || clean.message.length > 2000) {
    return res.status(400).json({ error: 'Your message is too long.' });
  }

  await connectDB();
  await Message.create(clean);
  res.status(201).json({ ok: true });
});

// GET /api/contact — list messages (private: needs the x-admin-key header)
router.get('/', async (req, res) => {
  const key = process.env.ADMIN_KEY;
  if (!key || req.get('x-admin-key') !== key) return res.status(401).json({ error: 'Unauthorized' });

  await connectDB();
  const messages = await Message.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json(messages);
});

export default router;
