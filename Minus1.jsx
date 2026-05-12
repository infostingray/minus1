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
  Hexagon,
  Globe,
  Send,
  Sparkles,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   MINUS 1 — A NEW LAYER OF LIVING
   Cinematic single-page experience.
   Cyber-brutalist luxury · Subterranean Infrastructure · GCC positioning.
   ════════════════════════════════════════════════════════════════════ */

/* ─────────────────── CINEMATIC IMAGERY ───────────────────
   Brand images extracted directly from MINUS-1-BUNKERS.pdf
   (served from /public/brand/). The corridor render was too
   sci-fi — removed in favour of architectural construction shots
   that show what MINUS 1 actually designs and delivers. */
const IMG = {
  // PRIMARY HERO — glass-walled bunker being built in excavated mountain
  hero: "/brand/concept.jpg",

  // BUNKERS / ARCHITECTURE SHOWCASE
  bunkersHero: "/brand/cave-vault.jpg",      // atmospheric vault-door entry into rock
  bunkersAlt: "/brand/cross-section.jpg",    // architectural cross-section as backdrop
  bunkersMain: "/brand/concept.jpg",         // the build scene — design + construction
  bunkersInterior: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85",
  bunkersConcrete: "https://images.unsplash.com/photo-1545158539-1709a01b9d2c?auto=format&fit=crop&w=2000&q=85",

  // EDITORIAL
  thesisImage: "/brand/cave-vault.jpg",      // cave-vault threshold for "a new layer"
  statsImage: "/brand/world-map.jpg",        // glowing world map — global demand
  capabilitiesHero: "/brand/cross-section.jpg", // engineering cross-section
  capabilitiesAccent: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85",
  gcc: "/brand/dubai.jpg",                   // Dubai skyline — GCC focus
  ctaBg: "https://images.unsplash.com/photo-1574691250077-03a929faece5?auto=format&fit=crop&w=2400&q=85",

  // TIERS — Unsplash luxury interiors
  tier1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
  tier2: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=85",
  tier3: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",

  // PROCESS — mix of brand + Unsplash for phase variety
  proc1: "/brand/concept.jpg",
  proc2: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=1200&q=80",
  proc3: "/brand/cross-section.jpg",
  proc4: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  proc5: "https://images.unsplash.com/photo-1493244040629-496f6d136e80?auto=format&fit=crop&w=1200&q=80",

  preloader: "/brand/cross-section.jpg",     // architectural backdrop (no more spaceship)
};

/* ─────────────────── GLOBAL CSS ─────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

:root {
  --ink: #050505; --carbon: #0a0a0a; --slate: #111111; --steel: #1a1a1a; --concrete: #2a2a2a;
  --line: rgba(237, 232, 223, 0.08); --line-2: rgba(237, 232, 223, 0.14); --line-3: rgba(237, 232, 223, 0.22);
  --bone: #ede8df; --bone-dim: #c8c3ba; --ash: #6e6a64;
  --gold: #c89c4a; --gold-bright: #e2bd6f; --gold-deep: #8a6a2e;
  --signal: #ff4a16;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
html, body { background: var(--ink); color: var(--bone); margin: 0; }
::selection { background: var(--gold); color: var(--ink); }

.f-display { font-family: 'Syne', sans-serif; letter-spacing: -0.045em; font-weight: 700; }
.f-body    { font-family: 'Manrope', sans-serif; font-weight: 300; }
.f-mono    { font-family: 'JetBrains Mono', monospace; font-weight: 400; letter-spacing: 0.02em; }

.bg-ink { background-color: var(--ink); } .bg-carbon { background-color: var(--carbon); }
.bg-slate-x { background-color: var(--slate); } .bg-steel { background-color: var(--steel); }
.t-bone { color: var(--bone); } .t-bone-dim { color: var(--bone-dim); }
.t-ash { color: var(--ash); } .t-gold { color: var(--gold); } .t-gold-b { color: var(--gold-bright); }

.hair-t { border-top: 1px solid var(--line); } .hair-b { border-bottom: 1px solid var(--line); }
.hair-l { border-left: 1px solid var(--line); } .hair-r { border-right: 1px solid var(--line); }
.hair-y { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }

.grain { position: relative; }
.grain::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 5;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='3' seed='7'/><feColorMatrix values='0 0 0 0 0.93  0 0 0 0 0.91  0 0 0 0 0.87  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>");
  opacity: 0.07; mix-blend-mode: overlay;
  animation: grain-shift 8s steps(6) infinite;
}
@keyframes grain-shift {
  0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,1%)} 40%{transform:translate(2%,-1%)}
  60%{transform:translate(-1%,2%)} 80%{transform:translate(1%,-2%)}
}

.vignette::before {
  content: ""; position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 95%);
}

.bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  background-color: var(--steel);
  transition: transform 1600ms cubic-bezier(.7,0,.2,1), filter 1400ms ease;
}
.bg-img.dark { filter: grayscale(20%) contrast(1.1) brightness(0.45); }
.bg-img.warm { filter: grayscale(15%) contrast(1.05) brightness(0.6) sepia(0.15); }

.hero-split {
  display: grid; grid-template-columns: 1fr 1fr;
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

/* SCROLL CUE — hides on scroll */
.scroll-cue {
  position: absolute; left: 0; right: 0; bottom: 32px;
  display: flex; justify-content: center; z-index: 8;
  opacity: 1; transform: translateY(0);
  transition: opacity 500ms ease, transform 500ms ease;
  pointer-events: none;
}
.scroll-cue.hidden { opacity: 0; transform: translateY(20px); }

/* PRELOADER */
.preloader { position: fixed; inset: 0; z-index: 1000; background: var(--ink); display: flex; align-items: center; justify-content: center; flex-direction: column; }
.preloader-bg { position: absolute; inset: 0; opacity: 0.18; background-size: cover; background-position: center; filter: grayscale(80%) contrast(1.2) brightness(0.4); }
.preloader-bars { position: fixed; inset: 0; z-index: 1001; pointer-events: none; display: flex; flex-direction: column; }
.preloader-bar { background: var(--ink); flex: 1; transition: transform 1100ms cubic-bezier(.85,0,.2,1); }
.preloader-bar.top.out { transform: translateY(-100%); }
.preloader-bar.bottom.out { transform: translateY(100%); }
@keyframes draw-logo { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
.logo-draw path, .logo-draw rect, .logo-draw line, .logo-draw circle {
  stroke-dasharray: 200; stroke-dashoffset: 200;
  animation: draw-logo 2.6s cubic-bezier(.7,0,.2,1) forwards;
}
.logo-draw .delay-1 { animation-delay: 0.5s; }
.logo-draw .delay-2 { animation-delay: 1s; }
.logo-draw .delay-3 { animation-delay: 1.5s; }

@keyframes pulse-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
.pulse-glow { animation: pulse-glow 1.6s ease-in-out infinite; }

@keyframes scan-line {
  0% { transform: translateY(-50px); opacity: 0; }
  10%, 90% { opacity: 1; }
  100% { transform: translateY(150px); opacity: 0; }
}
.scan-line {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  animation: scan-line 2.4s linear infinite;
}

.depth-bar { position: fixed; right: 28px; top: 50%; transform: translateY(-50%); z-index: 60; display: flex; flex-direction: column; align-items: center; gap: 14px; pointer-events: none; }
.depth-track { width: 1px; height: 240px; background: var(--line-2); position: relative; }
.depth-fill { position: absolute; left: -1px; top: 0; width: 3px; background: var(--gold); box-shadow: 0 0 18px rgba(200,156,74,0.7); transition: height 120ms linear; }
.depth-marker { position: absolute; left: -3px; width: 7px; height: 1px; background: var(--ash); }
@media (max-width: 900px) { .depth-bar { display: none; } }

/* MARQUEE — refined */
.marquee {
  overflow: hidden; white-space: nowrap;
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
  padding: 18px 0; background: var(--carbon);
}
.marquee-track {
  display: inline-flex; align-items: center; gap: 48px;
  animation: marquee 50s linear infinite;
}
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.marquee-row { display: inline-flex; align-items: center; gap: 48px; }
.marquee-word {
  font-family: 'Syne', sans-serif; font-weight: 600;
  font-size: clamp(1.5rem, 3.6vw, 2.6rem);
  letter-spacing: -0.02em; color: var(--bone);
}
.marquee-word.accent { color: var(--gold); font-style: italic; font-weight: 700; }
.marquee-divider { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; flex-shrink: 0; }
.marquee-rule { width: 64px; height: 1px; background: var(--line-3); flex-shrink: 0; }

.u-link { position: relative; display: inline-flex; align-items: center; gap: 0.5rem; padding-bottom: 4px; transition: color 200ms ease; }
.u-link::after { content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%; background: currentColor; transform-origin: right; transform: scaleX(1); transition: transform 500ms cubic-bezier(.7,0,.2,1); }
.u-link:hover::after { transform-origin: left; transform: scaleX(0); }

.btn-prime { display: inline-flex; align-items: center; gap: 14px; padding: 18px 24px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: var(--bone); background: transparent; border: 1px solid var(--line-3); text-transform: uppercase; transition: color 350ms ease, border-color 350ms ease; position: relative; overflow: hidden; cursor: pointer; }
.btn-prime::before { content: ""; position: absolute; inset: 0; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 600ms cubic-bezier(.7,0,.2,1); z-index: -1; }
.btn-prime:hover { color: var(--ink); border-color: var(--gold); }
.btn-prime:hover::before { transform: scaleX(1); }
.btn-prime .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); transition: background 350ms ease; }
.btn-prime:hover .dot { background: var(--ink); }

