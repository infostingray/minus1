import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
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
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
   MINUS 1 — A NEW LAYER OF LIVING
   Single-page cinematic experience. Cyber-brutalist luxury.
   ──────────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

:root {
  --ink: #050505;
  --carbon: #0a0a0a;
  --slate: #111111;
  --steel: #1a1a1a;
  --concrete: #2a2a2a;
  --line: rgba(237, 232, 223, 0.08);
  --line-2: rgba(237, 232, 223, 0.14);
  --bone: #ede8df;
  --bone-dim: #c8c3ba;
  --ash: #6e6a64;
  --gold: #c89c4a;
  --gold-bright: #e2bd6f;
  --signal: #ff4a16;
}

* { box-sizing: border-box; }
html, body { background: var(--ink); color: var(--bone); }

.f-display { font-family: 'Syne', sans-serif; letter-spacing: -0.045em; font-weight: 700; }
.f-body    { font-family: 'Manrope', sans-serif; font-weight: 300; }
.f-mono    { font-family: 'JetBrains Mono', monospace; font-weight: 400; letter-spacing: 0.02em; }

.bg-ink     { background-color: var(--ink); }
.bg-carbon  { background-color: var(--carbon); }
.bg-slate-x { background-color: var(--slate); }
.bg-steel   { background-color: var(--steel); }
.bg-concrete{ background-color: var(--concrete); }
.t-bone     { color: var(--bone); }
.t-bone-dim { color: var(--bone-dim); }
.t-ash      { color: var(--ash); }
.t-gold     { color: var(--gold); }
.t-gold-b   { color: var(--gold-bright); }
.t-signal   { color: var(--signal); }

.b-line   { border-color: var(--line); }
.b-line-2 { border-color: var(--line-2); }

/* hairline rules */
.hair-t { border-top: 1px solid var(--line); }
.hair-b { border-bottom: 1px solid var(--line); }
.hair-l { border-left: 1px solid var(--line); }
.hair-r { border-right: 1px solid var(--line); }
.hair-x { border-left: 1px solid var(--line); border-right: 1px solid var(--line); }
.hair-y { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.hair-all { border: 1px solid var(--line); }

/* film grain (pure SVG, blends in) */
.grain {
  position: relative;
}
.grain::after {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.93  0 0 0 0 0.91  0 0 0 0 0.87  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  opacity: 0.06;
  mix-blend-mode: overlay;
  z-index: 5;
}

/* Vignette */
.vignette::before {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 95%);
  pointer-events: none;
  z-index: 4;
}

/* gold ticker line */
.tick-gold {
  background: linear-gradient(90deg, transparent 0%, var(--gold) 35%, var(--gold) 65%, transparent 100%);
  height: 1px;
}

/* Underline link */
.u-link {
  position: relative; display: inline-flex; align-items: center; gap: 0.5rem;
  padding-bottom: 4px; transition: color 200ms ease;
}
.u-link::after {
  content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%;
  background: currentColor; transform-origin: right; transform: scaleX(1);
  transition: transform 400ms cubic-bezier(.7,0,.2,1);
}
.u-link:hover::after { transform-origin: left; transform: scaleX(0); }

/* Hero split */
.hero-split { display: grid; grid-template-columns: 1fr 1fr; transition: grid-template-columns 800ms cubic-bezier(.7,0,.2,1); }
.hero-split.left-active  { grid-template-columns: 1.7fr 1fr; }
.hero-split.right-active { grid-template-columns: 1fr 1.7fr; }
@media (max-width: 900px) {
  .hero-split { grid-template-columns: 1fr !important; grid-template-rows: 1fr 1fr; height: 100vh; }
}

/* image transforms */
.bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transition: transform 1400ms cubic-bezier(.7,0,.2,1), filter 1400ms ease;
  filter: grayscale(20%) contrast(1.08) brightness(0.45);
}
.hero-half:hover .bg-img { transform: scale(1.06); filter: grayscale(10%) contrast(1.1) brightness(0.6); }

/* depth indicator (fixed) */
.depth-bar {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 60; display: flex; flex-direction: column; align-items: center; gap: 12px;
  pointer-events: none;
}
.depth-track {
  width: 1px; height: 220px; background: var(--line-2); position: relative;
}
.depth-fill {
  position: absolute; left: -1px; top: 0; width: 3px; background: var(--gold);
  box-shadow: 0 0 12px rgba(200,156,74,0.6);
  transition: height 120ms linear;
}
@media (max-width: 900px) { .depth-bar { display: none; } }

