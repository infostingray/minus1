import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Same hero image — preloader is a glimpse of where you're descending into. */
const PRELOAD_IMAGE =
  'https://images.unsplash.com/photo-1624664929067-5bc278a7c57e?w=2400&q=88&auto=format&fit=crop';

export default function Preloader({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const start = performance.now();
    const total = 2000;
    let raf;
    const tick = () => {
      const p = Math.min((performance.now() - start) / total, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setStage(1);
        setTimeout(() => {
          setStage(2);
          setTimeout(() => onComplete?.(), 750);
        }, 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

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

  const depth = (progress * 0.15).toFixed(2);

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] bg-coal overflow-hidden"
        >
          {/* Same photo as hero, heavily darkened — glimpse into the interior */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, #5A3A28 0%, #2A1A14 50%, #0F0F0F 100%)',
              }}
            />
            <motion.img
              src={PRELOAD_IMAGE}
              alt=""
              initial={{ scale: 1.15 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'brightness(0.45) contrast(1.15) saturate(0.85)',
              }}
            />
            {/* Heavy darken — preloader is darker than hero */}
            <div className="absolute inset-0 bg-ink/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(15,15,15,0.85)_100%)]" />
          </div>

          {/* Wipe out at end */}
          {stage === 1 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
              style={{ transformOrigin: 'bottom' }}
              className="absolute inset-0 bg-ink z-20"
            />
          )}

          {/* CONTENT */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* TOP UI — matches hero */}
            <div className="px-6 md:px-12 pt-8 md:pt-10 grid grid-cols-12 gap-3 md:gap-6">
              <div className="col-span-6 md:col-span-3 label text-bone/50">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
                  <span className="text-orange">SYS · BOOT</span>
                </div>
                <div className="mt-1.5 text-bone/30 tabular-nums">{time} UTC</div>
              </div>
              <div className="hidden md:block md:col-span-3 label text-bone/50">
                <div className="text-bone/30">CHANNEL</div>
                <div className="mt-1.5">SECURE / TIER I</div>
              </div>
              <div className="hidden md:block md:col-span-3 label text-bone/50">
                <div className="text-bone/30">DEPTH</div>
                <div className="mt-1.5 text-orange tabular-nums">−{depth}m</div>
              </div>
              <div className="col-span-6 md:col-span-3 label text-bone/50 md:text-right">
                <div className="text-bone/30">SITE</div>
                <div className="mt-1.5 tabular-nums">MNS-1 / ARCHIVE</div>
              </div>
            </div>

            {/* CENTER — counter + brand */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
              {/* Vertical pour from top — matches Begin/Hero accent style */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformOrigin: 'top' }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[40vh] bg-orange/40"
              />

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="label text-orange mb-8 flex items-center gap-4"
              >
                <span className="w-8 h-px bg-orange" />
                <span>ESTABLISHING SECURE CHANNEL</span>
                <span className="w-8 h-px bg-orange" />
              </motion.div>

              {/* Massive percentage */}
              <div className="display text-bone text-7xl md:text-9xl lg:text-[12rem] tabular-nums leading-none mb-4">
                {String(progress).padStart(3, '0')}
              </div>
              <div className="label text-bone/40">/ 100 PERCENT</div>

              {/* Progress hairline */}
              <div className="mt-12 w-full max-w-sm h-px bg-bone/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-orange"
                  style={{ width: progress + '%' }}
                />
              </div>
            </div>

            {/* BOTTOM — matches hero bottom bar */}
            <div className="px-6 md:px-12 pb-10 grid grid-cols-12 gap-3 md:gap-6 items-end">
              <div className="col-span-6 md:col-span-3 label text-bone/40">
                <div className="text-bone/25">CLEARANCE</div>
                <div className="mt-1.5 text-bone/70">PENDING</div>
              </div>
              <div className="hidden md:flex md:col-span-6 items-center justify-center gap-4">
                <span className="h-px w-12 bg-bone/15" />
                <span className="label text-bone/40">MMXXVI</span>
                <span className="h-px w-12 bg-bone/15" />
              </div>
              <div className="col-span-6 md:col-span-3 label text-bone/40 md:text-right">
                <div className="text-bone/25">ENGINEERED</div>
                <div className="mt-1.5 text-bone/70">DUBAI · UAE</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
