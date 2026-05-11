import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SplitText from './SplitText'
import Magnetic from './Magnetic'

const projects = [
  {
    id: 'vault',
    num: '01',
    type: 'Single Unit',
    name: 'The Vault',
    tagline: 'A discreet single-occupancy stronghold.',
    image: 'https://images.unsplash.com/photo-1706464662649-5b075ef6e5af?w=1600&q=85&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1660313140427-aedb86597570?w=1600&q=85&auto=format&fit=crop',
    dims: '6.3 × 3.3 × 3.3 m',
    depth: '−12.00m',
    capacity: '1 – 2 Residents',
    duration: '14 Days Autonomy',
    materials: [
      'Monolithic Titanium-Alloy Shell',
      '1/4-inch Reinforced Steel Walls',
      '150-Year Cold-Tar Exterior Seal',
      'AR500 Bulletproof Hatch',
    ],
    description:
      'The Vault is the entry into the MINUS 1 system — a fully self-contained subterranean unit engineered for short-to-medium continuity. Concealed beneath a residence, garage, or garden, it preserves the architecture above while delivering uncompromised protection below.',
    inclusions: [
      'Private bedroom, ensuite shower & kitchen',
      'Swiss-made VA-40 NBC air filtration',
      '300-gallon potable water reserve',
      'Overpressure blast valves',
      'Climate-controlled equipment bay',
    ],
  },
  {
    id: 'citadel',
    num: '02',
    type: 'Family Compound',
    name: 'The Citadel',
    tagline: 'Generational continuity for the principal household.',
    image: 'https://images.unsplash.com/photo-1637935142056-03d421b2b13c?w=1600&q=85&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1660313096407-73b597e742e3?w=1600&q=85&auto=format&fit=crop',
    dims: '15.3 × 3.3 × 3.3 m',
    depth: '−18.00m',
    capacity: '6 – 10 Residents',
    duration: '90 Days Autonomy',
    materials: [
      'Modular Multi-Capsule Architecture',
      '8-inch Structural Channel Reinforcement',
      'Self-Healing Nano-Aerogel Composite',
      '5mm Lead-Lined Radiation Ceiling',
    ],
    description:
      'The Citadel scales the MINUS 1 doctrine to the family unit. Multi-capsule modules connect through airlocked corridors to form an integrated private residence below ground — sleeping quarters, lounges, a majlis, command suite, and dedicated equipment bay.',
    inclusions: [
      'Two private suites · expandable to four',
      'Formal majlis & dining area',
      'Triple-redundant air, water, and power',
      'Encrypted satellite & data uplink',
      'Hydroponic provisioning bay',
    ],
  },
  {
    id: 'ark',
    num: '03',
    type: 'Bespoke Complex',
    name: 'The Ark',
    tagline: 'A private community engineered for indefinite continuity.',
    image: 'https://images.unsplash.com/photo-1624664929067-5bc278a7c57e?w=1600&q=85&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1637935068558-a1f39612620d?w=1600&q=85&auto=format&fit=crop',
    dims: 'Bespoke / 600+ m²',
    depth: '−30.00m',
    capacity: '20 – 100 Residents',
    duration: 'Indefinite Autonomy',
    materials: [
      'Reinforced Concrete & Steel Composite',
      '50 kPa Overpressure-Rated Envelope',
      'Embedded Carbon-Fiber Skeleton',
      'Custom Architectural Finishes',
    ],
    description:
      'The Ark is the flagship offering of MINUS 1 — a bespoke subterranean complex commissioned for institutions, multi-generational families, and sovereign clients. Every spatial brief is original. Every system is over-engineered for permanence.',
    inclusions: [
      'Custom architectural design package',
      'Medical suite & isolation pod',
      'Independent energy infrastructure',
      'Hydroponics, cold storage & cellar',
      'Private cinema, library, and gallery',
    ],
  },
]