/* card tier shimmer */
.tier {
  position: relative; overflow: hidden;
  transition: transform 700ms cubic-bezier(.7,0,.2,1), background-color 500ms ease;
}
.tier .tier-img {
  transition: transform 1200ms cubic-bezier(.7,0,.2,1), filter 800ms ease;
  filter: grayscale(40%) contrast(1.05) brightness(0.55);
}
.tier:hover .tier-img { transform: scale(1.08); filter: grayscale(0%) contrast(1.1) brightness(0.7); }
.tier:hover { background-color: var(--carbon); }
.tier .tier-arrow { transition: transform 600ms cubic-bezier(.7,0,.2,1); }
.tier:hover .tier-arrow { transform: translate(8px, -8px); color: var(--gold-bright); }
.tier .tier-num { transition: color 500ms ease; }
.tier:hover .tier-num { color: var(--gold); }

/* scroll snap */
.snap-y { scroll-snap-type: y mandatory; }
.snap-start { scroll-snap-align: start; }

/* button */
.btn-prime {
  display: inline-flex; align-items: center; gap: 14px; padding: 16px 22px;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.18em;
  color: var(--bone); background: transparent; border: 1px solid var(--line-2);
  text-transform: uppercase; transition: all 350ms ease; position: relative; overflow: hidden;
  cursor: pointer;
}
.btn-prime::before {
  content: ""; position: absolute; inset: 0; background: var(--gold);
  transform: scaleX(0); transform-origin: left; transition: transform 500ms cubic-bezier(.7,0,.2,1); z-index: -1;
}
.btn-prime:hover { color: var(--ink); border-color: var(--gold); }
.btn-prime:hover::before { transform: scaleX(1); }
.btn-prime .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
.btn-prime:hover .dot { background: var(--ink); }

/* schematic blueprint */
.schematic {
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* breathing scroll cue */
@keyframes breathe {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(8px); opacity: 1; }
}
.breathe { animation: breathe 2.4s ease-in-out infinite; }

/* slow drift */
@keyframes drift {
  0%   { transform: translate3d(0,0,0) scale(1.05); }
  50%  { transform: translate3d(-2%, -1%, 0) scale(1.1); }
  100% { transform: translate3d(0,0,0) scale(1.05); }
}
.drift { animation: drift 22s ease-in-out infinite; }

/* split text reveal */
.reveal-wrap { overflow: hidden; display: inline-block; }
.reveal-inner { display: inline-block; transform: translateY(110%); }
.reveal-on .reveal-inner { transform: translateY(0); transition: transform 1100ms cubic-bezier(.7,0,.2,1); }

/* nav */
.nav-link {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--bone-dim); transition: color 250ms ease;
}
.nav-link:hover { color: var(--bone); }

/* corner brackets */
.bracket { position: absolute; width: 12px; height: 12px; border-color: var(--gold); }
.bracket.tl { top: 12px; left: 12px; border-top: 1px solid; border-left: 1px solid; }
.bracket.tr { top: 12px; right: 12px; border-top: 1px solid; border-right: 1px solid; }
.bracket.bl { bottom: 12px; left: 12px; border-bottom: 1px solid; border-left: 1px solid; }
.bracket.br { bottom: 12px; right: 12px; border-bottom: 1px solid; border-right: 1px solid; }

/* shadows for spec rows */
.spec-row { transition: background-color 300ms ease, padding 300ms ease; }
.spec-row:hover { background-color: var(--carbon); }

/* big numeric counter */
.big-num { font-feature-settings: "tnum"; }

/* mobile responsive helpers */
@media (max-width: 700px) {
  .clamp-display { font-size: clamp(2.2rem, 12vw, 5rem) !important; line-height: 0.95 !important; }
  .clamp-mega { font-size: clamp(3rem, 18vw, 8rem) !important; line-height: 0.88 !important; }
}

