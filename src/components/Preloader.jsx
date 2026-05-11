import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [time, setTime] = useState('');

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
        }, 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        String(d.getUTCHours()).padStart(2, '0') +
          ':' +
          String(d.getUTCMinutes()).padStart(2, '0')
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at center, #1A100A 0%, #050302 70%)',
          }}
        >
          {/* Wipe out */}
          {stage === 1 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
              style={{ transformOrigin: 'bottom' }}
              className="absolute inset-0 bg-coal z-50"
            />
          )}

          {/* Film grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* TOP — minimal status */}
          <div className="absolute top-0 left-0 right-0 px-6 md:px-12 pt-10 grid grid-cols-12 gap-6">
            <div className="col-span-6 label text-bone/45">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
                <span className="text-orange">SECURE CHANNEL</span>
              </div>
              <div className="mt-1.5 text-bone/30 tabular-nums">{time} UTC</div>
            </div>
            <div className="col-span-6 label text-bone/45 text-right">
              <div className="text-bone/30">MMXXVI</div>
              <div className="mt-1.5 text-bone/70">DUBAI · UAE</div>
            </div>
          </div>

          {/* CENTER */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            {/* Vertical brass pour from top */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: 'top' }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[35vh]"
            >
              <div className="w-full h-full bg-gradient-to-b from-orange/80 to-[#A8854A]/30" />
            </motion.div>

            {/* Brand wordmark — small, refined */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="display text-bone text-2xl md:text-3xl tracking-[0.4em] mb-2"
            >
              MINUS
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="display italic text-bone text-2xl md:text-3xl tracking-[0.4em] inline-flex items-baseline gap-3 mb-14"
            >
              <span className="block w-6 h-px bg-orange" />
              <span>1</span>
            </motion.div>

            {/* Progress hairline */}
            <div className="w-full max-w-xs h-px bg-bone/10 relative overflow-hidden mb-4">
              <motion.div
                className="absolute inset-y-0 left-0 bg-orange"
                style={{ width: progress + '%' }}
              />
            </div>
            <div className="label text-bone/40 tabular-nums">
              {String(progress).padStart(3, '0')} / 100
            </div>
          </div>

          {/* BOTTOM — tagline */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10 flex justify-between items-end">
            <div className="label text-bone/40">
              <div className="text-bone/25">ESTABLISHING</div>
              <div className="mt-1.5">A NEW LAYER OF LIVING</div>
            </div>
            <div className="label text-bone/40 text-right">
              <div className="text-bone/25">CLEARANCE</div>
              <div className="mt-1.5 text-orange/80">PENDING</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
