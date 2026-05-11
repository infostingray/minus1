import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Magnetic from './Magnetic';

/* Cinematic GCC plates — verified Unsplash photo IDs. */
const PLATES = [
  {
    url: 'https://images.unsplash.com/photo-1706464662649-5b075ef6e5af?w=2400&q=90&auto=format&fit=crop',
    label: 'EMPTY QUARTER · ABU DHABI',
    coords: '23.1417° N · 53.5500° E',
    sector: 'SECTOR I / VAULT',
  },
  {
    url: 'https://images.unsplash.com/photo-1637935142056-03d421b2b13c?w=2400&q=90&auto=format&fit=crop',
    label: 'AL QUDRA · DUBAI',
    coords: '24.7980° N · 55.3540° E',
    sector: 'SECTOR II / CITADEL',
  },
  {
    url: 'https://images.unsplash.com/photo-1624664929067-5bc278a7c57e?w=2400&q=90&auto=format&fit=crop',
    label: 'LIWA OASIS · GOLDEN HOUR',
    coords: '22.6444° N · 53.7794° E',
    sector: 'SECTOR III / ARK',
  },
  {
    url: 'https://images.unsplash.com/photo-1637935068558-a1f39612620d?w=2400&q=90&auto=format&fit=crop',
    label: 'RUB AL KHALI · DUSK',
    coords: '21.7900° N · 52.4500° E',
    sector: 'SECTOR IV / BESPOKE',
  },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const [time, setTime] = useState('');
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Mouse parallax — smooth
  const mouseX = useSpring(0, { stiffness: 60, damping: 20, mass: 0.5 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 20, mass: 0.5 });
  const tx = useTransform(mouseX, (v) => `${v * 18}px`);
  const ty = useTransform(mouseY, (v) => `${v * 14}px`);

  // Scroll-linked overlay fade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.15]);

  // Auto-advance carousel
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % PLATES.length);
    }, 8000);
    return () => clearInterval(id);
  }, [paused]);

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

  // Mouse parallax tracking
  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  const plate = PLATES[idx];
  const openConcierge = () => window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-coal overflow-hidden"
    >
      {/* ───── CINEMATIC PHOTO LAYER ───── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={plate.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* Fallback warm gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 60% 45%, #C57A3A 0%, #6B3B1F 38%, #2A1A14 70%, #0F0F0F 100%)',
              }}
            />
            {/* Photo with subtle parallax + slow zoom + Ken Burns */}
            <motion.div
              className="absolute -inset-8"
              style={{ x: tx, y: ty, scale: imgScale }}
            >
              <motion.img
                src={plate.url}
                alt=""
                draggable={false}
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 22, ease: 'linear' }}
                className="w-full h-full object-cover select-none"
                style={{
                  filter: 'brightness(0.78) contrast(1.08) saturate(0.95)',
                }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* atmospheric overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(15,15,15,0.7)_100%)]" />
        {/* warm bottom haze */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange/10 to-transparent mix-blend-overlay" />
        {/* grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

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
              <span className="text-orange">SCOUTING · LIVE</span>
            </div>
            <div className="mt-1.5 text-bone/30 tabular-nums">{time} UTC</div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={plate.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.6 }}
              className="hidden md:block md:col-span-6 text-center label text-bone/50"
            >
              <div className="text-orange/80">{plate.label}</div>
              <div className="text-bone/30 tabular-nums mt-1">{plate.coords}</div>
            </motion.div>
          </AnimatePresence>
          <div className="col-span-6 md:col-span-3 label text-bone/50 md:text-right">
            <div className="text-bone/30">PLATE</div>
            <div className="mt-1.5 tabular-nums">
              {String(idx + 1).padStart(2, '0')} / {String(PLATES.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* CENTER */}
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
                  style={{ textShadow: '0 8px 60px rgba(0,0,0,0.65)' }}
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
                  style={{ textShadow: '0 8px 60px rgba(0,0,0,0.65)' }}
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
                <p className="text-bone/85 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md">
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

        {/* BOTTOM — plate selector + meta */}
        <div className="px-6 md:px-12 pb-12 md:pb-16 pointer-events-auto">
          <div className="grid grid-cols-12 gap-3 md:gap-6 items-end">
            {/* PLATE DOTS */}
            <div
              className="col-span-12 md:col-span-6 flex items-center gap-2"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {PLATES.map((p, i) => (
                <button
                  key={p.url}
                  onClick={() => setIdx(i)}
                  className="group flex flex-col items-start gap-1.5 py-2"
                  aria-label={'Plate ' + (i + 1)}
                >
                  <span
                    className={`block h-px transition-all duration-700 ${
                      i === idx ? 'w-12 bg-orange' : 'w-6 bg-bone/30 group-hover:bg-bone/60'
                    }`}
                  />
                  <span
                    className={`label transition-colors ${
                      i === idx ? 'text-bone/80' : 'text-bone/30 group-hover:text-bone/50'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-6 md:text-right">
              <AnimatePresence mode="wait">
                <motion.div
                  key={plate.sector}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.5 }}
                  className="label text-bone/40"
                >
                  <div className="text-bone/30">SECTOR</div>
                  <div className="mt-1.5 text-orange/80">{plate.sector}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MARQUEE */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-bone/10 bg-coal/80 backdrop-blur-md overflow-hidden">
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