/* No scroll for body during modal */
.lock-scroll { overflow: hidden; }
`;

/* ────── images (Unsplash, cinematic architectural) ────── */
const IMG = {
  horizon:
    "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1800&q=80", // desert dunes
  depth:
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1800&q=80", // dark tunnel
  manifesto:
    "https://images.unsplash.com/photo-1545158539-1709a01b9d2c?auto=format&fit=crop&w=2200&q=80", // brutalist concrete corridor
  descent:
    "https://images.unsplash.com/photo-1564013434775-f71db0030976?auto=format&fit=crop&w=2200&q=80", // dark architectural
  tier1:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  tier2:
    "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1600&q=80", // concrete
  tier3:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  gcc:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=80", // Dubai skyline
  cta:
    "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=2400&q=80",
};

/* ────── small reusable bits ────── */

function MarkPlus({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1V13M1 7H13" stroke={color} strokeWidth="1" />
    </svg>
  );
}

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

/* hook: intersection-based reveal */
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

/* ────── NAV ────── */
function Nav({ scrollY }) {
  const [open, setOpen] = useState(false);
  return (
    <>
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
          borderBottom: scrollY > 60 ? "1px solid var(--line)" : "1px solid transparent",
          transition: "all 400ms ease",
        }}
      >
        <div className="flex items-center justify-between px-5 md:px-10 py-5">
          {/* logo */}
          <a href="#top" className="flex items-center gap-3 group">
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                border: "1px solid var(--gold)",
                color: "var(--gold)",
              }}
            >
              <MinusIcon size={14} strokeWidth={2.2} />
            </div>
            <div className="f-display" style={{ fontSize: 14, letterSpacing: "0.12em" }}>
              MINUS 1
            </div>
            <Label>BUNKERS</Label>
          </a>

          {/* center nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#thesis" className="nav-link">01 — Thesis</a>
            <a href="#descent" className="nav-link">02 — Descent</a>
            <a href="#tiers" className="nav-link">03 — Tiers</a>
            <a href="#capabilities" className="nav-link">04 — Capabilities</a>
            <a href="#contact" className="nav-link">05 — Contact</a>
          </nav>

          {/* right */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 t-ash">
              <Lock size={12} />
              <Label>CONFIDENTIAL</Label>
            </div>
            <a href="#contact" className="btn-prime" style={{ padding: "10px 16px" }}>
              <span className="dot" />
              Brief
            </a>
            <button
              className="md:hidden flex items-center justify-center"
              style={{ width: 36, height: 36, border: "1px solid var(--line-2)" }}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
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
              <div className="flex flex-col py-4 px-5">
                {["01 — Thesis", "02 — Descent", "03 — Tiers", "04 — Capabilities", "05 — Contact"].map(
                  (t, i) => (
                    <a
                      key={i}
                      href={`#${["thesis","descent","tiers","capabilities","contact"][i]}`}
                      className="nav-link py-3 hair-b"
                      onClick={() => setOpen(false)}
                    >
                      {t}
                    </a>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/* ────── DEPTH INDICATOR (fixed right) ────── */
function DepthIndicator({ depth }) {
  // depth: 0..1 mapped to -0..-127m
  const meters = Math.round(depth * 127);
  return (
    <div className="depth-bar">
      <div className="f-mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ash)" }}>
        DEPTH
      </div>
      <div className="depth-track">
        <div className="depth-fill" style={{ height: `${depth * 100}%` }} />
      </div>
      <div
        className="f-mono big-num"
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--gold)",
          minWidth: 50,
          textAlign: "center",
        }}
      >
        −{String(meters).padStart(3, "0")}m
      </div>
    </div>
  );
}

/* ────── HERO ────── */
function Hero() {
  const [hover, setHover] = useState(null); // 'L' | 'R' | null
  const split =
    hover === "L" ? "hero-split left-active" : hover === "R" ? "hero-split right-active" : "hero-split";

  return (
    <section id="top" style={{ height: "100vh", position: "relative" }} className="grain vignette">
      <div className={split} style={{ height: "100%" }}>
        {/* THE HORIZON */}
        <div
          className="hero-half"
          style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
          onMouseEnter={() => setHover("L")}
          onMouseLeave={() => setHover(null)}
        >
          <div
            className="bg-img drift"
            style={{ backgroundImage: `url(${IMG.horizon})` }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.15) 50%, rgba(5,5,5,0.75) 100%)",
              zIndex: 2,
            }}
          />
          <div
            style={{ position: "relative", zIndex: 6, height: "100%" }}
            className="flex flex-col justify-between p-6 md:p-12"
          >
            <div className="flex items-center justify-between">
              <Label color="var(--gold)">I — ABOVE</Label>
              <Label>00°N / 00°E</Label>
            </div>
            <div>
              <div className="reveal-on">
                <div className="reveal-wrap">
                  <div
                    className="reveal-inner f-display clamp-display t-bone"
                    style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", lineHeight: 0.9 }}
                  >
                    THE
                  </div>
                </div>
              </div>
              <div className="reveal-on">
                <div className="reveal-wrap">
                  <div
                    className="reveal-inner f-display clamp-display"
                    style={{
                      fontSize: "clamp(3rem, 9vw, 7.5rem)",
                      lineHeight: 0.9,
                      color: "var(--gold)",
                      transitionDelay: "120ms",
                    }}
                  >
                    HORIZON
                  </div>
                </div>
              </div>
              <p
                className="f-body t-bone-dim mt-6 max-w-md"
                style={{ fontSize: 14, lineHeight: 1.6 }}
              >
                Surface domes engineered as architectural objects. Continuity above the
                terrain — heat-shielded, isolated, intentional.
              </p>
              <div className="mt-8 flex items-center gap-2 u-link t-bone">
                <Label color="var(--bone)">Observe the Surface</Label>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* THE DEPTH */}
        <div
          className="hero-half hair-l"
          style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
          onMouseEnter={() => setHover("R")}
          onMouseLeave={() => setHover(null)}
        >
          <div className="bg-img drift" style={{ backgroundImage: `url(${IMG.depth})` }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(225deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.15) 50%, rgba(5,5,5,0.85) 100%)",
              zIndex: 2,
            }}
          />
          <div
            style={{ position: "relative", zIndex: 6, height: "100%" }}
            className="flex flex-col justify-between p-6 md:p-12"
          >
            <div className="flex items-center justify-between">
              <Label color="var(--gold)">II — BELOW</Label>
              <Label>−47m / SUB-GRADE</Label>
            </div>
            <div>
              <div className="reveal-on">
                <div className="reveal-wrap">
                  <div
                    className="reveal-inner f-display clamp-display t-bone"
                    style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", lineHeight: 0.9 }}
                  >
                    THE
                  </div>
                </div>
              </div>
              <div className="reveal-on">
                <div className="reveal-wrap">
                  <div
                    className="reveal-inner f-display clamp-display"
                    style={{
                      fontSize: "clamp(3rem, 9vw, 7.5rem)",
                      lineHeight: 0.9,
                      color: "var(--bone)",
                      transitionDelay: "120ms",
                    }}
                  >
                    DEPTH
                  </div>
                </div>
              </div>
              <p
                className="f-body t-bone-dim mt-6 max-w-md"
                style={{ fontSize: 14, lineHeight: 1.6 }}
              >
                Sub-terranean estates. A second layer of living, removed from the
                grid — for continuity, privacy, and control.
              </p>
              <div className="mt-8 flex items-center gap-2 u-link t-gold-b">
                <Label color="var(--gold-bright)">Initiate the Descent</Label>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
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
        <div
          style={{
            width: 80,
            height: 80,
            border: "1px solid var(--line-2)",
            background: "rgba(5,5,5,0.55)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--bone)",
          }}
        >
          <MinusIcon size={28} strokeWidth={1.5} />
        </div>
      </div>

      {/* scroll cue */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 28,
          display: "flex",
          justifyContent: "center",
          zIndex: 8,
        }}
      >
        <div className="breathe flex flex-col items-center gap-2">
          <Label color="var(--bone-dim)">SCROLL TO DESCEND</Label>
          <ChevronDown size={14} className="t-gold" />
        </div>
      </div>

      {/* hairline frame */}
      <div className="bracket tl" />
      <div className="bracket tr" />
      <div className="bracket bl" />
      <div className="bracket br" />
    </section>
  );
}

