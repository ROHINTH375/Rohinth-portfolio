import express from 'express';
import cors from 'cors';
import contactRouter from './routes/contact.js';

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

// Same-origin on Vercel needs no CORS; CLIENT_ORIGIN allows a separately hosted frontend.
const origins = (process.env.CLIENT_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
if (origins.length) app.use('/api', cors({ origin: origins }));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/contact', contactRouter);

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Express 5 forwards errors from async handlers here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error. Please try again later.' });
});

export default app;
