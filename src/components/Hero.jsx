import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from 'framer-motion';
import Magnetic from './Magnetic';

/* ONE photo — the bunker interior. Industrial concrete + luxury. Drag to look around. */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1754390755142-3b4b9ffbd1f3?w=3200&q=92&auto=format&fit=crop';

export default function Hero() {
  const sectionRef = useRef(null);
  const dragWrapRef = useRef(null);
  const [time, setTime] = useState('');
  const [hintVisible, setHintVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Drag values — free pan in both axes
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lastInteraction = useRef(Date.now());

  // Scroll-based fade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Time
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

  // Hide hint after first interaction or timeout
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hasInteracted) setHintVisible(false);
  }, [hasInteracted]);

  // Idle drift — slowly drift back to center if user hasn't interacted recently
  useEffect(() => {
    let raf;
    const loop = () => {
      const idle = Date.now() - lastInteraction.current > 2500;
      if (idle) {
        const t = Date.now() / 3000;
        const targetX = Math.sin(t) * 30;
        const targetY = Math.cos(t * 0.7) * 12;
        x.set(x.get() + (targetX - x.get()) * 0.015);
        y.set(y.get() + (targetY - y.get()) * 0.015);
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
      {/* ───── DRAGGABLE BUNKER INTERIOR ───── */}
      <motion.div
        ref={dragWrapRef}
        drag
        dragConstraints={{ left: -240, right: 240, top: -120, bottom: 120 }}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 80, bounceDamping: 18 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        style={{ x, y }}
        className="absolute -inset-32 md:-inset-40 z-0 cursor-grab active:cursor-grabbing touch-none"
      >
        {/* Fallback warm gradient — visible behind/while image loads */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, #5A3A28 0%, #2A1A14 50%, #0F0F0F 100%)',
          }}
        />
        {/* The photo — sized larger than viewport so drag reveals more */}
        <motion.img
          src={HERO_IMAGE}
          alt="MINUS 1 — interior"
          draggable={false}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 30, ease: 'linear' }}
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{
            filter: 'brightness(0.7) contrast(1.12) saturate(0.92)',
          }}
        />
      </motion.div>

      {/* Atmospheric overlays */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink/45 via-transparent to-ink/85" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,15,15,0.75)_100%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 z-10 bg-gradient-to-t from-orange/12 to-transparent mix-blend-overlay" />
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ───── CONTENT OVERLAY ───── */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="relative z-20 min-h-screen flex flex-col pointer-events-none"
      >
        {/* TOP UI */}
        <div className="px-6 md:px-12 pt-28 md:pt-32 grid grid-cols-12 gap-3 md:gap-6">
          <div className="col-span-6 md:col-span-3 label text-bone/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
              <span className="text-orange">INTERIOR · LIVE</span>
            </div>
            <div className="mt-1.5 text-bone/30 tabular-nums">{time} UTC</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">VIEWING</div>
            <div className="mt-1.5">VAULT — SUITE 01</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">DEPTH</div>
            <div className="mt-1.5 text-orange tabular-nums">−15.00m</div>
          </div>
          <div className="col-span-6 md:col-span-3 label text-bone/50 md:text-right">
            <div className="text-bone/30">SITE</div>
            <div className="mt-1.5 tabular-nums">GCC / SECTOR I</div>
          </div>
        </div>

        {/* CENTER STAGE */}
        <div className="flex-1 flex items-center px-6 md:px-12">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="label text-orange mb-6 md:mb-8 flex items-center gap-4"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="block w-12 h-px bg-orange"
              />
              <span>A NEW LAYER OF LIVING</span>
            </motion.div>

            <h1 className="display leading-[0.85] tracking-tight">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[20vw] md:text-[15vw] lg:text-[12vw] text-bone"
                  style={{ textShadow: '0 8px 60px rgba(0,0,0,0.7)' }}
                >
                  MINUS
                </motion.span>
              </span>
              <span className="block overflow-hidden -mt-[2.5vw]">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[20vw] md:text-[15vw] lg:text-[12vw] text-bone italic inline-flex items-baseline gap-[3vw] relative"
                  style={{ textShadow: '0 8px 60px rgba(0,0,0,0.7)' }}
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'left' }}
                    className="block w-[10vw] h-[0.8vw] bg-orange relative top-[-3.5vw]"
                  />
                  <span>1</span>
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 md:mt-14 grid grid-cols-12 gap-4 items-end"
            >
              <div className="col-span-12 md:col-span-6 lg:col-span-5 md:col-start-7 lg:col-start-8 pointer-events-auto">
                <p className="text-bone/90 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md">
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
            </motion.div>
          </div>
        </div>

        {/* BOTTOM UI */}
        <div className="px-6 md:px-12 pb-12 md:pb-16 pointer-events-none">
          <div className="grid grid-cols-12 gap-3 md:gap-6 items-end">
            <div className="col-span-6 md:col-span-3 label text-bone/40">
              <div className="text-bone/25">CLEARANCE</div>
              <div className="mt-1.5 text-bone/70">I — III</div>
            </div>
            <div className="hidden md:flex md:col-span-6 items-center justify-center gap-4">
              <span className="h-px w-12 bg-bone/15" />
              <span className="label text-bone/40">VAULT · DRAG TO LOOK</span>
              <span className="h-px w-12 bg-bone/15" />
            </div>
            <div className="col-span-6 md:col-span-3 label text-bone/40 md:text-right">
              <div className="text-bone/25">SCROLL</div>
              <div className="mt-1.5 text-bone/70 flex md:justify-end items-center gap-2">
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
        </div>
      </motion.div>

      {/* DRAG HINT */}
      {hintVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: 2.5 }}
          className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="flex items-center gap-3 label text-bone bg-coal/70 backdrop-blur-md border border-orange/40 px-5 py-3">
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
            <span>DRAG TO LOOK AROUND</span>
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
