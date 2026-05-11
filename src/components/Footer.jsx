import { motion } from 'framer-motion';
import Logo from './Logo';
import Magnetic from './Magnetic';

export default function Footer() {
  const openConcierge = () => window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <footer id="contact" className="relative bg-coal text-bone overflow-hidden border-t border-bone/10">
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto pt-16 md:pt-24 pb-10">

        {/* CONTACT GRID */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 pb-12 md:pb-16 border-b border-bone/10">
          <div className="col-span-12 md:col-span-3">
            <div className="label text-orange mb-3">Studio</div>
            <address className="not-italic text-bone/80 leading-relaxed text-sm">
              Dubai International<br />
              Financial Centre<br />
              Tower 2, Level 17<br />
              Dubai, UAE
            </address>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="label text-orange mb-3">Direct</div>
            <a href="mailto:vault@minus1.studio" className="block text-bone link-underline mb-2 text-sm">
              vault@minus1.studio
            </a>
            <a href="tel:+97140000000" className="block text-bone/80 text-sm">
              +971 4 000 0000
            </a>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="label text-orange mb-3">Discretion</div>
            <p className="text-bone/70 leading-relaxed text-xs md:text-sm">
              All correspondence encrypted, held under signed NDA. Initial consultations on-site only.
            </p>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="label text-orange mb-3">Begin</div>
            <p className="text-bone/70 leading-relaxed text-xs md:text-sm mb-4">
              Five questions. Direct line to a principal.
            </p>
            <Magnetic strength={0.25}>
              <button
                onClick={openConcierge}
                className="label bg-orange text-ink hover:bg-orange-bright transition-all px-5 py-3 inline-flex items-center gap-3"
              >
                Concierge
                <span>→</span>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* MASSIVE LOGOTYPE */}
        <div className="py-12 md:py-16 overflow-hidden">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="display text-[22vw] md:text-[16vw] leading-[0.8] tracking-tighter text-bone/95 select-none"
          >
            MINUS&nbsp;<span className="italic">1</span>
          </motion.div>
        </div>

        {/* BOTTOM BAR */}
        <div className="grid grid-cols-12 gap-3 border-t border-bone/10 pt-6 label text-bone/40">
          <div className="col-span-6 md:col-span-3 flex items-center gap-3">
            <Logo className="w-5 h-5 text-orange" />
            <span>MINUS 1 · MMXXVI</span>
          </div>
          <div className="hidden md:block md:col-span-3">
            All rights reserved
          </div>
          <div className="hidden md:block md:col-span-3 tabular-nums">
            25.2048° N · 55.2708° E
          </div>
          <div className="col-span-6 md:col-span-3 text-right">
            Engineered in Dubai
          </div>
        </div>
      </div>
    </footer>
  );
}