export default function Projects() {
  const [active, setActive] = useState(null)
  const project = projects.find((p) => p.id === active)

  return (
    <section id="bunkers" className="relative bg-ink border-t hairline py-24 md:py-32 grain">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between border-b hairline pb-6 mb-12">
          <p className="label text-bone/60"><span className="text-orange">N° 02</span> — Bunkers</p>
          <p className="label hidden md:block">Three Archetypes · One Standard</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <h2 className="display text-bone text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              <SplitText as="span" className="block">Three configurations.</SplitText>
              <SplitText as="span" className="block italic text-silver" delay={0.15}>From the single Vault</SplitText>
              <SplitText as="span" className="block" delay={0.3}>to the generational Ark.</SplitText>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 self-end">
            <p className="text-pale text-[15px] leading-relaxed">
              Each archetype is a starting point — every commission is engineered, finished, and concealed to the client&apos;s specification.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 md:gap-8 px-6 md:px-10 min-w-max">
            {projects.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.65, 0, 0.35, 1] }}
                data-cursor="OPEN"
                className="group relative w-[88vw] md:w-[520px] lg:w-[560px] flex-shrink-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-coal border hairline-strong">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-all duration-[1200ms] group-hover:scale-105"
                    style={{ filter: 'grayscale(1) contrast(1.05)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

                  <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-5">
                    <div className="flex flex-col gap-1">
                      <span className="label text-bone/80">N° {p.num}</span>
                      <span className="label text-silver">{p.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="label text-bone/80">{p.depth}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="display text-bone text-5xl md:text-6xl mb-2">{p.name}</h3>
                    <p className="text-pale text-sm max-w-xs leading-relaxed">{p.tagline}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-7 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <p className="label mb-1">Dimensions</p>
                      <p className="font-mono text-xs text-pale">{p.dims}</p>
                    </div>
                    <div>
                      <p className="label mb-1">Capacity</p>
                      <p className="font-mono text-xs text-pale">{p.capacity}</p>
                    </div>
                    <div>
                      <p className="label mb-1">Autonomy</p>
                      <p className="font-mono text-xs text-pale">{p.duration}</p>
                    </div>
                    <div>
                      <p className="label mb-1">Depth</p>
                      <p className="font-mono text-xs text-pale">{p.depth}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActive(p.id)}
                    className="col-span-5 group/btn h-full min-h-[88px] flex flex-col items-end justify-between border border-bone/30 p-4 hover:bg-orange hover:text-ink hover:border-orange transition-all duration-300"
                  >
                    <span className="self-start label group-hover/btn:text-ink transition-colors">View Details</span>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1">
                      <line x1="5" y1="19" x2="19" y2="5" />
                      <polyline points="9 5 19 5 19 15" />
                    </svg>
                  </button>
                </div>
              </motion.article>
            ))}

            <div className="w-[60vw] md:w-[260px] flex-shrink-0 flex items-center">
              <div className="border hairline p-8 w-full">
                <p className="label mb-3">— Commission</p>
                <p className="display text-bone text-2xl leading-tight">
                  Begin a private brief.
                </p>
                <a href="#contact" className="mt-6 inline-flex items-center gap-2 label link-underline">
                  Open Inquiry ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 mt-6 flex items-center justify-between max-w-7xl mx-auto">
          <p className="label">← Drag · Scroll · Explore →</p>
          <p className="font-mono text-xs text-silver tabular-nums">03 / 03</p>
        </div>
      </div>

      <AnimatePresence>
        {project && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-md flex items-stretch overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative w-full max-w-6xl mx-auto my-auto bg-ink border hairline-strong"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-ink/95 backdrop-blur-sm flex items-center justify-between px-6 md:px-10 py-5 border-b hairline">
                <div className="flex items-baseline gap-4">
                  <span className="label">N° {project.num}</span>
                  <span className="display text-bone text-2xl">{project.name}</span>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="group flex items-center gap-3 border hairline-strong px-3 py-2 hover:bg-bone hover:text-ink transition-colors duration-300"
                >
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase">Close</span>
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="grid lg:grid-cols-12 gap-px bg-graphite">
                <div className="lg:col-span-6 bg-ink p-6 md:p-10">
                  <img src={project.image} alt={project.name} className="w-full aspect-[4/5] object-cover" style={{ filter: 'grayscale(1)' }} />
                  <img src={project.image2} alt="" className="hidden md:block w-full aspect-[16/9] object-cover mt-4" style={{ filter: 'grayscale(1)' }} />
                </div>

                <div className="lg:col-span-6 bg-ink p-6 md:p-10 space-y-10">
                  <div>
                    <p className="label mb-3">— {project.type}</p>
                    <h2 className="display text-bone text-5xl md:text-6xl mb-4">{project.name}</h2>
                    <p className="text-silver text-sm">{project.tagline}</p>
                  </div>

                  <p className="text-pale leading-relaxed text-[15px]">{project.description}</p>

                  <div className="grid grid-cols-2 gap-px bg-graphite border hairline-strong">
                    {[
                      ['Dimensions', project.dims],
                      ['Depth', project.depth],
                      ['Capacity', project.capacity],
                      ['Autonomy', project.duration],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-ink p-5">
                        <p className="label mb-2">{k}</p>
                        <p className="font-mono text-sm text-bone">{v}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="label mb-4">— Construction</p>
                    <ul className="space-y-2">
                      {project.materials.map((m, i) => (
                        <li key={i} className="flex gap-3 text-pale text-sm">
                          <span className="font-mono text-silver">{String(i + 1).padStart(2, '0')}</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="label mb-4">— Inclusions</p>
                    <ul className="space-y-2">
                      {project.inclusions.map((m, i) => (
                        <li key={i} className="flex gap-3 text-pale text-sm">
                          <span className="text-silver">·</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setActive(null);
                      window.dispatchEvent(new CustomEvent('open-concierge'));
                    }}
                    className="inline-flex items-center justify-between w-full bg-orange text-ink px-5 py-4 hover:bg-orange-bright transition-colors duration-300 group"
                  >
                    <span className="font-mono text-xs tracking-[0.22em] uppercase">Request {project.name}</span>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1">
                      <line x1="5" y1="19" x2="19" y2="5" />
                      <polyline points="9 5 19 5 19 15" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
