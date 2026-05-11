import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Lock,
  Plus,
  Minus as MinusIcon,
  ChevronDown,
  ShieldCheck,
  Layers,
  Compass,
  Radio,
  Wind,
  Zap,
  Eye,
  X,
  Sun,
  Mountain,
  Hexagon,
  Globe,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   MINUS 1 — A NEW LAYER OF LIVING
   Cinematic single-page experience.
   Cyber-brutalist luxury · Bunkers + Domes · GCC positioning.
   ════════════════════════════════════════════════════════════════════ */

/* ─────────────────── REAL CINEMATIC IMAGERY ───────────────────
   Verified Unsplash photo IDs. Each entry has a gradient fallback
   embedded via CSS, so a missing image never breaks the layout. */
const IMG = {
  // DOMES — surface, sunlit, sand, desert, architectural
  domesHero:
    "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=2000&q=85",
  domesAlt:
    "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=2000&q=85",
  domesInterior:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
  domesAerial:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85",

  // BUNKERS — depth, tunnels, brutalist concrete, dark
  bunkersHero:
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=2000&q=85",
  bunkersAlt:
    "https://images.unsplash.com/photo-1545158539-1709a01b9d2c?auto=format&fit=crop&w=2000&q=85",
  bunkersInterior:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85",
  bunkersConcrete:
    "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=2000&q=85",

  // EDITORIAL / TEXTURE
  manifesto:
    "https://images.unsplash.com/photo-1564013434775-f71db0030976?auto=format&fit=crop&w=2400&q=85",
  gcc:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2200&q=85",
  pullQuote:
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=2400&q=85",
  ctaBg:
    "https://images.unsplash.com/photo-1574691250077-03a929faece5?auto=format&fit=crop&w=2400&q=85",

  // TIERS
  tier1:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
  tier2:
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=85",
  tier3:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
};

/* ─────────────────── GLOBAL CSS ─────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

:root {
  --ink: #050505;
  --carbon: #0a0a0a;
  --slate: #111111;
  --steel: #1a1a1a;
  --concrete: #2a2a2a;
  --line: rgba(237, 232, 223, 0.08);
  --line-2: rgba(237, 232, 223, 0.14);
  --line-3: rgba(237, 232, 223, 0.22);
  --bone: #ede8df;
  --bone-dim: #c8c3ba;
  --ash: #6e6a64;
  --gold: #c89c4a;
  --gold-bright: #e2bd6f;
  --gold-deep: #8a6a2e;
  --signal: #ff4a16;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
html, body { background: var(--ink); color: var(--bone); margin: 0; }
body { cursor: none; }

@media (hover: none) and (pointer: coarse) {
  body { cursor: auto; }
}

::selection { background: var(--gold); color: var(--ink); }

/* TYPOGRAPHY */
.f-display { font-family: 'Syne', sans-serif; letter-spacing: -0.045em; font-weight: 700; }
.f-body    { font-family: 'Manrope', sans-serif; font-weight: 300; }
.f-mono    { font-family: 'JetBrains Mono', monospace; font-weight: 400; letter-spacing: 0.02em; }

/* COLOR UTILITIES */
.bg-ink     { background-color: var(--ink); }
.bg-carbon  { background-color: var(--carbon); }
.bg-slate-x { background-color: var(--slate); }
.bg-steel   { background-color: var(--steel); }
.t-bone     { color: var(--bone); }
.t-bone-dim { color: var(--bone-dim); }
.t-ash      { color: var(--ash); }
.t-gold     { color: var(--gold); }
.t-gold-b   { color: var(--gold-bright); }

/* HAIRLINE BORDERS */
.hair-t { border-top: 1px solid var(--line); }
.hair-b { border-bottom: 1px solid var(--line); }
.hair-l { border-left: 1px solid var(--line); }
.hair-r { border-right: 1px solid var(--line); }
.hair-y { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.hair-all { border: 1px solid var(--line); }

/* FILM GRAIN (high-quality, animated subtly) */
.grain { position: relative; }
.grain::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 5;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='3' seed='7'/><feColorMatrix values='0 0 0 0 0.93  0 0 0 0 0.91  0 0 0 0 0.87  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>");
  opacity: 0.07; mix-blend-mode: overlay;
  animation: grain-shift 8s steps(6) infinite;
}
@keyframes grain-shift {
  0%, 100% { transform: translate(0,0); }
  20% { transform: translate(-2%, 1%); }
  40% { transform: translate(2%, -1%); }
  60% { transform: translate(-1%, 2%); }
  80% { transform: translate(1%, -2%); }
}

/* VIGNETTE */
.vignette::before {
  content: ""; position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 95%);
}

/* IMAGE WITH GRADIENT FALLBACK */
.bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  background-color: var(--steel);
  transition: transform 1600ms cubic-bezier(.7,0,.2,1), filter 1400ms ease;
}
.bg-img.dark { filter: grayscale(20%) contrast(1.1) brightness(0.45); }
.bg-img.warm { filter: grayscale(15%) contrast(1.05) brightness(0.6) sepia(0.15); }

/* HERO SPLIT */
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  transition: grid-template-columns 900ms cubic-bezier(.7,0,.2,1);
}
.hero-split.left-active  { grid-template-columns: 1.7fr 1fr; }
.hero-split.right-active { grid-template-columns: 1fr 1.7fr; }
@media (max-width: 900px) {
  .hero-split { grid-template-columns: 1fr !important; grid-template-rows: 1fr 1fr; }
}
.hero-half:hover .bg-img { transform: scale(1.08); }
.hero-half.warm:hover .bg-img { filter: grayscale(0%) contrast(1.1) brightness(0.7) sepia(0.05); }
.hero-half.dark:hover .bg-img { filter: grayscale(5%) contrast(1.15) brightness(0.65); }

/* CUSTOM CURSOR */
.cursor-ring, .cursor-dot {
  position: fixed; top: 0; left: 0; pointer-events: none; z-index: 999;
  mix-blend-mode: difference;
}
.cursor-ring {
  width: 28px; height: 28px; border: 1px solid var(--bone);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 350ms ease, height 350ms ease, border-color 250ms ease, background 250ms ease;
}
.cursor-dot {
  width: 4px; height: 4px; background: var(--bone); border-radius: 50%;
  transform: translate(-50%, -50%);
}
.cursor-ring.hover { width: 56px; height: 56px; background: rgba(237,232,223,0.06); }
.cursor-ring.text  { width: 80px; height: 80px; }
@media (hover: none) and (pointer: coarse) {
  .cursor-ring, .cursor-dot { display: none; }
}

/* PRELOADER */
.preloader {
  position: fixed; inset: 0; z-index: 1000;
  background: var(--ink);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column;
}
.preloader-bars {
  position: fixed; inset: 0; z-index: 1001; pointer-events: none;
  display: flex; flex-direction: column;
}
.preloader-bar {
  background: var(--ink); flex: 1;
  transition: transform 1100ms cubic-bezier(.85,0,.2,1);
}
.preloader-bar.top.out    { transform: translateY(-100%); }
.preloader-bar.bottom.out { transform: translateY(100%); }
@keyframes draw-logo {
  0%   { stroke-dashoffset: 200; }
  100% { stroke-dashoffset: 0; }
}
.logo-draw path, .logo-draw rect, .logo-draw line {
  stroke-dasharray: 200; stroke-dashoffset: 200;
  animation: draw-logo 1.6s cubic-bezier(.7,0,.2,1) forwards;
}
.logo-draw .delay-1 { animation-delay: 0.25s; }
.logo-draw .delay-2 { animation-delay: 0.5s; }

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.pulse-glow { animation: pulse-glow 1.6s ease-in-out infinite; }

/* DEPTH INDICATOR */
.depth-bar {
  position: fixed; right: 28px; top: 50%; transform: translateY(-50%);
  z-index: 60; display: flex; flex-direction: column; align-items: center; gap: 14px;
  pointer-events: none;
}
.depth-track {
  width: 1px; height: 240px; background: var(--line-2); position: relative;
}
.depth-fill {
  position: absolute; left: -1px; top: 0; width: 3px; background: var(--gold);
  box-shadow: 0 0 18px rgba(200,156,74,0.7);
  transition: height 120ms linear;
}
.depth-marker {
  position: absolute; left: -3px; width: 7px; height: 1px; background: var(--ash);
}
@media (max-width: 900px) { .depth-bar { display: none; } }

