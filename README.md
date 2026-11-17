# Rohinth S — Portfolio (MERN)

My personal portfolio, built with the MERN stack:

| Layer | Tech |
|---|---|
| **M**ongoDB | MongoDB Atlas + Mongoose, stores contact-form messages |
| **E**xpress | REST API (`/api/contact`, `/api/health`) |
| **R**eact | React 19 + Vite frontend with scroll and hover animations |
| **N**ode.js | Runs the API locally / on Render or Coolify, and as a serverless function on Vercel |

## Project structure

```
client/                 React app (Vite)
  src/components/       Navbar, Hero, Sections, Contact, Footer…
  src/data/portfolio.js All content: skills, experience, projects, socials
server/
  app.js                Express app (shared by local server and Vercel)
  index.js              Local / long-running server (also serves the built React app)
  db.js                 Cached MongoDB connection
  models/Message.js     Mongoose model
  routes/contact.js     POST (save message) and GET (read messages, admin key)
api/index.js            Vercel serverless entry → server/app.js
vercel.json             Vercel build and /api routing
```

To change any text on the site, edit `client/src/data/portfolio.js`.

## Run locally

```bash
npm install
cp .env.example .env      # then put your MongoDB URI and an ADMIN_KEY in .env
npm run dev               # React on http://localhost:5173, API on http://localhost:5000
```

## MongoDB Atlas setup (free)

1. Create a free M0 cluster on mongodb.com/atlas.
2. **Database Access** → add a database user with a password.
3. **Network Access** → add `0.0.0.0/0` so Vercel's servers can connect.
4. **Connect → Drivers** → copy the connection string into `MONGODB_URI`.

## Deploy to Vercel

1. vercel.com → **Add New → Project** → import this repo.
2. Vercel reads `vercel.json`, so leave the build settings as they are.
3. **Environment Variables** → add `MONGODB_URI` and `ADMIN_KEY` (and optionally `MONGODB_DB`).
4. **Deploy**. Check `https://<your-site>.vercel.app/api/health` returns `{"ok":true}`.

## Deploy to Render / Coolify (one Node server)

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Add the same environment variables. The server serves the React app and the API together.

## Reading contact messages

```bash
curl https://<your-site>/api/contact -H "x-admin-key: <ADMIN_KEY>"
```

Or open your cluster in MongoDB Atlas → **Browse Collections** → `portfolio.messages`.
