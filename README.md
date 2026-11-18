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

## Interactive character hero

The hero can show an animated character of me that reacts to the cursor:
look left / look right as you move, and when you rest in the centre it notices you,
slides its headphones off, waves and points down at the portfolio.
It's a short AI video turned into frames, which the site plays forward and back
(`client/src/components/CharacterHero.jsx`). Until frames exist, the hero shows the terminal card.

### 1. Make the video (Google Flow / Veo, image-to-video, 8 s)

Upload a clear front-facing photo of yourself as the reference image, then use:

```
Stylized 3D animated character (Pixar-style) based on the man in the reference photo:
young Indian man, short dark hair, same face, wearing a dark green suit jacket over a white shirt.
He sits at a desk behind an open silver laptop, wearing over-ear white headphones.
Plain solid dark navy background (#0b0d14), soft studio key light, subtle rim light.
Medium shot from the chest up, centred, with empty space above his head.
Camera completely locked: no zoom, no pan, no cuts, no scene changes. One continuous shot.

Action, in this exact order:
0–2 s: he types on the laptop, focused, small natural movements.
2–3 s: he glances to his left (screen left).
3–4 s: he glances to his right (screen right).
4–5 s: he looks straight into the camera, noticing the viewer, and smiles.
5–6 s: he slides the headphones down around his neck.
6–7 s: he waves hello at the camera.
7–8 s: he points down toward the bottom of the frame.
```

Generate a few takes and keep the one where the face looks most like you and the camera stays still.

### 2. Turn it into frames

```bash
bash scripts/make-frames.sh path/to/character.mp4
```

Needs ffmpeg. This writes `client/public/character/frame_0001.webp …` and `config.json`.

### 3. Match the timings

Watch your video and put the times (in seconds) into `client/public/character/config.json`:

| key | when |
|---|---|
| `idleEnd` | last moment he's just typing |
| `lookLeft` | moment he looks furthest left |
| `lookRight` | moment he looks furthest right |
| `greetStart` | moment he starts looking at the camera |

Run `npm run dev` to check, then commit and push. Vercel redeploys automatically.