/* MARQUEE */
.marquee {
  overflow: hidden; white-space: nowrap;
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
  padding: 22px 0;
}
.marquee-track {
  display: inline-flex; gap: 56px;
  animation: marquee 40s linear infinite;
}
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-item {
  display: inline-flex; align-items: center; gap: 56px;
  font-family: 'Syne', sans-serif; font-weight: 700;
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: -0.03em;
}
.marquee-dot {
  width: 12px; height: 12px; border-radius: 50%; background: var(--gold);
  flex-shrink: 0;
}

/* LINK UNDERLINE */
.u-link {
  position: relative; display: inline-flex; align-items: center; gap: 0.5rem;
  padding-bottom: 4px; transition: color 200ms ease;
}
.u-link::after {
  content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%;
  background: currentColor; transform-origin: right; transform: scaleX(1);
  transition: transform 500ms cubic-bezier(.7,0,.2,1);
}
.u-link:hover::after { transform-origin: left; transform: scaleX(0); }

/* BUTTONS */
.btn-prime {
  display: inline-flex; align-items: center; gap: 14px; padding: 18px 24px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em;
  color: var(--bone); background: transparent; border: 1px solid var(--line-3);
  text-transform: uppercase; transition: color 350ms ease, border-color 350ms ease;
  position: relative; overflow: hidden; cursor: none;
}
.btn-prime::before {
  content: ""; position: absolute; inset: 0; background: var(--gold);
  transform: scaleX(0); transform-origin: left;
  transition: transform 600ms cubic-bezier(.7,0,.2,1); z-index: -1;
}
.btn-prime:hover { color: var(--ink); border-color: var(--gold); }
.btn-prime:hover::before { transform: scaleX(1); }
.btn-prime .dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--gold);
  transition: background 350ms ease;
}
.btn-prime:hover .dot { background: var(--ink); }

/* NAV */
.nav-link {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--bone-dim); transition: color 250ms ease;
  position: relative; padding: 4px 0;
}
.nav-link:hover { color: var(--bone); }
.nav-link::after {
  content: ""; position: absolute; bottom: -2px; left: 0; height: 1px; width: 0;
  background: var(--gold); transition: width 350ms ease;
}
.nav-link:hover::after { width: 100%; }

/* CORNER BRACKETS */
.bracket { position: absolute; width: 14px; height: 14px; border-color: var(--gold); }
.bracket.tl { top: 14px; left: 14px; border-top: 1px solid; border-left: 1px solid; }
.bracket.tr { top: 14px; right: 14px; border-top: 1px solid; border-right: 1px solid; }
.bracket.bl { bottom: 14px; left: 14px; border-bottom: 1px solid; border-left: 1px solid; }
.bracket.br { bottom: 14px; right: 14px; border-bottom: 1px solid; border-right: 1px solid; }

/* CARD */
.tier {
  position: relative; overflow: hidden;
  transition: transform 700ms cubic-bezier(.7,0,.2,1), background-color 500ms ease;
  transform-style: preserve-3d;
}
.tier .tier-img {
  transition: transform 1200ms cubic-bezier(.7,0,.2,1), filter 800ms ease;
  filter: grayscale(40%) contrast(1.05) brightness(0.55);
}
.tier:hover .tier-img { transform: scale(1.1); filter: grayscale(0%) contrast(1.1) brightness(0.7); }
.tier:hover { background-color: var(--carbon); }
.tier .tier-arrow { transition: transform 600ms cubic-bezier(.7,0,.2,1), color 400ms ease; }
.tier:hover .tier-arrow { transform: translate(8px, -8px); color: var(--gold-bright); }
.tier .tier-num { transition: color 500ms ease; }
.tier:hover .tier-num { color: var(--gold); }

/* SCHEMATIC GRID */
.schematic {
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* BREATHING */
@keyframes breathe {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(8px); opacity: 1; }
}
.breathe { animation: breathe 2.4s ease-in-out infinite; }

/* SLOW DRIFT */
@keyframes drift {
  0%   { transform: translate3d(0,0,0) scale(1.05); }
  50%  { transform: translate3d(-2%, -1%, 0) scale(1.1); }
  100% { transform: translate3d(0,0,0) scale(1.05); }
}
.drift { animation: drift 24s ease-in-out infinite; }

/* TEXT REVEAL */
.reveal-wrap { overflow: hidden; display: inline-block; }
.reveal-inner { display: inline-block; transform: translateY(110%); }
.reveal-on .reveal-inner { transform: translateY(0); transition: transform 1100ms cubic-bezier(.7,0,.2,1); }

