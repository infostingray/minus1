import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const total = 1800;
    let raf;
    const tick = () => {
      const p = Math.min((performance.now() - start) / total, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setStage(1);
        setTimeout(() => {
          setStage(2);
          setTimeout(() => onComplete?.(), 700);
        }, 400);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] bg-ink flex flex-col"
        >
          {/* TOP METADATA */}
          <div className="flex justify-between px-6 md:px-12 pt-8 label text-bone/40">
            <span>SYS · BOOT</span>
            <span>MNS-1 / ARCHIVE</span>
          </div>

          {/* CENTER */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Vertical pour from top */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: stage === 0 ? 1 : 0 }}
              transition={{ duration: 1.8, ease: [0.83, 0, 0.17, 1] }}
              style={{ transformOrigin: 'top' }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-orange/60"
            />

            {/* Counter */}
            <div className="relative flex flex-col items-center gap-6">
              <div className="label text-bone/40">DESCENDING</div>
              <div className="display text-bone text-7xl md:text-9xl tabular-nums leading-none">
                {String(progress).padStart(3, '0')}
              </div>
              <div className="label text-orange">−{(progress * 0.6).toFixed(2)}m</div>
            </div>

            {/* Wipe out — vertical bars closing in from sides */}
            {stage === 1 && (
              <>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
                  style={{ transformOrigin: 'left' }}
                  className="absolute inset-0 bg-ink z-10"
                />
              </>
            )}
          </div>

          {/* BOTTOM METADATA */}
          <div className="flex justify-between px-6 md:px-12 pb-8 label text-bone/40">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
              ESTABLISHING SECURE CHANNEL
            </span>
            <span>{progress}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
