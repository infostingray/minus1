import { motion } from 'framer-motion';
import Magnetic from './Magnetic';
import SplitText from './SplitText';

export default function Begin() {
  const openConcierge = () => window.dispatchEvent(new CustomEvent('open-concierge'));

  return (
    <section id="begin" className="relative bg-ink overflow-hidden py-32 md:py-48 grain">
      {/* background photographic plate */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1700308232095-2514f455344d?w=2400&q=85&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          style={{ filter: 'grayscale(0.7) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
      </div>

      {/* radial highlight */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,107,26,0.08)_0%,transparent_55%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* section number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="label text-orange mb-8 flex items-center justify-center gap-4"
        >
          <span className="w-8 h-px bg-orange" />
          <span>N° 06 — Engage</span>
          <span className="w-8 h-px bg-orange" />
        </motion.div>

        {/* monumental headline */}
        <h2 className="display text-bone leading-[0.85] tracking-tight text-6xl md:text-8xl lg:text-9xl mb-8 md:mb-12">
          <SplitText as="span" className="block">Begin your</SplitText>
          <SplitText as="span" className="block italic text-bone/70" delay={0.15}>descent.</SplitText>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-pale text-base md:text-xl leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16"
        >
          MINUS 1 engagements proceed by referral and qualification. The Concierge is a private channel — five questions, then direct contact with a principal.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row gap-4 items-center justify-center mb-16 md:mb-20"
        >
          <Magnetic strength={0.3}>
            <button
              onClick={openConcierge}
              className="group label bg-orange text-ink px-8 md:px-12 py-5 hover:bg-orange-bright transition-colors inline-flex items-center gap-4 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-ink animate-pulse" />
              Open Concierge
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Magnetic>
          <span className="label text-bone/40">OR</span>
          <Magnetic strength={0.2}>
            <a
              href="mailto:vault@minus1.studio"
              className="label border border-bone/30 text-bone hover:border-orange hover:text-orange px-6 py-5 transition-all"
            >
              vault@minus1.studio
            </a>
          </Magnetic>
        </motion.div>

        {/* reassurance row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px max-w-3xl mx-auto border-t border-b border-bone/10"
        >
          {[
            { v: 'NDA', l: 'on initial contact' },
            { v: '48h', l: 'principal response' },
            { v: 'On-site', l: 'consultations only' },
            { v: 'Bespoke', l: 'every commission' },
          ].map((s, i) => (
            <div key={i} className="bg-ink/30 py-6 px-4">
              <div className="display text-bone text-2xl md:text-3xl mb-1">{s.v}</div>
              <div className="label text-bone/40">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