/* PROCESS TIMELINE */
.process-track {
  display: flex; gap: 0; overflow-x: auto; scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.process-track::-webkit-scrollbar { display: none; }
.process-card {
  scroll-snap-align: start; flex: 0 0 calc(100% - 24px);
  border-right: 1px solid var(--line);
}
@media (min-width: 700px) { .process-card { flex: 0 0 50%; } }
@media (min-width: 1100px) { .process-card { flex: 0 0 33%; } }

/* SPEC ROW */
.spec-row { transition: background-color 300ms ease; }
.spec-row:hover { background-color: rgba(255,255,255,0.02); }

.big-num { font-feature-settings: "tnum"; }

/* DOMES SECTION ANIMATED LINE */
@keyframes draw-line {
  0%   { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
.draw-line {
  transform-origin: left; animation: draw-line 1.4s cubic-bezier(.7,0,.2,1) forwards;
}

/* GLOW */
.glow-gold {
  box-shadow: 0 0 60px 0 rgba(200,156,74,0.15), inset 0 0 0 1px var(--line-2);
}

/* RESPONSIVE TYPE */
@media (max-width: 700px) {
  .clamp-display { font-size: clamp(2.4rem, 12vw, 5rem) !important; line-height: 0.95 !important; }
  .clamp-mega { font-size: clamp(3rem, 18vw, 8rem) !important; line-height: 0.9 !important; }
}

/* SMOOTH section background transition */
section { isolation: isolate; }
`;

/* ═══════════════════ HOOKS ═══════════════════ */

function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { threshold }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on];
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const fn = (e) => setReduce(e.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return reduce;
}

/* ═══════════════════ PRELOADER ═══════════════════ */

function Preloader({ done }) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("INITIALIZING SEQUENCE");
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    let start = performance.now();
    const duration = 2400;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(eased * 100);
      setCount(v);
      if (v < 30) setStatus("INITIALIZING SEQUENCE");
      else if (v < 55) setStatus("LOCATING HORIZON");
      else if (v < 80) setStatus("CALIBRATING DEPTH");
      else if (v < 97) setStatus("ESTABLISHING CHANNEL");
      else setStatus("READY");
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => setOpening(true), 220);
        setTimeout(() => done(), 1380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  return (
    <>
      <div className="preloader">
        <div className="grain" style={{ position: "absolute", inset: 0 }} />
        {/* corner brackets */}
        <div className="bracket tl" style={{ borderColor: "var(--gold)" }} />
        <div className="bracket tr" style={{ borderColor: "var(--gold)" }} />
        <div className="bracket bl" style={{ borderColor: "var(--gold)" }} />
        <div className="bracket br" style={{ borderColor: "var(--gold)" }} />

        {/* top brand */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "var(--gold)",
            }}
            className="pulse-glow"
          />
          <span
            className="f-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "var(--bone-dim)",
            }}
          >
            MINUS 1 · INTAKE TERMINAL
          </span>
        </div>

        {/* center logo + counter */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <svg
            className="logo-draw"
            width="84"
            height="84"
            viewBox="0 0 84 84"
            fill="none"
          >
            <rect
              x="2"
              y="2"
              width="80"
              height="80"
              stroke="var(--gold)"
              strokeWidth="1.2"
            />
            <line
              x1="20"
              y1="42"
              x2="64"
              y2="42"
              stroke="var(--gold)"
              strokeWidth="1.6"
              className="delay-1"
            />
            <line
              x1="42"
              y1="62"
              x2="42"
              y2="74"
              stroke="var(--bone)"
              strokeWidth="1"
              className="delay-2"
            />
          </svg>
          <div
            className="f-display"
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              color: "var(--bone)",
            }}
          >
            MINUS 1
          </div>
        </div>

        {/* bottom counter & status */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 32,
            right: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              className="f-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "var(--ash)",
                marginBottom: 6,
              }}
            >
              STATUS
            </div>
            <div
              className="f-mono"
              style={{
                fontSize: 13,
                letterSpacing: "0.18em",
                color: "var(--gold)",
              }}
            >
              {status} <span className="pulse-glow">_</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              className="f-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "var(--ash)",
                marginBottom: 6,
              }}
            >
              LOAD
            </div>
            <div
              className="f-display big-num"
              style={{
                fontSize: 56,
                lineHeight: 0.9,
                color: "var(--bone)",
              }}
            >
              {String(count).padStart(3, "0")}
              <span style={{ color: "var(--gold)", fontSize: 24 }}>%</span>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: 1,
              background: "var(--line-2)",
              position: "relative",
              order: 10,
              marginTop: 18,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -1,
                left: 0,
                height: 3,
                width: `${count}%`,
                background: "var(--gold)",
                boxShadow: "0 0 16px rgba(200,156,74,0.7)",
                transition: "width 80ms linear",
              }}
            />
          </div>
        </div>
      </div>

      {/* vault doors split open */}
      <div className="preloader-bars" style={{ pointerEvents: opening ? "none" : "auto" }}>
        <div className={`preloader-bar top ${opening ? "out" : ""}`} />
        <div className={`preloader-bar bottom ${opening ? "out" : ""}`} />
      </div>
    </>
  );
}

/* ═══════════════════ CUSTOM CURSOR ═══════════════════ */

function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const move = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    const loop = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf.current = requestAnimationFrame(loop);

    const over = (e) => {
      const t = e.target.closest("a, button, [data-cursor]");
      if (!t || !ringRef.current) return;
      const variant = t.getAttribute("data-cursor");
      ringRef.current.classList.remove("hover", "text");
      if (variant === "text") ringRef.current.classList.add("text");
      else ringRef.current.classList.add("hover");
    };
    const out = (e) => {
      const t = e.target.closest("a, button, [data-cursor]");
      if (!t || !ringRef.current) return;
      ringRef.current.classList.remove("hover", "text");
    };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

/* ═══════════════════ MAGNETIC WRAPPER ═══════════════════ */

function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const leave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return (
    <div
      ref={ref}
      style={{ display: "inline-block", transition: "transform 400ms cubic-bezier(.7,0,.2,1)" }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════ 3D TILT WRAPPER ═══════════════════ */

function Tilt({ children, max = 8 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
    };
    const leave = () => {
      el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [max]);
  return (
    <div
      ref={ref}
      style={{
        transition: "transform 500ms cubic-bezier(.7,0,.2,1)",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════ SCRAMBLE TEXT ═══════════════════ */

function Scramble({ text, className = "", style = {} }) {
  const [out, setOut] = useState(text);
  const ref = useRef(null);
  const chars = "01ABCDEFXYZ◆◇░▒▓█";
  const run = useCallback(() => {
    let frame = 0;
    const total = 18;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / total;
      let nxt = "";
      for (let i = 0; i < text.length; i++) {
        if (i / text.length < progress) nxt += text[i];
        else nxt += chars[Math.floor(Math.random() * chars.length)];
      }
      setOut(nxt);
      if (frame >= total) {
        clearInterval(interval);
        setOut(text);
      }
    }, 30);
  }, [text]);
  return (
    <span
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={run}
    >
      {out}
    </span>
  );
}

/* ═══════════════════ LABEL ═══════════════════ */

const Label = ({ children, color = "var(--ash)" }) => (
  <span
    className="f-mono"
    style={{
      fontSize: 11,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </span>
);

/* ═══════════════════ NAV ═══════════════════ */

function Nav({ scrollY }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="grain"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        background:
          scrollY > 60
            ? "rgba(5,5,5,0.78)"
            : "linear-gradient(180deg, rgba(0,0,0,0.5), transparent)",
        backdropFilter: scrollY > 60 ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrollY > 60 ? "blur(14px)" : "none",
        borderBottom: scrollY > 60 ? "1px solid var(--line)" : "1px solid transparent",
        transition: "all 400ms ease",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "20px 28px" }}
      >
        <a href="#top" className="flex items-center gap-3" data-cursor>
          <div
            className="flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              border: "1px solid var(--gold)",
              color: "var(--gold)",
            }}
          >
            <MinusIcon size={14} strokeWidth={2.2} />
          </div>
          <div
            className="f-display"
            style={{ fontSize: 14, letterSpacing: "0.12em" }}
          >
            MINUS 1
          </div>
          <span style={{ width: 1, height: 14, background: "var(--line-2)" }} />
          <Label>BUNKERS · DOMES</Label>
        </a>

        <nav className="hidden md:flex items-center" style={{ gap: 30 }}>
          {[
            ["domes", "01 — Domes"],
            ["bunkers", "02 — Bunkers"],
            ["tiers", "03 — Tiers"],
            ["process", "04 — Process"],
            ["capabilities", "05 — Specs"],
            ["contact", "06 — Contact"],
          ].map(([h, t]) => (
            <a key={h} href={`#${h}`} className="nav-link">
              {t}
            </a>
          ))}
        </nav>

        <div className="flex items-center" style={{ gap: 14 }}>
          <div className="hidden md:flex items-center" style={{ gap: 8, color: "var(--ash)" }}>
            <Lock size={12} />
            <Label>CONFIDENTIAL</Label>
          </div>
          <Magnetic strength={0.2}>
            <a
              href="#contact"
              className="btn-prime"
              style={{ padding: "12px 18px" }}
            >
              <span className="dot" />
              <span>Brief</span>
            </a>
          </Magnetic>
          <button
            className="md:hidden flex items-center justify-center"
            style={{ width: 36, height: 36, border: "1px solid var(--line-2)", background: "transparent", cursor: "none" }}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={16} color="var(--bone)" /> : <Plus size={16} color="var(--bone)" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
            className="md:hidden hair-t"
            style={{ overflow: "hidden", background: "var(--ink)" }}
          >
            <div className="flex flex-col py-4 px-7">
              {[
                ["domes", "01 — Domes"],
                ["bunkers", "02 — Bunkers"],
                ["tiers", "03 — Tiers"],
                ["process", "04 — Process"],
                ["capabilities", "05 — Specs"],
                ["contact", "06 — Contact"],
              ].map(([h, t], i) => (
                <a
                  key={i}
                  href={`#${h}`}
                  className="nav-link py-4 hair-b"
                  onClick={() => setOpen(false)}
                >
                  {t}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══════════════════ DEPTH INDICATOR ═══════════════════ */

function DepthIndicator({ depth }) {
  const meters = Math.round(depth * 127);
  return (
    <div className="depth-bar">
      <div
        className="f-mono"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--ash)" }}
      >
        DEPTH
      </div>
      <div className="depth-track">
        <div className="depth-fill" style={{ height: `${depth * 100}%` }} />
        {[25, 50, 75].map((p) => (
          <div key={p} className="depth-marker" style={{ top: `${p}%` }} />
        ))}
      </div>
      <div
        className="f-mono big-num"
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--gold)",
          minWidth: 56,
          textAlign: "center",
        }}
      >
        −{String(meters).padStart(3, "0")}m
      </div>
    </div>
  );
}

/* ═══════════════════ HERO ═══════════════════ */

