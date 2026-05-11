import { useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

const BunkerInterior = lazy(() => import('./BunkerInterior'));

export default function Hero() {
  const [time, setTime] = useState('');
  const [hintVisible, setHintVisible] = useState(true);

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
    const t = setTimeout(() => setHintVisible(false), 5500);
    return () => clearTimeout(t);
  }, []);

  const openConcierge = () =>
    window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <section className="relative min-h-screen bg-coal overflow-hidden">
      {/* 3D BUNKER INTERIOR — fills the viewport */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-coal via-ink to-coal" />
          }
        >
          <BunkerInterior />
        </Suspense>
      </div>

      {/* Vignette — subtle darkening at edges */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(15,15,15,0.55)_100%)]" />

      {/* CONTENT */}
      <div className="relative z-20 min-h-screen flex flex-col pointer-events-none">
        {/* TOP UI BAR */}
        <div className="px-6 md:px-12 pt-28 md:pt-32 grid grid-cols-12 gap-4">
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
            <div className="text-bone/30">COORDINATES</div>
            <div className="mt-1.5 tabular-nums">25.2048° N · 55.2708° E</div>
          </div>
        </div>

        {/* CENTER — leave space for the room to be the hero */}
        <div className="flex-1" />

        {/* BOTTOM TYPOGRAPHY + CTAs */}
        <div className="px-6 md:px-12 pb-12 md:pb-16 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="label text-orange mb-4 flex items-center gap-4"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
              className="block w-10 h-px bg-orange"
            />
            <span>A NEW LAYER OF LIVING</span>
          </motion.div>

          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <h1 className="display leading-[0.85] tracking-tight">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[14vw] md:text-[10vw] lg:text-[8vw] text-bone"
                  style={{ textShadow: '0 6px 40px rgba(0,0,0,0.7)' }}
                >
                  MINUS&nbsp;
                  <span className="italic relative">
                    1
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left' }}
                      className="absolute left-[-0.6em] top-[0.45em] w-[0.5em] h-[0.06em] bg-orange"
                    />
                  </span>
                </motion.span>
              </h1>
            </div>

            <div className="col-span-12 md:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-bone/85 text-base md:text-lg leading-relaxed mb-6 max-w-md">
                  Subterranean residences engineered to military specification, finished to the standard of a private gallery.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Magnetic strength={0.2}>
                    <a
                      href="#bunkers"
                      className="label bg-orange text-ink px-5 py-3 hover:bg-orange-bright transition-colors inline-flex items-center gap-3"
                    >
                      Explore
                      <span>→</span>
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* HINT BUBBLE */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
            className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="flex items-center gap-2 label text-bone/70 bg-coal/70 backdrop-blur-md border border-bone/15 px-4 py-2">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-orange"
              />
              <span>DRAG TO LOOK AROUND</span>
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