/* ────── THESIS ────── */
function Thesis() {
  const [ref, on] = useReveal(0.2);
  return (
    <section
      id="thesis"
      ref={ref}
      className="grain hair-b"
      style={{ background: "var(--ink)", padding: "140px 0 160px", position: "relative" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div className="px-6 md:px-10">
          <div className="flex items-center gap-3 mb-12">
            <span style={{ width: 36, height: 1, background: "var(--gold)" }} />
            <Label color="var(--gold)">01 — THESIS</Label>
          </div>

          <div className={on ? "reveal-on" : ""}>
            <h2
              className="f-display clamp-mega"
              style={{ fontSize: "clamp(2.6rem, 7.8vw, 8.2rem)", lineHeight: 0.92 }}
            >
              <span className="reveal-wrap"><span className="reveal-inner">Not a shelter.</span></span><br />
              <span className="reveal-wrap">
                <span className="reveal-inner" style={{ transitionDelay: "120ms" }}>
                  A <em className="t-gold" style={{ fontStyle: "italic", fontWeight: 600 }}>new layer</em> of living.
                </span>
              </span>
            </h2>
          </div>

          <div
            className="mt-16 grid gap-12"
            style={{ gridTemplateColumns: "1fr", maxWidth: 1100 }}
          >
            <div className="grid md:grid-cols-3 gap-10">
              <div className="hair-t pt-6">
                <Label color="var(--gold)">CONTINUITY</Label>
                <p className="f-body mt-4 t-bone" style={{ fontSize: 16, lineHeight: 1.55 }}>
                  Operational autonomy across power, air, water and communication.
                  A residence that does not stop when the grid does.
                </p>
              </div>
              <div className="hair-t pt-6">
                <Label color="var(--gold)">PRIVACY</Label>
                <p className="f-body mt-4 t-bone" style={{ fontSize: 16, lineHeight: 1.55 }}>
                  Architecture removed from public sightlines. No address.
                  No external footprint. Visible only to those invited.
                </p>
              </div>
              <div className="hair-t pt-6">
                <Label color="var(--gold)">CONTROL</Label>
                <p className="f-body mt-4 t-bone" style={{ fontSize: 16, lineHeight: 1.55 }}>
                  Climate, atmosphere, ingress, monitoring — every variable
                  governed from a single interface, by a single hand.
                </p>
              </div>
            </div>
          </div>

          {/* coordinates strip */}
          <div className="mt-24 hair-y py-5 flex flex-wrap items-center justify-between gap-4">
            <Label>EST. PROTOCOL — Ω.001</Label>
            <Label color="var(--bone-dim)">CLEARANCE — RESTRICTED TIER</Label>
            <Label>OPERATING ENVELOPE — GLOBAL</Label>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────── DESCENT (parallax visual moment) ────── */
function Descent() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const depthLabel = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 87]
  );
  const [d, setD] = useState(0);
  useMotionValueEvent(depthLabel, "change", (v) => setD(Math.round(v)));

  return (
    <section
      id="descent"
      ref={ref}
      className="grain"
      style={{
        position: "relative",
        height: "120vh",
        overflow: "hidden",
        background: "var(--carbon)",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: "-10% -5%",
          backgroundImage: `url(${IMG.manifesto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(40%) contrast(1.15) brightness(0.5)",
          y: y1,
          scale,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.45) 35%, rgba(5,5,5,0.6) 65%, rgba(5,5,5,0.96) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "5%",
          top: "12%",
          color: "var(--bone-dim)",
        }}
        className="f-mono"
      >
        <div style={{ fontSize: 10, letterSpacing: "0.22em" }}>VECTOR</div>
        <div className="f-display t-gold" style={{ fontSize: 14, marginTop: 4 }}>
          −Z AXIS
        </div>
      </div>

      <motion.div
        style={{
          position: "absolute",
          right: "5%",
          top: "12%",
          y: y2,
          textAlign: "right",
        }}
        className="f-mono"
      >
        <div style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--bone-dim)" }}>
          CURRENT
        </div>
        <div className="f-display big-num" style={{ fontSize: 56, color: "var(--bone)" }}>
          −{String(d).padStart(2, "0")}m
        </div>
      </motion.div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div>
          <Label color="var(--gold)">02 — DESCENT</Label>
          <h3
            className="f-display mt-6"
            style={{
              fontSize: "clamp(2.4rem, 7vw, 6.5rem)",
              lineHeight: 0.95,
              color: "var(--bone)",
            }}
          >
            Engineered beneath<br />the recognisable world.
          </h3>
          <p
            className="f-body t-bone-dim mt-8 mx-auto"
            style={{ fontSize: 15, lineHeight: 1.65, maxWidth: 540 }}
          >
            Every project begins with a vector — downward. Excavation, ballistic
            envelope, atmospheric seal. The surface holds the address. The depth
            holds the life.
          </p>
        </div>
      </div>

      {/* vertical depth ladder */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 24,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 1, height: 80, background: "var(--gold)" }} />
        <Label color="var(--gold)">CONTINUE</Label>
      </div>
    </section>
  );
}

/* ────── PROOF / STATS ────── */
function Proof() {
  const [ref, on] = useReveal(0.25);
  const stats = [
    { num: "300%+", label: "GLOBAL INTEREST", note: "Surge in private underground demand since 2020." },
    { num: "$2B+",  label: "MARKET ENVELOPE",  note: "Estimated category valuation, expanding annually." },
    { num: "01",    label: "LUXURY POSITION",  note: "No dominant premium brand exists. We define it." },
  ];
  return (
    <section
      ref={ref}
      className="grain hair-b"
      style={{ background: "var(--ink)", padding: "140px 0", position: "relative" }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 1320 }}>
        <div className="flex items-center gap-3 mb-16">
          <span style={{ width: 36, height: 1, background: "var(--gold)" }} />
          <Label color="var(--gold)">03 — POSITION</Label>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-0">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`px-0 md:px-10 py-8 ${i > 0 ? "md:hair-l" : ""}`}
            >
              <div
                className={`reveal-wrap ${on ? "reveal-on" : ""}`}
                style={{ display: "block" }}
              >
                <div
                  className="reveal-inner f-display big-num"
                  style={{
                    fontSize: "clamp(4rem, 11vw, 8.5rem)",
                    lineHeight: 0.9,
                    transitionDelay: `${i * 120}ms`,
                    color: i === 1 ? "var(--gold)" : "var(--bone)",
                  }}
                >
                  {s.num}
                </div>
              </div>
              <div className="mt-6 hair-t pt-5">
                <Label color="var(--bone)">{s.label}</Label>
                <p className="f-body t-bone-dim mt-3" style={{ fontSize: 13, lineHeight: 1.55 }}>
                  {s.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────── TIERS ────── */
function Tiers() {
  const tiers = [
    {
      n: "I",
      name: "SAFE ROOMS",
      price: "FROM $50,000",
      img: IMG.tier1,
      desc:
        "Engineered secure rooms integrated into existing residences. Atmospheric seal, ballistic envelope, autonomous power.",
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
      desc:
        "Pre-configured underground modules. Rapid integration, scalable footprint, full life-support and finishing.",
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
      desc:
        "Bespoke subterranean environments — private majlis, entertainment complexes, wellness retreats. Flagship offering.",
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
      style={{ background: "var(--carbon)", padding: "140px 0" }}
    >
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 1320 }}>
        <div className="flex items-center gap-3 mb-6">
          <span style={{ width: 36, height: 1, background: "var(--gold)" }} />
          <Label color="var(--gold)">04 — CATALOGUE</Label>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <h3
            className="f-display"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)",
              lineHeight: 0.95,
              color: "var(--bone)",
              maxWidth: 740,
            }}
          >
            Three tiers.<br />One brand standard.
          </h3>
          <p className="f-body t-bone-dim max-w-sm" style={{ fontSize: 14, lineHeight: 1.6 }}>
            Each tier shares the same engineering substrate. They differ only in scale,
            finish, and the depth of customisation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px" style={{ background: "var(--line-2)" }}>
          {tiers.map((t, i) => (
            <article
              key={i}
              className="tier bg-ink p-6 md:p-8 flex flex-col"
              style={{ minHeight: 560 }}
            >
              <div className="flex items-start justify-between">
                <div className="tier-num f-mono" style={{ fontSize: 12, letterSpacing: "0.2em", color: "var(--ash)" }}>
                  TIER {t.n}
                </div>
                <ArrowUpRight className="tier-arrow t-ash" size={20} />
              </div>

              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  marginTop: 28,
                  height: 220,
                  background: "var(--steel)",
                }}
              >
                <div
                  className="tier-img"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${t.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(5,5,5,0.85) 100%)",
                  }}
                />
                <div className="bracket tl" />
                <div className="bracket tr" />
                <div className="bracket bl" />
                <div className="bracket br" />
              </div>

              <div className="mt-8 flex-1">
                <h4 className="f-display" style={{ fontSize: 26, color: "var(--bone)" }}>
                  {t.name}
                </h4>
                <div className="mt-2">
                  <Label color="var(--gold)">{t.price}</Label>
                </div>
                <p className="f-body t-bone-dim mt-5" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  {t.desc}
                </p>

                <div className="mt-7 hair-t pt-4">
                  {t.specs.map(([k, v], j) => (
                    <div
                      key={j}
                      className="spec-row flex items-center justify-between py-2"
                    >
                      <Label color="var(--ash)">{k}</Label>
                      <span className="f-mono" style={{ fontSize: 12, color: "var(--bone)" }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <a href="#contact" className="u-link mt-8 t-bone-dim" style={{ fontSize: 12 }}>
                <Label color="var(--bone-dim)">Enquire — Tier {t.n}</Label>
                <ArrowRight size={12} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────── CAPABILITIES ────── */
function Capabilities() {
  const caps = [
    { Icon: ShieldCheck, k: "BLAST ENVELOPE", v: "≥ 1 MPa overpressure" },
    { Icon: Wind,        k: "ATMOSPHERIC",    v: "NBC filtration · ±0.1% O₂" },
    { Icon: Zap,         k: "AUTONOMY",       v: "40 kVA dual / 7-day cycle" },
    { Icon: Radio,       k: "COMMS",          v: "Satellite + mesh fallback" },
    { Icon: Layers,      k: "STRUCTURE",      v: "AR500 steel · 6.3mm hull" },
    { Icon: Eye,         k: "MONITORING",     v: "AI detection · 24/7" },
    { Icon: Compass,     k: "GEOSEISMIC",     v: "Shock isolation lattice" },
    { Icon: Lock,        k: "INGRESS",        v: "Airtight blast door" },
  ];
  const [ref, on] = useReveal(0.18);

  return (
    <section
      id="capabilities"
      ref={ref}
      className="grain hair-b"
      style={{ background: "var(--ink)", padding: "140px 0", position: "relative" }}
    >
      {/* schematic backdrop */}
      <div
        className="schematic"
        style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}
      />
      <div className="mx-auto px-6 md:px-10 relative" style={{ maxWidth: 1320 }}>
        <div className="flex items-center gap-3 mb-6">
          <span style={{ width: 36, height: 1, background: "var(--gold)" }} />
          <Label color="var(--gold)">05 — CAPABILITIES</Label>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8 mb-16">
          <h3
            className="f-display"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", lineHeight: 0.95, color: "var(--bone)" }}
          >
            Specifications.<br />Made visible.
          </h3>
          <div className="f-mono t-bone-dim" style={{ fontSize: 12, lineHeight: 1.7, maxWidth: 320 }}>
            <div className="hair-t pt-4">
              CERT — ISO 9001 · CNAS<br />
              STANDARD — ASTM E668 · ISO 10055<br />
              ENVELOPE — Mil-grade alloy substrate
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "var(--line-2)" }}>
          {caps.map(({ Icon, k, v }, i) => (
            <div
              key={i}
              className={`bg-ink p-6 md:p-7 spec-row ${on ? "reveal-on" : ""}`}
              style={{ minHeight: 180, transitionDelay: `${i * 60}ms` }}
            >
              <Icon className="t-gold" size={20} strokeWidth={1.2} />
              <div className="mt-8">
                <div className="f-mono t-ash" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
                  {k}
                </div>
                <div className="f-display t-bone mt-2" style={{ fontSize: 16, lineHeight: 1.25 }}>
                  {v}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* dimensional table */}
        <div className="mt-24">
          <div className="flex items-center justify-between hair-b pb-4">
            <Label color="var(--gold)">DIMENSIONAL ENVELOPES</Label>
            <Label>SUB-GRADE / m</Label>
          </div>
          {[
            ["UNIT A · 20ft", "6.3 × 3.3 × 3.3", "20 – 28 m²"],
            ["UNIT B · 30ft", "9.3 × 3.3 × 3.3", "32 – 42 m²"],
            ["UNIT C · 50ft", "15.3 × 3.3 × 3.3", "55 – 72 m²"],
            ["CUSTOM / MAJLIS", "ON-SPEC", "80 m² +"],
          ].map(([a, b, c], i) => (
            <div
              key={i}
              className="hair-b spec-row grid grid-cols-3 items-center py-5 px-2"
              style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr" }}
            >
              <div className="f-display t-bone" style={{ fontSize: 17 }}>
                {a}
              </div>
              <div className="f-mono t-bone-dim" style={{ fontSize: 12 }}>
                {b}
              </div>
              <div className="f-mono t-gold text-right" style={{ fontSize: 12 }}>
                {c}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────── GCC POSITIONING ────── */
function Region() {
  return (
    <section
      className="grain hair-b"
      style={{
        position: "relative",
        background: "var(--carbon)",
        padding: "140px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMG.gcc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(50%) contrast(1.1) brightness(0.4)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.95) 100%)",
        }}
      />
      <div className="mx-auto px-6 md:px-10 relative" style={{ maxWidth: 1320 }}>
        <div className="flex items-center gap-3 mb-6">
          <span style={{ width: 36, height: 1, background: "var(--gold)" }} />
          <Label color="var(--gold)">06 — TERRITORY</Label>
        </div>

        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <h3
              className="f-display"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.6rem)", lineHeight: 0.95, color: "var(--bone)" }}
            >
              High concentration<br />
              of wealth.<br />
              <span className="t-gold">Zero luxury competition.</span>
            </h3>
            <p
              className="f-body t-bone-dim mt-8 max-w-lg"
              style={{ fontSize: 15, lineHeight: 1.65 }}
            >
              The Gulf represents the optimal launch envelope. Concentrated
              UHNW density. A culture of bespoke architecture. A region for
              which discretion is not preference but inheritance.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="hair-t pt-5">
              <Label color="var(--gold)">PRIMARY MARKETS</Label>
              <div className="mt-4">
                {[
                  ["UAE", "Dubai · Abu Dhabi"],
                  ["KSA", "Riyadh · NEOM corridor"],
                  ["QATAR", "Doha"],
                  ["KUWAIT", "Kuwait City"],
                ].map(([k, v], i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between hair-b py-4"
                  >
                    <div className="f-display t-bone" style={{ fontSize: 16 }}>
                      {k}
                    </div>
                    <div className="f-mono t-bone-dim" style={{ fontSize: 11 }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────── CTA ────── */
function CTA() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section
      id="contact"
      className="grain hair-b"
      style={{
        position: "relative",
        background: "var(--ink)",
        padding: "140px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-15%",
          top: "10%",
          width: "70%",
          height: "80%",
          backgroundImage: `url(${IMG.cta})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(60%) contrast(1.1) brightness(0.35)",
          opacity: 0.6,
          maskImage: "linear-gradient(270deg, rgba(0,0,0,1), rgba(0,0,0,0))",
          WebkitMaskImage: "linear-gradient(270deg, rgba(0,0,0,1), rgba(0,0,0,0))",
        }}
      />

      <div className="mx-auto px-6 md:px-10 relative" style={{ maxWidth: 1320 }}>
        <div className="flex items-center gap-3 mb-6">
          <span style={{ width: 36, height: 1, background: "var(--gold)" }} />
          <Label color="var(--gold)">07 — CONTACT</Label>
        </div>
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <h3
              className="f-display"
              style={{ fontSize: "clamp(2.6rem, 7vw, 6.4rem)", lineHeight: 0.92, color: "var(--bone)" }}
            >
              Request a<br />
              <span className="t-gold">private briefing.</span>
            </h3>
            <p
              className="f-body t-bone-dim mt-8 max-w-lg"
              style={{ fontSize: 15, lineHeight: 1.65 }}
            >
              Engagement begins with a confidential consultation — typically on-site,
              always under non-disclosure. Project intake is limited.
            </p>

            <div className="mt-12 hair-t pt-6 grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label>OPERATIONS</Label>
                <div className="f-display t-bone mt-2" style={{ fontSize: 15 }}>
                  Dubai · Riyadh
                </div>
              </div>
              <div>
                <Label>CIPHERED CHANNEL</Label>
                <div className="f-display t-bone mt-2" style={{ fontSize: 15 }}>
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
                padding: 28,
                position: "relative",
              }}
            >
              <div className="bracket tl" />
              <div className="bracket tr" />
              <div className="bracket bl" />
              <div className="bracket br" />

              {!submitted ? (
                <>
                  <Label color="var(--gold)">INTAKE — FORM 001</Label>
                  <div className="mt-6 space-y-4">
                    {[
                      ["NAME", "Full name"],
                      ["ENTITY", "Organisation / individual"],
                      ["TERRITORY", "City · Country"],
                      ["CHANNEL", "Email · Encrypted preferred"],
                    ].map(([k, p], i) => (
                      <div key={i} className="hair-b pb-3">
                        <div className="f-mono t-ash mb-2" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                          {String(i + 1).padStart(2, "0")} — {k}
                        </div>
                        <input
                          type="text"
                          placeholder={p}
                          className="f-body t-bone w-full"
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            fontSize: 14,
                            padding: "4px 0",
                          }}
                        />
                      </div>
                    ))}
                    <div>
                      <div className="f-mono t-ash mb-2" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                        05 — TIER OF INTEREST
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {["I", "II", "III"].map((t) => (
                          <button
                            key={t}
                            className="f-mono"
                            style={{
                              padding: "8px 14px",
                              fontSize: 11,
                              letterSpacing: "0.15em",
                              border: "1px solid var(--line-2)",
                              color: "var(--bone-dim)",
                              background: "transparent",
                              cursor: "pointer",
                              transition: "all 250ms ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "var(--gold)";
                              e.currentTarget.style.color = "var(--gold)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "var(--line-2)";
                              e.currentTarget.style.color = "var(--bone-dim)";
                            }}
                          >
                            TIER {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-prime mt-8 w-full justify-between"
                    onClick={() => setSubmitted(true)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="dot" />
                      Request Private Briefing
                    </span>
                    <ArrowRight size={14} />
                  </button>
                  <div className="mt-4 flex items-center gap-2">
                    <Lock size={10} className="t-ash" />
                    <Label>TRANSMISSION IS ENCRYPTED</Label>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div
                    style={{
                      width: 50,
                      height: 50,
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
                    className="f-display t-bone mt-6"
                    style={{ fontSize: 22, lineHeight: 1.2 }}
                  >
                    Request received.
                  </h4>
                  <p className="f-body t-bone-dim mt-3" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                    A member of the MINUS 1 intake desk will reach you within 72 hours
                    on the channel provided. Reference number is held internally.
                  </p>
                  <button
                    className="btn-prime mt-8"
                    onClick={() => setSubmitted(false)}
                    style={{ padding: "12px 18px" }}
                  >
                    <span className="dot" />
                    New Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────── FOOTER ────── */
function Footer() {
  return (
    <footer className="grain" style={{ background: "var(--carbon)", padding: "60px 0 40px" }}>
      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 1320 }}>
        <div className="flex flex-wrap items-center justify-between gap-8 hair-b pb-8">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 28,
                height: 28,
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MinusIcon size={14} strokeWidth={2.2} />
            </div>
            <div className="f-display" style={{ fontSize: 14, letterSpacing: "0.12em" }}>
              MINUS 1
            </div>
            <Label>BUNKERS</Label>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <Label color="var(--bone-dim)">PRIVACY</Label>
            <Label color="var(--bone-dim)">TERMS</Label>
            <Label color="var(--bone-dim)">PRESS</Label>
            <Label color="var(--bone-dim)">CAREERS</Label>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--gold)" }} />
            <Label color="var(--gold)">CHANNEL — ACTIVE</Label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div>
            <Label>HEADQUARTERS</Label>
            <p className="f-body t-bone-dim mt-3" style={{ fontSize: 13, lineHeight: 1.6 }}>
              By appointment only. Address disclosed in NDA phase.
            </p>
          </div>
          <div>
            <Label>STANDARDS</Label>
            <p className="f-body t-bone-dim mt-3" style={{ fontSize: 13, lineHeight: 1.6 }}>
              ISO 9001 · CNAS · ASTM E668 · ISO 10055 · Mil-grade substrate.
            </p>
          </div>
          <div>
            <Label>PHILOSOPHY</Label>
            <p className="f-body t-bone-dim mt-3" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Not a shelter. A new layer of living.
            </p>
          </div>
        </div>

        <div className="mt-12 hair-t pt-6 flex flex-wrap items-center justify-between gap-4">
          <Label color="var(--ash)">© MINUS 1 — ALL CLEARANCES RESERVED</Label>
          <Label color="var(--ash)">Ω.001 — CONFIDENTIAL</Label>
        </div>
      </div>
    </footer>
  );
}

/* ────── ROOT ────── */
export default function Minus1() {
  const [scrollY, setScrollY] = useState(0);
  const [depth, setDepth] = useState(0);

  // global scroll handler (cheap)
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
    <div className="f-body" style={{ background: "var(--ink)", color: "var(--bone)" }}>
      <style>{CSS}</style>

      <Nav scrollY={scrollY} />
      <DepthIndicator depth={depth} />

      <Hero />
      <Thesis />
      <Descent />
      <Proof />
      <Tiers />
      <Capabilities />
      <Region />
      <CTA />
      <Footer />
    </div>
  );
}