/* AI ASSISTANT TRIGGER */
.btn-ai {
  display: inline-flex; align-items: center; gap: 12px; padding: 14px 18px;
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.18em;
  color: var(--gold); background: rgba(200,156,74,0.05);
  border: 1px solid rgba(200,156,74,0.35);
  text-transform: uppercase; cursor: pointer;
  transition: background 250ms ease, border-color 250ms ease;
}
.btn-ai:hover { background: rgba(200,156,74,0.12); border-color: var(--gold); }
.btn-ai .spark { width: 14px; height: 14px; flex-shrink: 0; }

.nav-link { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--bone-dim); transition: color 250ms ease; position: relative; padding: 4px 0; }
.nav-link:hover { color: var(--bone); }
.nav-link::after { content: ""; position: absolute; bottom: -2px; left: 0; height: 1px; width: 0; background: var(--gold); transition: width 350ms ease; }
.nav-link:hover::after { width: 100%; }

.bracket { position: absolute; width: 14px; height: 14px; border-color: var(--gold); }
.bracket.tl { top: 14px; left: 14px; border-top: 1px solid; border-left: 1px solid; }
.bracket.tr { top: 14px; right: 14px; border-top: 1px solid; border-right: 1px solid; }
.bracket.bl { bottom: 14px; left: 14px; border-bottom: 1px solid; border-left: 1px solid; }
.bracket.br { bottom: 14px; right: 14px; border-bottom: 1px solid; border-right: 1px solid; }

.tier { position: relative; overflow: hidden; transition: transform 700ms cubic-bezier(.7,0,.2,1), background-color 500ms ease; transform-style: preserve-3d; }
.tier .tier-img { transition: transform 1200ms cubic-bezier(.7,0,.2,1), filter 800ms ease; filter: grayscale(40%) contrast(1.05) brightness(0.55); }
.tier:hover .tier-img { transform: scale(1.1); filter: grayscale(0%) contrast(1.1) brightness(0.7); }
.tier:hover { background-color: var(--carbon); }
.tier .tier-arrow { transition: transform 600ms cubic-bezier(.7,0,.2,1), color 400ms ease; }
.tier:hover .tier-arrow { transform: translate(8px, -8px); color: var(--gold-bright); }
.tier .tier-num { transition: color 500ms ease; }
.tier:hover .tier-num { color: var(--gold); }

.proc-img-wrap { position: relative; overflow: hidden; height: 160px; background: var(--steel); margin-bottom: 32px; }
.proc-img { position: absolute; inset: 0; background-size: cover; background-position: center; filter: grayscale(40%) contrast(1.05) brightness(0.55); transition: transform 1200ms cubic-bezier(.7,0,.2,1), filter 800ms ease; }
.process-card:hover .proc-img { transform: scale(1.08); filter: grayscale(0%) brightness(0.7); }

.schematic {
  background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 32px 32px;
}

@keyframes breathe { 0%,100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(8px); opacity: 1; } }
.breathe { animation: breathe 2.4s ease-in-out infinite; }

@keyframes drift { 0% { transform: translate3d(0,0,0) scale(1.05); } 50% { transform: translate3d(-2%, -1%, 0) scale(1.1); } 100% { transform: translate3d(0,0,0) scale(1.05); } }
.drift { animation: drift 24s ease-in-out infinite; }

.reveal-wrap { overflow: hidden; display: inline-block; }
.reveal-inner { display: inline-block; transform: translateY(110%); }
.reveal-on .reveal-inner { transform: translateY(0); transition: transform 1100ms cubic-bezier(.7,0,.2,1); }

.process-track { display: flex; gap: 0; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.process-track::-webkit-scrollbar { display: none; }
.process-card { scroll-snap-align: start; flex: 0 0 calc(100% - 24px); border-right: 1px solid var(--line); }
@media (min-width: 700px) { .process-card { flex: 0 0 50%; } }
@media (min-width: 1100px) { .process-card { flex: 0 0 33%; } }

.spec-row { transition: background-color 300ms ease; }
.spec-row:hover { background-color: rgba(255,255,255,0.02); }
.big-num { font-feature-settings: "tnum"; }
.glow-gold { box-shadow: 0 0 60px 0 rgba(200,156,74,0.15), inset 0 0 0 1px var(--line-2); }

@media (max-width: 700px) {
  .clamp-display { font-size: clamp(2.4rem, 12vw, 5rem) !important; line-height: 0.95 !important; }
  .clamp-mega { font-size: clamp(3rem, 18vw, 8rem) !important; line-height: 0.9 !important; }
}
section { isolation: isolate; }

/* AI ASSISTANT PANEL */
.ai-panel {
  position: fixed; z-index: 90;
  background: var(--ink); border: 1px solid var(--line-3);
  display: flex; flex-direction: column;
  box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(200,156,74,0.06);
}
@media (min-width: 900px) {
  .ai-panel { right: 28px; bottom: 28px; width: 440px; max-height: 78vh; height: 640px; }
}
@media (max-width: 899px) {
  .ai-panel { inset: 0; height: 100vh; max-height: 100vh; }
}
.ai-head { padding: 18px 20px; border-bottom: 1px solid var(--line-2); background: var(--carbon); display: flex; align-items: center; justify-content: space-between; }
.ai-omega { width: 32px; height: 32px; background: var(--ink); border: 1px solid var(--gold); color: var(--gold); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }
.ai-body { flex: 1; overflow-y: auto; padding: 22px 20px; background: var(--ink); scrollbar-width: thin; scrollbar-color: var(--line-3) transparent; }
.ai-body::-webkit-scrollbar { width: 4px; }
.ai-body::-webkit-scrollbar-thumb { background: var(--line-3); }
.ai-msg { display: flex; gap: 10px; margin-bottom: 18px; max-width: 92%; }
.ai-msg.user { flex-direction: row-reverse; margin-left: auto; }
.ai-avatar { width: 28px; height: 28px; flex-shrink: 0; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; border: 1px solid var(--gold); color: var(--gold); background: var(--carbon); }
.ai-msg.user .ai-avatar { border-color: var(--line-2); color: var(--bone-dim); }
.ai-bubble { padding: 12px 14px; background: var(--carbon); border: 1px solid var(--line-2); color: var(--bone); font-family: 'Manrope', sans-serif; font-size: 13.5px; line-height: 1.55; font-weight: 300; }
.ai-msg.user .ai-bubble { background: rgba(200,156,74,0.07); border-color: rgba(200,156,74,0.32); color: var(--bone); }
.ai-typing { display: inline-flex; gap: 5px; padding: 14px; }
.ai-typing span { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); animation: type-bounce 1.2s ease-in-out infinite; }
.ai-typing span:nth-child(2) { animation-delay: 0.2s; }
.ai-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes type-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }
.ai-suggested { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; margin-left: 38px; }
.ai-chip { padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.12em; color: var(--bone-dim); background: transparent; border: 1px solid var(--line-2); cursor: pointer; text-transform: uppercase; transition: all 220ms ease; }
.ai-chip:hover { color: var(--gold); border-color: var(--gold); background: rgba(200,156,74,0.04); }
.ai-foot { border-top: 1px solid var(--line-2); padding: 12px 14px; display: flex; gap: 10px; align-items: center; background: var(--carbon); }
.ai-input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Manrope', sans-serif; font-size: 14px; color: var(--bone); padding: 8px 4px; }
.ai-input::placeholder { color: var(--ash); }
.ai-send { background: transparent; border: 1px solid var(--gold); color: var(--gold); width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 220ms ease; }
.ai-send:hover { background: var(--gold); color: var(--ink); }
.ai-send:disabled { border-color: var(--line-2); color: var(--ash); cursor: not-allowed; background: transparent; }

