import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import SplitText from './SplitText';
import Magnetic from './Magnetic';

const categories = [
  { id: 'all', label: 'All Systems', count: 12 },
  { id: 'life-support', label: 'Life Support', count: 4 },
  { id: 'security', label: 'Security', count: 3 },
  { id: 'interiors', label: 'Interiors', count: 3 },
  { id: 'autonomy', label: 'Autonomy', count: 2 },
];

const items = [
  {
    code: 'LS-001',
    category: 'life-support',
    name: 'NBC Air Filtration',
    sub: 'Swiss VA-40 system',
    spec: 'Nuclear Â· Biological Â· Chemical',
    metric: '99.97%',
    metricLabel: 'particulate removal',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    code: 'LS-002',
    category: 'life-support',
    name: 'Hydroponic Provisioning Bay',
    sub: 'Closed-loop cultivation',
    spec: '12-tier vertical Â· LED spectrum',
    metric: '180d',
    metricLabel: 'food autonomy',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {[20, 35, 50, 65, 80].map((y) => (
          <g key={y}>
            <line x1="20" y1={y} x2="80" y2={y} stroke="currentColor" strokeWidth="0.8" />
            <circle cx="30" cy={y} r="1.5" fill="currentColor" />
            <circle cx="42" cy={y} r="1.5" fill="currentColor" />
            <circle cx="54" cy={y} r="1.5" fill="currentColor" />
            <circle cx="66" cy={y} r="1.5" fill="currentColor" />
            <circle cx="78" cy={y} r="1.5" fill="currentColor" />
          </g>
        ))}
        <line x1="18" y1="15" x2="18" y2="85" stroke="currentColor" strokeWidth="0.6" />
        <line x1="82" y1="15" x2="82" y2="85" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    code: 'LS-003',
    category: 'life-support',
    name: 'Potable Water Reserve',
    sub: 'Subfloor reservoir + UV cycle',
    spec: '6,500 L Â· triple-stage filtration',
    metric: '180d',
    metricLabel: 'continuous supply',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="22" y="22" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M22 56 Q35 50 50 56 T78 56" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M22 64 Q35 58 50 64 T78 64" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M22 72 Q35 66 50 72 T78 72" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="38" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <line x1="50" y1="14" x2="50" y2="22" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    code: 'LS-004',
    category: 'life-support',
    name: 'Climate Cellar',
    sub: 'Nine-constant regulation',
    spec: '19â24Â°C Â· 50â65% RH Â· 30dB',
    metric: 'Â±0.1%',
    metricLabel: 'oxygen precision',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.8" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 50 + Math.cos(angle) * 28;
          const y1 = 50 + Math.sin(angle) * 28;
          const x2 = 50 + Math.cos(angle) * 34;
          const y2 = 50 + Math.sin(angle) * 34;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.6" />;
        })}
        <line x1="50" y1="50" x2="50" y2="28" stroke="currentColor" strokeWidth="1" />
        <line x1="50" y1="50" x2="66" y2="58" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: 'SC-001',
    category: 'security',
    name: 'Blast Door AR500',
    sub: 'Bulletproof steel + overpressure seal',
    spec: '1 MPa Â· airtight Â· explosion-rated',
    metric: '50kPa',
    metricLabel: 'overpressure rating',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="28" y="14" width="44" height="72" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <rect x="32" y="18" width="36" height="64" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <line x1="50" y1="40" x2="50" y2="60" stroke="currentColor" strokeWidth="0.6" />
        <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="34" cy="22" r="1" fill="currentColor" />
        <circle cx="66" cy="22" r="1" fill="currentColor" />
        <circle cx="34" cy="78" r="1" fill="currentColor" />
        <circle cx="66" cy="78" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    code: 'SC-002',
    category: 'security',
    name: 'Biometric Access Console',
    sub: 'Multi-factor authentication',
    spec: 'Retinal Â· vein Â· keypad redundancy',
    metric: '4FA',
    metricLabel: 'auth layers',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="42" r="10" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="42" r="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="42" r="1" fill="currentColor" />
        <rect x="32" y="60" width="36" height="12" fill="none" stroke="currentColor" strokeWidth="0.6" />
        {[36, 44, 52, 60].map((x) => (
          <line key={x} x1={x} y1="60" x2={x} y2="72" stroke="currentColor" strokeWidth="0.4" />
        ))}
      </svg>
    ),
  },
  {
    code: 'SC-003',
    category: 'security',
    name: 'Encrypted Comms Suite',
    sub: 'Satellite + mesh radio',
    spec: 'Iridium uplink Â· faraday-shielded',
    metric: 'AES-256',
    metricLabel: 'encryption standard',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="6" fill="currentColor" />
        <path d="M30 50 Q30 30 50 30" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M22 50 Q22 22 50 22" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M14 50 Q14 14 50 14" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M70 50 Q70 30 50 30" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M78 50 Q78 22 50 22" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M86 50 Q86 14 50 14" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <line x1="50" y1="50" x2="50" y2="86" stroke="currentColor" strokeWidth="0.8" />
        <rect x="40" y="80" width="20" height="6" fill="none" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    code: 'IN-001',
    category: 'interiors',
    name: 'Majlis Suite',
    sub: 'Bespoke reception hall',
    spec: 'Hand-crafted millwork Â· acoustic treatment',
    metric: 'NÂ° 01',
    metricLabel: 'signature interior',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="14" y="30" width="72" height="50" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <rect x="20" y="55" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <rect x="44" y="55" width="32" height="20" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <line x1="14" y1="20" x2="86" y2="20" stroke="currentColor" strokeWidth="0.6" />
        <line x1="50" y1="20" x2="50" y2="30" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="15" r="2" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <line x1="22" y1="42" x2="78" y2="42" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 1" />
      </svg>
    ),
  },
  {
    code: 'IN-002',
    category: 'interiors',
    name: 'Private Cinema',
    sub: 'Dolby Atmos Â· 4K laser',
    spec: 'Acoustic isolation Â· tiered seating',
    metric: '7.4.4',
    metricLabel: 'channel layout',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="18" y="22" width="64" height="38" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <rect x="22" y="26" width="56" height="30" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <path d="M18 70 L82 70 L78 86 L22 86 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <line x1="28" y1="74" x2="72" y2="74" stroke="currentColor" strokeWidth="0.4" />
        <line x1="30" y1="78" x2="70" y2="78" stroke="currentColor" strokeWidth="0.4" />
        <line x1="32" y1="82" x2="68" y2="82" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    ),
  },
  {
    code: 'IN-003',
    category: 'interiors',
    name: 'Asset Vault',
    sub: 'Climate-controlled storage',
    spec: 'Biometric Â· seismic isolation Â· UL-rated',
    metric: 'TL-30',
    metricLabel: 'penetration class',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="18" y="18" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="1.5" fill="currentColor" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const angle = (deg * Math.PI) / 180;
          const x1 = 50 + Math.cos(angle) * 18;
          const y1 = 50 + Math.sin(angle) * 18;
          const x2 = 50 + Math.cos(angle) * 24;
          const y2 = 50 + Math.sin(angle) * 24;
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.6" />;
        })}
      </svg>
    ),
  },
  {
    code: 'AU-001',
    category: 'autonomy',
    name: 'Independent Power Plant',
    sub: 'Dual 40kVA + solar + battery',
    spec: 'Silent diesel Â· lithium reserve Â· grid-tied',
    metric: '90d',
    metricLabel: 'off-grid runtime',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,15 60,40 50,40 56,75 38,45 50,45" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 2" />
        <rect x="14" y="78" width="72" height="6" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <line x1="22" y1="78" x2="22" y2="84" stroke="currentColor" strokeWidth="0.4" />
        <line x1="34" y1="78" x2="34" y2="84" stroke="currentColor" strokeWidth="0.4" />
        <line x1="46" y1="78" x2="46" y2="84" stroke="currentColor" strokeWidth="0.4" />
        <line x1="54" y1="78" x2="54" y2="84" stroke="currentColor" strokeWidth="0.4" />
        <line x1="66" y1="78" x2="66" y2="84" stroke="currentColor" strokeWidth="0.4" />
        <line x1="78" y1="78" x2="78" y2="84" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    ),
  },
  {
    code: 'AU-002',
    category: 'autonomy',
    name: 'Medical Pod',
    sub: 'Telemetry-linked treatment bay',
    spec: 'Isolation Â· diagnostics Â· pharma reserve',
    metric: '24/7',
    metricLabel: 'remote consult',
    glyph: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="18" y="22" width="64" height="56" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <line x1="50" y1="34" x2="50" y2="66" stroke="currentColor" strokeWidth="1.2" />
        <line x1="34" y1="50" x2="66" y2="50" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" />
        <line x1="18" y1="14" x2="82" y2="14" stroke="currentColor" strokeWidth="0.4" />
        <line x1="18" y1="86" x2="82" y2="86" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    ),
  },
];

