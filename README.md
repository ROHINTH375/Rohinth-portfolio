# Rohinth S — Portfolio

Personal portfolio site: a single static `index.html` with no build step.

## Deploy to Vercel

**Option A: GitHub (recommended, auto-deploys on every push)**
1. Create a new repo on GitHub, e.g. `portfolio`.
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/ROHINTH375/Rohinth-portfolio.git
   git push -u origin main
   ```
3. Go to vercel.com → **Add New → Project** → import the repo.
4. Framework Preset: **Other**. Leave Build Command and Output Directory empty → **Deploy**.

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel        # first deploy (preview)
vercel --prod # production
```

## Custom domain
In Vercel → Project → Settings → Domains, add your domain (e.g. `rohinth.dev`) and set the DNS records Vercel shows you.