/* ─────────────────── MOBILE OPTIMIZATIONS ─────────────────── */
@media (max-width: 768px) {
  /* SECTION PADDING — compress vertical rhythm */
  section { padding-top: 72px !important; padding-bottom: 72px !important; }
  #bunkers > .mx-auto {
    padding-top: 96px !important; padding-bottom: 96px !important;
    padding-left: 22px !important; padding-right: 22px !important;
  }

  /* HERO — single full-bleed; tighten padding + stack CTAs full-width */
  #top { padding: 0 !important; }
  #top > .flex.flex-col {
    padding: 92px 24px 80px !important;
  }
  #top .btn-prime {
    width: 100%;
    justify-content: space-between !important;
  }

  /* === H-SWIPE: horizontal scroll for selected grids === */
  .h-swipe {
    display: flex !important;
    grid-template-columns: none !important;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 1px !important;
    background: var(--line-2);
    padding: 0 !important;
    margin-left: -22px;
    margin-right: -22px;
    padding-left: 22px !important;
    padding-right: 22px !important;
  }
  .h-swipe::-webkit-scrollbar { display: none; }
  .h-swipe > * {
    flex: 0 0 84% !important;
    scroll-snap-align: start;
    min-width: 0;
  }
  .h-swipe > .spec-row {
    flex: 0 0 64% !important;
    scroll-snap-align: start;
  }

  /* === IMAGE HEIGHT REDUCTIONS === */
  [style*="height: 540"] { height: 280px !important; }
  [style*="height: 480"] { height: 260px !important; }
  [style*="height: 460"] { height: auto !important; min-height: 260px !important; }
  [style*="height: 380"] { height: 220px !important; }
  [style*="height: 240"] { height: 180px !important; }
  [style*="min-height: 460"] { min-height: 260px !important; }
  [style*="min-height: 600"] { min-height: auto !important; }
  [style*="min-height: 540"] { min-height: auto !important; }
  [style*="min-height: 230"] { min-height: 160px !important; }

  /* PROCESS — tighten cards */
  .process-card { padding: 32px 22px !important; min-height: auto !important; }
  .process-card .proc-img-wrap { height: 130px !important; margin-bottom: 22px !important; }

  /* TIER cards inside h-swipe */
  .tier { padding: 26px 22px !important; }

  /* GAP & MARGIN COMPRESSIONS */
  [style*="gap: 48px"] { gap: 24px !important; }
  [style*="gap: 40px"] { gap: 22px !important; }
  [style*="margin-top: 96"] { margin-top: 48px !important; }
  [style*="margin-top: 80"] { margin-top: 40px !important; }
  [style*="margin-top: 64"] { margin-top: 32px !important; }
  [style*="margin-bottom: 80"] { margin-bottom: 40px !important; }
  [style*="margin-bottom: 64"] { margin-bottom: 32px !important; }

  /* MARQUEE — tighter on phones */
  .marquee-word { font-size: clamp(1.2rem, 5vw, 1.8rem) !important; }
  .marquee-rule { width: 36px !important; }
  .marquee-track { gap: 32px !important; }
  .marquee-row { gap: 32px !important; }
}
`;

/* ═══════════════════ HOOKS ═══════════════════ */

function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on];
}

/* ═══════════════════ PRELOADER ═══════════════════ */

function Preloader({ done }) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("INITIALIZING TERMINAL");
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 5500;
    let raf;
    const phases = [
      [0, 10, "INITIALIZING TERMINAL"],
      [10, 22, "VERIFYING CLEARANCE"],
      [22, 36, "LOCATING HORIZON"],
      [36, 50, "CALIBRATING DEPTH GRADIENT"],
      [50, 64, "MAPPING SUB-GRADE"],
      [64, 78, "ESTABLISHING SECURE CHANNEL"],
      [78, 92, "LOADING ARCHIVE"],
      [92, 100, "READY"],
    ];
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 2.4);
      const v = Math.round(eased * 100);
      setCount(v);
      const phase = phases.find(([a, b]) => v >= a && v < b) || phases[phases.length - 1];
      setStatus(phase[2]);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => setOpening(true), 500);
        setTimeout(() => done(), 1750);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  return (
    <>
      <div className="preloader">
        <div className="preloader-bg" style={{ backgroundImage: `url(${IMG.preloader}), linear-gradient(180deg, #0a0a0a, #050505)` }} />
        <div className="grain" style={{ position: "absolute", inset: 0 }} />
        <div className="bracket tl" style={{ borderColor: "var(--gold)" }} />
        <div className="bracket tr" style={{ borderColor: "var(--gold)" }} />
        <div className="bracket bl" style={{ borderColor: "var(--gold)" }} />
        <div className="bracket br" style={{ borderColor: "var(--gold)" }} />

        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 100, transform: "translateY(-50%)", overflow: "hidden", pointerEvents: "none" }}>
          <div className="scan-line" />
        </div>

        <div style={{ position: "absolute", top: 32, left: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--gold)" }} className="pulse-glow" />
          <span className="f-mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--bone-dim)" }}>MINUS 1 · INTAKE TERMINAL</span>
        </div>

        <div style={{ position: "absolute", top: 32, right: 32, textAlign: "right" }}>
          <div className="f-mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ash)" }}>SESSION</div>
          <div className="f-mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--gold)", marginTop: 4 }}>
            Ω.{(performance.now() | 0).toString(16).slice(-6).toUpperCase()}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <svg className="logo-draw" width="100" height="100" viewBox="0 0 100 100" fill="none">
            <rect x="2" y="2" width="96" height="96" stroke="var(--gold)" strokeWidth="1.2" />
            <line x1="24" y1="50" x2="76" y2="50" stroke="var(--gold)" strokeWidth="1.8" className="delay-1" />
            <line x1="50" y1="76" x2="50" y2="92" stroke="var(--bone)" strokeWidth="1" className="delay-2" />
            <circle cx="50" cy="50" r="34" stroke="var(--line-2)" strokeWidth="1" fill="none" className="delay-3" />
          </svg>
          <div className="f-display" style={{ fontSize: 26, letterSpacing: "0.18em", color: "var(--bone)" }}>MINUS 1</div>
          <div className="f-mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--ash)", marginTop: -14 }}>SUBTERRANEAN INFRASTRUCTURE</div>
          <div className="f-body" style={{ fontSize: 12, color: "var(--bone-dim)", maxWidth: 280, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
            Preparing the experience. Please remain on this terminal.
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="f-mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ash)", marginBottom: 6 }}>STATUS</div>
            <div className="f-mono" style={{ fontSize: 13, letterSpacing: "0.18em", color: "var(--gold)" }}>
              {status} <span className="pulse-glow">_</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="f-mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ash)", marginBottom: 6 }}>LOAD</div>
            <div className="f-display big-num" style={{ fontSize: 60, lineHeight: 0.9, color: "var(--bone)" }}>
              {String(count).padStart(3, "0")}<span style={{ color: "var(--gold)", fontSize: 24 }}>%</span>
            </div>
          </div>
          <div style={{ width: "100%", height: 1, background: "var(--line-2)", position: "relative", order: 10, marginTop: 18 }}>
            <div style={{ position: "absolute", top: -1, left: 0, height: 3, width: `${count}%`, background: "var(--gold)", boxShadow: "0 0 16px rgba(200,156,74,0.7)", transition: "width 80ms linear" }} />
          </div>
        </div>
      </div>
      <div className="preloader-bars" style={{ pointerEvents: opening ? "none" : "auto" }}>
        <div className={`preloader-bar top ${opening ? "out" : ""}`} />
        <div className={`preloader-bar bottom ${opening ? "out" : ""}`} />
      </div>
    </>
  );
}

/* ═══════════════════ MAGNETIC / TILT / SCRAMBLE / LABEL ═══════════════════ */

function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move = (e) => { const r = el.getBoundingClientRect(); const x = e.clientX - (r.left + r.width / 2); const y = e.clientY - (r.top + r.height / 2); el.style.transform = `translate(${x * strength}px, ${y * strength}px)`; };
    const leave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("mousemove", move); el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);
  return <div ref={ref} style={{ display: "inline-block", transition: "transform 400ms cubic-bezier(.7,0,.2,1)" }}>{children}</div>;
}

function Tilt({ children, max = 8 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move = (e) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`; };
    const leave = () => { el.style.transform = "perspective(900px) rotateY(0) rotateX(0)"; };
    el.addEventListener("mousemove", move); el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [max]);
  return <div ref={ref} style={{ transition: "transform 500ms cubic-bezier(.7,0,.2,1)", transformStyle: "preserve-3d" }}>{children}</div>;
}

function Scramble({ text, className = "", style = {} }) {
  const [out, setOut] = useState(text);
  const chars = "01ABCDEFXYZ◆◇░▒▓█";
  const run = useCallback(() => {
    let frame = 0; const total = 18;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / total;
      let nxt = "";
      for (let i = 0; i < text.length; i++) {
        if (i / text.length < progress) nxt += text[i];
        else nxt += chars[Math.floor(Math.random() * chars.length)];
      }
      setOut(nxt);
      if (frame >= total) { clearInterval(interval); setOut(text); }
    }, 30);
  }, [text]);
  return <span className={className} style={style} onMouseEnter={run}>{out}</span>;
}

const Label = ({ children, color = "var(--ash)" }) => (
  <span className="f-mono" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color }}>{children}</span>
);

/* ═══════════════════ NAV ═══════════════════ */

function Nav({ scrollY }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="grain" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, background: scrollY > 60 ? "rgba(5,5,5,0.78)" : "linear-gradient(180deg, rgba(0,0,0,0.5), transparent)", backdropFilter: scrollY > 60 ? "blur(14px)" : "none", WebkitBackdropFilter: scrollY > 60 ? "blur(14px)" : "none", borderBottom: scrollY > 60 ? "1px solid var(--line)" : "1px solid transparent", transition: "all 400ms ease" }}>
      <div className="flex items-center justify-between" style={{ padding: "20px 28px" }}>
        <a href="#top" className="flex items-center gap-3" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="flex items-center justify-center" style={{ width: 30, height: 30, border: "1px solid var(--gold)", color: "var(--gold)" }}>
            <MinusIcon size={14} strokeWidth={2.2} />
          </div>
          <div className="f-display" style={{ fontSize: 14, letterSpacing: "0.12em" }}>MINUS 1</div>
          <span style={{ width: 1, height: 14, background: "var(--line-2)" }} />
          <Label>SUBTERRANEAN INFRASTRUCTURE</Label>
        </a>
        <nav className="hidden md:flex items-center" style={{ gap: 30 }}>
          {[["bunkers", "01 — Bunkers"], ["tiers", "02 — Tiers"], ["process", "03 — Process"], ["capabilities", "04 — Specs"], ["contact", "05 — Contact"]].map(([h, t]) => (
            <a key={h} href={`#${h}`} className="nav-link" style={{ textDecoration: "none" }}>{t}</a>
          ))}
        </nav>
        <div className="flex items-center" style={{ gap: 14 }}>
          <div className="hidden md:flex items-center" style={{ gap: 8, color: "var(--ash)" }}>
            <Lock size={12} /><Label>CONFIDENTIAL</Label>
          </div>
          <Magnetic strength={0.2}>
            <a href="#contact" className="btn-prime" style={{ padding: "12px 18px", textDecoration: "none" }}>
              <span className="dot" /><span>Brief</span>
            </a>
          </Magnetic>
          <button className="md:hidden flex items-center justify-center" style={{ width: 36, height: 36, border: "1px solid var(--line-2)", background: "transparent", cursor: "pointer" }} onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={16} color="var(--bone)" /> : <Plus size={16} color="var(--bone)" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }} className="md:hidden hair-t" style={{ overflow: "hidden", background: "var(--ink)" }}>
            <div className="flex flex-col py-4 px-7">
              {[["bunkers", "01 — Bunkers"], ["tiers", "02 — Tiers"], ["process", "03 — Process"], ["capabilities", "04 — Specs"], ["contact", "05 — Contact"]].map(([h, t], i) => (
                <a key={i} href={`#${h}`} className="nav-link py-4 hair-b" onClick={() => setOpen(false)} style={{ textDecoration: "none" }}>{t}</a>
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
      <div className="f-mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--ash)" }}>DEPTH</div>
      <div className="depth-track">
        <div className="depth-fill" style={{ height: `${depth * 100}%` }} />
        {[25, 50, 75].map((p) => (<div key={p} className="depth-marker" style={{ top: `${p}%` }} />))}
      </div>
      <div className="f-mono big-num" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--gold)", minWidth: 56, textAlign: "center" }}>
        −{String(meters).padStart(3, "0")}m
      </div>
    </div>
  );
}