function Hero() {
  const [hover, setHover] = useState(null);
  const split =
    hover === "L"
      ? "hero-split left-active"
      : hover === "R"
      ? "hero-split right-active"
      : "hero-split";

  return (
    <section
      id="top"
      style={{ height: "100vh", position: "relative" }}
      className="grain vignette"
    >
      <div className={split} style={{ height: "100%" }}>
        {/* DOMES — light side */}
        <a
          href="#domes"
          className="hero-half warm"
          style={{
            position: "relative",
            overflow: "hidden",
            cursor: "none",
            textDecoration: "none",
            color: "inherit",
          }}
          onMouseEnter={() => setHover("L")}
          onMouseLeave={() => setHover(null)}
          data-cursor="text"
        >
          <div
            className="bg-img warm drift"
            style={{
              backgroundImage: `url(${IMG.domesHero}), linear-gradient(135deg, #2a2520, #1a1610)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.1) 50%, rgba(5,5,5,0.85) 100%)",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 6,
              height: "100%",
              padding: "32px",
            }}
            className="flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Label color="var(--gold)">I — ABOVE THE LINE</Label>
              <div className="flex items-center" style={{ gap: 8 }}>
                <Sun size={12} color="var(--gold-bright)" />
                <Label>SURFACE · 00m</Label>
              </div>
            </div>

            <div>
              <div className="reveal-on">
                <div className="reveal-wrap">
                  <div
                    className="reveal-inner f-display clamp-display"
                    style={{
                      fontSize: "clamp(3.5rem, 10vw, 9rem)",
                      lineHeight: 0.88,
                      color: "var(--bone)",
                    }}
                  >
                    DOMES
                  </div>
                </div>
              </div>
              <div className="reveal-on">
                <div className="reveal-wrap" style={{ display: "block" }}>
                  <div
                    className="reveal-inner f-body"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--bone-dim)",
                      maxWidth: 420,
                      marginTop: 24,
                      transitionDelay: "120ms",
                    }}
                  >
                    Sculpted geodesic enclosures. Climate-managed, solar-shielded,
                    visible only when invited to see them.
                  </div>
                </div>
              </div>

              <div
                className="u-link"
                style={{ marginTop: 36, color: "var(--bone)" }}
              >
                <Label color="var(--bone)">Observe the Surface</Label>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </a>

        {/* BUNKERS — dark side */}
        <a
          href="#bunkers"
          className="hero-half dark hair-l"
          style={{
            position: "relative",
            overflow: "hidden",
            cursor: "none",
            textDecoration: "none",
            color: "inherit",
          }}
          onMouseEnter={() => setHover("R")}
          onMouseLeave={() => setHover(null)}
          data-cursor="text"
        >
          <div
            className="bg-img dark drift"
            style={{
              backgroundImage: `url(${IMG.bunkersHero}), linear-gradient(225deg, #0c0c0c, #050505)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(225deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.1) 50%, rgba(5,5,5,0.95) 100%)",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 6,
              height: "100%",
              padding: "32px",
            }}
            className="flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Label color="var(--gold)">II — BELOW THE LINE</Label>
              <div className="flex items-center" style={{ gap: 8 }}>
                <ArrowDown size={12} color="var(--gold-bright)" />
                <Label>SUB-GRADE · −47m</Label>
              </div>
            </div>

            <div>
              <div className="reveal-on">
                <div className="reveal-wrap">
                  <div
                    className="reveal-inner f-display clamp-display"
                    style={{
                      fontSize: "clamp(3.5rem, 10vw, 9rem)",
                      lineHeight: 0.88,
                      color: "var(--gold)",
                    }}
                  >
                    BUNKERS
                  </div>
                </div>
              </div>
              <div className="reveal-on">
                <div className="reveal-wrap" style={{ display: "block" }}>
                  <div
                    className="reveal-inner f-body"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--bone-dim)",
                      maxWidth: 420,
                      marginTop: 24,
                      transitionDelay: "120ms",
                    }}
                  >
                    Subterranean estates. Sealed, autonomous, removed from
                    the grid — for continuity, privacy, control.
                  </div>
                </div>
              </div>

              <div
                className="u-link"
                style={{ marginTop: 36, color: "var(--gold-bright)" }}
              >
                <Label color="var(--gold-bright)">Initiate the Descent</Label>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* center monogram */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 7,
        }}
      >
        <Magnetic strength={0.4}>
          <div
            style={{
              width: 88,
              height: 88,
              border: "1px solid var(--line-3)",
              background: "rgba(5,5,5,0.6)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--bone)",
            }}
            className="glow-gold"
          >
            <MinusIcon size={30} strokeWidth={1.3} />
          </div>
        </Magnetic>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 32,
          display: "flex",
          justifyContent: "center",
          zIndex: 8,
        }}
      >
        <div className="breathe flex flex-col items-center" style={{ gap: 8 }}>
          <Label color="var(--bone-dim)">SCROLL TO ENTER</Label>
          <ChevronDown size={14} color="var(--gold)" />
        </div>
      </div>

      <div className="bracket tl" />
      <div className="bracket tr" />
      <div className="bracket bl" />
      <div className="bracket br" />
    </section>
  );
}

/* ═══════════════════ MARQUEE ═══════════════════ */

