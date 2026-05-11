import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Magnetic from './Magnetic';

/**
 * MINUS 1 — Hero
 * Scroll-driven 5-frame narrative. Pinned section, ~500vh tall.
 * Frame 1 — The horizon
 * Frame 2 — The residence
 * Frame 3 — The reveal (ground peels)
 * Frame 4 — The world beneath
 * Frame 5 — The mark
 */
export default function Hero() {
  const ref = useRef(null);
  const [frame, setFrame] = useState(0);
  const [time, setTime] = useState('');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.18) setFrame(0);
    else if (v < 0.38) setFrame(1);
    else if (v < 0.58) setFrame(2);
    else if (v < 0.78) setFrame(3);
    else setFrame(4);
  });

  // ── CAMERA / SCENE TRANSFORMS ───────────────────────────────
  // Push-in: from wide horizon to villa close-up
  const sceneScale = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1.35, 1.05]);
  const sceneY = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], ['0vh', '-8vh', '12vh', '4vh']);
  // Sky darkens as we descend
  const skyOpacity = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [1, 0.7, 0.15, 0]);
  // Dunes shift
  const duneY = useTransform(scrollYProgress, [0, 1], ['0vh', '-20vh']);
  // Sun position — rises slightly then drops below horizon
  const sunY = useTransform(scrollYProgress, [0, 0.4, 1], [0, -30, -200]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.7, 0]);

  // Villa
  const villaScale = useTransform(scrollYProgress, [0, 0.2, 0.55, 0.85, 1], [0.18, 0.55, 1, 1.1, 1.05]);
  const villaY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ['18vh', '6vh', '-2vh', '-6vh']);
  const villaOpacity = useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0, 1, 1, 0.9]);

  // Ground peel — clipPath inset bottom retreats so soil "opens"
  const groundPeel = useTransform(scrollYProgress, [0.4, 0.7], [0, 100]);
  const groundClip = useTransform(groundPeel, (v) => `inset(0 0 ${v}% 0)`);

  // Bunker
  const bunkerOpacity = useTransform(scrollYProgress, [0.4, 0.55, 0.95, 1], [0, 1, 1, 0]);
  const bunkerY = useTransform(scrollYProgress, [0.4, 0.7, 1], ['10vh', '0vh', '-4vh']);
  const bunkerScale = useTransform(scrollYProgress, [0.4, 0.7, 1], [0.92, 1, 1.04]);

  // Vertical brass line connecting villa to bunker
  const lineScaleY = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);

  // Brand mark — frame 5
  const markOpacity = useTransform(scrollYProgress, [0.78, 0.88], [0, 1]);
  const markScale = useTransform(scrollYProgress, [0.78, 1], [0.92, 1]);

  // Universal dark veil intensifies as we go deeper
  const veilOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.5, 0.85]);

  // Frame text opacities — fade in then out within each 20% window
  const f1 = useTransform(scrollYProgress, [0, 0.03, 0.16, 0.22], [0, 1, 1, 0]);
  const f2 = useTransform(scrollYProgress, [0.22, 0.25, 0.36, 0.42], [0, 1, 1, 0]);
  const f3 = useTransform(scrollYProgress, [0.42, 0.45, 0.56, 0.62], [0, 1, 1, 0]);
  const f4 = useTransform(scrollYProgress, [0.62, 0.65, 0.76, 0.82], [0, 1, 1, 0]);
  const f5 = useTransform(scrollYProgress, [0.82, 0.88, 1], [0, 1, 1]);

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

  const openConcierge = () => window.dispatchEvent(new CustomEvent('open-concierge'));

  // ── CONTENT ─────────────────────────────────────────────────
  return (
    <section
      ref={ref}
      className="relative bg-coal"
      style={{ height: '500vh' }}
    >
      {/* PINNED VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ━━━━ SKY ━━━━ */}
        <motion.div
          style={{ opacity: skyOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, #1A1410 0%, #2A1A14 25%, #5A3520 55%, #A8552A 78%, #E5A05A 95%, #2A1A14 100%)',
            }}
          />
          {/* Sun */}
          <motion.div
            style={{ y: sunY, opacity: sunOpacity }}
            className="absolute right-[10%] top-[28%] w-32 h-32 md:w-48 md:h-48 rounded-full"
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, #FFE0A0 0%, #FFB060 30%, transparent 70%)',
              }}
            />
            <div className="absolute inset-[32%] rounded-full bg-[#FFE0A0]" />
          </motion.div>
        </motion.div>

        {/* ━━━━ MID/FAR DUNES ━━━━ */}
        <motion.div
          style={{ y: duneY, opacity: skyOpacity, scale: sceneScale }}
          className="absolute inset-0"
        >
          <svg
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <linearGradient id="far-dune" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#5C3A24" />
                <stop offset="1" stopColor="#3A1F10" />
              </linearGradient>
              <linearGradient id="near-dune" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3A2418" />
                <stop offset="1" stopColor="#1A0F08" />
              </linearGradient>
            </defs>
            {/* Far dunes */}
            <path
              d="M 0,560 Q 200,520 400,540 T 800,530 T 1200,535 T 1600,560 L 1600,900 L 0,900 Z"
              fill="url(#far-dune)"
              opacity="0.85"
            />
            {/* Mid dunes */}
            <path
              d="M 0,620 Q 250,580 500,605 T 1000,595 T 1600,620 L 1600,900 L 0,900 Z"
              fill="url(#near-dune)"
            />
          </svg>
        </motion.div>

        {/* ━━━━ MAIN SCENE — VILLA + BUNKER ━━━━ */}
        <motion.div
          style={{ y: sceneY, scale: sceneScale }}
          className="absolute inset-0"
        >
          {/* Ground line — orange dashed survey marker */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.15, 0.3, 0.92, 1], [0, 1, 1, 0]) }}
            className="absolute left-0 right-0 top-[62%] pointer-events-none z-30"
          >
            <div className="relative w-full h-px overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left', borderTop: '1px dashed #FF6B1A', height: '1px' }}
                className="w-full"
              />
            </div>
            <div className="absolute left-6 -top-5 label text-orange tracking-[0.3em] text-[10px]">
              GRADE · 0.00m
            </div>
          </motion.div>

          {/* ━━━ VILLA SVG ━━━ */}
          <motion.div
            style={{ scale: villaScale, y: villaY, opacity: villaOpacity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <svg
              viewBox="0 0 800 400"
              className="w-[90%] md:w-[70%] max-w-4xl"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="villa-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1A1612" />
                  <stop offset="1" stopColor="#080604" />
                </linearGradient>
                <linearGradient id="window-glow-v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFD088" />
                  <stop offset="1" stopColor="#FF8830" />
                </linearGradient>
                <linearGradient id="brass-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#5C4A2F" stopOpacity="0.4" />
                  <stop offset="0.5" stopColor="#D4A574" />
                  <stop offset="1" stopColor="#5C4A2F" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Driveway terrace */}
              <rect x="180" y="330" width="440" height="6" fill="#2A2520" />
              {/* Pool */}
              <rect x="640" y="332" width="100" height="4" fill="#2A4A5A" />
              <rect x="640" y="332" width="100" height="2" fill="#5A8AA0" opacity="0.7" />

              {/* Palms */}
              <g transform="translate(120, 240)">
                <rect x="-1.5" y="0" width="3" height="90" fill="#1A0F08" />
                <g fill="#1A2A18">
                  <path d="M 0,0 Q -30,-15 -40,-30 Q -28,-22 -8,-10 Z" opacity="0.8" />
                  <path d="M 0,0 Q 30,-18 42,-32 Q 30,-22 10,-10 Z" opacity="0.8" />
                  <path d="M 0,0 Q -35,5 -48,8 Q -30,0 -10,-2 Z" opacity="0.7" />
                  <path d="M 0,0 Q 36,3 50,5 Q 32,-2 12,-2 Z" opacity="0.7" />
                </g>
              </g>
              <g transform="translate(700, 250)">
                <rect x="-1.5" y="0" width="3" height="80" fill="#1A0F08" />
                <g fill="#1A2A18">
                  <path d="M 0,0 Q -25,-12 -32,-26 Q -22,-20 -6,-10 Z" opacity="0.7" />
                  <path d="M 0,0 Q 25,-14 34,-28 Q 26,-20 10,-10 Z" opacity="0.7" />
                  <path d="M 0,0 Q -28,5 -38,8 Q -22,0 -8,-2 Z" opacity="0.6" />
                </g>
              </g>

              {/* Villa main volume */}
              <rect x="240" y="220" width="320" height="110" fill="url(#villa-fill)" />
              {/* Upper volume — set back */}
              <rect x="290" y="160" width="220" height="60" fill="url(#villa-fill)" />

              {/* Roof brass caps */}
              <rect x="240" y="218" width="320" height="2" fill="url(#brass-line)" />
              <rect x="290" y="158" width="220" height="2" fill="url(#brass-line)" />

              {/* Glowing window strip — ground floor */}
              <rect x="260" y="240" width="280" height="70" fill="url(#window-glow-v)" opacity="0.75" />
              {/* Mullions */}
              {[260, 320, 380, 440, 500].map((x) => (
                <line key={x} x1={x} y1="240" x2={x} y2="310" stroke="#0A0808" strokeWidth="1.5" />
              ))}
              <line x1="260" y1="240" x2="540" y2="240" stroke="#0A0808" strokeWidth="1.2" />
              <line x1="260" y1="310" x2="540" y2="310" stroke="#0A0808" strokeWidth="1.2" />

              {/* Upper window strip */}
              <rect x="305" y="180" width="190" height="32" fill="url(#window-glow-v)" opacity="0.7" />
              {[305, 365, 425, 495].map((x) => (
                <line key={x} x1={x} y1="180" x2={x} y2="212" stroke="#0A0808" strokeWidth="1.2" />
              ))}

              {/* Window glow halo */}
              <rect x="240" y="220" width="320" height="110" fill="#FFB060" opacity="0.06" />

              {/* Front entry — brass door */}
              <rect x="385" y="290" width="30" height="40" fill="#1A0F08" stroke="url(#brass-line)" strokeWidth="0.8" />
              <circle cx="408" cy="312" r="1.5" fill="#D4A574" />
            </svg>
          </motion.div>

          {/* ━━━ VERTICAL BRASS LINE — villa to bunker ━━━ */}
          <motion.div
            style={{ scaleY: lineScaleY }}
            className="absolute left-1/2 top-[62%] w-px h-[18vh] origin-top pointer-events-none z-20"
          >
            <div className="h-full w-full bg-gradient-to-b from-orange/80 via-[#A8854A] to-[#A8854A]/30" />
            <div className="absolute -left-1 top-0 w-3 h-3 -translate-x-1/2 rounded-full bg-orange" />
            <div className="absolute -left-1 bottom-0 w-2 h-2 -translate-x-1/2 rounded-full bg-[#A8854A]" />
          </motion.div>

          {/* ━━━ BUNKER SVG — below ground ━━━ */}
          <motion.div
            style={{ opacity: bunkerOpacity, y: bunkerY, scale: bunkerScale }}
            className="absolute inset-x-0 top-[68%] flex justify-center pointer-events-none"
          >
            <svg
              viewBox="0 0 1000 380"
              className="w-[92%] md:w-[78%] max-w-5xl"
              preserveAspectRatio="xMidYMin meet"
            >
              <defs>
                <linearGradient id="bunker-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0A0604" />
                  <stop offset="1" stopColor="#050302" />
                </linearGradient>
                <linearGradient id="brass-bunker" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#5C4A2F" />
                  <stop offset="0.5" stopColor="#D4A574" />
                  <stop offset="1" stopColor="#5C4A2F" />
                </linearGradient>
              </defs>

              {/* Outer shell */}
              <rect x="40" y="20" width="920" height="340" fill="url(#bunker-fill)" stroke="url(#brass-bunker)" strokeWidth="1.2" />
              {/* Inner liner */}
              <rect x="46" y="26" width="908" height="328" fill="none" stroke="#A8854A" strokeWidth="0.4" opacity="0.4" />
              {/* Mid-floor */}
              <line x1="46" y1="190" x2="954" y2="190" stroke="url(#brass-bunker)" strokeWidth="0.8" />
              {/* Upper dividers */}
              <line x1="350" y1="26" x2="350" y2="190" stroke="#A8854A" strokeWidth="0.5" opacity="0.7" />
              <line x1="700" y1="26" x2="700" y2="190" stroke="#A8854A" strokeWidth="0.5" opacity="0.7" />
              {/* Lower dividers */}
              <line x1="310" y1="190" x2="310" y2="354" stroke="#A8854A" strokeWidth="0.5" opacity="0.7" />
              <line x1="640" y1="190" x2="640" y2="354" stroke="#A8854A" strokeWidth="0.5" opacity="0.7" />

              {/* === UPPER ROOMS === */}
              {/* Master bed */}
              <g opacity="0.7">
                <rect x="120" y="140" width="160" height="35" fill="#3A2418" />
                <rect x="120" y="125" width="160" height="18" fill="#5C3A24" />
                <rect x="120" y="125" width="30" height="18" fill="#A8854A" opacity="0.7" />
                <rect x="100" y="130" width="14" height="40" fill="#A8854A" opacity="0.6" />
              </g>
              {/* Majlis */}
              <g opacity="0.7">
                <rect x="400" y="135" width="100" height="22" fill="#3A2418" />
                <ellipse cx="450" cy="132" rx="50" ry="7" fill="#5C3A24" />
                <ellipse cx="550" cy="155" rx="22" ry="6" fill="#A8854A" opacity="0.7" />
                <rect x="528" y="155" width="44" height="14" fill="#1A0F08" stroke="#A8854A" strokeWidth="0.5" />
                <rect x="600" y="135" width="100" height="22" fill="#3A2418" />
                <ellipse cx="650" cy="132" rx="50" ry="7" fill="#5C3A24" />
                {/* Hanging lantern */}
                <line x1="550" y1="30" x2="550" y2="100" stroke="#A8854A" strokeWidth="0.4" />
                <ellipse cx="550" cy="108" rx="9" ry="14" fill="#1A0F08" stroke="#A8854A" strokeWidth="0.6" />
                <ellipse cx="550" cy="108" rx="5" ry="9" fill="#FFB060" opacity="0.7" />
              </g>
              {/* Vault */}
              <g opacity="0.75">
                <rect x="770" y="100" width="60" height="70" fill="#0A0604" stroke="url(#brass-bunker)" strokeWidth="1" />
                <circle cx="800" cy="135" r="11" fill="none" stroke="url(#brass-bunker)" strokeWidth="0.6" />
                <circle cx="800" cy="135" r="3" fill="#A8854A" />
                <line x1="850" y1="115" x2="930" y2="115" stroke="#A8854A" strokeWidth="0.5" opacity="0.5" />
                <line x1="850" y1="140" x2="930" y2="140" stroke="#A8854A" strokeWidth="0.5" opacity="0.5" />
                <line x1="850" y1="165" x2="930" y2="165" stroke="#A8854A" strokeWidth="0.5" opacity="0.5" />
                {[855, 880, 905].map((x, i) => (
                  <rect key={i} x={x} y="105" width="14" height="8" fill="#FFD088" opacity="0.75" />
                ))}
              </g>

              {/* === LOWER ROOMS === */}
              {/* Provisioning */}
              <g opacity="0.65">
                {[210, 240, 270, 300].map((y, i) => (
                  <line key={i} x1="80" y1={y} x2="290" y2={y} stroke="#5C4A2F" strokeWidth="1.2" />
                ))}
                {[210, 240, 270].map((y) =>
                  [95, 120, 145, 170, 195, 220, 245, 270].map((x, i) => (
                    <rect key={y + '-' + i} x={x} y={y - 8} width="18" height="8" fill="#3A2418" />
                  ))
                )}
              </g>
              {/* Mechanical */}
              <g opacity="0.6">
                <rect x="370" y="220" width="50" height="100" fill="#0A0604" stroke="#5C4A2F" strokeWidth="0.6" />
                <rect x="440" y="240" width="60" height="80" fill="#0A0604" stroke="#5C4A2F" strokeWidth="0.6" />
                <rect x="520" y="220" width="50" height="100" fill="#0A0604" stroke="#5C4A2F" strokeWidth="0.6" />
                <rect x="595" y="245" width="35" height="75" fill="#0A0604" stroke="#5C4A2F" strokeWidth="0.6" />
                <circle cx="395" cy="250" r="8" fill="none" stroke="#A8854A" strokeWidth="0.5" />
                <circle cx="395" cy="250" r="4" fill="#FF6B1A" opacity="0.7" />
                <circle cx="470" cy="270" r="10" fill="none" stroke="#A8854A" strokeWidth="0.5" />
                <circle cx="470" cy="270" r="5" fill="#FFB060" opacity="0.6" />
                <circle cx="545" cy="250" r="8" fill="none" stroke="#A8854A" strokeWidth="0.5" />
                <circle cx="545" cy="250" r="4" fill="#FF6B1A" opacity="0.7" />
              </g>
              {/* Servers */}
              <g opacity="0.65">
                {[660, 690, 720, 750, 780, 810, 840, 870, 900, 930].map((x, i) => (
                  <g key={i}>
                    <rect x={x} y="210" width="22" height="120" fill="#0A0604" stroke="#5C4A2F" strokeWidth="0.4" />
                    {[225, 240, 255, 270, 285, 300, 315].map((ly, j) => (
                      <rect
                        key={j}
                        x={x + 3}
                        y={ly}
                        width="16"
                        height="2"
                        fill={j % 3 === 0 ? '#FF6B1A' : '#5C4A2F'}
                        opacity={j % 3 === 0 ? 0.85 : 0.5}
                      />
                    ))}
                  </g>
                ))}
              </g>

              {/* Brass corner ticks */}
              {[
                [40, 20],
                [960, 20],
                [40, 360],
                [960, 360],
              ].map(([cx, cy], i) => (
                <g key={i} stroke="url(#brass-bunker)" strokeWidth="1.2" fill="none">
                  <line x1={cx + (cx > 500 ? -10 : 10)} y1={cy} x2={cx + (cx > 500 ? -22 : 22)} y2={cy} />
                  <line x1={cx} y1={cy + (cy > 200 ? -10 : 10)} x2={cx} y2={cy + (cy > 200 ? -22 : 22)} />
                </g>
              ))}

              {/* Depth scale right */}
              <g fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#A8854A" letterSpacing="1.5">
                {[
                  { y: 30, l: '0.00m' },
                  { y: 110, l: '−5.00m' },
                  { y: 190, l: '−10.00m' },
                  { y: 270, l: '−15.00m' },
                  { y: 350, l: '−20.00m' },
                ].map((d, i) => (
                  <g key={i}>
                    <line x1="970" y1={d.y} x2="980" y2={d.y} stroke="#A8854A" strokeWidth="0.5" />
                    <text x="986" y={d.y + 3}>{d.l}</text>
                  </g>
                ))}
              </g>
            </svg>
          </motion.div>

          {/* Ground veil — covers bunker initially, peels away */}
          <motion.div
            style={{ clipPath: groundClip }}
            className="absolute inset-x-0 top-[62%] bottom-0 pointer-events-none z-10"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, #2A1810 0%, #1A0F08 40%, #050302 100%)',
              }}
            />
            {/* Soil texture lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={20 + i * 30}
                  x2="100%"
                  y2={20 + i * 30}
                  stroke="#3A2418"
                  strokeWidth="0.6"
                  opacity={0.5 - i * 0.03}
                />
              ))}
            </svg>
          </motion.div>
        </motion.div>

        {/* ━━━━ DARK VEIL ━━━━ */}
        <motion.div
          style={{ opacity: veilOpacity }}
          className="absolute inset-0 bg-coal pointer-events-none z-30"
        />
        {/* Vignette */}
        <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,3,2,0.85)_100%)]" />
        {/* Film grain */}
        <div
          className="absolute inset-0 z-30 pointer-events-none opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* ━━━━ TEXT FRAMES ━━━━ */}
        {/* Persistent UI: top status bar */}
        <div className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 pt-28 md:pt-32 pointer-events-none">
          <div className="grid grid-cols-12 gap-3 md:gap-6">
            <div className="col-span-6 md:col-span-3 label text-bone/45">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
                <span className="text-orange">CH · 0{frame + 1}</span>
              </div>
              <div className="mt-1.5 text-bone/30 tabular-nums">{time} UTC</div>
            </div>
            <div className="hidden md:block md:col-span-6 text-center">
              <FrameLabel frame={frame} />
            </div>
            <div className="col-span-6 md:col-span-3 label text-bone/45 md:text-right">
              <div className="text-bone/30">PROGRESS</div>
              <div className="mt-1.5 tabular-nums text-bone/70">
                {String(frame + 1).padStart(2, '0')} / 05
              </div>
            </div>
          </div>
        </div>

        {/* FRAME 1 — Establishment */}
        <motion.div
          style={{ opacity: f1 }}
          className="absolute inset-0 z-40 flex items-end pb-[20vh] md:pb-[24vh] px-6 md:px-16 pointer-events-none"
        >
          <div>
            <p className="label text-orange tracking-[0.35em] mb-5 md:mb-7">CHAPTER 01 · THE HORIZON</p>
            <h2 className="display text-bone text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl">
              Where the horizon ends,
              <br />
              <span className="italic text-pale">a new layer begins.</span>
            </h2>
          </div>
        </motion.div>

        {/* FRAME 2 — Residence */}
        <motion.div
          style={{ opacity: f2 }}
          className="absolute inset-0 z-40 flex items-end pb-[20vh] md:pb-[24vh] px-6 md:px-16 pointer-events-none"
        >
          <div>
            <p className="label text-orange tracking-[0.35em] mb-5 md:mb-7">CHAPTER 02 · THE RESIDENCE</p>
            <h2 className="display text-bone text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl">
              A villa.
              <br />
              <span className="italic text-pale">Indistinguishable from any other.</span>
            </h2>
            <p className="mt-6 max-w-md text-pale text-sm md:text-base leading-relaxed">
              Commissioned across Dubai, Riyadh, Doha, Abu Dhabi. Designed by your architect of record. Constructed in silence.
            </p>
          </div>
        </motion.div>

        {/* FRAME 3 — Reveal */}
        <motion.div
          style={{ opacity: f3 }}
          className="absolute inset-0 z-40 flex items-start pt-[18vh] md:pt-[22vh] px-6 md:px-16 pointer-events-none"
        >
          <div>
            <p className="label text-orange tracking-[0.35em] mb-5 md:mb-7">CHAPTER 03 · THE REVEAL</p>
            <h2 className="display text-bone text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl">
              But beneath every
              <br />
              <span className="italic text-pale">commission lies—</span>
            </h2>
          </div>
        </motion.div>

        {/* FRAME 4 — World beneath */}
        <motion.div
          style={{ opacity: f4 }}
          className="absolute inset-0 z-40 flex items-start pt-[16vh] md:pt-[20vh] px-6 md:px-16 pointer-events-none"
        >
          <div>
            <p className="label text-orange tracking-[0.35em] mb-5 md:mb-7">CHAPTER 04 · THE WORLD BENEATH</p>
            <h2 className="display text-bone text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl">
              A second residence.
              <br />
              <span className="italic text-pale">Permanent. Continuous.</span>
            </h2>
            <p className="mt-6 max-w-md text-pale text-sm md:text-base leading-relaxed">
              Engineered to military specification. Finished to the standard of a private gallery. Concealed from view, accessible only to those who hold the keys.
            </p>
          </div>
        </motion.div>

        {/* FRAME 5 — Mark + CTA */}
        <motion.div
          style={{ opacity: f5, scale: markScale }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 pointer-events-none"
        >
          <p className="label text-orange tracking-[0.4em] mb-8">A NEW LAYER OF LIVING</p>
          <div className="text-center mb-12 md:mb-16">
            <div className="display text-bone text-[18vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tight">
              MINUS
            </div>
            <div className="display text-bone italic text-[18vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tight -mt-[3vw] inline-flex items-baseline gap-[3vw]">
              <span className="block w-[7vw] md:w-[5vw] h-[0.6vw] bg-orange relative top-[-2vw]" />
              <span>1</span>
            </div>
          </div>
          <p className="text-pale text-base md:text-lg max-w-xl text-center mb-10 leading-relaxed">
            Concealed luxury infrastructure. Commissioned across the Gulf.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pointer-events-auto">
            <Magnetic strength={0.2}>
              <a
                href="#bunkers"
                className="label bg-orange text-ink px-6 py-3.5 hover:bg-orange-bright transition-colors inline-flex items-center gap-3"
              >
                Explore the Estates <span>→</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.15}>
              <button
                onClick={openConcierge}
                className="label border border-bone/40 text-bone px-6 py-3.5 hover:border-orange hover:text-orange transition-all"
              >
                Concierge
              </button>
            </Magnetic>
          </div>
        </motion.div>

        {/* Chapter progress dots — right side */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`label transition-all duration-500 ${
                  frame === i ? 'text-orange opacity-100' : 'text-bone/30 opacity-60'
                }`}
              >
                0{i + 1}
              </span>
              <span
                className={`block h-px transition-all duration-500 ${
                  frame === i ? 'w-12 bg-orange' : 'w-6 bg-bone/30'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Scroll cue — bottom — fades after frame 1 */}
        <motion.div
          style={{ opacity: f1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="label text-bone/50 flex flex-col items-center gap-3">
            <span className="tracking-[0.3em]">SCROLL · DESCEND</span>
            <motion.svg
              viewBox="0 0 12 24"
              className="w-3 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <line x1="6" y1="2" x2="6" y2="20" />
              <polyline points="2 16 6 20 10 16" />
            </motion.svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FrameLabel({ frame }) {
  const labels = [
    'THE HORIZON',
    'THE RESIDENCE',
    'THE REVEAL',
    'THE WORLD BENEATH',
    'THE MARK',
  ];
  return (
    <div className="label text-bone/50">
      <div className="text-bone/30">CHAPTER</div>
      <motion.div
        key={frame}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-1.5 text-orange/80"
      >
        {labels[frame]}
      </motion.div>
    </div>
  );
}
