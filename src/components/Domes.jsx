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
    diameter: '12 â 18 m',
    height: '8.4 m',
    panels: 'Low-iron triple-glaze',
    capacity: '6 â 14 occupants',
    summary:
      'A climate-controlled luxury habitat designed to integrate with a subterranean Bunker. The Atrium is a single-volume sanctuary â open plan beneath an unbroken glass sky, finished in solid stone, brass, and walnut. Sunlight by day, observatory by night.',
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
    diameter: '8 â 14 m',
    height: '6.2 m',
    panels: 'ETFE inflated layer',
    capacity: '180-day food autonomy',
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

/* SVG glyph illustrations â geodesic patterns */
function AtriumGlyph() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Ground line */}
      <line x1="20" y1="300" x2="380" y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      {/* Dome outline */}
      <path d="M80 300 Q80 100 200 100 Q320 100 320 300 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Geodesic facets */}
      <path d="M80 300 Q140 180 200 100" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <path d="M120 300 Q160 180 200 100" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <path d="M160 300 Q180 200 200 100" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <path d="M200 300 L200 100" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <path d="M240 300 Q220 200 200 100" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <path d="M280 300 Q240 180 200 100" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      <path d="M320 300 Q260 180 200 100" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
      {/* horizontal latitude lines */}
      <path d="M93 240 Q200 220 307 240" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
      <path d="M115 180 Q200 160 285 180" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
      <path d="M150 135 Q200 122 250 135" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
      {/* Sun marker â orange */}
      <circle cx="200" cy="60" r="4" fill="#FF6B1A" />
      <line x1="200" y1="50" x2="200" y2="40" stroke="#FF6B1A" strokeWidth="1" />
      <line x1="200" y1="80" x2="200" y2="90" stroke="#FF6B1A" strokeWidth="1" opacity="0.5" />
      {/* Foundation connection */}
      <line x1="180" y1="300" x2="180" y2="340" stroke="#FF6B1A" strokeWidth="1" />
      <line x1="220" y1="300" x2="220" y2="340" stroke="#FF6B1A" strokeWidth="1" />
      <line x1="170" y1="340" x2="230" y2="340" stroke="#FF6B1A" strokeWidth="1" />
      <text x="200" y="365" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="currentColor" opacity="0.5">
        â TO BUNKER
      </text>
    </svg>
  );
}

function VerdantGlyph() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Ground */}
      <line x1="20" y1="300" x2="380" y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      {/* Dome outline */}
      <ellipse cx="200" cy="300" rx="140" ry="200" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* clip to upper hemisphere via a rect mask not needed â ellipse extends below ground naturally clipped by viewBox sense */}
      {/* Triangulation facets */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const angle = (i / 8) * Math.PI;
        const x1 = 200 - 140 * Math.cos(angle);
        const y1 = 300 - 200 * Math.sin(angle);
        return <line key={`r-${i}`} x1="200" y1="300" x2={x1} y2={y1} stroke="currentColor" strokeWidth="0.3" opacity="0.4" />;
      })}
      {/* Latitude bands */}
      {[0.3, 0.6, 0.85].map((r, i) => (
        <ellipse key={`lat-${i}`} cx="200" cy="300" rx={140 * r} ry={200 * r} fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      ))}
      {/* Plant rows inside */}
      {[260, 280].map((y, i) => (
        <g key={`row-${i}`}>
          <line x1="100" y1={y} x2="300" y2={y} stroke="#FF6B1A" strokeWidth="0.8" />
          {[120, 160, 200, 240, 280].map((x) => (
            <circle key={x} cx={x} cy={y - 4} r="2" fill="#FF6B1A" />
          ))}
        </g>
      ))}
      {/* Vertical tier */}
      <line x1="200" y1="120" x2="200" y2="240" stroke="currentColor" strokeWidth="0.4" opacity="0.5" strokeDasharray="3 3" />
      {/* CO2/Water indicators */}
      <g transform="translate(70 90)">
        <circle r="14" fill="none" stroke="#FF6B1A" strokeWidth="0.8" />
        <text textAnchor="middle" dominantBaseline="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#FF6B1A">CO₂</text>
      </g>
      <g transform="translate(330 90)">
        <circle r="14" fill="none" stroke="#FF6B1A" strokeWidth="0.8" />
        <text textAnchor="middle" dominantBaseline="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#FF6B1A">H₂O</text>
      </g>
      {/* Foundation */}
      <line x1="180" y1="300" x2="180" y2="340" stroke="#FF6B1A" strokeWidth="1" />
      <line x1="220" y1="300" x2="220" y2="340" stroke="#FF6B1A" strokeWidth="1" />
      <line x1="170" y1="340" x2="230" y2="340" stroke="#FF6B1A" strokeWidth="1" />
      <text x="200" y="365" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="currentColor" opacity="0.5">
        â TO PROVISIONING
      </text>
    </svg>
  );
}