function Marquee() {
  const items = [
    "MINUS 1",
    "—",
    "BUNKERS",
    "◆",
    "DOMES",
    "—",
    "CONFIDENTIAL",
    "◆",
    "GCC",
    "—",
    "BY APPOINTMENT",
    "◆",
  ];
  return (
    <div className="marquee bg-ink">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="marquee-item">
            {items.map((it, i) =>
              it === "◆" ? (
                <span key={i} className="marquee-dot" />
              ) : (
                <span
                  key={i}
                  className="f-display"
                  style={{
                    color: i % 4 === 2 ? "var(--gold)" : "var(--bone)",
                  }}
                >
                  {it}
                </span>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ THESIS ═══════════════════ */

function Thesis() {
  const [ref, on] = useReveal(0.2);
  return (
    <section
      ref={ref}
      className="grain hair-b"
      style={{
        background: "var(--ink)",
        padding: "160px 0",
        position: "relative",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 56 }}>
            <span
              style={{
                width: 40,
                height: 1,
                background: "var(--gold)",
                display: "block",
              }}
            />
            <Label color="var(--gold)">THESIS</Label>
          </div>

          <div className={on ? "reveal-on" : ""}>
            <h2
              className="f-display clamp-mega"
              style={{
                fontSize: "clamp(2.6rem, 8vw, 8.4rem)",
                lineHeight: 0.92,
                color: "var(--bone)",
              }}
            >
              <span className="reveal-wrap">
                <span className="reveal-inner">Not a shelter.</span>
              </span>
              <br />
              <span className="reveal-wrap">
                <span
                  className="reveal-inner"
                  style={{ transitionDelay: "120ms" }}
                >
                  A{" "}
                  <em
                    className="t-gold"
                    style={{ fontStyle: "italic", fontWeight: 600 }}
                  >
                    new layer
                  </em>{" "}
                  of living.
                </span>
              </span>
            </h2>
          </div>

          <div style={{ marginTop: 80, maxWidth: 1100 }}>
            <div
              className="grid md:grid-cols-3"
              style={{ gap: 40 }}
            >
              {[
                [
                  "CONTINUITY",
                  "Operational autonomy across power, air, water, and communication. A residence that does not stop when the grid does.",
                ],
                [
                  "PRIVACY",
                  "Architecture removed from public sightlines. No address. No external footprint. Visible only to those invited.",
                ],
                [
                  "CONTROL",
                  "Climate, atmosphere, ingress, monitoring — every variable governed from a single interface, by a single hand.",
                ],
              ].map(([k, v]) => (
                <div key={k} className="hair-t" style={{ paddingTop: 24 }}>
                  <Label color="var(--gold)">{k}</Label>
                  <p
                    className="f-body t-bone"
                    style={{ fontSize: 16, lineHeight: 1.55, marginTop: 18 }}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="hair-y flex flex-wrap items-center justify-between"
            style={{
              marginTop: 96,
              padding: "20px 0",
              gap: 16,
            }}
          >
            <Label>EST. PROTOCOL — Ω.001</Label>
            <Label color="var(--bone-dim)">CLEARANCE — RESTRICTED</Label>
            <Label>ENVELOPE — GLOBAL</Label>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ DOMES SHOWCASE ═══════════════════ */

function DomesShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section
      id="domes"
      ref={ref}
      className="grain hair-b"
      style={{
        position: "relative",
        background: "var(--carbon)",
        padding: "160px 0",
        overflow: "hidden",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 32 }}>
            <Sun size={14} color="var(--gold)" />
            <Label color="var(--gold)">01 — DOMES</Label>
          </div>

          <div
            className="flex flex-wrap items-end justify-between"
            style={{ gap: 24, marginBottom: 64 }}
          >
            <h3
              className="f-display"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.6rem)",
                lineHeight: 0.94,
                color: "var(--bone)",
                maxWidth: 800,
              }}
            >
              Above the line.<br />
              <span style={{ color: "var(--gold)" }}>Engineered for the sun.</span>
            </h3>
            <p
              className="f-body t-bone-dim"
              style={{
                fontSize: 14.5,
                lineHeight: 1.65,
                maxWidth: 360,
              }}
            >
              Geodesic enclosures sculpted into the terrain. Solar-managed, climate-sealed,
              acoustically isolated — the surface residence as discreet object.
            </p>
          </div>

          {/* large dome image with parallax */}
          <div
            style={{
              position: "relative",
              height: 540,
              overflow: "hidden",
              background: "var(--steel)",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: "-15% -5%",
                backgroundImage: `url(${IMG.domesAlt}), linear-gradient(135deg, #2a2520, #1a1610)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                y,
                scale,
                filter: "grayscale(15%) contrast(1.08) brightness(0.65) sepia(0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(10,10,10,0.4), rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.85))",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: 28,
                top: 28,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Hexagon size={12} color="var(--gold)" />
              <Label color="var(--bone)">SURFACE GEODESIC</Label>
            </div>
            <div
              style={{
                position: "absolute",
                right: 28,
                top: 28,
              }}
            >
              <Label color="var(--bone-dim)">SOLAR-MANAGED</Label>
            </div>

            <div
              style={{
                position: "absolute",
                left: 28,
                bottom: 28,
                right: 28,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 24,
                alignItems: "flex-end",
              }}
            >
              <div>
                <div
                  className="f-display"
                  style={{
                    fontSize: "clamp(1.8rem, 4.2vw, 3.4rem)",
                    lineHeight: 0.95,
                    color: "var(--bone)",
                  }}
                >
                  A residence,<br />held by the horizon.
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Label color="var(--gold)">ENVELOPE</Label>
                <div
                  className="f-display big-num"
                  style={{
                    fontSize: 36,
                    color: "var(--bone)",
                    marginTop: 4,
                  }}
                >
                  120 – 800 m²
                </div>
              </div>
            </div>

            <div className="bracket tl" />
            <div className="bracket tr" />
            <div className="bracket bl" />
            <div className="bracket br" />
          </div>

          {/* dome specs row */}
          <div
            className="grid md:grid-cols-4"
            style={{
              gap: 0,
              marginTop: 64,
              background: "var(--line-2)",
              gridGap: 1,
            }}
          >
            {[
              ["GEOMETRY", "Geodesic · Triax frame"],
              ["GLAZING", "Polarised · UV/IR filtered"],
              ["CLIMATE", "Nine-constant system"],
              ["ACOUSTIC", "Sub-30dB ambient"],
              ["LOAD", "Wind · 280 km/h rated"],
              ["SEAL", "Sand-storm tight class"],
              ["ENERGY", "Solar + battery autonomy"],
              ["FINISH", "Bespoke interior atelier"],
            ].map(([k, v], i) => (
              <div
                key={i}
                className="bg-carbon spec-row"
                style={{ padding: "28px 22px", minHeight: 130 }}
              >
                <Label color="var(--gold)">{k}</Label>
                <div
                  className="f-display"
                  style={{
                    fontSize: 16,
                    color: "var(--bone)",
                    marginTop: 12,
                    lineHeight: 1.3,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ BUNKERS SHOWCASE ═══════════════════ */

function BunkersShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const depthVal = useTransform(scrollYProgress, [0.1, 0.9], [0, 87]);
  const [d, setD] = useState(0);
  useMotionValueEvent(depthVal, "change", (v) => setD(Math.round(v)));

  return (
    <section
      id="bunkers"
      ref={ref}
      className="grain"
      style={{
        position: "relative",
        background: "var(--ink)",
        overflow: "hidden",
      }}
    >
      {/* full-bleed parallax backdrop */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-10% -5%",
          backgroundImage: `url(${IMG.bunkersAlt}), linear-gradient(180deg, #1a1a1a, #050505)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(40%) contrast(1.15) brightness(0.4)",
          y,
          scale,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.45) 30%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.95) 100%)",
        }}
      />

      <div
        style={{ position: "relative", zIndex: 2, padding: "180px 32px" }}
        className="mx-auto"
      >
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 32 }}>
            <ArrowDown size={14} color="var(--gold)" />
            <Label color="var(--gold)">02 — BUNKERS</Label>
          </div>

          <div
            className="flex flex-wrap items-start justify-between"
            style={{ gap: 32, marginBottom: 80 }}
          >
            <h3
              className="f-display"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 5.6rem)",
                lineHeight: 0.94,
                color: "var(--bone)",
                maxWidth: 800,
              }}
            >
              Below the line.<br />
              <span style={{ color: "var(--gold)" }}>
                Engineered beneath the recognisable world.
              </span>
            </h3>

            <div style={{ textAlign: "right" }}>
              <Label color="var(--ash)">LIVE READOUT</Label>
              <div
                className="f-display big-num"
                style={{
                  fontSize: 80,
                  lineHeight: 0.9,
                  color: "var(--bone)",
                  marginTop: 8,
                }}
              >
                −{String(d).padStart(2, "0")}
                <span style={{ color: "var(--gold)", fontSize: 32 }}>m</span>
              </div>
            </div>
          </div>

          {/* image-card grid */}
          <div className="grid md:grid-cols-12" style={{ gap: 20 }}>
            <div
              className="md:col-span-7"
              style={{
                position: "relative",
                height: 480,
                overflow: "hidden",
                background: "var(--steel)",
              }}
            >
              <div
                className="bg-img dark drift"
                style={{
                  backgroundImage: `url(${IMG.bunkersHero}), linear-gradient(180deg, #0a0a0a, #050505)`,
                  filter: "grayscale(30%) contrast(1.1) brightness(0.55)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(5,5,5,0.85))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  top: 24,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <ArrowDown size={12} color="var(--gold)" />
                <Label color="var(--bone)">DESCENT CORRIDOR</Label>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  bottom: 24,
                  right: 24,
                }}
              >
                <Label color="var(--gold)">PRIMARY INGRESS</Label>
                <div
                  className="f-display"
                  style={{
                    fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)",
                    color: "var(--bone)",
                    lineHeight: 1,
                    marginTop: 8,
                  }}
                >
                  AR500 blast envelope.
                </div>
              </div>
              <div className="bracket tl" />
              <div className="bracket tr" />
              <div className="bracket bl" />
              <div className="bracket br" />
            </div>

            <div className="md:col-span-5 flex flex-col" style={{ gap: 20 }}>
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  minHeight: 230,
                  overflow: "hidden",
                  background: "var(--steel)",
                }}
              >
                <div
                  className="bg-img dark"
                  style={{
                    backgroundImage: `url(${IMG.bunkersInterior}), linear-gradient(180deg, #1a1a1a, #0a0a0a)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.85))",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    bottom: 20,
                    right: 20,
                  }}
                >
                  <Label color="var(--gold)">INTERIOR</Label>
                  <div
                    className="f-display"
                    style={{
                      fontSize: 22,
                      color: "var(--bone)",
                      marginTop: 6,
                      lineHeight: 1.1,
                    }}
                  >
                    Architect-led finishing.
                  </div>
                </div>
                <div className="bracket tl" />
                <div className="bracket br" />
              </div>

              <div
                style={{
                  position: "relative",
                  flex: 1,
                  minHeight: 230,
                  overflow: "hidden",
                  background: "var(--steel)",
                }}
              >
                <div
                  className="bg-img dark"
                  style={{
                    backgroundImage: `url(${IMG.bunkersConcrete}), linear-gradient(180deg, #1a1a1a, #050505)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.85))",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    bottom: 20,
                    right: 20,
                  }}
                >
                  <Label color="var(--gold)">STRUCTURE</Label>
                  <div
                    className="f-display"
                    style={{
                      fontSize: 22,
                      color: "var(--bone)",
                      marginTop: 6,
                      lineHeight: 1.1,
                    }}
                  >
                    Reinforced steel hull.
                  </div>
                </div>
                <div className="bracket tl" />
                <div className="bracket br" />
              </div>
            </div>
          </div>

          {/* bunker spec row */}
          <div
            className="grid md:grid-cols-4"
            style={{
              gap: 0,
              marginTop: 32,
              background: "var(--line-2)",
              gridGap: 1,
            }}
          >
            {[
              ["BLAST", "≥ 1 MPa overpressure"],
              ["RADIATION", "99.97% attenuation"],
              ["ATMOSPHERIC", "NBC · ±0.1% O₂"],
              ["AUTONOMY", "40 kVA dual / 7-day"],
            ].map(([k, v], i) => (
              <div
                key={i}
                className="bg-ink spec-row"
                style={{ padding: "28px 22px", minHeight: 130 }}
              >
                <Label color="var(--gold)">{k}</Label>
                <div
                  className="f-display"
                  style={{
                    fontSize: 16,
                    color: "var(--bone)",
                    marginTop: 12,
                    lineHeight: 1.3,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ STATS ═══════════════════ */

function Stats() {
  const [ref, on] = useReveal(0.25);
  const items = [
    {
      num: "300%",
      label: "GLOBAL INTEREST",
      note: "Surge in private underground demand since 2020.",
    },
    {
      num: "$2B",
      label: "MARKET ENVELOPE",
      note: "Estimated category valuation. Expanding annually.",
    },
    {
      num: "01",
      label: "LUXURY POSITION",
      note: "No dominant premium brand exists. We define it.",
    },
  ];

  return (
    <section
      ref={ref}
      className="grain hair-b"
      style={{ background: "var(--ink)", padding: "160px 0" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 64 }}>
            <span
              style={{
                width: 40,
                height: 1,
                background: "var(--gold)",
                display: "block",
              }}
            />
            <Label color="var(--gold)">03 — POSITION</Label>
          </div>

          <div className="grid md:grid-cols-3">
            {items.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 0",
                  paddingLeft: i > 0 ? 48 : 0,
                  borderLeft: i > 0 ? "1px solid var(--line)" : "none",
                }}
                className="md:pl-12"
              >
                <div
                  className={`reveal-wrap ${on ? "reveal-on" : ""}`}
                  style={{ display: "block" }}
                >
                  <div
                    className="reveal-inner f-display big-num"
                    style={{
                      fontSize: "clamp(4.5rem, 13vw, 11rem)",
                      lineHeight: 0.88,
                      transitionDelay: `${i * 120}ms`,
                      color: i === 1 ? "var(--gold)" : "var(--bone)",
                    }}
                  >
                    {s.num}
                    <span
                      style={{ color: "var(--gold)", fontSize: "0.4em" }}
                    >
                      {i < 2 ? "+" : ""}
                    </span>
                  </div>
                </div>
                <div className="hair-t" style={{ marginTop: 24, paddingTop: 20 }}>
                  <Label color="var(--bone)">{s.label}</Label>
                  <p
                    className="f-body t-bone-dim"
                    style={{ fontSize: 13, lineHeight: 1.55, marginTop: 12 }}
                  >
                    {s.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ TIERS ═══════════════════ */

function Tiers() {
  const tiers = [
    {
      n: "I",
      name: "SAFE ROOMS",
      price: "FROM $50,000",
      img: IMG.tier1,
      desc: "Engineered secure rooms integrated into existing residences. Atmospheric seal, ballistic envelope, autonomous power.",
      specs: [
        ["Footprint", "12 – 28 m²"],
        ["Capacity", "2 – 4 persons"],
        ["Deploy", "6 weeks"],
      ],
    },
    {
      n: "II",
      name: "MODULAR UNITS",
      price: "FROM $80,000",
      img: IMG.tier2,
      desc: "Pre-configured underground modules. Rapid integration, scalable footprint, full life-support and finishing.",
      specs: [
        ["Footprint", "20 – 60 m²"],
        ["Capacity", "4 – 8 persons"],
        ["Deploy", "8 – 12 weeks"],
      ],
    },
    {
      n: "III",
      name: "CUSTOM SPACES",
      price: "FROM $150,000",
      img: IMG.tier3,
      desc: "Bespoke subterranean environments — private majlis, entertainment, wellness retreats. Flagship offering.",
      specs: [
        ["Footprint", "80 m² +"],
        ["Capacity", "Bespoke"],
        ["Deploy", "16 – 36 weeks"],
      ],
    },
  ];

  return (
    <section
      id="tiers"
      className="grain hair-b"
      style={{ background: "var(--carbon)", padding: "160px 0" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <span
              style={{
                width: 40,
                height: 1,
                background: "var(--gold)",
                display: "block",
              }}
            />
            <Label color="var(--gold)">04 — CATALOGUE</Label>
          </div>
          <div
            className="flex flex-wrap items-end justify-between"
            style={{ gap: 24, marginBottom: 64 }}
          >
            <h3
              className="f-display"
              style={{
                fontSize: "clamp(2.2rem, 5.6vw, 4.8rem)",
                lineHeight: 0.94,
                color: "var(--bone)",
                maxWidth: 760,
              }}
            >
              Three tiers.<br />
              One brand standard.
            </h3>
            <p
              className="f-body t-bone-dim"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 360,
              }}
            >
              Each tier shares the same engineering substrate. They differ in scale,
              finish, and the depth of customisation.
            </p>
          </div>

          <div
            className="grid md:grid-cols-3"
            style={{ background: "var(--line-2)", gap: 1 }}
          >
            {tiers.map((t, i) => (
              <Tilt key={i} max={5}>
                <article
                  className="tier bg-ink flex flex-col"
                  style={{
                    padding: "32px",
                    minHeight: 600,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="tier-num f-mono"
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.2em",
                        color: "var(--ash)",
                      }}
                    >
                      TIER {t.n}
                    </div>
                    <ArrowUpRight
                      className="tier-arrow"
                      size={22}
                      color="var(--ash)"
                    />
                  </div>

                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      marginTop: 28,
                      height: 240,
                      background: "var(--steel)",
                    }}
                  >
                    <div
                      className="tier-img"
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url(${t.img}), linear-gradient(135deg, #1a1a1a, #050505)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, transparent 50%, rgba(5,5,5,0.85))",
                      }}
                    />
                    <div className="bracket tl" />
                    <div className="bracket tr" />
                    <div className="bracket bl" />
                    <div className="bracket br" />
                  </div>

                  <div style={{ marginTop: 32, flex: 1 }}>
                    <h4
                      className="f-display"
                      style={{ fontSize: 28, color: "var(--bone)" }}
                    >
                      <Scramble text={t.name} />
                    </h4>
                    <div style={{ marginTop: 8 }}>
                      <Label color="var(--gold)">{t.price}</Label>
                    </div>
                    <p
                      className="f-body t-bone-dim"
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        marginTop: 20,
                      }}
                    >
                      {t.desc}
                    </p>

                    <div
                      className="hair-t"
                      style={{ marginTop: 28, paddingTop: 16 }}
                    >
                      {t.specs.map(([k, v], j) => (
                        <div
                          key={j}
                          className="spec-row flex items-center justify-between"
                          style={{ padding: "8px 0" }}
                        >
                          <Label color="var(--ash)">{k}</Label>
                          <span
                            className="f-mono"
                            style={{
                              fontSize: 12,
                              color: "var(--bone)",
                            }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#contact"
                    className="u-link"
                    style={{
                      marginTop: 32,
                      color: "var(--bone-dim)",
                      fontSize: 12,
                    }}
                  >
                    <Label color="var(--bone-dim)">Enquire — Tier {t.n}</Label>
                    <ArrowRight size={12} />
                  </a>
                </article>
              </Tilt>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ PROCESS TIMELINE ═══════════════════ */

function Process() {
  const steps = [
    {
      n: "01",
      ttl: "CONSULTATION",
      sub: "WEEK 0",
      body: "Confidential briefing under NDA. Site assessment, threat profile, lifestyle envelope.",
    },
    {
      n: "02",
      ttl: "DESIGN",
      sub: "WEEK 2 – 6",
      body: "Architectural studies, modular configuration, atelier finishes. Approved with the principal in person.",
    },
    {
      n: "03",
      ttl: "ENGINEERING",
      sub: "WEEK 6 – 14",
      body: "Structural, hydraulic, atmospheric, AI control. Every subsystem certified to ISO and military standard.",
    },
    {
      n: "04",
      ttl: "FABRICATION",
      sub: "WEEK 10 – 22",
      body: "Off-site manufacture under sealed protocol. Concurrent excavation if on-site works are commissioned.",
    },
    {
      n: "05",
      ttl: "DELIVERY",
      sub: "WEEK 18 – 36",
      body: "Discreet transport, on-site placement, commissioning. Handover with full operational documentation.",
    },
  ];
  return (
    <section
      id="process"
      className="grain hair-b"
      style={{ background: "var(--ink)", padding: "160px 0" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <span
              style={{
                width: 40,
                height: 1,
                background: "var(--gold)",
                display: "block",
              }}
            />
            <Label color="var(--gold)">05 — PROCESS</Label>
          </div>
          <h3
            className="f-display"
            style={{
              fontSize: "clamp(2.2rem, 5.6vw, 4.6rem)",
              lineHeight: 0.94,
              color: "var(--bone)",
              maxWidth: 720,
              marginBottom: 8,
            }}
          >
            Five phases.<br />
            <span style={{ color: "var(--gold)" }}>One sealed protocol.</span>
          </h3>
        </div>

        <div className="hair-y process-track">
          {steps.map((s, i) => (
            <div
              key={i}
              className="process-card"
              style={{
                padding: "48px 32px",
                background: i % 2 ? "var(--carbon)" : "var(--ink)",
                minHeight: 360,
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="f-display big-num"
                  style={{ fontSize: 48, color: "var(--gold)" }}
                >
                  {s.n}
                </div>
                <Label>{s.sub}</Label>
              </div>
              <div
                style={{
                  width: 48,
                  height: 1,
                  background: "var(--gold)",
                  margin: "36px 0 28px",
                }}
              />
              <h4
                className="f-display"
                style={{ fontSize: 26, color: "var(--bone)", lineHeight: 1 }}
              >
                {s.ttl}
              </h4>
              <p
                className="f-body t-bone-dim"
                style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 20 }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "20px 32px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Label color="var(--ash)">SCROLL HORIZONTALLY</Label>
          <Label color="var(--ash)">↔</Label>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ PULL QUOTE ═══════════════════ */

function PullQuote() {
  return (
    <section
      className="grain hair-b"
      style={{
        position: "relative",
        background: "var(--carbon)",
        padding: "180px 0",
        overflow: "hidden",
      }}
    >
      <div
        className="bg-img"
        style={{
          backgroundImage: `url(${IMG.pullQuote}), linear-gradient(180deg, #0a0a0a, #050505)`,
          filter: "grayscale(60%) contrast(1.1) brightness(0.3)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.7), rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.95))",
        }}
      />

      <div
        className="mx-auto"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1100,
          padding: "0 32px",
        }}
      >
        <div className="flex items-center" style={{ gap: 14, marginBottom: 32 }}>
          <span
            style={{
              width: 40,
              height: 1,
              background: "var(--gold)",
              display: "block",
            }}
          />
          <Label color="var(--gold)">DOCTRINE</Label>
        </div>

        <h3
          className="f-display"
          style={{
            fontSize: "clamp(2rem, 5.4vw, 4.6rem)",
            lineHeight: 1.05,
            color: "var(--bone)",
          }}
        >
          “Integrate ultimate protection into the architectural fabric.
          When the world becomes uncertain,{" "}
          <span
            style={{
              color: "var(--gold)",
              fontStyle: "italic",
              fontWeight: 600,
            }}
          >
            home becomes a continent.
          </span>
          ”
        </h3>

        <div
          className="flex flex-wrap justify-between items-center hair-t"
          style={{ gap: 16, marginTop: 64, paddingTop: 24 }}
        >
          <Label>— MINUS 1 DOCTRINE · §02</Label>
          <Label color="var(--bone-dim)">EST. 2025 · GLOBAL</Label>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ CAPABILITIES ═══════════════════ */

function Capabilities() {
  const caps = [
    { Icon: ShieldCheck, k: "BLAST ENVELOPE", v: "≥ 1 MPa overpressure" },
    { Icon: Wind, k: "ATMOSPHERIC", v: "NBC filtration · ±0.1% O₂" },
    { Icon: Zap, k: "AUTONOMY", v: "40 kVA dual / 7-day cycle" },
    { Icon: Radio, k: "COMMS", v: "Satellite + mesh fallback" },
    { Icon: Layers, k: "STRUCTURE", v: "AR500 steel · 6.3mm hull" },
    { Icon: Eye, k: "MONITORING", v: "AI detection · 24/7" },
    { Icon: Compass, k: "GEOSEISMIC", v: "Shock isolation lattice" },
    { Icon: Lock, k: "INGRESS", v: "Airtight blast door" },
  ];
  const [ref, on] = useReveal(0.18);

  return (
    <section
      id="capabilities"
      ref={ref}
      className="grain hair-b"
      style={{
        background: "var(--ink)",
        padding: "160px 0",
        position: "relative",
      }}
    >
      <div
        className="schematic"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />
      <div
        className="mx-auto"
        style={{ position: "relative", maxWidth: 1320 }}
      >
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <span
              style={{
                width: 40,
                height: 1,
                background: "var(--gold)",
                display: "block",
              }}
            />
            <Label color="var(--gold)">06 — SPECIFICATIONS</Label>
          </div>

          <div
            className="flex flex-wrap items-end justify-between"
            style={{ gap: 32, marginBottom: 64 }}
          >
            <h3
              className="f-display"
              style={{
                fontSize: "clamp(2.2rem, 5.6vw, 4.6rem)",
                lineHeight: 0.94,
                color: "var(--bone)",
              }}
            >
              Specifications.<br />Made visible.
            </h3>
            <div
              className="f-mono t-bone-dim hair-t"
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                maxWidth: 320,
                paddingTop: 16,
              }}
            >
              CERT — ISO 9001 · CNAS
              <br />
              STANDARD — ASTM E668 · ISO 10055
              <br />
              ENVELOPE — Mil-grade alloy substrate
            </div>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ background: "var(--line-2)", gap: 1 }}
          >
            {caps.map(({ Icon, k, v }, i) => (
              <div
                key={i}
                className={`bg-ink spec-row ${on ? "reveal-on" : ""}`}
                style={{
                  padding: "28px 24px",
                  minHeight: 180,
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <Icon size={22} strokeWidth={1.2} color="var(--gold)" />
                <div style={{ marginTop: 32 }}>
                  <div
                    className="f-mono t-ash"
                    style={{ fontSize: 10, letterSpacing: "0.22em" }}
                  >
                    {k}
                  </div>
                  <div
                    className="f-display t-bone"
                    style={{
                      fontSize: 16,
                      lineHeight: 1.25,
                      marginTop: 8,
                    }}
                  >
                    {v}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 96 }}>
            <div
              className="flex items-center justify-between hair-b"
              style={{ paddingBottom: 16 }}
            >
              <Label color="var(--gold)">DIMENSIONAL ENVELOPES</Label>
              <Label>SUB-GRADE / m</Label>
            </div>
            {[
              ["UNIT A · 20ft", "6.3 × 3.3 × 3.3", "20 – 28 m²"],
              ["UNIT B · 30ft", "9.3 × 3.3 × 3.3", "32 – 42 m²"],
              ["UNIT C · 50ft", "15.3 × 3.3 × 3.3", "55 – 72 m²"],
              ["DOME · GEODESIC", "Variable", "120 – 800 m²"],
              ["CUSTOM / MAJLIS", "ON-SPEC", "80 m² +"],
            ].map(([a, b, c], i) => (
              <div
                key={i}
                className="hair-b spec-row grid"
                style={{
                  padding: "22px 8px",
                  gridTemplateColumns: "1.5fr 1.5fr 1fr",
                  alignItems: "center",
                }}
              >
                <div
                  className="f-display t-bone"
                  style={{ fontSize: 17 }}
                >
                  {a}
                </div>
                <div
                  className="f-mono t-bone-dim"
                  style={{ fontSize: 12 }}
                >
                  {b}
                </div>
                <div
                  className="f-mono t-gold"
                  style={{ fontSize: 12, textAlign: "right" }}
                >
                  {c}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ REGION ═══════════════════ */

function Region() {
  return (
    <section
      className="grain hair-b"
      style={{
        position: "relative",
        background: "var(--carbon)",
        padding: "160px 0",
        overflow: "hidden",
      }}
    >
      <div
        className="bg-img"
        style={{
          backgroundImage: `url(${IMG.gcc}), linear-gradient(180deg, #1a1a1a, #050505)`,
          filter: "grayscale(50%) contrast(1.1) brightness(0.35)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      <div
        className="mx-auto"
        style={{ position: "relative", maxWidth: 1320 }}
      >
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <Globe size={14} color="var(--gold)" />
            <Label color="var(--gold)">07 — TERRITORY</Label>
          </div>

          <div className="grid md:grid-cols-12" style={{ gap: 40 }}>
            <div className="md:col-span-7">
              <h3
                className="f-display"
                style={{
                  fontSize: "clamp(2.2rem, 5.6vw, 4.8rem)",
                  lineHeight: 0.94,
                  color: "var(--bone)",
                }}
              >
                High concentration<br />
                of wealth.<br />
                <span style={{ color: "var(--gold)" }}>
                  Zero luxury competition.
                </span>
              </h3>
              <p
                className="f-body t-bone-dim"
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  marginTop: 32,
                  maxWidth: 520,
                }}
              >
                The Gulf represents the optimal launch envelope. Concentrated
                UHNW density. A culture of bespoke architecture. A region for
                which discretion is not preference but inheritance.
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="hair-t" style={{ paddingTop: 20 }}>
                <Label color="var(--gold)">PRIMARY MARKETS</Label>
                <div style={{ marginTop: 20 }}>
                  {[
                    ["UAE", "Dubai · Abu Dhabi"],
                    ["KSA", "Riyadh · NEOM corridor"],
                    ["QATAR", "Doha"],
                    ["KUWAIT", "Kuwait City"],
                  ].map(([k, v], i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between hair-b"
                      style={{ padding: "18px 0" }}
                    >
                      <div
                        className="f-display t-bone"
                        style={{ fontSize: 16 }}
                      >
                        {k}
                      </div>
                      <div
                        className="f-mono t-bone-dim"
                        style={{ fontSize: 11 }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ CTA ═══════════════════ */

function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const [tier, setTier] = useState(null);

  return (
    <section
      id="contact"
      className="grain hair-b"
      style={{
        position: "relative",
        background: "var(--ink)",
        padding: "160px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-15%",
          top: "8%",
          width: "75%",
          height: "84%",
          backgroundImage: `url(${IMG.ctaBg}), linear-gradient(135deg, #1a1a1a, #050505)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(60%) contrast(1.1) brightness(0.35)",
          opacity: 0.55,
          maskImage: "linear-gradient(270deg, rgba(0,0,0,1), rgba(0,0,0,0))",
          WebkitMaskImage:
            "linear-gradient(270deg, rgba(0,0,0,1), rgba(0,0,0,0))",
        }}
      />

      <div
        className="mx-auto"
        style={{ position: "relative", maxWidth: 1320 }}
      >
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <span
              style={{
                width: 40,
                height: 1,
                background: "var(--gold)",
                display: "block",
              }}
            />
            <Label color="var(--gold)">08 — CONTACT</Label>
          </div>
          <div className="grid md:grid-cols-12" style={{ gap: 48 }}>
            <div className="md:col-span-7">
              <h3
                className="f-display"
                style={{
                  fontSize: "clamp(2.6rem, 7vw, 6.8rem)",
                  lineHeight: 0.9,
                  color: "var(--bone)",
                }}
              >
                Request a<br />
                <span style={{ color: "var(--gold)" }}>private briefing.</span>
              </h3>
              <p
                className="f-body t-bone-dim"
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  marginTop: 32,
                  maxWidth: 520,
                }}
              >
                Engagement begins with a confidential consultation —
                typically on-site, always under non-disclosure. Project intake
                is limited and waitlisted.
              </p>

              <div
                className="hair-t grid grid-cols-2"
                style={{
                  marginTop: 48,
                  paddingTop: 24,
                  gap: 16,
                  maxWidth: 460,
                }}
              >
                <div>
                  <Label>OPERATIONS</Label>
                  <div
                    className="f-display t-bone"
                    style={{ fontSize: 15, marginTop: 8 }}
                  >
                    Dubai · Riyadh
                  </div>
                </div>
                <div>
                  <Label>CIPHERED CHANNEL</Label>
                  <div
                    className="f-display t-bone"
                    style={{ fontSize: 15, marginTop: 8 }}
                  >
                    by request
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div
                style={{
                  background: "var(--carbon)",
                  border: "1px solid var(--line-2)",
                  padding: 32,
                  position: "relative",
                }}
                className="glow-gold"
              >
                <div className="bracket tl" />
                <div className="bracket tr" />
                <div className="bracket bl" />
                <div className="bracket br" />

                {!submitted ? (
                  <>
                    <Label color="var(--gold)">INTAKE — FORM 001</Label>
                    <div style={{ marginTop: 24 }}>
                      {[
                        ["NAME", "Full name"],
                        ["ENTITY", "Organisation / individual"],
                        ["TERRITORY", "City · Country"],
                        ["CHANNEL", "Email · Encrypted preferred"],
                      ].map(([k, p], i) => (
                        <div
                          key={i}
                          className="hair-b"
                          style={{ paddingBottom: 14, marginBottom: 14 }}
                        >
                          <div
                            className="f-mono t-ash"
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.2em",
                              marginBottom: 8,
                            }}
                          >
                            {String(i + 1).padStart(2, "0")} — {k}
                          </div>
                          <input
                            type="text"
                            placeholder={p}
                            className="f-body t-bone"
                            style={{
                              background: "transparent",
                              border: "none",
                              outline: "none",
                              fontSize: 14,
                              padding: "4px 0",
                              width: "100%",
                              color: "var(--bone)",
                            }}
                          />
                        </div>
                      ))}
                      <div>
                        <div
                          className="f-mono t-ash"
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.2em",
                            marginBottom: 10,
                          }}
                        >
                          05 — INTEREST
                        </div>
                        <div
                          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                        >
                          {[
                            ["DOMES", "DOMES"],
                            ["BUNKERS", "BUNKERS"],
                            ["BOTH", "BOTH"],
                          ].map(([k]) => (
                            <button
                              key={k}
                              onClick={() => setTier(k)}
                              className="f-mono"
                              style={{
                                padding: "10px 14px",
                                fontSize: 11,
                                letterSpacing: "0.15em",
                                border:
                                  tier === k
                                    ? "1px solid var(--gold)"
                                    : "1px solid var(--line-2)",
                                color:
                                  tier === k
                                    ? "var(--gold)"
                                    : "var(--bone-dim)",
                                background:
                                  tier === k
                                    ? "rgba(200,156,74,0.05)"
                                    : "transparent",
                                cursor: "none",
                                transition: "all 250ms ease",
                              }}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Magnetic strength={0.15}>
                      <button
                        className="btn-prime"
                        onClick={() => setSubmitted(true)}
                        style={{
                          marginTop: 32,
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          className="flex items-center"
                          style={{ gap: 12 }}
                        >
                          <span className="dot" />
                          Request Private Briefing
                        </span>
                        <ArrowRight size={14} />
                      </button>
                    </Magnetic>
                    <div
                      className="flex items-center"
                      style={{ gap: 8, marginTop: 16 }}
                    >
                      <Lock size={10} color="var(--ash)" />
                      <Label>TRANSMISSION ENCRYPTED</Label>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "32px 0", textAlign: "center" }}>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        border: "1px solid var(--gold)",
                        borderRadius: 999,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--gold)",
                      }}
                    >
                      <Lock size={18} />
                    </div>
                    <h4
                      className="f-display t-bone"
                      style={{ fontSize: 24, lineHeight: 1.2, marginTop: 24 }}
                    >
                      Request received.
                    </h4>
                    <p
                      className="f-body t-bone-dim"
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        marginTop: 12,
                      }}
                    >
                      A member of the MINUS 1 intake desk will reach you
                      within 72 hours on the channel provided. Reference is
                      held internally.
                    </p>
                    <Magnetic>
                      <button
                        className="btn-prime"
                        onClick={() => {
                          setSubmitted(false);
                          setTier(null);
                        }}
                        style={{ marginTop: 32, padding: "12px 20px" }}
                      >
                        <span className="dot" />
                        New Request
                      </button>
                    </Magnetic>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ FOOTER ═══════════════════ */

function Footer() {
  return (
    <footer
      className="grain"
      style={{ background: "var(--carbon)", padding: "72px 0 48px" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div
            className="hair-b flex flex-wrap items-center justify-between"
            style={{ gap: 32, paddingBottom: 32 }}
          >
            <div className="flex items-center" style={{ gap: 12 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  border: "1px solid var(--gold)",
                  color: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MinusIcon size={14} strokeWidth={2.2} />
              </div>
              <div
                className="f-display"
                style={{ fontSize: 14, letterSpacing: "0.12em" }}
              >
                MINUS 1
              </div>
              <Label>BUNKERS · DOMES</Label>
            </div>

            <div
              className="flex flex-wrap items-center"
              style={{ gap: 32 }}
            >
              <Label color="var(--bone-dim)">PRIVACY</Label>
              <Label color="var(--bone-dim)">TERMS</Label>
              <Label color="var(--bone-dim)">PRESS</Label>
              <Label color="var(--bone-dim)">CAREERS</Label>
            </div>

            <div className="flex items-center" style={{ gap: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "var(--gold)",
                }}
                className="pulse-glow"
              />
              <Label color="var(--gold)">CHANNEL ACTIVE</Label>
            </div>
          </div>

          <div
            className="grid md:grid-cols-3"
            style={{ gap: 32, marginTop: 40 }}
          >
            <div>
              <Label>HEADQUARTERS</Label>
              <p
                className="f-body t-bone-dim"
                style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}
              >
                By appointment only. Address disclosed in NDA phase.
              </p>
            </div>
            <div>
              <Label>STANDARDS</Label>
              <p
                className="f-body t-bone-dim"
                style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}
              >
                ISO 9001 · CNAS · ASTM E668 · ISO 10055 · Mil-grade substrate.
              </p>
            </div>
            <div>
              <Label>PHILOSOPHY</Label>
              <p
                className="f-body t-bone-dim"
                style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}
              >
                Not a shelter. A new layer of living.
              </p>
            </div>
          </div>

          <div
            className="hair-t flex flex-wrap items-center justify-between"
            style={{ marginTop: 48, paddingTop: 24, gap: 16 }}
          >
            <Label color="var(--ash)">© MINUS 1 — ALL CLEARANCES RESERVED</Label>
            <Label color="var(--ash)">Ω.001 — CONFIDENTIAL</Label>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════ ROOT ═══════════════════ */

export default function Minus1() {
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const h = document.body.scrollHeight - window.innerHeight;
        setScrollY(y);
        setDepth(Math.max(0, Math.min(1, y / Math.max(1, h))));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="f-body"
      style={{ background: "var(--ink)", color: "var(--bone)" }}
    >
      <style>{CSS}</style>

      <AnimatePresence>
        {loading && <Preloader done={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && <CustomCursor />}

      <Nav scrollY={scrollY} />
      <DepthIndicator depth={depth} />

      <Hero />
      <Marquee />
      <Thesis />
      <DomesShowcase />
      <BunkersShowcase />
      <Stats />
      <Tiers />
      <Process />
      <PullQuote />
      <Capabilities />
      <Region />
      <CTA />
      <Footer />
    </div>
  );
}
