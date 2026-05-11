import { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from './Magnetic';

const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero() {
  const sectionRef = useRef(null);
  const [time, setTime] = useState('');
  const [sceneReady, setSceneReady] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
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
    // Mark scene ready after a beat to let it animate in
    const t = setTimeout(() => setSceneReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 6500);
    return () => clearTimeout(t);
  }, []);

  const openConcierge = () =>
    window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-coal overflow-hidden"
    >
      {/* Fallback gradient — visible during 3D load */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 60% 50%, #3A2418 0%, #1A100A 50%, #0A0604 100%)',
        }}
      />

      {/* ───── 3D SCENE ───── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: sceneReady ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10"
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </motion.div>

      {/* Atmospheric overlays */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-coal/30 via-transparent to-coal/50" />
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ───── UI OVERLAY ───── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-30 min-h-screen flex flex-col pointer-events-none"
      >
        {/* TOP */}
        <div className="px-6 md:px-12 pt-28 md:pt-32 grid grid-cols-12 gap-3 md:gap-6">
          <div className="col-span-6 md:col-span-3 label text-bone/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
              <span className="text-orange">MODEL · LIVE</span>
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
            <div className="text-bone/30">VIEW</div>
            <div className="mt-1.5 tabular-nums">SECTION 3D</div>
          </div>
        </div>

        {/* HEADLINE — upper-left */}
        <div className="px-6 md:px-12 pt-8 md:pt-12">
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

        <div className="flex-1" />

        {/* BOTTOM */}
        <div className="px-6 md:px-12 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="grid grid-cols-12 gap-4 items-end"
          >
            <div className="col-span-12 md:col-span-6 lg:col-span-5 pointer-events-auto">
              <p className="text-bone/85 text-sm md:text-base leading-relaxed mb-5 max-w-md">
                Each MINUS 1 estate begins as a private villa and continues underground — a concealed sanctuary engineered to military specification and finished to the standard of a private gallery.
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
                    Commission
                  </button>
                </Magnetic>
              </div>
            </div>
            <div className="hidden md:flex md:col-span-6 lg:col-span-7 justify-end items-end">
              <div className="label text-bone/40 text-right">
                <div className="text-bone/25">DRAG · ROTATE · ZOOM</div>
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
      {hintVisible && sceneReady && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, delay: 2 }}
          className="absolute z-40 top-[58%] left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="flex items-center gap-3 label text-bone bg-coal/80 backdrop-blur-md border border-orange/50 px-5 py-3">
            <motion.svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-orange"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              animate={{ rotate: [0, 25, -25, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3v18" strokeOpacity="0.3" />
              <path d="M8 8l8 8M16 8l-8 8" strokeOpacity="0.3" />
            </motion.svg>
            <span>DRAG TO ROTATE · SCROLL TO ZOOM</span>
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
