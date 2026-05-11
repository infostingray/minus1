import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SplitText from './SplitText';

/* Cinematic photography of finished MINUS 1 environments.
   Sourced from Unsplash CDN — swap with bespoke photography as portfolio grows. */
const PLATES = [
  {
    url: 'https://images.unsplash.com/photo-1754390755142-3b4b9ffbd1f3?w=1600&q=85&auto=format&fit=crop',
    title: 'Reception',
    location: 'Citadel · Suite II',
    tag: 'INTERIOR',
    aspect: 'aspect-[4/5]',
    span: 'md:col-span-5 md:row-span-2',
  },
  {
    url: 'https://images.unsplash.com/photo-1759196450910-c44faf7abcdf?w=1600&q=85&auto=format&fit=crop',
    title: 'Living Core',
    location: 'Vault Configuration',
    tag: 'LIVING',
    aspect: 'aspect-[5/4]',
    span: 'md:col-span-7',
  },
  {
    url: 'https://images.unsplash.com/photo-1752756571709-8fb6032239ad?w=1600&q=85&auto=format&fit=crop',
    title: 'The Atrium',
    location: 'Ark · Central Volume',
    tag: 'SPACE',
    aspect: 'aspect-square',
    span: 'md:col-span-4',
  },
  {
    url: 'https://images.unsplash.com/photo-1741524915248-d3a727ee6fce?w=1600&q=85&auto=format&fit=crop',
    title: 'Threshold',
    location: 'Concealed Entry',
    tag: 'PORTAL',
    aspect: 'aspect-[5/4]',
    span: 'md:col-span-3',
  },
  {
    url: 'https://images.unsplash.com/photo-1774270906132-86218bf92158?w=1600&q=85&auto=format&fit=crop',
    title: 'Verdant',
    location: 'Provisioning · Hydroponic',
    tag: 'CULTIVATION',
    aspect: 'aspect-[4/3]',
    span: 'md:col-span-7',
  },
  {
    url: 'https://images.unsplash.com/photo-1741524915506-c009e15f55cc?w=1600&q=85&auto=format&fit=crop',
    title: 'The Atrium Dome',
    location: 'Surface Companion',
    tag: 'CANOPY',
    aspect: 'aspect-[4/3]',
    span: 'md:col-span-5',
  },
];

function Plate({ plate, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden bg-coal ${plate.span} ${plate.aspect}`}
    >
      {/* image with parallax y */}
      <motion.div style={{ y }} className="absolute inset-0 -m-[5%]">
        <img
          src={plate.url}
          alt={plate.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-[1.04]"
          style={{ filter: 'grayscale(0.3) contrast(1.05) brightness(0.85)' }}
        />
      </motion.div>

      {/* gradient veil */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

      {/* corner ticks */}
      <span className="absolute top-3 left-3 w-3 h-px bg-bone/40" />
      <span className="absolute top-3 left-3 w-px h-3 bg-bone/40" />
      <span className="absolute top-3 right-3 w-3 h-px bg-bone/40" />
      <span className="absolute top-3 right-3 w-px h-3 bg-bone/40" />

      {/* labels */}
      <div className="absolute top-4 left-5 right-5 flex justify-between label text-bone/70">
        <span className="text-orange">{plate.tag}</span>
        <span>N° {String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="absolute bottom-5 md:bottom-7 left-5 md:left-7 right-5">
        <h3 className="display text-bone text-2xl md:text-3xl lg:text-4xl leading-tight mb-1 group-hover:translate-x-1 transition-transform duration-700">
          {plate.title}
        </h3>
        <p className="label text-bone/60">{plate.location}</p>
      </div>
    </motion.figure>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative bg-ink border-t hairline py-24 md:py-32 grain">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="grid grid-cols-12 gap-4 mb-12 md:mb-20 border-b hairline pb-8">
          <div className="col-span-12 md:col-span-3">
            <div className="label text-bone/60"><span className="text-orange">N° 04</span> — Archive</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="display text-4xl md:text-6xl lg:text-7xl text-bone leading-[0.95]">
              <SplitText as="span" className="block">Worlds, beneath the world.</SplitText>
            </h2>
            <p className="text-pale text-base md:text-lg leading-relaxed mt-6 max-w-2xl">
              Plates from the MINUS 1 archive. Faces and identifying details are withheld. The work, presented in its own quiet voice.
            </p>
          </div>
        </div>

        {/* PHOTO GRID — asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 auto-rows-auto">
          {PLATES.map((p, i) => (
            <Plate key={p.url} plate={p} index={i} />
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-12 grid grid-cols-12 gap-4 pt-6 border-t hairline label text-bone/40">
          <div className="col-span-6">All identifying details redacted</div>
          <div className="col-span-6 text-right">06 of 84 plates · full archive on request</div>
        </div>
      </div>
    </section>
  );
}
