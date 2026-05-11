import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import SplitText from './SplitText';
import Magnetic from './Magnetic';

const categories = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'life-support', label: 'Life Support', count: 4 },
  { id: 'security', label: 'Security', count: 3 },
  { id: 'interiors', label: 'Interiors', count: 3 },
  { id: 'autonomy', label: 'Autonomy', count: 2 },
];

const items = [
  { code: 'LS-001', category: 'life-support', name: 'NBC Air Filtration', sub: 'Swiss VA-40 system', spec: 'Nuclear Â· biological Â· chemical', metric: '99.97%', metricLabel: 'particulate removal' },
  { code: 'LS-002', category: 'life-support', name: 'Hydroponic Provisioning Bay', sub: 'Closed-loop cultivation', spec: '12-tier vertical Â· LED spectrum', metric: '180d', metricLabel: 'food autonomy' },
  { code: 'LS-003', category: 'life-support', name: 'Potable Water Reserve', sub: 'Subfloor reservoir + UV cycle', spec: '6,500 L Â· triple-stage filtration', metric: '180d', metricLabel: 'continuous supply' },
  { code: 'LS-004', category: 'life-support', name: 'Climate Cellar', sub: 'Nine-constant regulation', spec: '19â24Â°C Â· 50â65% RH Â· 30dB', metric: '±0.1%', metricLabel: 'oxygen precision' },
  { code: 'SC-001', category: 'security', name: 'Blast Door AR500', sub: 'Bulletproof steel + overpressure seal', spec: '1 MPa Â· airtight Â· explosion-rated', metric: '50kPa', metricLabel: 'overpressure' },
  { code: 'SC-002', category: 'security', name: 'Biometric Access Console', sub: 'Multi-factor authentication', spec: 'Retinal Â· vein Â· keypad redundancy', metric: '4FA', metricLabel: 'auth layers' },
  { code: 'SC-003', category: 'security', name: 'Encrypted Comms Suite', sub: 'Satellite + mesh radio', spec: 'Iridium uplink Â· faraday-shielded', metric: 'AES-256', metricLabel: 'encryption' },
  { code: 'IN-001', category: 'interiors', name: 'Majlis Suite', sub: 'Bespoke reception hall', spec: 'Hand-crafted millwork Â· acoustic treatment', metric: 'N°01', metricLabel: 'signature' },
  { code: 'IN-002', category: 'interiors', name: 'Private Cinema', sub: 'Dolby Atmos Â· 4K laser', spec: 'Acoustic isolation Â· tiered seating', metric: '7.4.4', metricLabel: 'channel layout' },
  { code: 'IN-003', category: 'interiors', name: 'Asset Vault', sub: 'Climate-controlled storage', spec: 'Biometric Â· seismic isolation Â· UL-rated', metric: 'TL-30', metricLabel: 'penetration class' },
  { code: 'AU-001', category: 'autonomy', name: 'Independent Power Plant', sub: 'Dual 40kVA + solar + battery', spec: 'Silent diesel Â· lithium reserve Â· grid-tied', metric: '90d', metricLabel: 'off-grid runtime' },
  { code: 'AU-002', category: 'autonomy', name: 'Medical Pod', sub: 'Telemetry-linked treatment bay', spec: 'Isolation Â· diagnostics Â· pharma reserve', metric: '24/7', metricLabel: 'remote consult' },
];

const categoryLabel = (id) => id.replace('-', ' ').toUpperCase();

export default function Catalogue() {
  const [active, setActive] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const filtered = active === 'all' ? items : items.filter((i) => i.category === active);

  return (
    <section id="catalogue" className="relative bg-bone py-24 md:py-32 text-ink">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="grid grid-cols-12 gap-4 mb-12 md:mb-20">
          <div className="col-span-12 md:col-span-3">
            <div className="label text-ink/50"><span className="text-orange">N° 05</span> â Catalogue</div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h2 className="display text-4xl md:text-6xl leading-[0.95] tracking-tight">
              <SplitText as="span" className="block">The component</SplitText>
              <SplitText as="span" className="block italic" delay={0.12}>library.</SplitText>
            </h2>
            <p className="mt-6 text-ink/60 text-base max-w-md leading-relaxed">
              Every MINUS 1 environment is composed from a single, audited inventory of subterranean infrastructure. Engineered to ISO 9001. Specified to the millimetre.
            </p>
          </div>
          <div className="col-span-12 md:col-span-3 md:text-right">
            <div className="label text-ink/50">Inventory</div>
            <div className="display text-3xl mt-2">12<span className="text-ink/30"> / specified</span></div>
          </div>
        </div>

        {/* FILTER PILLS â horizontal scroll on mobile, sticky on desktop */}
        <LayoutGroup>
          <div className="sticky top-20 md:top-24 z-30 bg-bone/95 backdrop-blur-md -mx-6 px-6 py-3 mb-8 md:mb-12 border-y border-ink/15 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {categories.map((c) => {
                const isActive = active === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => { setActive(c.id); setExpanded(null); }}
                    className={`relative label px-4 py-2 transition-colors whitespace-nowrap ${
                      isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="cat-pill"
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
          </div>
        </LayoutGroup>

        {/* EDITORIAL LIST */}
        <LayoutGroup>
          <motion.ul layout className="border-t border-ink/15">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => {
                const isExpanded = expanded === item.code;
                return (
                  <motion.li
                    key={item.code}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-ink/15"
                  >
                    {/* ROW (always visible) */}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.code)}
                      className="w-full grid grid-cols-12 gap-3 md:gap-6 items-center py-4 md:py-5 group text-left"
                    >
                      <div className="col-span-3 md:col-span-2 label text-orange tabular-nums">{item.code}</div>
                      <div className="col-span-9 md:col-span-6">
                        <h3 className="display text-xl md:text-2xl group-hover:translate-x-1 transition-transform duration-500">
                          {item.name}
                        </h3>
                      </div>
                      <div className="hidden md:block md:col-span-2 label text-ink/40">
                        {categoryLabel(item.category)}
                      </div>
                      <div className="col-span-9 md:col-span-1 md:text-right display text-xl text-ink/80 col-start-4 md:col-start-auto">
                        {item.metric}
                      </div>
                      <div className="col-span-3 md:col-span-1 md:text-right">
                        <motion.span
                          animate={{ rotate: isExpanded ? 45 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="inline-block text-ink/40 group-hover:text-orange transition-colors text-xl"
                        >
                          +
                        </motion.span>
                      </div>
                    </button>

                    {/* EXPANDED DETAIL */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-12 gap-3 md:gap-6 pb-6 md:pb-8 pt-2">
                            <div className="hidden md:block md:col-span-2" />
                            <div className="col-span-12 md:col-span-6">
                              <p className="text-ink/60 text-sm leading-relaxed mb-3">{item.sub}</p>
                              <p className="text-ink/80 text-sm leading-relaxed">{item.spec}</p>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                              <div className="border-l-2 border-orange pl-4">
                                <div className="display text-3xl text-orange">{item.metric}</div>
                                <div className="label text-ink/50 mt-1">{item.metricLabel}</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {/* FOOTER */}
        <div className="mt-12 md:mt-16 grid grid-cols-12 gap-3 pt-6 border-t border-ink/15">
          <div className="col-span-12 md:col-span-6 label text-ink/50">
            ISO 9001 · CNAS-accredited testing · Full dossier on request
          </div>
          <div className="col-span-12 md:col-span-6 md:text-right">
            <Magnetic strength={0.2}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-concierge'))}
                className="label text-ink link-underline inline-block"
              >
                Request specification dossier →
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
