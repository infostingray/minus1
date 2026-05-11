import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from './SplitText';
import Magnetic from './Magnetic';

const domes = [
  {
    id: 'atrium',
    num: '01',
    name: 'Atrium',
    tagline: 'The habitable canopy. A residential geodesic suspended in glass.',
    type: 'RESIDENTIAL',
    diameter: '12 — 18 m',
    height: '8.4 m',
    panels: 'Low-iron triple-glaze',
    capacity: '6 — 14 occupants',
    image: 'https://images.unsplash.com/photo-1706464662649-5b075ef6e5af?w=1600&q=88&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1660313140427-aedb86597570?w=1600&q=88&auto=format&fit=crop',
    summary:
      'A climate-controlled luxury habitat designed to integrate with a subterranean Bunker. The Atrium is a single-volume sanctuary — open plan beneath an unbroken glass sky, finished in solid stone, brass, and walnut. Sunlight by day, observatory by night.',
    inclusions: [
      'Triple-glazed low-iron sky panels',
      'Powder-coated structural alloy frame',
      'Radiant in-floor climate system',
      'Acoustic isolation perimeter',
      'Direct vertical link to Bunker',
      'Heliostatic shade automation',
    ],
  },
  {
    id: 'verdant',
    num: '02',
    name: 'Verdant',
    tagline: 'The productive canopy. A self-sufficient cultivation pavilion.',
    type: 'PROVISIONING',
    diameter: '8 — 14 m',
    height: '6.2 m',
    panels: 'ETFE inflated layer',
    capacity: '180-day food autonomy',
    image: 'https://images.unsplash.com/photo-1637935068558-a1f39612620d?w=1600&q=88&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1660313096407-73b597e742e3?w=1600&q=88&auto=format&fit=crop',
    summary:
      "A closed-loop hydroponic dome engineered to supply a household indefinitely. Verdant pairs with a Bunker's provisioning bay to extend autonomy from months to years. Year-round cultivation in any climate, automated and discreet.",
    inclusions: [
      'Multi-tier hydroponic substrate',
      'LED full-spectrum cultivation array',
      'Reclaimed-water nutrient cycle',
      'Automated harvest logistics',
      'CO₂ enrichment & atmosphere control',
      'Direct line to provisioning bay',
    ],
  },
];

