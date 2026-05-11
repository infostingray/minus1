# MINUS 1

> A New Layer of Living.

Single-page experience site for **MINUS 1** — a luxury underground infrastructure brand. Brutalist editorial aesthetic, black and white only.

Built with **React 18 · Vite · Tailwind CSS · Framer Motion**.

---

## Sections

1. **Hero** — Cinematic descent with parallax depth.
2. **Manifesto** — The brand thesis.
3. **Projects** — Three archetypes: The Vault · The Citadel · The Ark.
4. **Catalogue** — Filterable component library (life support, security, interiors, autonomy).
5. **Contact** — Studio details and clearance request.

---

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

Output is written to `dist/`.

---

## Deploy to GitHub + Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — MINUS 1"
git branch -M main
git remote add origin https://github.com/<your-username>/minus1.git
git push -u origin main
```

### 2. Connect Vercel

1. Go to https://vercel.com/new
2. Import the GitHub repository
3. Vercel auto-detects Vite — no settings need to change
4. Click **Deploy**

The included `vercel.json` handles SPA routing and security headers. Future pushes to `main` redeploy automatically.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion 11 |
| Typography | Instrument Serif · Geist · JetBrains Mono |
| Hosting | Vercel |

## Color tokens

Defined in `tailwind.config.js`:

```
ink      #0A0A0A   primary background
coal     #141414
steel    #1F1F1F
graphite #2A2A2A
silver   #8A8A8A
pale     #C8C6C0
bone     #F2F0EB   primary text / inverse bg
chalk    #FAFAF7
```

## Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
└── components/
    ├── Logo.jsx
    ├── Navigation.jsx
    ├── Hero.jsx
    ├── Manifesto.jsx
    ├── Projects.jsx
    ├── Catalogue.jsx
    └── Footer.jsx
public/
├── logo.svg
└── images/
    ├── installation-trench.jpg
    ├── crane-lift.jpg
    ├── delivery-gate.jpg
    ├── factory-floor.jpg
    ├── module-placement.jpg
    ├── twin-modules.jpg
    └── escape-pod.jpg
```

---

MMXXVI · Engineered in Dubai.
