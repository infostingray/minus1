import { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

const DustOverlay = lazy(() => import('./DustOverlay'));

/* OUTSIDE VIEW IMAGES â cinematic landscapes that play through the slit.
   Hosted on Unsplash CDN. If any 404, the gradient fallback covers it. */
const OUTSIDE_VIEWS = [
  {
    url: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=2400&q=85&auto=format&fit=crop',
    label: 'EMPTY QUARTER Â· DUSK',
    coords: '23.1417° N Â· 53.5500° E',
  },
  {
    url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=2400&q=85&auto=format&fit=crop',
    label: 'NORTHERN RIDGE Â· WINTER',
    coords: '46.5197° N Â· 6.6323° E',
  },
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2400&q=85&auto=format&fit=crop',
    label: 'LIWA OASIS Â· GOLDEN HOUR',
    coords: '22.6444° N Â· 53.7794° E',
  },
];

export default function Hero() {
  const containerRef = useRef(null);
  const [time, setTime] = useState('');
  const [viewIndex, setViewIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // cycle through views
  useEffect(() => {
    const id = setInterval(() => {
      setViewIndex((i) => (i + 1) % OUTSIDE_VIEWS.length);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // timecode
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

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const view = OUTSIDE_VIEWS[viewIndex];

  const openConcierge = () => window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <section ref={containerRef} className="relative min-h-screen bg-coal overflow-hidden">
      {/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
         OUTSIDE VIEW â the landscape through the glass
         ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={view.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0"
              style={{ scale: imageScale, y: imageY }}
            >
              {/* CSS fallback gradient lives underneath */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at 70% 45%, #C57A3A 0%, #6B3B1F 35%, #2A1A14 65%, #0F0F0F 100%)',
                }}
              />
              <img
                src={view.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.75) contrast(1.08) saturate(0.92)' }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* atmospheric overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,15,15,0.65)_100%)]" />
        {/* warm bottom haze */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange/8 to-transparent mix-blend-overlay pointer-events-none" />
      </div>

      {/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
         INTERIOR FRAMING â top concrete lintel + bottom sill
         ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      {/* TOP LINTEL */}
      <div className="absolute top-0 left-0 right-0 z-10 h-[28vh] md:h-[22vh] pointer-events-none">
        {/* concrete fill */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-transparent" />
        {/* texture */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E')",
          }}
        />
        {/* bottom edge â bevelled metal */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-bone/20" />
        <div className="absolute bottom-[3px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange/60 to-transparent" />
        {/* tiny rivets */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6 md:px-12 opacity-50">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-bone/30" />
          ))}
        </div>
      </div>

      {/* BOTTOM SILL */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-[36vh] md:h-[30vh] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/95 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E')",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-bone/20" />
        <div className="absolute top-[3px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange/60 to-transparent" />
        <div className="absolute top-6 left-0 right-0 flex justify-between px-6 md:px-12 opacity-50">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-bone/30" />
          ))}
        </div>
      </div>

      {/* SIDE FADES â subtle bunker depth at edges */}
      <div className="absolute top-0 bottom-0 left-0 w-[12vw] z-10 bg-gradient-to-r from-ink/80 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-[12vw] z-10 bg-gradient-to-l from-ink/80 to-transparent pointer-events-none" />

      {/* GLASS REFLECTION SCAN â thin horizontal scan moving slowly */}
      <div className="absolute top-[28vh] md:top-[22vh] bottom-[36vh] md:bottom-[30vh] left-0 right-0 z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-bone/20 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* DUST PARTICLES inside the bunker (in front of glass) */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        <Suspense fallback={null}>
          <DustOverlay />
        </Suspense>
      </div>

      {/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
         CONTENT OVERLAY
         ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="relative z-20 min-h-screen flex flex-col"
      >
        {/* TOP UI BAR (inside lintel) */}
        <div className="px-6 md:px-12 pt-8 md:pt-10 grid grid-cols-12 gap-3 md:gap-6 items-center">
          <div className="col-span-6 md:col-span-3 label text-bone/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
              <span className="text-orange">OBSERVATION Â· LIVE</span>
            </div>
            <div className="mt-1 text-bone/30 tabular-nums">{time} UTC</div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={view.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.6 }}
              className="hidden md:block md:col-span-6 text-center label text-bone/50"
            >
              <div className="text-orange/80">{view.label}</div>
              <div className="text-bone/30 tabular-nums mt-1">{view.coords}</div>
            </motion.div>
          </AnimatePresence>
          <div className="col-span-6 md:col-span-3 label text-bone/60 md:text-right">
            <div className="text-bone/40">DEPTH</div>
            <div className="mt-1 text-orange tabular-nums">â15.00m</div>
          </div>
        </div>

        {/* CENTER STAGE â typography + CTAs */}
        <div className="flex-1 flex items-center px-6 md:px-12">
          <div className="w-full">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="label text-orange mb-6 flex items-center gap-4"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="block w-12 h-px bg-orange"
              />
              <span>A NEW LAYER OF LIVING</span>
            </motion.div>

            {/* MINUS 1 */}
            <h1 className="display leading-[0.85] tracking-tight">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-[20vw] md:text-[15vw] lg:text-[12vw] text-bone"
                  style={{ textShadow: '0 8px 60px rgba(0,0,0,0.6)' }}
                >
                  MINUS
                </motion.span>
              </span>
              <span className="block overflow-hidden -mt-[2vw]">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[20vw] md:text-[15vw] lg:text-[12vw] text-bone italic inline-flex items-baseline gap-[3vw]"
                  style={{ textShadow: '0 8px 60px rgba(0,0,0,0.6)' }}
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: 'left' }}
                    className="block w-[10vw] h-[0.8vw] bg-orange relative top-[-3.5vw]"
                  />
                  <span>1</span>
                </motion.span>
              </span>
            </h1>

            {/* Description + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 md:mt-12 grid grid-cols-12 gap-4 items-end"
            >
              <div className="col-span-12 md:col-span-5 md:col-start-7 lg:col-start-8">
                <p className="text-bone/85 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md">
                  Subterranean residences engineered to military specification, finished to the standard of a private gallery. Commissioned. Concealed. Continuous.
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
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM UI (inside sill) */}
        <div className="px-6 md:px-12 pb-8 md:pb-10 grid grid-cols-12 gap-3 md:gap-6 items-end">
          <div className="col-span-6 md:col-span-3 label text-bone/60">
            <div className="text-bone/40">SECTOR</div>
            <div className="mt-1 text-bone/80">N° 01 / GENESIS</div>
          </div>
          <div className="hidden md:flex md:col-span-6 items-center justify-center gap-4">
            <span className="h-px w-12 bg-bone/15" />
            <span className="label text-bone/40">VIEW · EAST</span>
            <span className="h-px w-12 bg-bone/15" />
          </div>
          <div className="col-span-6 md:col-span-3 label text-bone/60 md:text-right">
            <div className="text-bone/40">CLEARANCE</div>
            <div className="mt-1 text-bone/80">I — III</div>
          </div>
        </div>
      </motion.div>

      {/* HINT */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, delay: 2.8 }}
            className="absolute z-30 bottom-[38vh] md:bottom-[33vh] left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <div className="flex items-center gap-2 label text-bone/60 bg-coal/60 backdrop-blur-md border border-bone/15 px-3 py-1.5">
              <motion.span
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-orange"
              />
              <span>SCROLL TO DESCEND</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
