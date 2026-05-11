import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Magnetic from './Magnetic';

/* Composite scene: luxury Arabian majlis interior — desert visible through the arched window. */
const DESERT_URL =
  'https://images.unsplash.com/photo-1624664929067-5bc278a7c57e?w=3200&q=92&auto=format&fit=crop';

export default function Hero() {
  const sectionRef = useRef(null);
  const [time, setTime] = useState('');
  const [hintVisible, setHintVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lastInteraction = useRef(Date.now());

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      setTime(h + ':' + m + ':' + s);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hasInteracted) setHintVisible(false);
  }, [hasInteracted]);

  // Idle drift
  useEffect(() => {
    let raf;
    const loop = () => {
      const idle = Date.now() - lastInteraction.current > 2500;
      if (idle) {
        const t = Date.now() / 4000;
        const targetX = Math.sin(t) * 22;
        const targetY = Math.cos(t * 0.7) * 10;
        x.set(x.get() + (targetX - x.get()) * 0.012);
        y.set(y.get() + (targetY - y.get()) * 0.012);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [x, y]);

  const handleDragStart = () => {
    setHasInteracted(true);
    lastInteraction.current = Date.now();
  };
  const handleDrag = () => {
    lastInteraction.current = Date.now();
  };

  const openConcierge = () =>
    window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-coal overflow-hidden select-none"
    >
      {/* SVG defs — Arabian arch clip path */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="arabian-arch" clipPathUnits="objectBoundingBox">
            <path d="M 0.04,1 L 0.04,0.32 C 0.04,0.14 0.22,0 0.5,0 C 0.78,0 0.96,0.14 0.96,0.32 L 0.96,1 Z" />
          </clipPath>
          <linearGradient id="brass-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E5C285" />
            <stop offset="0.4" stopColor="#A8854A" />
            <stop offset="1" stopColor="#5C4A2F" />
          </linearGradient>
          <linearGradient id="brass-inner" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8B6F47" stopOpacity="0" />
            <stop offset="0.5" stopColor="#D4A574" stopOpacity="0.5" />
            <stop offset="1" stopColor="#8B6F47" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* ─── DEEP INTERIOR BACKGROUND — warm dark majlis tones ─── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, #2A1810 0%, #1A100A 45%, #0A0604 100%)',
        }}
      />
      {/* Subtle warm color cast */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,107,26,0.15) 0%, transparent 60%)',
        }}
      />

      {/* ─── ARCHED WINDOW WITH DRAGGABLE DESERT ─── */}
      <div
        className="absolute z-10 inset-x-[6%] md:inset-x-[12%] lg:inset-x-[16%] top-[14%] md:top-[16%] bottom-[28%] md:bottom-[26%] overflow-hidden"
        style={{ clipPath: 'url(#arabian-arch)' }}
      >
        {/* Sky fallback inside the window */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #E8A65A 0%, #C57A3A 30%, #6B3B1F 70%, #2A1A14 100%)',
          }}
        />

        {/* Draggable desert image */}
        <motion.div
          drag
          dragConstraints={{ left: -180, right: 180, top: -100, bottom: 100 }}
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 80, bounceDamping: 18 }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          style={{ x, y }}
          className="absolute -inset-24 md:-inset-32 cursor-grab active:cursor-grabbing touch-none"
        >
          <motion.img
            src={DESERT_URL}
            alt="GCC desert"
            draggable={false}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 30, ease: 'linear' }}
            className="w-full h-full object-cover pointer-events-none"
            style={{
              filter:
                'brightness(0.92) contrast(1.08) saturate(1.18) sepia(0.12)',
            }}
          />
        </motion.div>

        {/* Heat haze + warm tone over desert */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange/15 via-transparent to-amber-900/10 mix-blend-overlay" />
        {/* Vignette inside window */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(20,10,5,0.65)_100%)]" />
      </div>

      {/* ─── BRASS TRIM TRACING THE ARCH ─── */}
      <svg
        className="absolute z-20 inset-x-[6%] md:inset-x-[12%] lg:inset-x-[16%] top-[14%] md:top-[16%] bottom-[28%] md:bottom-[26%] pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Outer brass trim */}
        <path
          d="M 4,100 L 4,32 C 4,14 22,0 50,0 C 78,0 96,14 96,32 L 96,100"
          stroke="url(#brass-grad)"
          strokeWidth="0.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: '1.5px', filter: 'drop-shadow(0 0 4px rgba(212,165,116,0.4))' }}
        />
        {/* Inner brass thin line */}
        <path
          d="M 6,100 L 6,33 C 6,16 23,2 50,2 C 77,2 94,16 94,33 L 94,100"
          stroke="url(#brass-inner)"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: '0.5px' }}
        />
      </svg>

      {/* ─── MAJLIS FOREGROUND — luxury cushions & brass lanterns ─── */}
      <div className="absolute z-20 inset-x-0 bottom-0 h-[32%] md:h-[30%] pointer-events-none">
        {/* Floor gradient — deep luxury Persian carpet feel */}
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background:
              'linear-gradient(to top, #0A0604 0%, rgba(42,24,16,0.95) 30%, rgba(42,24,16,0.6) 70%, transparent 100%)',
          }}
        />

        {/* Subtle Arabian pattern band */}
        <svg
          className="absolute bottom-[12%] inset-x-0 h-3 opacity-30"
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <g key={i} transform={`translate(${i * 20}, 0)`}>
              <path
                d="M 10,2 L 18,6 L 10,10 L 2,6 Z"
                fill="none"
                stroke="#A8854A"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </svg>

        {/* Low majlis cushions silhouettes */}
        <svg
          className="absolute bottom-0 inset-x-0 h-1/2 opacity-60"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          {/* Long cushion bench */}
          <rect x="0" y="60" width="1200" height="40" fill="#1A100A" />
          {/* Stacked pillows */}
          {[80, 240, 400, 560, 720, 880, 1040].map((cx, i) => (
            <g key={i}>
              <ellipse cx={cx} cy="55" rx="55" ry="14" fill="#3A2418" />
              <ellipse cx={cx} cy="50" rx="48" ry="10" fill="#5C3A24" opacity="0.7" />
            </g>
          ))}
        </svg>

        {/* Hanging brass lanterns left & right */}
        {[
          { side: 'left', x: '4%' },
          { side: 'right', x: '4%' },
        ].map((l, i) => (
          <div
            key={i}
            className={`absolute top-[-180%] md:top-[-200%] ${
              l.side === 'left' ? 'left-[6%]' : 'right-[6%]'
            } w-10 md:w-14`}
          >
            {/* Hanging cable */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 md:h-40 bg-gradient-to-b from-transparent via-amber-900/40 to-amber-700/50" />
            {/* Lantern body */}
            <motion.svg
              viewBox="0 0 60 90"
              className="absolute top-32 md:top-40 left-1/2 -translate-x-1/2 w-10 md:w-14 drop-shadow-[0_0_12px_rgba(255,180,80,0.4)]"
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Cap */}
              <path d="M 25,5 L 35,5 L 32,12 L 28,12 Z" fill="url(#brass-grad)" />
              {/* Body */}
              <path
                d="M 18,15 L 42,15 L 48,40 L 45,75 L 15,75 L 12,40 Z"
                fill="#1A100A"
                stroke="url(#brass-grad)"
                strokeWidth="1.5"
              />
              {/* Inner glow */}
              <ellipse cx="30" cy="45" rx="14" ry="22" fill="#FFB54A" opacity="0.45" />
              <ellipse cx="30" cy="45" rx="8" ry="14" fill="#FFE0A0" opacity="0.6" />
              {/* Cross detail */}
              <line x1="15" y1="45" x2="45" y2="45" stroke="url(#brass-grad)" strokeWidth="0.8" />
              <line x1="30" y1="18" x2="30" y2="73" stroke="url(#brass-grad)" strokeWidth="0.6" />
              {/* Bottom */}
              <path d="M 18,75 L 42,75 L 38,85 L 22,85 Z" fill="url(#brass-grad)" />
              <circle cx="30" cy="87" r="1.5" fill="url(#brass-grad)" />
            </motion.svg>
          </div>
        ))}
      </div>

      {/* ─── ATMOSPHERE OVERLAYS ─── */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-coal/30 via-transparent to-coal/40" />
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ─── CONTENT OVERLAY ─── */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="relative z-30 min-h-screen flex flex-col pointer-events-none"
      >
        {/* TOP UI */}
        <div className="px-6 md:px-12 pt-28 md:pt-32 grid grid-cols-12 gap-3 md:gap-6">
          <div className="col-span-6 md:col-span-3 label text-bone/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
              <span className="text-orange">MAJLIS · LIVE</span>
            </div>
            <div className="mt-1.5 text-bone/30 tabular-nums">{time} UTC</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">VIEWING</div>
            <div className="mt-1.5">CITADEL — SUITE 01</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">DEPTH</div>
            <div className="mt-1.5 text-orange tabular-nums">−15.00m</div>
          </div>
          <div className="col-span-6 md:col-span-3 label text-bone/50 md:text-right">
            <div className="text-bone/30">VIEW</div>
            <div className="mt-1.5">AL QUDRA · DUSK</div>
          </div>
        </div>

        {/* CENTER — smaller, more refined typography */}
        <div className="flex-1 flex flex-col justify-end px-6 md:px-12 pb-[34%] md:pb-[32%]">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="label text-orange mb-4 md:mb-5 flex items-center gap-4"
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

            <h1 className="display leading-[0.85] tracking-tight">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[13vw] md:text-[10vw] lg:text-[8vw] text-bone"
                  style={{ textShadow: '0 6px 40px rgba(0,0,0,0.7)' }}
                >
                  MINUS
                </motion.span>
              </span>
              <span className="block overflow-hidden -mt-[1.5vw]">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[13vw] md:text-[10vw] lg:text-[8vw] text-bone italic inline-flex items-baseline gap-[2.5vw] relative"
                  style={{ textShadow: '0 6px 40px rgba(0,0,0,0.7)' }}
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'left' }}
                    className="block w-[6vw] h-[0.55vw] bg-orange relative top-[-2.3vw]"
                  />
                  <span>1</span>
                </motion.span>
              </span>
            </h1>
          </div>
        </div>

        {/* BOTTOM CTAs — repositioned for new layout */}
        <div className="px-6 md:px-12 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7 }}
            className="grid grid-cols-12 gap-4 items-end pointer-events-none"
          >
            <div className="col-span-12 md:col-span-6 lg:col-span-5 pointer-events-auto">
              <p className="text-bone/90 text-sm md:text-base leading-relaxed mb-5 max-w-md">
                Subterranean residences engineered to military specification, finished to the standard of a private gallery. Commissioned across the Gulf.
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
                    className="label border border-bone/40 text-bone px-5 py-3 hover:border-orange hover:text-orange transition-all"
                  >
                    Concierge
                  </button>
                </Magnetic>
              </div>
            </div>
            <div className="hidden md:flex md:col-span-6 lg:col-span-7 justify-end items-end">
              <div className="label text-bone/40 text-right">
                <div className="text-bone/25">SCROLL</div>
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

      {/* DRAG HINT */}
      {hintVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: 2.5 }}
          className="absolute z-40 top-[42%] left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="flex items-center gap-3 label text-bone bg-coal/80 backdrop-blur-md border border-orange/50 px-5 py-3">
            <motion.svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-orange"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M8 12h8M8 12l3-3M8 12l3 3M16 12l-3-3M16 12l-3 3" />
            </motion.svg>
            <span>DRAG TO LOOK OUTSIDE</span>
          </div>
        </motion.div>
      )}

      {/* MARQUEE */}
      <div className="absolute bottom-0 left-0 right-0 z-40 border-t border-bone/10 bg-coal/85 backdrop-blur-md overflow-hidden">
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