export default function Domes() {
  const [active, setActive] = useState(null);
  const activeDome = domes.find((d) => d.id === active);

  return (
    <section id="domes" className="relative bg-coal border-t hairline py-24 md:py-32 grain">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex items-baseline justify-between border-b hairline pb-6 mb-12">
          <p className="label text-bone/60">
            <span className="text-orange">N° 03</span> — Domes
          </p>
          <p className="label text-bone/60 hidden md:block">
            Two Canopies · Above the Surface
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="lg:col-span-7">
            <h2 className="display text-bone text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              <SplitText as="span" className="block">
                The surface companion.
              </SplitText>
              <SplitText as="span" className="block italic text-silver" delay={0.15}>
                Where the bunker ends,
              </SplitText>
              <SplitText as="span" className="block" delay={0.3}>
                the dome begins.
              </SplitText>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 self-end">
            <p className="text-pale text-[15px] leading-relaxed">
              Each MINUS 1 estate is conceived as a continuous environment. The Bunker provides continuity below. The Dome — habitable or productive — is its counterpart above.
            </p>
          </div>
        </div>

        {/* DOME CARDS — photo driven, similar style to Bunkers */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 -mx-6 px-6 snap-x snap-mandatory md:overflow-visible md:grid md:grid-cols-2">
          {domes.map((d, i) => (
            <motion.article
              key={d.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative w-[85vw] md:w-auto flex-shrink-0 snap-start"
            >
              {/* Image with hover scale */}
              <div className="relative aspect-[4/5] overflow-hidden bg-ink border hairline">
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-105"
                  style={{ filter: 'grayscale(0.2) contrast(1.05) brightness(0.85)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                {/* corner ticks */}
                <span className="absolute top-4 left-4 w-3 h-px bg-bone/40" />
                <span className="absolute top-4 left-4 w-px h-3 bg-bone/40" />
                <span className="absolute top-4 right-4 w-3 h-px bg-bone/40" />
                <span className="absolute top-4 right-4 w-px h-3 bg-bone/40" />

                {/* Top labels */}
                <div className="absolute top-5 left-5 right-5 flex justify-between label text-bone/70">
                  <span className="text-orange">N° {d.num}</span>
                  <span>{d.type}</span>
                </div>

                {/* Title block at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="display text-bone text-5xl md:text-6xl mb-2">
                    {d.name}
                  </h3>
                  <p className="text-pale text-sm max-w-xs leading-relaxed">
                    {d.tagline}
                  </p>
                </div>
              </div>

              {/* Specs row + CTA */}
              <div className="mt-4 grid grid-cols-12 gap-4 items-start">
                <div className="col-span-7 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="label mb-1 text-bone/40">Diameter</p>
                    <p className="font-mono text-xs text-pale">{d.diameter}</p>
                  </div>
                  <div>
                    <p className="label mb-1 text-bone/40">Height</p>
                    <p className="font-mono text-xs text-pale">{d.height}</p>
                  </div>
                  <div>
                    <p className="label mb-1 text-bone/40">Glazing</p>
                    <p className="font-mono text-xs text-pale">{d.panels}</p>
                  </div>
                  <div>
                    <p className="label mb-1 text-bone/40">Capacity</p>
                    <p className="font-mono text-xs text-pale">{d.capacity}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActive(d.id)}
                  className="col-span-5 group/btn h-full min-h-[88px] flex flex-col items-end justify-between border border-bone/30 p-4 hover:bg-orange hover:text-ink hover:border-orange transition-all duration-300"
                >
                  <span className="self-start label group-hover/btn:text-ink transition-colors">
                    Inspect
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <line x1="5" y1="19" x2="19" y2="5" />
                    <polyline points="9 5 19 5 19 15" />
                  </svg>
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* DETAIL MODAL */}
        <AnimatePresence>
          {activeDome && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 z-50 bg-coal/95 backdrop-blur-md overflow-y-auto"
            >
              <motion.div
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                exit={{ y: 40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="min-h-screen max-w-5xl mx-auto p-6 md:p-12"
              >
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="label text-orange">
                      N° {activeDome.num} · {activeDome.type}
                    </div>
                    <h2 className="display text-bone text-6xl md:text-8xl mt-2">
                      {activeDome.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="label text-bone hover:text-orange transition-colors"
                  >
                    ✕ CLOSE
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  <div className="aspect-[4/5] overflow-hidden border hairline">
                    <img
                      src={activeDome.image2}
                      alt={activeDome.name}
                      className="w-full h-full object-cover"
                      style={{ filter: 'grayscale(0.2) contrast(1.05) brightness(0.85)' }}
                    />
                  </div>

                  <div>
                    <p className="text-pale leading-relaxed mb-8">{activeDome.summary}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8 border-y hairline py-6">
                      <div>
                        <div className="label text-bone/40 mb-1">Diameter</div>
                        <div className="text-bone">{activeDome.diameter}</div>
                      </div>
                      <div>
                        <div className="label text-bone/40 mb-1">Height</div>
                        <div className="text-bone">{activeDome.height}</div>
                      </div>
                      <div>
                        <div className="label text-bone/40 mb-1">Glazing</div>
                        <div className="text-bone">{activeDome.panels}</div>
                      </div>
                      <div>
                        <div className="label text-bone/40 mb-1">Capacity</div>
                        <div className="text-bone">{activeDome.capacity}</div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="label text-bone/40 mb-3">Inclusions</div>
                      <ul className="space-y-2">
                        {activeDome.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-bone/80">
                            <span className="text-orange mt-1">—</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Magnetic strength={0.2}>
                      <button
                        onClick={() => {
                          setActive(null);
                          window.dispatchEvent(new CustomEvent('open-concierge'));
                        }}
                        className="inline-flex items-center justify-between w-full bg-orange text-ink px-5 py-4 hover:bg-orange-bright transition-colors"
                      >
                        <span className="label">Commission {activeDome.name}</span>
                        <span>→</span>
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