export default function Catalogue() {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? items : items.filter((i) => i.category === active);

  return (
    <section id="catalogue" className="relative bg-bone py-32 md:py-48 text-ink">
      {/* Header */}
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-3">
            <div className="label text-ink/50">N° 03 â Catalogue</div>
            <div className="label text-ink/30 mt-2">â42.00m</div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h2 className="display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              <SplitText as="span" className="block">The component</SplitText>
              <SplitText as="span" className="block italic" delay={0.15}>library.</SplitText>
            </h2>
            <p className="mt-8 text-ink/60 text-lg max-w-md leading-relaxed">
              Engineered systems, specified to the millimetre. Every MINUS 1 environment is composed from a single, audited inventory of subterranean infrastructure.
            </p>
          </div>
          <div className="col-span-12 md:col-span-3 md:text-right">
            <div className="label text-ink/50">Inventory</div>
            <div className="display text-4xl mt-2">{String(items.length).padStart(2, '0')}<span className="text-ink/30 text-2xl"> / specified</span></div>
          </div>
        </div>

        {/* Filter pills */}
        <LayoutGroup>
          <div className="flex flex-wrap gap-2 mb-12 md:mb-16 border-y border-ink/15 py-6">
            {categories.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`relative label px-4 py-2.5 transition-colors ${
                    isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-orange"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">
                    {c.label} <span className="opacity-50 ml-1">[{String(c.count).padStart(2, '0')}]</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Item grid */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.article
                  key={item.code}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  data-cursor="VIEW SPEC"
                  className="group bg-bone p-8 md:p-10 hover:bg-chalk transition-colors cursor-pointer relative"
                >
                  {/* Code label */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="label text-orange">{item.code}</div>
                    <div className="label text-ink/40 uppercase">{item.category.replace('-', ' ')}</div>
                  </div>

                  {/* Blueprint glyph */}
                  <div className="relative aspect-square w-full max-w-[280px] mx-auto mb-8">
                    {/* dotted grid bg */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, rgba(10,10,10,0.4) 0.5px, transparent 0.5px)',
                        backgroundSize: '8px 8px',
                      }}
                    />
                    {/* corner ticks */}
                    <span className="absolute top-0 left-0 w-3 h-px bg-ink/40" />
                    <span className="absolute top-0 left-0 w-px h-3 bg-ink/40" />
                    <span className="absolute top-0 right-0 w-3 h-px bg-ink/40" />
                    <span className="absolute top-0 right-0 w-px h-3 bg-ink/40" />
                    <span className="absolute bottom-0 left-0 w-3 h-px bg-ink/40" />
                    <span className="absolute bottom-0 left-0 w-px h-3 bg-ink/40" />
                    <span className="absolute bottom-0 right-0 w-3 h-px bg-ink/40" />
                    <span className="absolute bottom-0 right-0 w-px h-3 bg-ink/40" />

                    <motion.div
                      className="absolute inset-6 text-ink/80 group-hover:text-ink transition-colors"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {item.glyph}
                    </motion.div>
                  </div>

                  {/* Title block */}
                  <div className="mb-6">
                    <h3 className="display text-2xl md:text-3xl leading-tight">{item.name}</h3>
                    <p className="text-ink/50 text-sm mt-2">{item.sub}</p>
                  </div>

                  {/* Footer specs */}
                  <div className="flex items-end justify-between pt-4 border-t border-ink/15">
                    <div>
                      <div className="label text-ink/40 mb-1">Specification</div>
                      <div className="text-ink/80 text-xs leading-snug max-w-[180px]">{item.spec}</div>
                    </div>
                    <div className="text-right">
                      <div className="display text-2xl leading-none text-orange">{item.metric}</div>
                      <div className="label text-ink/40 mt-1">{item.metricLabel}</div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Footer note */}
        <div className="mt-16 md:mt-24 grid grid-cols-12 gap-6 border-t border-ink/15 pt-8">
          <div className="col-span-12 md:col-span-6 label text-ink/50">
            All components engineered to ISO 9001 Â· CNAS-accredited testing
          </div>
          <div className="col-span-12 md:col-span-6 md:text-right">
            <a href="#contact" className="label text-ink link-underline">Request full specification dossier â</a>
          </div>
        </div>
      </div>
    </section>
  );
}