const glyphs = { atrium: AtriumGlyph, verdant: VerdantGlyph };

export default function Domes() {
  const [active, setActive] = useState(null);
  const activeDome = domes.find((d) => d.id === active);

  return (
    <section id="domes" className="relative bg-coal border-t hairline py-24 md:py-32 grain">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex items-baseline justify-between border-b hairline pb-6 mb-12">
          <p className="label text-bone/60"><span className="text-orange">N° 03</span> â Domes</p>
          <p className="label text-bone/60 hidden md:block">Two Canopies · Above the Surface</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="lg:col-span-7">
            <h2 className="display text-bone text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              <SplitText as="span" className="block">The surface companion.</SplitText>
              <SplitText as="span" className="block italic text-silver" delay={0.15}>Where the bunker ends,</SplitText>
              <SplitText as="span" className="block" delay={0.3}>the dome begins.</SplitText>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 self-end">
            <p className="text-pale text-[15px] leading-relaxed">
              Each MINUS 1 estate is conceived as a continuous environment. The Bunker provides continuity below. The Dome â habitable or productive â is its counterpart above.
            </p>
          </div>
        </div>

        {/* DOME CARDS */}
        <div className="grid md:grid-cols-2 gap-px bg-bone/10 border hairline">
          {domes.map((d, i) => {
            const Glyph = glyphs[d.id];
            return (
              <motion.article
                key={d.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-ink p-8 md:p-12 cursor-pointer hover:bg-coal transition-colors"
                onClick={() => setActive(d.id)}
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="label text-orange">N° {d.num}</div>
                    <div className="label text-bone/40 mt-1">{d.type}</div>
                  </div>
                  <motion.div
                    className="label text-bone/30 group-hover:text-orange transition-colors"
                  >
                    INSPECT →
                  </motion.div>
                </div>

                {/* Glyph */}
                <div className="relative aspect-square w-full max-w-[400px] mx-auto mb-8 text-bone/70 group-hover:text-bone transition-colors">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Glyph />
                  </motion.div>
                  {/* corner ticks */}
                  <span className="absolute top-0 left-0 w-3 h-px bg-bone/40" />
                  <span className="absolute top-0 left-0 w-px h-3 bg-bone/40" />
                  <span className="absolute top-0 right-0 w-3 h-px bg-bone/40" />
                  <span className="absolute top-0 right-0 w-px h-3 bg-bone/40" />
                  <span className="absolute bottom-0 left-0 w-3 h-px bg-bone/40" />
                  <span className="absolute bottom-0 left-0 w-px h-3 bg-bone/40" />
                  <span className="absolute bottom-0 right-0 w-3 h-px bg-bone/40" />
                  <span className="absolute bottom-0 right-0 w-px h-3 bg-bone/40" />
                </div>

                {/* Title */}
                <h3 className="display text-bone text-5xl md:text-6xl mb-3">{d.name}</h3>
                <p className="text-pale text-sm max-w-xs leading-relaxed mb-8">{d.tagline}</p>

                {/* Quick specs */}
                <div className="grid grid-cols-2 gap-y-3 border-t hairline pt-6">
                  <div>
                    <div className="label text-bone/40 mb-1">Diameter</div>
                    <div className="text-bone/80 text-sm">{d.diameter}</div>
                  </div>
                  <div>
                    <div className="label text-bone/40 mb-1">Height</div>
                    <div className="text-bone/80 text-sm">{d.height}</div>
                  </div>
                  <div>
                    <div className="label text-bone/40 mb-1">Glazing</div>
                    <div className="text-bone/80 text-sm">{d.panels}</div>
                  </div>
                  <div>
                    <div className="label text-bone/40 mb-1">Capacity</div>
                    <div className="text-bone/80 text-sm">{d.capacity}</div>
                  </div>
                </div>
              </motion.article>
            );
          })}
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
                    <div className="label text-orange">N° {activeDome.num} · {activeDome.type}</div>
                    <h2 className="display text-bone text-6xl md:text-8xl mt-2">{activeDome.name}</h2>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="label text-bone hover:text-orange transition-colors"
                  >
                    ✕ CLOSE
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="aspect-square text-bone/70">
                    {(() => {
                      const G = glyphs[activeDome.id];
                      return <G />;
                    })()}
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
