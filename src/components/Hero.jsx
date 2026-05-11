import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Magnetic from './Magnetic';

/**
 * HERO — Architectural sectional reveal.
 * Surface: luxury villa at golden hour. Below: the -1 bunker, cross-section.
 * Interactive: mouse parallax rotates the whole scene, room hotspots illuminate on hover.
 */

const ROOMS = [
  {
    id: 'master',
    label: 'Master Suite',
    note: 'Sleeping quarter · ensuite · private vault access',
    x: 360,
    y: 580,
    w: 320,
    h: 130,
    href: '#bunkers',
  },
  {
    id: 'majlis',
    label: 'Majlis · Lounge',
    note: 'Reception · entertainment · dining',
    x: 700,
    y: 580,
    w: 360,
    h: 130,
    href: '#bunkers',
  },
  {
    id: 'vault',
    label: 'The Vault',
    note: 'Bullion · documents · cold storage',
    x: 1080,
    y: 580,
    w: 200,
    h: 130,
    href: '#bunkers',
  },
  {
    id: 'provisioning',
    label: 'Provisioning',
    note: '180-day autonomy · hydroponics link',
    x: 360,
    y: 730,
    w: 280,
    h: 110,
    href: '#domes',
  },
  {
    id: 'mech',
    label: 'NBC Mechanical',
    note: 'Air · water · power · filtration',
    x: 660,
    y: 730,
    w: 280,
    h: 110,
    href: '#catalogue',
  },
  {
    id: 'security',
    label: 'Security & Comms',
    note: 'Biometric · SCIF · surveillance',
    x: 960,
    y: 730,
    w: 320,
    h: 110,
    href: '#catalogue',
  },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const [time, setTime] = useState('');
  const [hovered, setHovered] = useState(null);

  // Mouse parallax
  const mouseX = useSpring(0, { stiffness: 50, damping: 18 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 18 });
  const rotateY = useTransform(mouseX, [-1, 1], [-6, 6]);
  const rotateX = useTransform(mouseY, [-1, 1], [3, -3]);
  const tx = useTransform(mouseX, [-1, 1], [-20, 20]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        String(d.getUTCHours()).padStart(2, '0') +
          ':' +
          String(d.getUTCMinutes()).padStart(2, '0') +
          ':' +
          String(d.getUTCSeconds()).padStart(2, '0')
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  const openConcierge = () =>
    window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-coal overflow-hidden select-none"
      style={{ perspective: '1800px' }}
    >
      {/* DEEP BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, #2A1810 0%, #15100A 50%, #050302 100%)',
        }}
      />

      {/* ───── ARCHITECTURAL SECTIONAL SCENE ───── */}
      <motion.div
        style={{
          rotateY,
          rotateX,
          y: sceneY,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        className="absolute inset-0 z-10"
      >
        <motion.svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          style={{ x: tx }}
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1A1410" />
              <stop offset="0.35" stopColor="#3A2418" />
              <stop offset="0.7" stopColor="#A8552A" />
              <stop offset="1" stopColor="#E5A05A" />
            </linearGradient>
            <radialGradient id="sunGrad" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FFE0A0" />
              <stop offset="0.4" stopColor="#FFB060" />
              <stop offset="1" stopColor="#FFB060" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="duneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6B3B1F" />
              <stop offset="1" stopColor="#3A1F10" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1A0F08" />
              <stop offset="0.3" stopColor="#100A05" />
              <stop offset="1" stopColor="#050302" />
            </linearGradient>
            <linearGradient id="villaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2A2520" />
              <stop offset="1" stopColor="#0F0E0C" />
            </linearGradient>
            <linearGradient id="windowGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFD088" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FF8830" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5C4A2F" />
              <stop offset="0.5" stopColor="#D4A574" />
              <stop offset="1" stopColor="#5C4A2F" />
            </linearGradient>
            <pattern id="soil" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="#100A05" />
              <circle cx="10" cy="20" r="0.5" fill="#3A2418" opacity="0.6" />
              <circle cx="40" cy="10" r="0.4" fill="#3A2418" opacity="0.5" />
              <circle cx="25" cy="45" r="0.6" fill="#3A2418" opacity="0.7" />
              <circle cx="50" cy="50" r="0.4" fill="#3A2418" opacity="0.5" />
            </pattern>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
          </defs>

          {/* ───────── SKY ───────── */}
          <rect width="1600" height="380" fill="url(#skyGrad)" />

          {/* Stars */}
          {Array.from({ length: 30 }).map((_, i) => {
            const sx = (i * 53) % 1600;
            const sy = (i * 17) % 120;
            return <circle key={i} cx={sx} cy={sy} r="0.6" fill="#FFE8C8" opacity={0.4 + ((i * 0.07) % 0.5)} />;
          })}

          {/* Sun haze */}
          <circle cx="1280" cy="280" r="180" fill="url(#sunGrad)" opacity="0.6" />
          <circle cx="1280" cy="280" r="34" fill="#FFE0A0" />
          <circle cx="1280" cy="280" r="22" fill="#FFF4D0" />

          {/* Distant dune layers */}
          <path
            d="M 0,360 Q 200,330 400,345 T 800,338 T 1200,342 T 1600,360 L 1600,380 L 0,380 Z"
            fill="#3A1F10"
            opacity="0.6"
          />
          <path
            d="M 0,375 Q 250,355 500,365 T 1000,360 T 1600,375 L 1600,380 L 0,380 Z"
            fill="url(#duneGrad)"
          />

          {/* ───────── LUXURY VILLA ───────── */}
          <g>
            {/* Villa shadow on dune */}
            <ellipse cx="800" cy="382" rx="320" ry="6" fill="#000" opacity="0.5" />

            {/* Pool — left side */}
            <rect x="500" y="370" width="140" height="10" fill="#2A4A5A" />
            <rect x="500" y="370" width="140" height="3" fill="#5A8AA0" opacity="0.6" />

            {/* Two palms */}
            <g transform="translate(470, 290)">
              <rect x="-1.5" y="0" width="3" height="80" fill="#1A0F08" />
              <path d="M 0,0 Q -25,-15 -35,-30 Q -28,-22 -10,-10 Z" fill="#1A2A18" opacity="0.8" />
              <path d="M 0,0 Q 25,-18 38,-32 Q 28,-22 12,-12 Z" fill="#1A2A18" opacity="0.8" />
              <path d="M 0,0 Q -30,5 -42,8 Q -28,0 -10,-2 Z" fill="#1A2A18" opacity="0.7" />
              <path d="M 0,0 Q 32,3 45,5 Q 30,-2 12,-2 Z" fill="#1A2A18" opacity="0.7" />
            </g>
            <g transform="translate(1090, 295)">
              <rect x="-1.5" y="0" width="3" height="75" fill="#1A0F08" />
              <path d="M 0,0 Q -22,-12 -32,-28 Q -25,-20 -8,-10 Z" fill="#1A2A18" opacity="0.7" />
              <path d="M 0,0 Q 22,-14 32,-30 Q 25,-20 10,-10 Z" fill="#1A2A18" opacity="0.7" />
              <path d="M 0,0 Q -28,5 -38,8 Q -25,0 -8,-2 Z" fill="#1A2A18" opacity="0.6" />
            </g>

            {/* Main villa volume — flat-roof modernist */}
            <rect x="650" y="280" width="420" height="100" fill="url(#villaGrad)" />
            {/* Upper level set back */}
            <rect x="720" y="240" width="280" height="40" fill="url(#villaGrad)" />
            {/* Roof line accent */}
            <line x1="650" y1="280" x2="1070" y2="280" stroke="url(#brassGrad)" strokeWidth="1.2" />
            <line x1="720" y1="240" x2="1000" y2="240" stroke="url(#brassGrad)" strokeWidth="1" />

            {/* Floor-to-ceiling glass windows — glowing */}
            <g>
              <rect x="670" y="295" width="60" height="75" fill="url(#windowGlow)" />
              <rect x="745" y="295" width="60" height="75" fill="url(#windowGlow)" />
              <rect x="820" y="295" width="60" height="75" fill="url(#windowGlow)" />
              <rect x="895" y="295" width="60" height="75" fill="url(#windowGlow)" />
              <rect x="970" y="295" width="60" height="75" fill="url(#windowGlow)" />
              <rect x="730" y="252" width="50" height="22" fill="url(#windowGlow)" />
              <rect x="800" y="252" width="50" height="22" fill="url(#windowGlow)" />
              <rect x="870" y="252" width="50" height="22" fill="url(#windowGlow)" />
              <rect x="940" y="252" width="50" height="22" fill="url(#windowGlow)" />
            </g>

            {/* Window mullions */}
            {[670, 730, 745, 805, 820, 880, 895, 955, 970, 1030].map((mx, i) => (
              <line key={i} x1={mx} y1="295" x2={mx} y2="370" stroke="#0F0E0C" strokeWidth="0.6" />
            ))}

            {/* Soft window bloom */}
            <rect x="650" y="280" width="420" height="100" fill="#FFB060" opacity="0.08" filter="url(#softGlow)" />

            {/* Entry slab — base shadow */}
            <rect x="650" y="378" width="420" height="4" fill="#0A0604" />
          </g>

          {/* ───────── GROUND LINE ───────── */}
          <line
            x1="0"
            y1="380"
            x2="1600"
            y2="380"
            stroke="#FF6B1A"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.85"
          />
          <text x="40" y="374" fontSize="10" fill="#FF6B1A" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
            GRADE · 0.00m
          </text>

          {/* ───────── UNDERGROUND ───────── */}
          <rect x="0" y="380" width="1600" height="520" fill="url(#groundGrad)" />
          <rect x="0" y="380" width="1600" height="520" fill="url(#soil)" opacity="0.5" />

          {/* Stratification lines */}
          {[420, 440, 470, 510, 560].map((sy, i) => (
            <line key={i} x1="0" y1={sy} x2="1600" y2={sy} stroke="#3A2418" strokeWidth="0.4" opacity={0.4 - i * 0.05} />
          ))}

          {/* ───────── BUNKER SHELL ───────── */}
          <g>
            {/* Outer shell */}
            <rect
              x="320"
              y="560"
              width="980"
              height="300"
              fill="#0A0604"
              stroke="url(#brassGrad)"
              strokeWidth="1.5"
            />
            {/* Inner liner */}
            <rect
              x="328"
              y="568"
              width="964"
              height="284"
              fill="none"
              stroke="#A8854A"
              strokeWidth="0.5"
              opacity="0.4"
            />
            {/* Mid-floor divider */}
            <line x1="328" y1="715" x2="1292" y2="715" stroke="#A8854A" strokeWidth="0.8" opacity="0.7" />
            {/* Vertical room dividers — upper */}
            <line x1="680" y1="568" x2="680" y2="715" stroke="#A8854A" strokeWidth="0.8" opacity="0.7" />
            <line x1="1060" y1="568" x2="1060" y2="715" stroke="#A8854A" strokeWidth="0.8" opacity="0.7" />
            {/* Vertical room dividers — lower */}
            <line x1="640" y1="715" x2="640" y2="852" stroke="#A8854A" strokeWidth="0.8" opacity="0.7" />
            <line x1="960" y1="715" x2="960" y2="852" stroke="#A8854A" strokeWidth="0.8" opacity="0.7" />
          </g>

          {/* ───────── ELEVATOR / VERTICAL SHAFT ───────── */}
          <g>
            <rect x="810" y="380" width="20" height="180" fill="#1A0F08" stroke="url(#brassGrad)" strokeWidth="0.5" />
            <line x1="820" y1="380" x2="820" y2="560" stroke="#A8854A" strokeWidth="0.4" strokeDasharray="2 3" />
            {/* Cabin */}
            <motion.rect
              x="813"
              y="400"
              width="14"
              height="22"
              fill="url(#brassGrad)"
              animate={{ y: [400, 530, 400] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>

          {/* ───────── ROOM FURNITURE SILHOUETTES ───────── */}
          {/* Master Suite — bed */}
          <g opacity="0.55">
            <rect x="430" y="660" width="120" height="35" fill="#3A2418" />
            <rect x="430" y="650" width="120" height="12" fill="#5C3A24" />
            <rect x="430" y="650" width="20" height="12" fill="#A8854A" opacity="0.6" />
          </g>
          {/* Majlis — low seating + table */}
          <g opacity="0.55">
            <rect x="720" y="675" width="80" height="20" fill="#3A2418" />
            <ellipse cx="760" cy="673" rx="40" ry="6" fill="#5C3A24" />
            <rect x="830" y="678" width="50" height="14" fill="#1A0F08" stroke="#A8854A" strokeWidth="0.5" />
            <rect x="900" y="675" width="80" height="20" fill="#3A2418" />
            <ellipse cx="940" cy="673" rx="40" ry="6" fill="#5C3A24" />
          </g>
          {/* Vault — safe */}
          <g opacity="0.6">
            <rect x="1140" y="650" width="50" height="50" fill="#1A0F08" stroke="url(#brassGrad)" strokeWidth="1" />
            <circle cx="1165" cy="675" r="8" fill="none" stroke="url(#brassGrad)" strokeWidth="0.6" />
            <circle cx="1165" cy="675" r="2" fill="#A8854A" />
          </g>
          {/* Provisioning — shelves */}
          <g opacity="0.55">
            <line x1="400" y1="755" x2="600" y2="755" stroke="#5C4A2F" strokeWidth="1.5" />
            <line x1="400" y1="775" x2="600" y2="775" stroke="#5C4A2F" strokeWidth="1.5" />
            <line x1="400" y1="795" x2="600" y2="795" stroke="#5C4A2F" strokeWidth="1.5" />
            {[420, 440, 460, 480, 500, 520, 540, 560, 580].map((px, i) => (
              <rect key={i} x={px} y="747" width="14" height="8" fill="#3A2418" />
            ))}
            {[420, 440, 460, 480, 500, 520, 540, 560, 580].map((px, i) => (
              <rect key={i} x={px} y="767" width="14" height="8" fill="#3A2418" />
            ))}
          </g>
          {/* Mechanical — equipment boxes */}
          <g opacity="0.55">
            <rect x="690" y="755" width="40" height="60" fill="#1A0F08" stroke="#5C4A2F" strokeWidth="0.5" />
            <rect x="740" y="765" width="50" height="50" fill="#1A0F08" stroke="#5C4A2F" strokeWidth="0.5" />
            <rect x="800" y="755" width="40" height="60" fill="#1A0F08" stroke="#5C4A2F" strokeWidth="0.5" />
            <circle cx="710" cy="780" r="6" fill="none" stroke="#A8854A" strokeWidth="0.5" />
            <circle cx="765" cy="785" r="8" fill="none" stroke="#A8854A" strokeWidth="0.5" />
            <circle cx="820" cy="780" r="6" fill="none" stroke="#A8854A" strokeWidth="0.5" />
          </g>
          {/* Security — server racks */}
          <g opacity="0.55">
            <rect x="990" y="755" width="20" height="60" fill="#1A0F08" stroke="#5C4A2F" strokeWidth="0.4" />
            <rect x="1015" y="755" width="20" height="60" fill="#1A0F08" stroke="#5C4A2F" strokeWidth="0.4" />
            <rect x="1040" y="755" width="20" height="60" fill="#1A0F08" stroke="#5C4A2F" strokeWidth="0.4" />
            {[760, 770, 780, 790, 800].map((ly, i) => (
              <g key={i}>
                <circle cx="1000" cy={ly} r="0.8" fill="#FF6B1A" opacity="0.7" />
                <circle cx="1025" cy={ly} r="0.8" fill="#A8854A" opacity="0.6" />
                <circle cx="1050" cy={ly} r="0.8" fill="#FF6B1A" opacity="0.7" />
              </g>
            ))}
          </g>

          {/* ───────── INTERACTIVE ROOM HOTSPOTS ───────── */}
          {ROOMS.map((r) => {
            const isHover = hovered === r.id;
            return (
              <g key={r.id}>
                {/* Click target */}
                <a href={r.href}>
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    fill="transparent"
                    onMouseEnter={() => setHovered(r.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                  />
                </a>
                {/* Highlight overlay */}
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill="#FF6B1A"
                  opacity={isHover ? 0.10 : 0}
                  style={{ transition: 'opacity 0.3s', pointerEvents: 'none' }}
                />
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill="none"
                  stroke="#FF6B1A"
                  strokeWidth={isHover ? 1 : 0}
                  style={{ transition: 'stroke-width 0.3s', pointerEvents: 'none' }}
                />
                {/* Pulse dot */}
                <g style={{ pointerEvents: 'none' }}>
                  <circle
                    cx={r.x + r.w / 2}
                    cy={r.y + r.h / 2}
                    r={isHover ? 6 : 4}
                    fill="#FF6B1A"
                    style={{ transition: 'r 0.3s' }}
                  />
                  <circle cx={r.x + r.w / 2} cy={r.y + r.h / 2} r="8" fill="none" stroke="#FF6B1A" strokeWidth="0.6" opacity="0.6">
                    <animate attributeName="r" values="4;14;4" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                </g>
              </g>
            );
          })}

          {/* ───────── DEPTH SCALE — right side ───────── */}
          <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#A8854A" letterSpacing="1.5">
            {[
              { y: 380, label: '0.00m' },
              { y: 480, label: '−5.00m' },
              { y: 580, label: '−10.00m' },
              { y: 680, label: '−15.00m' },
              { y: 780, label: '−20.00m' },
              { y: 860, label: '−25.00m' },
            ].map((d, i) => (
              <g key={i}>
                <line x1="1490" y1={d.y} x2="1510" y2={d.y} stroke="#A8854A" strokeWidth="0.5" />
                <text x="1518" y={d.y + 3}>
                  {d.label}
                </text>
              </g>
            ))}
            <line x1="1500" y1="380" x2="1500" y2="860" stroke="#A8854A" strokeWidth="0.4" opacity="0.5" />
          </g>

          {/* Dimension arrow — house overall depth */}
          <g stroke="#A8854A" strokeWidth="0.5" fill="none" opacity="0.6">
            <line x1="300" y1="560" x2="300" y2="860" />
            <line x1="295" y1="560" x2="305" y2="560" />
            <line x1="295" y1="860" x2="305" y2="860" />
          </g>
          <text
            x="285"
            y="715"
            fontSize="9"
            fill="#A8854A"
            fontFamily="JetBrains Mono, monospace"
            transform="rotate(-90, 285, 715)"
            textAnchor="middle"
            letterSpacing="2"
          >
            15.00m BLAST-RATED
          </text>
        </motion.svg>
      </motion.div>

      {/* ───── CONTENT OVERLAY ───── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-30 min-h-screen flex flex-col pointer-events-none"
      >
        {/* TOP UI */}
        <div className="px-6 md:px-12 pt-28 md:pt-32 grid grid-cols-12 gap-3 md:gap-6">
          <div className="col-span-6 md:col-span-3 label text-bone/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
              <span className="text-orange">SECTION · LIVE</span>
            </div>
            <div className="mt-1.5 text-bone/30 tabular-nums">{time} UTC</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">PROJECT</div>
            <div className="mt-1.5">RESIDENCE N° 17</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">SITE</div>
            <div className="mt-1.5">EMIRATES HILLS</div>
          </div>
          <div className="col-span-6 md:col-span-3 label text-bone/50 md:text-right">
            <div className="text-bone/30">SCALE</div>
            <div className="mt-1.5 tabular-nums">1 : 120</div>
          </div>
        </div>

        {/* MID — drop tagline */}
        <div className="flex-1 flex items-start pt-8 md:pt-12 px-6 md:px-12">
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="label text-orange mb-4 flex items-center gap-4"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="block w-12 h-px bg-orange"
              />
              <span className="tracking-[0.3em]">A NEW LAYER OF LIVING</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="display text-bone text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.7)' }}
            >
              The residence above.
              <br />
              <span className="italic text-pale">The world beneath.</span>
            </motion.h1>
          </div>
        </div>

        {/* BOTTOM — copy + CTAs + scroll cue */}
        <div className="px-6 md:px-12 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="grid grid-cols-12 gap-4 items-end"
          >
            <div className="col-span-12 md:col-span-6 lg:col-span-5 pointer-events-auto">
              <p className="text-bone/85 text-sm md:text-base leading-relaxed mb-5 max-w-md">
                Each MINUS 1 estate begins as a private villa and continues underground — a concealed subterranean sanctuary engineered to military specification and finished to the standard of a private gallery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Magnetic strength={0.2}>
                  <a
                    href="#bunkers"
                    className="label bg-orange text-ink px-5 py-3 hover:bg-orange-bright transition-colors inline-flex items-center gap-3"
                  >
                    Explore <span>→</span>
                  </a>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <button
                    onClick={openConcierge}
                    className="label border border-bone/40 text-bone px-5 py-3 hover:border-orange hover:text-orange transition-all pointer-events-auto"
                  >
                    Commission
                  </button>
                </Magnetic>
              </div>
            </div>
            <div className="hidden md:flex md:col-span-6 lg:col-span-7 justify-end items-end pointer-events-none">
              <div className="label text-bone/40 text-right">
                <div className="text-bone/25">HOVER · CLICK ANY ROOM</div>
                <div className="mt-1.5 text-bone/70 flex justify-end items-center gap-2">
                  <motion.span
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                  <span>DESCEND</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ROOM CALLOUT — appears when hovering a hotspot */}
      {hovered && (
        <motion.div
          key={hovered}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[180%] md:-translate-y-[120%] pointer-events-none"
        >
          <div className="bg-coal/90 backdrop-blur-md border border-orange/50 px-5 py-3 min-w-[260px]">
            <div className="label text-orange mb-1">
              {ROOMS.find((r) => r.id === hovered)?.label}
            </div>
            <div className="text-bone/80 text-xs">
              {ROOMS.find((r) => r.id === hovered)?.note}
            </div>
          </div>
        </motion.div>
      )}

      {/* MARQUEE */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-bone/10 bg-coal/85 backdrop-blur-md overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {[
                'NBC AIR FILTRATION · VA-40',
                'BLAST-RATED · AR500 STEEL',
                'AUTONOMY · 180 DAYS',
                'OVERPRESSURE · 50 kPa',
                'DEPTH · 15 — 60 m',
                'BIOMETRIC · 4FA',
                'OFF-GRID POWER',
                'BESPOKE SIGNATURE',
              ].map((t, j) => (
                <span key={j} className="label text-bone/40 mx-8 flex items-center gap-3">
                  <span className="w-1 h-1 bg-orange rounded-full" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
