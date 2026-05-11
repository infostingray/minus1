import { useRef, useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

const HeroScene = lazy(() => import('./HeroScene'));

const HOTSPOTS = [
  { id: 'hatch', label: 'Reinforced Hatch', spec: 'AR500 Â· airtight seal' },
  { id: 'shaft', label: 'Access Shaft', spec: '4-factor biometric' },
  { id: 'ribs', label: 'Structural Ribs', spec: 'Blast-rated frame' },
  { id: 'core', label: 'Living Core', spec: '180-day autonomy' },
  { id: 'vent', label: 'NBC Filtration', spec: 'Swiss VA-40 system' },
];

export default function Hero() {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [time, setTime] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 4500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen bg-coal overflow-hidden">
      {/* 3D CANVAS */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-coal" />}>
          <HeroScene onHotspot={setActiveHotspot} />
        </Suspense>
      </div>

      {/* VIGNETTE */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(15,15,15,0.7)_100%)]" />

      {/* CONTENT OVERLAY */}
      <div className="relative z-20 min-h-screen flex flex-col pointer-events-none">
        {/* TOP METADATA */}
        <div className="px-6 md:px-12 pt-28 md:pt-32 grid grid-cols-12 gap-4">
          <div className="col-span-6 md:col-span-3 label text-bone/40">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
              <span className="text-orange">SYS Â· LIVE</span>
            </div>
            <div className="mt-2 text-bone/30 tabular-nums">{time} UTC</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/40">
            <div className="text-bone/25">SECTION</div>
            <div className="mt-2">N° 01 / Genesis</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/40">
            <div className="text-bone/25">VIEWING</div>
            <div className="mt-2">MNS-1 / VAULT</div>
          </div>
          <div className="col-span-6 md:col-span-3 label text-bone/40 md:text-right">
            <div className="text-bone/25">COORDINATES</div>
            <div className="mt-2 tabular-nums">25.2048° N Â· 55.2708° E</div>
          </div>
        </div>

        {/* CENTER STAGE */}
        <div className="flex-1 flex items-center px-6 md:px-12">
          <div className="w-full grid grid-cols-12 gap-6 items-end">
            {/* LEFT: WORDMARK */}
            <div className="col-span-12 md:col-span-7 lg:col-span-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="label text-orange mb-6 md:mb-8 flex items-center gap-4"
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                    transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-[18vw] md:text-[14vw] lg:text-[11vw] text-bone"
                  >
                    MINUS
                  </motion.span>
                </span>
                <span className="block overflow-hidden -mt-[2vw]">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[18vw] md:text-[14vw] lg:text-[11vw] text-bone italic inline-flex items-baseline gap-[2.5vw]"
                  >
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.9, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left' }}
                      className="block w-[8vw] h-[0.7vw] bg-orange relative top-[-3vw]"
                    />
                    <span>1</span>
                  </motion.span>
                </span>
              </h1>
            </div>

            {/* RIGHT: DESCRIPTION + CTAs */}
            <div className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-9 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-bone/80 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                  Subterranean residences engineered to military specification, finished to the standard of a private gallery. Commissioned. Concealed. Continuous.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Magnetic strength={0.2}>
                    <a
                      href="#bunkers"
                      className="label bg-orange text-ink px-5 py-3 hover:bg-orange-bright transition-colors inline-flex items-center gap-3"
                    >
                      Explore Bunkers
                      <span>→</span>
                    </a>
                  </Magnetic>
                  <Magnetic strength={0.15}>
                    <a
                      href="#contact"
                      className="label border border-bone/30 text-bone px-5 py-3 hover:border-orange hover:text-orange transition-all"
                    >
                      Private Brief
                    </a>
                  </Magnetic>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="px-6 md:px-12 pb-8 md:pb-12 grid grid-cols-12 gap-4 items-end">
          <div className="col-span-6 md:col-span-4 label text-bone/40">
            <div className="text-bone/25">INSPECT</div>
            <div className="mt-2 flex items-center gap-3 text-bone/70">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="12" r="3" />
                <path d="M3 12c3-5 7-7 9-7s6 2 9 7c-3 5-7 7-9 7s-6-2-9-7Z" />
              </svg>
              <span>DRAG · ORBIT · HOVER</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {activeHotspot ? (
              <motion.div
                key={activeHotspot.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="hidden md:block col-span-4 text-center"
              >
                <div className="label text-orange mb-1">{activeHotspot.label}</div>
                <div className="label text-bone/40">{activeHotspot.spec}</div>
              </motion.div>
            ) : (
              <div className="hidden md:flex col-span-4 items-center justify-center gap-3">
                <span className="h-px w-12 bg-bone/15" />
                <span className="label text-bone/30">N° 01 · VAULT</span>
                <span className="h-px w-12 bg-bone/15" />
              </div>
            )}
          </AnimatePresence>
          <div className="col-span-6 md:col-span-4 label text-bone/40 md:text-right">
            <div className="text-bone/25">TIER</div>
            <div className="mt-2 text-bone/70">CLEARANCE I — III</div>
          </div>
        </div>
      </div>

      {/* HINT BUBBLE */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 translate-y-[8vh] pointer-events-none"
          >
            <div className="flex items-center gap-2 label text-bone/60 bg-coal/70 backdrop-blur-md border border-bone/15 px-4 py-2">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-orange"
              />
              <span>Drag to inspect</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