/* ═══════════════════ HERO — single full-bleed bunker brand statement ═══════════════════ */

function Hero({ scrollY }) {
  const cueHidden = scrollY > 80;

  return (
    <section id="top" style={{ height: "100vh", position: "relative", overflow: "hidden" }} className="grain vignette">
      {/* full-bleed brand image */}
      <div
        className="bg-img drift"
        style={{
          backgroundImage: `url(${IMG.hero}), linear-gradient(180deg, #1a1a1a, #050505)`,
          filter: "grayscale(15%) contrast(1.08) brightness(0.5)",
        }}
      />

      {/* dark gradient for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,5,0.75) 0%, rgba(5,5,5,0.25) 35%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.92) 100%)",
          zIndex: 2,
        }}
      />

      {/* content */}
      <div
        style={{
          position: "relative",
          zIndex: 6,
          height: "100%",
          padding: "120px 32px 96px",
        }}
        className="flex flex-col"
      >
        {/* top meta row */}
        <div className="flex justify-between items-start flex-wrap" style={{ gap: 16 }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <span
              style={{ width: 8, height: 8, borderRadius: 999, background: "var(--gold)" }}
              className="pulse-glow"
            />
            <Label color="var(--gold)">Subterranean Infrastructure · Est. 2025</Label>
          </div>
          <Label color="var(--bone-dim)">Sub-grade · −47m</Label>
        </div>

        {/* main bottom-aligned content */}
        <div className="flex-1 flex flex-col justify-end" style={{ maxWidth: 920 }}>
          {/* MINUS 1 headline */}
          <div className="reveal-on">
            <div className="reveal-wrap">
              <div
                className="reveal-inner f-display clamp-display"
                style={{
                  fontSize: "clamp(4rem, 13vw, 11rem)",
                  lineHeight: 0.86,
                  color: "var(--bone)",
                  letterSpacing: "-0.05em",
                }}
              >
                MINUS&nbsp;1
              </div>
            </div>
          </div>

          {/* tagline */}
          <div className="reveal-on" style={{ marginTop: 16 }}>
            <div className="reveal-wrap" style={{ display: "block" }}>
              <div
                className="reveal-inner f-display"
                style={{
                  fontSize: "clamp(1.4rem, 3.4vw, 2.6rem)",
                  lineHeight: 1.1,
                  color: "var(--gold)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  transitionDelay: "120ms",
                }}
              >
                A new layer of living.
              </div>
            </div>
          </div>

          {/* description */}
          <div className="reveal-on" style={{ marginTop: 28, maxWidth: 580 }}>
            <div className="reveal-wrap" style={{ display: "block" }}>
              <div
                className="reveal-inner f-body"
                style={{
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: "var(--bone-dim)",
                  transitionDelay: "220ms",
                }}
              >
                Private bunker estates engineered beneath the recognisable world.
                Designed, integrated and delivered — by appointment, under NDA.
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div
            className="reveal-on flex flex-wrap"
            style={{ marginTop: 40, gap: 12, transitionDelay: "320ms" }}
          >
            <Magnetic strength={0.18}>
              <a
                href="#contact"
                className="btn-prime"
                style={{ textDecoration: "none" }}
              >
                <span className="dot" />
                <span>Initiate the Descent</span>
                <ArrowRight size={14} />
              </a>
            </Magnetic>
            <a
              href="#bunkers"
              className="btn-prime"
              style={{ textDecoration: "none", borderColor: "var(--line-2)" }}
            >
              <span>Discover Architecture</span>
              <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className={`scroll-cue ${cueHidden ? "hidden" : ""}`}>
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

/* ═══════════════════ MARQUEE — brand language ═══════════════════ */

function Marquee() {
  const Row = () => (
    <div className="marquee-row">
      <span className="marquee-word">MINUS 1</span>
      <span className="marquee-rule" />
      <span className="marquee-word accent">A new layer of living</span>
      <span className="marquee-divider" />
      <span className="marquee-word">CONTINUITY</span>
      <span className="marquee-divider" />
      <span className="marquee-word">PRIVACY</span>
      <span className="marquee-divider" />
      <span className="marquee-word">CONTROL</span>
      <span className="marquee-rule" />
      <span className="marquee-word">SUBTERRANEAN</span>
      <span className="marquee-divider" />
      <span className="marquee-word accent">Beyond security</span>
      <span className="marquee-rule" />
      <span className="marquee-word">GCC</span>
      <span className="marquee-divider" />
      <span className="marquee-word accent">By appointment</span>
      <span className="marquee-divider" />
    </div>
  );
  return (
    <div className="marquee">
      <div className="marquee-track"><Row /><Row /></div>
    </div>
  );
}

/* ═══════════════════ THESIS ═══════════════════ */

function Thesis() {
  const [ref, on] = useReveal(0.2);
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="grain hair-b" style={{ background: "var(--ink)", padding: "160px 0", position: "relative" }}>
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 56 }}>
            <span style={{ width: 40, height: 1, background: "var(--gold)", display: "block" }} />
            <Label color="var(--gold)">THESIS</Label>
          </div>

          <div className="grid md:grid-cols-12" style={{ gap: 48, alignItems: "center" }}>
            <div className="md:col-span-7">
              <div className={on ? "reveal-on" : ""}>
                <h2 className="f-display clamp-mega" style={{ fontSize: "clamp(2.4rem, 7vw, 7.4rem)", lineHeight: 0.92, color: "var(--bone)" }}>
                  <span className="reveal-wrap"><span className="reveal-inner">Not a shelter.</span></span>
                  <br />
                  <span className="reveal-wrap">
                    <span className="reveal-inner" style={{ transitionDelay: "120ms" }}>
                      A <em className="t-gold" style={{ fontStyle: "italic", fontWeight: 600 }}>new layer</em> of living.
                    </span>
                  </span>
                </h2>
              </div>
            </div>

            <div ref={imgRef} className="md:col-span-5" style={{ position: "relative", height: 460, overflow: "hidden", background: "var(--steel)" }}>
              <motion.div className="bg-img dark" style={{ backgroundImage: `url(${IMG.thesisImage}), linear-gradient(180deg, #1a1a1a, #050505)`, y: yImg, filter: "grayscale(30%) contrast(1.1) brightness(0.55)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,5,0.2), rgba(5,5,5,0.6) 60%, rgba(5,5,5,0.9))" }} />
              <div style={{ position: "absolute", left: 22, top: 22, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--gold)" }} className="pulse-glow" />
                <Label color="var(--bone)">REFERENCE · 01</Label>
              </div>
              <div style={{ position: "absolute", left: 22, bottom: 22, right: 22 }}>
                <Label color="var(--gold)">PROJECT FOOTPRINT</Label>
                <div className="f-display" style={{ fontSize: 22, color: "var(--bone)", marginTop: 8, lineHeight: 1.1 }}>Two layers,<br />one address.</div>
              </div>
              <div className="bracket tl" /><div className="bracket br" />
            </div>
          </div>

          <div style={{ marginTop: 80, maxWidth: 1100 }}>
            <div className="grid md:grid-cols-3" style={{ gap: 40 }}>
              {[
                ["CONTINUITY", "Operational autonomy across power, air, water, and communication. A residence that does not stop when the grid does."],
                ["PRIVACY", "Architecture removed from public sightlines. No address. No external footprint. Visible only to those invited."],
                ["CONTROL", "Climate, atmosphere, ingress, monitoring — every variable governed from a single interface, by a single hand."],
              ].map(([k, v]) => (
                <div key={k} className="hair-t" style={{ paddingTop: 24 }}>
                  <Label color="var(--gold)">{k}</Label>
                  <p className="f-body t-bone" style={{ fontSize: 16, lineHeight: 1.55, marginTop: 18 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hair-y flex flex-wrap items-center justify-between" style={{ marginTop: 96, padding: "20px 0", gap: 16 }}>
            <Label>EST. PROTOCOL — Ω.001</Label>
            <Label color="var(--bone-dim)">CLEARANCE — RESTRICTED</Label>
            <Label>ENVELOPE — GLOBAL</Label>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ BUNKERS SHOWCASE ═══════════════════ */

function BunkersShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const depthVal = useTransform(scrollYProgress, [0.1, 0.9], [0, 87]);
  const [d, setD] = useState(0);
  useMotionValueEvent(depthVal, "change", (v) => setD(Math.round(v)));

  return (
    <section id="bunkers" ref={ref} className="grain" style={{ position: "relative", background: "var(--ink)", overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: "-10% -5%", backgroundImage: `url(${IMG.bunkersAlt}), linear-gradient(180deg, #1a1a1a, #050505)`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(40%) contrast(1.15) brightness(0.4)", y, scale }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.45) 30%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.95) 100%)" }} />

      <div style={{ position: "relative", zIndex: 2, padding: "180px 32px" }} className="mx-auto">
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 32 }}>
            <ArrowDown size={14} color="var(--gold)" /><Label color="var(--gold)">01 — BUNKERS</Label>
          </div>
          <div className="flex flex-wrap items-start justify-between" style={{ gap: 32, marginBottom: 80 }}>
            <h3 className="f-display" style={{ fontSize: "clamp(2.4rem, 6vw, 5.6rem)", lineHeight: 0.94, color: "var(--bone)", maxWidth: 800 }}>
              Below the line.<br /><span style={{ color: "var(--gold)" }}>Engineered beneath the recognisable world.</span>
            </h3>
            <div style={{ textAlign: "right" }}>
              <Label color="var(--ash)">LIVE READOUT</Label>
              <div className="f-display big-num" style={{ fontSize: 80, lineHeight: 0.9, color: "var(--bone)", marginTop: 8 }}>
                −{String(d).padStart(2, "0")}<span style={{ color: "var(--gold)", fontSize: 32 }}>m</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-12" style={{ gap: 20 }}>
            <div className="md:col-span-7" style={{ position: "relative", height: 480, overflow: "hidden", background: "var(--steel)" }}>
              <div className="bg-img dark drift" style={{ backgroundImage: `url(${IMG.bunkersHero}), linear-gradient(180deg, #0a0a0a, #050505)`, filter: "grayscale(30%) contrast(1.1) brightness(0.55)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(5,5,5,0.85))" }} />
              <div style={{ position: "absolute", left: 24, top: 24, display: "flex", gap: 8, alignItems: "center" }}>
                <ArrowDown size={12} color="var(--gold)" /><Label color="var(--bone)">VAULT ENTRY</Label>
              </div>
              <div style={{ position: "absolute", left: 24, bottom: 24, right: 24 }}>
                <Label color="var(--gold)">PRIMARY INGRESS</Label>
                <div className="f-display" style={{ fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)", color: "var(--bone)", lineHeight: 1, marginTop: 8 }}>AR500 blast envelope.</div>
              </div>
              <div className="bracket tl" /><div className="bracket tr" /><div className="bracket bl" /><div className="bracket br" />
            </div>

            <div className="md:col-span-5 flex flex-col" style={{ gap: 20 }}>
              <div style={{ position: "relative", flex: 1, minHeight: 230, overflow: "hidden", background: "var(--steel)" }}>
                <div className="bg-img dark" style={{ backgroundImage: `url(${IMG.bunkersInterior}), linear-gradient(180deg, #1a1a1a, #0a0a0a)` }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.85))" }} />
                <div style={{ position: "absolute", left: 20, bottom: 20, right: 20 }}>
                  <Label color="var(--gold)">INTERIOR</Label>
                  <div className="f-display" style={{ fontSize: 22, color: "var(--bone)", marginTop: 6, lineHeight: 1.1 }}>Architect-led finishing.</div>
                </div>
                <div className="bracket tl" /><div className="bracket br" />
              </div>
              <div style={{ position: "relative", flex: 1, minHeight: 230, overflow: "hidden", background: "var(--steel)" }}>
                <div className="bg-img dark" style={{ backgroundImage: `url(${IMG.bunkersConcrete}), linear-gradient(180deg, #1a1a1a, #050505)` }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.85))" }} />
                <div style={{ position: "absolute", left: 20, bottom: 20, right: 20 }}>
                  <Label color="var(--gold)">STRUCTURE</Label>
                  <div className="f-display" style={{ fontSize: 22, color: "var(--bone)", marginTop: 6, lineHeight: 1.1 }}>Reinforced steel hull.</div>
                </div>
                <div className="bracket tl" /><div className="bracket br" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 h-swipe" style={{ marginTop: 32, background: "var(--line-2)", gap: 1 }}>
            {[["BLAST", "≥ 1 MPa overpressure"], ["RADIATION", "99.97% attenuation"], ["ATMOSPHERIC", "NBC · ±0.1% O₂"], ["AUTONOMY", "40 kVA dual / 7-day"]].map(([k, v], i) => (
              <div key={i} className="bg-ink spec-row" style={{ padding: "28px 22px", minHeight: 130 }}>
                <Label color="var(--gold)">{k}</Label>
                <div className="f-display" style={{ fontSize: 16, color: "var(--bone)", marginTop: 12, lineHeight: 1.3 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ STATS — smaller numbers ═══════════════════ */

function Stats() {
  const [ref, on] = useReveal(0.25);
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const items = [
    { num: "300%", label: "GLOBAL INTEREST", note: "Surge in private underground demand since 2020." },
    { num: "$2B", label: "MARKET ENVELOPE", note: "Estimated category valuation. Expanding annually." },
    { num: "01", label: "LUXURY POSITION", note: "No dominant premium brand exists. We define it." },
  ];

  return (
    <section ref={ref} className="grain hair-b" style={{ background: "var(--ink)", padding: "160px 0" }}>
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 64 }}>
            <span style={{ width: 40, height: 1, background: "var(--gold)", display: "block" }} />
            <Label color="var(--gold)">02 — POSITION</Label>
          </div>

          <div className="grid md:grid-cols-12" style={{ gap: 32, alignItems: "stretch" }}>
            <div ref={imgRef} className="md:col-span-5" style={{ position: "relative", minHeight: 460, overflow: "hidden", background: "var(--steel)" }}>
              <motion.div className="bg-img dark" style={{ backgroundImage: `url(${IMG.statsImage}), linear-gradient(180deg, #1a1a1a, #050505)`, y: yImg, filter: "grayscale(30%) contrast(1.1) brightness(0.5)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,5,0.4), rgba(5,5,5,0.85))" }} />
              <div style={{ position: "absolute", left: 22, top: 22 }}><Label color="var(--gold)">MARKET / 2026</Label></div>
              <div style={{ position: "absolute", left: 22, bottom: 22, right: 22 }}>
                <Label color="var(--bone-dim)">UNSERVED · UNCLAIMED</Label>
                <div className="f-display" style={{ fontSize: 22, color: "var(--bone)", marginTop: 8, lineHeight: 1.05 }}>A category<br />without a leader.</div>
              </div>
              <div className="bracket tl" /><div className="bracket br" />
            </div>

            <div className="md:col-span-7">
              {items.map((s, i) => (
                <div key={i} className={i > 0 ? "hair-t" : ""} style={{ padding: i === 0 ? "0 0 28px 0" : "28px 0" }}>
                  <div className="flex flex-wrap items-center justify-between" style={{ gap: 24 }}>
                    <div className={`reveal-wrap ${on ? "reveal-on" : ""}`} style={{ display: "block" }}>
                      <div className="reveal-inner f-display big-num" style={{ fontSize: "clamp(2.4rem, 5.6vw, 4.4rem)", lineHeight: 0.95, transitionDelay: `${i * 120}ms`, color: i === 1 ? "var(--gold)" : "var(--bone)" }}>
                        {s.num}<span style={{ color: "var(--gold)", fontSize: "0.5em" }}>{i < 2 ? "+" : ""}</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 220, textAlign: "right" }}>
                      <Label color="var(--bone)">{s.label}</Label>
                      <p className="f-body t-bone-dim" style={{ fontSize: 13, lineHeight: 1.55, marginTop: 8, marginLeft: "auto", maxWidth: 320 }}>{s.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ TIERS ═══════════════════ */

function Tiers() {
  const tiers = [
    { n: "I", name: "SAFE ROOMS", price: "FROM $50,000", img: IMG.tier1, desc: "Engineered secure rooms integrated into existing residences. Atmospheric seal, ballistic envelope, autonomous power.", specs: [["Footprint", "12 – 28 m²"], ["Capacity", "2 – 4 persons"], ["Deploy", "6 weeks"]] },
    { n: "II", name: "MODULAR UNITS", price: "FROM $80,000", img: IMG.tier2, desc: "Pre-configured underground modules. Rapid integration, scalable footprint, full life-support and finishing.", specs: [["Footprint", "20 – 60 m²"], ["Capacity", "4 – 8 persons"], ["Deploy", "8 – 12 weeks"]] },
    { n: "III", name: "CUSTOM SPACES", price: "FROM $150,000", img: IMG.tier3, desc: "Bespoke subterranean environments — private majlis, entertainment, wellness retreats. Flagship offering.", specs: [["Footprint", "80 m² +"], ["Capacity", "Bespoke"], ["Deploy", "16 – 36 weeks"]] },
  ];

  return (
    <section id="tiers" className="grain hair-b" style={{ background: "var(--carbon)", padding: "160px 0" }}>
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <span style={{ width: 40, height: 1, background: "var(--gold)", display: "block" }} />
            <Label color="var(--gold)">03 — CATALOGUE</Label>
          </div>
          <div className="flex flex-wrap items-end justify-between" style={{ gap: 24, marginBottom: 64 }}>
            <h3 className="f-display" style={{ fontSize: "clamp(2.2rem, 5.6vw, 4.8rem)", lineHeight: 0.94, color: "var(--bone)", maxWidth: 760 }}>
              Three tiers.<br />One brand standard.
            </h3>
            <p className="f-body t-bone-dim" style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 360 }}>
              Each tier shares the same engineering substrate. They differ in scale, finish, and the depth of customisation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 h-swipe" style={{ background: "var(--line-2)", gap: 1 }}>
            {tiers.map((t, i) => (
              <Tilt key={i} max={5}>
                <article className="tier bg-ink flex flex-col" style={{ padding: "32px", minHeight: 600 }}>
                  <div className="flex items-start justify-between">
                    <div className="tier-num f-mono" style={{ fontSize: 12, letterSpacing: "0.2em", color: "var(--ash)" }}>TIER {t.n}</div>
                    <ArrowUpRight className="tier-arrow" size={22} color="var(--ash)" />
                  </div>
                  <div style={{ position: "relative", overflow: "hidden", marginTop: 28, height: 240, background: "var(--steel)" }}>
                    <div className="tier-img" style={{ position: "absolute", inset: 0, backgroundImage: `url(${t.img}), linear-gradient(135deg, #1a1a1a, #050505)`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(5,5,5,0.85))" }} />
                    <div className="bracket tl" /><div className="bracket tr" /><div className="bracket bl" /><div className="bracket br" />
                  </div>
                  <div style={{ marginTop: 32, flex: 1 }}>
                    <h4 className="f-display" style={{ fontSize: 28, color: "var(--bone)" }}><Scramble text={t.name} /></h4>
                    <div style={{ marginTop: 8 }}><Label color="var(--gold)">{t.price}</Label></div>
                    <p className="f-body t-bone-dim" style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 20 }}>{t.desc}</p>
                    <div className="hair-t" style={{ marginTop: 28, paddingTop: 16 }}>
                      {t.specs.map(([k, v], j) => (
                        <div key={j} className="spec-row flex items-center justify-between" style={{ padding: "8px 0" }}>
                          <Label color="var(--ash)">{k}</Label>
                          <span className="f-mono" style={{ fontSize: 12, color: "var(--bone)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <a href="#contact" className="u-link" style={{ marginTop: 32, color: "var(--bone-dim)", fontSize: 12, textDecoration: "none" }}>
                    <Label color="var(--bone-dim)">Enquire — Tier {t.n}</Label><ArrowRight size={12} />
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

/* ═══════════════════ PROCESS ═══════════════════ */

function Process() {
  const steps = [
    { n: "01", ttl: "CONSULTATION", sub: "WEEK 0", body: "Confidential briefing under NDA. Site assessment, threat profile, lifestyle envelope.", img: IMG.proc1 },
    { n: "02", ttl: "DESIGN", sub: "WEEK 2 – 6", body: "Architectural studies, modular configuration, atelier finishes. Approved with the principal in person.", img: IMG.proc2 },
    { n: "03", ttl: "ENGINEERING", sub: "WEEK 6 – 14", body: "Structural, hydraulic, atmospheric, AI control. Every subsystem certified to ISO and military standard.", img: IMG.proc3 },
    { n: "04", ttl: "FABRICATION", sub: "WEEK 10 – 22", body: "Off-site manufacture under sealed protocol. Concurrent excavation if on-site works are commissioned.", img: IMG.proc4 },
    { n: "05", ttl: "DELIVERY", sub: "WEEK 18 – 36", body: "Discreet transport, on-site placement, commissioning. Handover with full operational documentation.", img: IMG.proc5 },
  ];
  return (
    <section id="process" className="grain hair-b" style={{ background: "var(--ink)", padding: "160px 0" }}>
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <span style={{ width: 40, height: 1, background: "var(--gold)", display: "block" }} />
            <Label color="var(--gold)">04 — PROCESS</Label>
          </div>
          <h3 className="f-display" style={{ fontSize: "clamp(2.2rem, 5.6vw, 4.6rem)", lineHeight: 0.94, color: "var(--bone)", maxWidth: 720, marginBottom: 8 }}>
            Five phases.<br /><span style={{ color: "var(--gold)" }}>One sealed protocol.</span>
          </h3>
        </div>

        <div className="hair-y process-track">
          {steps.map((s, i) => (
            <div key={i} className="process-card" style={{ padding: "48px 32px", background: i % 2 ? "var(--carbon)" : "var(--ink)", minHeight: 540 }}>
              <div className="proc-img-wrap">
                <div className="proc-img" style={{ backgroundImage: `url(${s.img}), linear-gradient(135deg, #1a1a1a, #050505)` }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,5,0.2), rgba(5,5,5,0.8))" }} />
                <div style={{ position: "absolute", left: 14, bottom: 14 }}><Label color="var(--gold)">PHASE {s.n}</Label></div>
                <div className="bracket tl" /><div className="bracket br" />
              </div>
              <div className="flex items-center justify-between">
                <div className="f-display big-num" style={{ fontSize: 48, color: "var(--gold)" }}>{s.n}</div>
                <Label>{s.sub}</Label>
              </div>
              <div style={{ width: 48, height: 1, background: "var(--gold)", margin: "28px 0 24px" }} />
              <h4 className="f-display" style={{ fontSize: 26, color: "var(--bone)", lineHeight: 1 }}>{s.ttl}</h4>
              <p className="f-body t-bone-dim" style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 16 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: "20px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Label color="var(--ash)">SCROLL HORIZONTALLY</Label>
          <Label color="var(--ash)">↔</Label>
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
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const yHero = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section id="capabilities" ref={ref} className="grain hair-b" style={{ background: "var(--ink)", padding: "160px 0", position: "relative" }}>
      <div className="schematic" style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }} />
      <div className="mx-auto" style={{ position: "relative", maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <span style={{ width: 40, height: 1, background: "var(--gold)", display: "block" }} />
            <Label color="var(--gold)">05 — SPECIFICATIONS</Label>
          </div>
          <div className="flex flex-wrap items-end justify-between" style={{ gap: 32, marginBottom: 48 }}>
            <h3 className="f-display" style={{ fontSize: "clamp(2.2rem, 5.6vw, 4.6rem)", lineHeight: 0.94, color: "var(--bone)" }}>
              Specifications.<br />Made visible.
            </h3>
            <div className="f-mono t-bone-dim hair-t" style={{ fontSize: 12, lineHeight: 1.7, maxWidth: 320, paddingTop: 16 }}>
              CERT — ISO 9001 · CNAS<br />STANDARD — ASTM E668 · ISO 10055<br />ENVELOPE — Mil-grade alloy substrate
            </div>
          </div>

          <div ref={heroRef} style={{ position: "relative", height: 380, overflow: "hidden", background: "var(--steel)", marginBottom: 48 }}>
            <motion.div style={{ position: "absolute", inset: "-10% -5%", backgroundImage: `url(${IMG.capabilitiesHero}), linear-gradient(135deg, #1a1a1a, #050505)`, backgroundSize: "cover", backgroundPosition: "center", y: yHero, scale: scaleHero, filter: "grayscale(40%) contrast(1.15) brightness(0.45)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,5,0.5), rgba(5,5,5,0.2) 40%, rgba(5,5,5,0.9))" }} />
            <div style={{ position: "absolute", left: 28, top: 28, display: "flex", gap: 8, alignItems: "center" }}>
              <Layers size={12} color="var(--gold)" /><Label color="var(--bone)">ENGINEERING SUBSTRATE</Label>
            </div>
            <div style={{ position: "absolute", left: 28, bottom: 28, right: 28 }}>
              <Label color="var(--gold)">CORE SYSTEMS</Label>
              <div className="f-display" style={{ fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)", color: "var(--bone)", marginTop: 8, lineHeight: 1.05 }}>
                Every subsystem certified.<br />Every envelope sealed.
              </div>
            </div>
            <div className="bracket tl" /><div className="bracket tr" /><div className="bracket bl" /><div className="bracket br" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 h-swipe" style={{ background: "var(--line-2)", gap: 1 }}>
            {caps.map(({ Icon, k, v }, i) => (
              <div key={i} className={`bg-ink spec-row ${on ? "reveal-on" : ""}`} style={{ padding: "28px 24px", minHeight: 180, transitionDelay: `${i * 60}ms` }}>
                <Icon size={22} strokeWidth={1.2} color="var(--gold)" />
                <div style={{ marginTop: 32 }}>
                  <div className="f-mono t-ash" style={{ fontSize: 10, letterSpacing: "0.22em" }}>{k}</div>
                  <div className="f-display t-bone" style={{ fontSize: 16, lineHeight: 1.25, marginTop: 8 }}>{v}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-12" style={{ gap: 32, marginTop: 96 }}>
            <div className="md:col-span-5" style={{ position: "relative", minHeight: 460, overflow: "hidden", background: "var(--steel)" }}>
              <div className="bg-img dark drift" style={{ backgroundImage: `url(${IMG.capabilitiesAccent}), linear-gradient(180deg, #1a1a1a, #050505)`, filter: "grayscale(40%) contrast(1.1) brightness(0.45)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,5,5,0.3), rgba(5,5,5,0.85))" }} />
              <div style={{ position: "absolute", left: 22, top: 22 }}><Label color="var(--gold)">SCHEMATIC · §07</Label></div>
              <div style={{ position: "absolute", left: 22, bottom: 22, right: 22 }}>
                <Label color="var(--bone-dim)">DIMENSIONAL ENVELOPES</Label>
                <div className="f-display" style={{ fontSize: 26, color: "var(--bone)", marginTop: 8, lineHeight: 1.05 }}>From 12 m²<br />to bespoke.</div>
              </div>
              <div className="bracket tl" /><div className="bracket br" />
            </div>

            <div className="md:col-span-7">
              <div className="flex items-center justify-between hair-b" style={{ paddingBottom: 16 }}>
                <Label color="var(--gold)">UNIT REFERENCE</Label>
                <Label>SUB-GRADE / m</Label>
              </div>
              {[["UNIT A · 20ft", "6.3 × 3.3 × 3.3", "20 – 28 m²"], ["UNIT B · 30ft", "9.3 × 3.3 × 3.3", "32 – 42 m²"], ["UNIT C · 50ft", "15.3 × 3.3 × 3.3", "55 – 72 m²"], ["DOME · GEODESIC", "Variable", "120 – 800 m²"], ["CUSTOM / MAJLIS", "ON-SPEC", "80 m² +"]].map(([a, b, c], i) => (
                <div key={i} className="hair-b spec-row grid" style={{ padding: "22px 8px", gridTemplateColumns: "1.5fr 1.5fr 1fr", alignItems: "center" }}>
                  <div className="f-display t-bone" style={{ fontSize: 17 }}>{a}</div>
                  <div className="f-mono t-bone-dim" style={{ fontSize: 12 }}>{b}</div>
                  <div className="f-mono t-gold" style={{ fontSize: 12, textAlign: "right" }}>{c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ REGION ═══════════════════ */

function Region() {
  return (
    <section className="grain hair-b" style={{ position: "relative", background: "var(--carbon)", padding: "160px 0", overflow: "hidden" }}>
      <div className="bg-img" style={{ backgroundImage: `url(${IMG.gcc}), linear-gradient(180deg, #1a1a1a, #050505)`, filter: "grayscale(50%) contrast(1.1) brightness(0.35)", opacity: 0.55 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.95) 100%)" }} />
      <div className="mx-auto" style={{ position: "relative", maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
            <Globe size={14} color="var(--gold)" /><Label color="var(--gold)">06 — TERRITORY</Label>
          </div>
          <div className="grid md:grid-cols-12" style={{ gap: 40 }}>
            <div className="md:col-span-7">
              <h3 className="f-display" style={{ fontSize: "clamp(2.2rem, 5.6vw, 4.8rem)", lineHeight: 0.94, color: "var(--bone)" }}>
                High concentration<br />of wealth.<br />
                <span style={{ color: "var(--gold)" }}>Zero luxury competition.</span>
              </h3>
              <p className="f-body t-bone-dim" style={{ fontSize: 15, lineHeight: 1.65, marginTop: 32, maxWidth: 520 }}>
                The Gulf represents the optimal launch envelope. Concentrated UHNW density. A culture of bespoke architecture. A region for which discretion is not preference but inheritance.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="hair-t" style={{ paddingTop: 20 }}>
                <Label color="var(--gold)">PRIMARY MARKETS</Label>
                <div style={{ marginTop: 20 }}>
                  {[["UAE", "Dubai · Abu Dhabi"], ["KSA", "Riyadh · NEOM corridor"], ["QATAR", "Doha"], ["KUWAIT", "Kuwait City"]].map(([k, v], i) => (
                    <div key={i} className="flex items-center justify-between hair-b" style={{ padding: "18px 0" }}>
                      <div className="f-display t-bone" style={{ fontSize: 16 }}>{k}</div>
                      <div className="f-mono t-bone-dim" style={{ fontSize: 11 }}>{v}</div>
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

/* ═══════════════════ AI ASSISTANT — Ω INTAKE CONCIERGE ═══════════════════ */

function Assistant({ open, onClose, fields, setFields, onSubmit }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Welcome. I'm Ω — MINUS 1's AI intake concierge." },
    { role: "ai", text: "I'll guide you through a confidential briefing request in under two minutes. Shall we begin?" },
  ]);
  const [stage, setStage] = useState("start");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const aiSay = useCallback((text, delay = 900) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "ai", text }]);
    }, delay);
  }, []);

  const userSay = useCallback((text) => {
    setMessages((m) => [...m, { role: "user", text }]);
  }, []);

  const handle = useCallback((input) => {
    const trimmed = (input || "").trim();
    if (!trimmed) return;
    userSay(trimmed);
    setDraft("");

    switch (stage) {
      case "start":
        if (/begin|yes|sure|ok|start|continue/i.test(trimmed)) {
          aiSay("How shall I address you?");
          setStage("name");
        } else if (/tell|more|info|what|why/i.test(trimmed)) {
          aiSay("MINUS 1 designs private subterranean environments — bunker estates engineered for continuity, privacy, and control. Engagement is by appointment only, under NDA.", 1100);
          setTimeout(() => aiSay("Shall we begin?", 800), 1500);
        } else {
          aiSay("To proceed, simply say 'yes' or 'begin'.");
        }
        break;
      case "name":
        setFields((f) => ({ ...f, name: trimmed }));
        aiSay(`Thank you, ${trimmed.split(" ")[0]}.`, 700);
        setTimeout(() => aiSay("Are you enquiring on behalf of an organisation, a family office, or as an individual?", 900), 1000);
        setStage("entity");
        break;
      case "entity":
        setFields((f) => ({ ...f, entity: trimmed }));
        aiSay("Understood.", 600);
        setTimeout(() => aiSay("From which territory will the consultation take place?", 800), 900);
        setStage("territory");
        break;
      case "territory":
        setFields((f) => ({ ...f, territory: trimmed }));
        aiSay(`Noted — ${trimmed}.`, 700);
        setTimeout(() => aiSay("What is the most discreet channel for our intake desk to reach you?", 900), 1000);
        setStage("channel");
        break;
      case "channel":
        setFields((f) => ({ ...f, channel: trimmed }));
        aiSay("Received. We use encrypted channels wherever possible.", 800);
        setTimeout(() => aiSay("Final question — which tier best matches your project? Safe Room, Modular, or Custom?", 900), 1100);
        setStage("interest");
        break;
      case "interest": {
        let normalised = "CUSTOM";
        if (/safe|room/i.test(trimmed)) normalised = "SAFE ROOM";
        else if (/modular|mid/i.test(trimmed)) normalised = "MODULAR";
        else if (/custom|bespoke|flagship|premium/i.test(trimmed)) normalised = "CUSTOM";
        setFields((f) => ({ ...f, interest: normalised }));
        aiSay(`Excellent — ${normalised}.`, 700);
        setTimeout(() => aiSay("Brief is ready. Shall I submit this to the intake desk?", 900), 1100);
        setStage("review");
        break;
      }
      case "review":
        if (/yes|submit|send|confirm|ok/i.test(trimmed)) {
          aiSay("Submitted. Reference logged internally.", 700);
          setTimeout(() => {
            aiSay("The intake desk will reach you within 72 hours on the channel provided.", 900);
            onSubmit();
          }, 1100);
          setStage("done");
        } else if (/edit|change|no|wait/i.test(trimmed)) {
          aiSay("Of course. You can edit any field directly in the form, or tell me which to change.", 900);
        } else {
          aiSay("Reply 'yes' to submit, or 'edit' to make changes.");
        }
        break;
      default:
        aiSay("Our session is complete. Close this panel to return to the site.");
    }
  }, [stage, setFields, userSay, aiSay, onSubmit]);

  const suggestionsFor = (s) => {
    switch (s) {
      case "start": return ["Yes, begin", "Tell me more first"];
      case "entity": return ["Family office", "Organisation", "Individual"];
      case "territory": return ["Dubai", "Riyadh", "Doha"];
      case "interest": return ["SAFE ROOM", "MODULAR", "CUSTOM"];
      case "review": return ["Submit", "Edit a field"];
      default: return null;
    }
  };

  const sug = suggestionsFor(stage);
  const placeholder = {
    start: "Type 'yes' to begin…",
    name: "Your name…",
    entity: "Family office / Individual…",
    territory: "City · Country…",
    channel: "Email or encrypted channel…",
    interest: "Safe Room / Modular / Custom…",
    review: "Type 'yes' to submit…",
    done: "Session complete.",
  }[stage];

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.7, 0, 0.2, 1] }}
      className="ai-panel grain"
    >
      <div className="ai-head">
        <div className="flex items-center" style={{ gap: 12 }}>
          <div className="ai-omega">Ω</div>
          <div>
            <div className="f-mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--gold)" }}>
              INTAKE CONCIERGE
            </div>
            <div className="f-mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ash)", marginTop: 2 }}>
              AI · ALWAYS ENCRYPTED
            </div>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "1px solid var(--line-2)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bone-dim)", cursor: "pointer" }}>
          <X size={14} />
        </button>
      </div>

      <div className="ai-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role}`}>
            <div className="ai-avatar">{m.role === "ai" ? "Ω" : "·"}</div>
            <div className="ai-bubble">{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="ai-msg">
            <div className="ai-avatar">Ω</div>
            <div className="ai-bubble" style={{ padding: 0 }}>
              <div className="ai-typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
        {sug && !typing && stage !== "done" && (
          <div className="ai-suggested">
            {sug.map((s) => (
              <button key={s} className="ai-chip" onClick={() => handle(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <form className="ai-foot" onSubmit={(e) => { e.preventDefault(); handle(draft); }}>
        <input className="ai-input" placeholder={placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} disabled={stage === "done" || typing} />
        <button type="submit" className="ai-send" disabled={!draft.trim() || stage === "done" || typing} aria-label="Send">
          <Send size={14} />
        </button>
      </form>
    </motion.div>
  );
}

/* ═══════════════════ CTA — with AI assistant ═══════════════════ */

function CTA() {
  const [fields, setFields] = useState({ name: "", entity: "", territory: "", channel: "", interest: null });
  const [submitted, setSubmitted] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      <section id="contact" className="grain hair-b" style={{ position: "relative", background: "var(--ink)", padding: "160px 0", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-15%", top: "8%", width: "75%", height: "84%", backgroundImage: `url(${IMG.ctaBg}), linear-gradient(135deg, #1a1a1a, #050505)`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(60%) contrast(1.1) brightness(0.35)", opacity: 0.55, maskImage: "linear-gradient(270deg, rgba(0,0,0,1), rgba(0,0,0,0))", WebkitMaskImage: "linear-gradient(270deg, rgba(0,0,0,1), rgba(0,0,0,0))" }} />

        <div className="mx-auto" style={{ position: "relative", maxWidth: 1320 }}>
          <div style={{ padding: "0 32px" }}>
            <div className="flex items-center" style={{ gap: 14, marginBottom: 24 }}>
              <span style={{ width: 40, height: 1, background: "var(--gold)", display: "block" }} />
              <Label color="var(--gold)">07 — CONTACT</Label>
            </div>
            <div className="grid md:grid-cols-12" style={{ gap: 48 }}>
              <div className="md:col-span-7">
                <h3 className="f-display" style={{ fontSize: "clamp(2.6rem, 7vw, 6.8rem)", lineHeight: 0.9, color: "var(--bone)" }}>
                  Request a<br /><span style={{ color: "var(--gold)" }}>private briefing.</span>
                </h3>
                <p className="f-body t-bone-dim" style={{ fontSize: 15, lineHeight: 1.65, marginTop: 32, maxWidth: 520 }}>
                  Engagement begins with a confidential consultation — typically on-site, always under non-disclosure. Project intake is limited and waitlisted.
                </p>

                <div style={{ marginTop: 32 }}>
                  <button type="button" className="btn-ai" onClick={() => setAiOpen(true)}>
                    <Sparkles className="spark" size={14} />
                    <span>Ω · AI Intake Concierge</span>
                    <span style={{ marginLeft: 6, padding: "2px 6px", background: "rgba(200,156,74,0.12)", borderRadius: 2, fontSize: 9, letterSpacing: "0.15em" }}>NEW</span>
                  </button>
                  <p className="f-body t-bone-dim" style={{ fontSize: 12, lineHeight: 1.55, marginTop: 12, maxWidth: 380 }}>
                    Or let our AI assistant guide you through the briefing in 2 minutes — your answers auto-fill the form.
                  </p>
                </div>

                <div className="hair-t grid grid-cols-2" style={{ marginTop: 48, paddingTop: 24, gap: 16, maxWidth: 460 }}>
                  <div>
                    <Label>OPERATIONS</Label>
                    <div className="f-display t-bone" style={{ fontSize: 15, marginTop: 8 }}>Dubai · Riyadh</div>
                  </div>
                  <div>
                    <Label>CIPHERED CHANNEL</Label>
                    <div className="f-display t-bone" style={{ fontSize: 15, marginTop: 8 }}>by request</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div style={{ background: "var(--carbon)", border: "1px solid var(--line-2)", padding: 32, position: "relative" }} className="glow-gold">
                  <div className="bracket tl" /><div className="bracket tr" /><div className="bracket bl" /><div className="bracket br" />

                  {!submitted ? (
                    <>
                      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
                        <Label color="var(--gold)">INTAKE — FORM 001</Label>
                        <button type="button" onClick={() => setAiOpen(true)} style={{ background: "transparent", border: "none", color: "var(--gold)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                          <Sparkles size={11} />Ask Ω
                        </button>
                      </div>

                      {[["name", "NAME", "Full name"], ["entity", "ENTITY", "Organisation / individual"], ["territory", "TERRITORY", "City · Country"], ["channel", "CHANNEL", "Email · Encrypted preferred"]].map(([key, k, p], i) => (
                        <div key={i} className="hair-b" style={{ paddingBottom: 14, marginBottom: 14 }}>
                          <div className="f-mono t-ash" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{String(i + 1).padStart(2, "0")} — {k}</div>
                          <input
                            type="text"
                            placeholder={p}
                            value={fields[key]}
                            onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                            className="f-body t-bone"
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: 14, padding: "4px 0", width: "100%", color: "var(--bone)" }}
                          />
                        </div>
                      ))}
                      <div>
                        <div className="f-mono t-ash" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 10 }}>05 — INTEREST</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {["SAFE ROOM", "MODULAR", "CUSTOM"].map((k) => (
                            <button key={k} onClick={() => setFields((f) => ({ ...f, interest: k }))} className="f-mono"
                              style={{
                                padding: "10px 14px", fontSize: 11, letterSpacing: "0.15em",
                                border: fields.interest === k ? "1px solid var(--gold)" : "1px solid var(--line-2)",
                                color: fields.interest === k ? "var(--gold)" : "var(--bone-dim)",
                                background: fields.interest === k ? "rgba(200,156,74,0.05)" : "transparent",
                                cursor: "pointer", transition: "all 250ms ease",
                              }}>
                              {k}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Magnetic strength={0.15}>
                        <button className="btn-prime" onClick={() => setSubmitted(true)} style={{ marginTop: 32, width: "100%", justifyContent: "space-between" }}>
                          <span className="flex items-center" style={{ gap: 12 }}>
                            <span className="dot" />Request Private Briefing
                          </span>
                          <ArrowRight size={14} />
                        </button>
                      </Magnetic>
                      <div className="flex items-center" style={{ gap: 8, marginTop: 16 }}>
                        <Lock size={10} color="var(--ash)" /><Label>TRANSMISSION ENCRYPTED</Label>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: "32px 0", textAlign: "center" }}>
                      <div style={{ width: 54, height: 54, border: "1px solid var(--gold)", borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                        <Lock size={18} />
                      </div>
                      <h4 className="f-display t-bone" style={{ fontSize: 24, lineHeight: 1.2, marginTop: 24 }}>Request received.</h4>
                      <p className="f-body t-bone-dim" style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 12 }}>
                        A member of the MINUS 1 intake desk will reach you within 72 hours on the channel provided. Reference is held internally.
                      </p>
                      <Magnetic>
                        <button className="btn-prime" onClick={() => { setSubmitted(false); setFields({ name: "", entity: "", territory: "", channel: "", interest: null }); }} style={{ marginTop: 32, padding: "12px 20px" }}>
                          <span className="dot" />New Request
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

      <AnimatePresence>
        {aiOpen && (
          <Assistant
            open={aiOpen}
            onClose={() => setAiOpen(false)}
            fields={fields}
            setFields={setFields}
            onSubmit={() => {
              setSubmitted(true);
              setTimeout(() => setAiOpen(false), 2200);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════ FOOTER — Swot Creative Hub ═══════════════════ */

function Footer() {
  return (
    <footer className="grain" style={{ background: "var(--carbon)", padding: "72px 0 48px" }}>
      <div className="mx-auto" style={{ maxWidth: 1320 }}>
        <div style={{ padding: "0 32px" }}>
          <div className="hair-b flex flex-wrap items-center justify-between" style={{ gap: 32, paddingBottom: 32 }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <div style={{ width: 30, height: 30, border: "1px solid var(--gold)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MinusIcon size={14} strokeWidth={2.2} />
              </div>
              <div className="f-display" style={{ fontSize: 14, letterSpacing: "0.12em" }}>MINUS 1</div>
              <Label>SUBTERRANEAN INFRASTRUCTURE</Label>
            </div>
            <div className="flex flex-wrap items-center" style={{ gap: 32 }}>
              <Label color="var(--bone-dim)">PRIVACY</Label>
              <Label color="var(--bone-dim)">TERMS</Label>
              <Label color="var(--bone-dim)">PRESS</Label>
              <Label color="var(--bone-dim)">CAREERS</Label>
            </div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--gold)" }} className="pulse-glow" />
              <Label color="var(--gold)">CHANNEL ACTIVE</Label>
            </div>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: 32, marginTop: 40 }}>
            <div>
              <Label>HEADQUARTERS</Label>
              <p className="f-body t-bone-dim" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>By appointment only. Address disclosed in NDA phase.</p>
            </div>
            <div>
              <Label>STANDARDS</Label>
              <p className="f-body t-bone-dim" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>ISO 9001 · CNAS · ASTM E668 · ISO 10055 · Mil-grade substrate.</p>
            </div>
            <div>
              <Label>PHILOSOPHY</Label>
              <p className="f-body t-bone-dim" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>Not a shelter. A new layer of living.</p>
            </div>
          </div>

          <div className="hair-t flex flex-wrap items-center justify-between" style={{ marginTop: 48, paddingTop: 24, gap: 16 }}>
            <div className="flex items-center" style={{ gap: 10, flexWrap: "wrap" }}>
              <Label color="var(--ash)">©</Label>
              <a
                href="https://www.swottm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="f-mono"
                style={{
                  fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "var(--bone-dim)", textDecoration: "none",
                  transition: "color 250ms ease",
                  borderBottom: "1px solid var(--line-2)", paddingBottom: 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--gold)";
                  e.currentTarget.style.borderColor = "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--bone-dim)";
                  e.currentTarget.style.borderColor = "var(--line-2)";
                }}
              >
                SWOT CREATIVE HUB
              </a>
              <Label color="var(--ash)">— ALL RIGHTS RESERVED</Label>
            </div>
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
    if (loading) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
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
    <div className="f-body" style={{ background: "var(--ink)", color: "var(--bone)" }}>
      <style>{CSS}</style>
      <AnimatePresence>{loading && <Preloader done={() => setLoading(false)} />}</AnimatePresence>

      <Nav scrollY={scrollY} />
      <DepthIndicator depth={depth} />

      <Hero scrollY={scrollY} />
      <Marquee />
      <Thesis />
      <BunkersShowcase />
      <Stats />
      <Tiers />
      <Process />
      <Capabilities />
      <Region />
      <CTA />
      <Footer />
    </div>
  );
}
