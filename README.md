# MINUS 1 — A New Layer of Living

A single-page cinematic experience for **MINUS 1 Bunkers** — a luxury underground infrastructure brand. Built with React, Vite, Tailwind CSS, and Framer Motion.

> *"Not a shelter. A new layer of living."*

---

## Features

- **Duality Hero** — split-screen `THE HORIZON / THE DEPTH` that cinematically expands on hover.
- **Descent Indicator** — fixed depth gauge (right side) that tracks scroll position in meters (−000m → −127m), turning the page into an elevator.
- **Parallax Descent Section** — live depth readout with synced background motion as you scroll past.
- **Three-Tier Catalogue** — Safe Rooms / Modular Units / Custom Spaces with hover micro-interactions.
- **Capabilities Grid** — real engineering specs on a faint blueprint backdrop (blast envelope, NBC filtration, AR500, ISO certifications).
- **GCC Positioning** — territory module with the four primary markets.
- **Confidential Intake Form** — "Form 001" CTA with encrypted-channel framing and a 72-hour confirmation state.
- **Cyber-brutalist palette** — pure black + bone + a single Elite Gold accent.
- **Typography** — `Syne` (display) · `Manrope` (body) · `JetBrains Mono` (technical labels).
- **Fully responsive** — split hero stacks on mobile, depth gauge hides under 900px, drawer nav.

---

## Quickstart

```bash
# install
npm install

# dev server (http://localhost:5173)
npm run dev

# production build
npm run build

# preview the build
npm run preview
```

Requires **Node 18+**.

---

## Project structure

```
minus-1/
├── index.html              # entry HTML + Google Fonts
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx            # React root
    ├── index.css           # Tailwind directives + global resets
    └── Minus1.jsx          # the entire single-page experience
```

Everything lives in one component (`Minus1.jsx`) by design — the experience is a single uninterrupted scroll, so the source mirrors that. Sections inside the file are clearly named: `Nav`, `Hero`, `Thesis`, `Descent`, `Proof`, `Tiers`, `Capabilities`, `Region`, `CTA`, `Footer`.

---

## Customising

### Brand colors
Edit `tailwind.config.js` and the matching CSS variables at the top of `Minus1.jsx` (inside the `CSS` constant). The two need to stay in sync — variables drive the runtime styles, Tailwind extends drive any utility classes you add later.

### Images
All hero / section images are Unsplash URLs centralised in the `IMG` object at the top of `Minus1.jsx`. Swap in your own (CDN, S3, etc.) without touching the JSX. Recommended: 1800–2400px wide, dark / moody / architectural.

### Copy
Section copy lives inline with each section component (`Thesis`, `Descent`, `Proof`, etc.). Search the file for the headline you want to change — it's all in plain JSX, no CMS layer.

### Pricing tiers
The `tiers` array inside the `Tiers` component holds the three product cards (name, price, image, description, specs). Add a fourth tier by extending the array and changing the grid from `md:grid-cols-3` to `md:grid-cols-4`.

### Form submission
The intake form is currently UI-only — clicking *Request Private Briefing* flips local state to the confirmation view. To wire it up to a real backend, replace the `onClick` handler inside the `CTA` component with a `fetch(...)` call to your endpoint.

---

## Deployment

The build output is a static SPA — deploy `dist/` to anywhere that serves static files.

### Vercel
```bash
npm i -g vercel
vercel
```
Vercel auto-detects Vite. No config needed.

### Netlify
Connect the repo, set:
- Build command: `npm run build`
- Publish directory: `dist`

### Cloudflare Pages
- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`

### GitHub Pages
```bash
npm run build
# then push `dist/` to a `gh-pages` branch
```
You'll need to set `base: '/repo-name/'` in `vite.config.js` if not hosting on a custom domain.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 5 | Instant HMR, tiny config |
| UI | React 18 | Stable, well-supported |
| Styling | Tailwind 3 + custom CSS variables | Utility speed where it helps; CSS vars for the brand system |
| Motion | Framer Motion 11 | Scroll-linked transforms (`useScroll`, `useTransform`) for the descent parallax |
| Icons | Lucide React | Sharp, technical, fits the cyber-brutalist tone |

---

## Brand notes

The site reads as a **gallery**, not a brochure. There is no sales language, no hero CTA, no testimonials. Headlines are numbered like a dossier (`01 — Thesis`, `07 — Contact`). Every CTA defers to *intake* and *briefing* — never *buy*, *order*, or *get started*.

Privacy positioning is enforced visually: corner brackets, hairline rules, `CONFIDENTIAL` and `RESTRICTED TIER` labels, encrypted-channel cues. This is deliberate. Atlas Survival Shelters' weakness is fear-driven survival messaging; MINUS 1's lane is **discreet luxury infrastructure** — the same audience that buys a Bugatti chassis, not a panic room.

---

## License

Private commercial project. Not open source.
