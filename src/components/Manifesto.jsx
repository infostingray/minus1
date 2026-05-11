import { motion } from 'framer-motion';
import SplitText from './SplitText';
import Counter from './Counter';

const tenets = [
  {
    num: '01',
    head: 'Private Spaces',
    body: 'Exclusive underground environments built into existing or new real estate developments — concealed in daily life, activated when required.',
  },
  {
    num: '02',
    head: 'Secure Integration',
    body: 'Embedded protection infrastructure that preserves architectural integrity. Military-grade engineering hidden inside residential fabric.',
  },
  {
    num: '03',
    head: 'Modular Systems',
    body: 'Scalable, configurable subterranean systems designed to evolve with the owner — from a single Vault to a generational Ark.',
  },
];

const stats = [
  { node: <Counter to={300} suffix="%+" />, l: 'Surge in global demand since 2020', accent: true },
  { node: <Counter to={2} prefix="$" suffix="B+" />, l: 'Underground shelter market valuation' },
  { node: <Counter to={72} suffix="h" />, l: 'Rapid deployment, fully containerized' },
  { node: <span>N° 1</span>, l: 'Luxury-positioned in category' },
];

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative bg-ink border-t border-bone/10 py-24 md:py-40 px-6 grain">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-16 md:mb-24 border-b border-bone/10 pb-6">
          <p className="label text-bone/60">
            <span className="text-orange">N° 01</span> — Manifesto
          </p>
          <p className="label text-bone/60 hidden md:block">A New Layer of Living</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="display text-bone text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              <SplitText as="span" className="block">Not a shelter.</SplitText>
              <SplitText as="span" className="block italic text-silver" delay={0.15}>A new standard</SplitText>
              <SplitText as="span" className="block" delay={0.3}>of underground living.</SplitText>
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 max-w-xl space-y-6 text-pale leading-relaxed text-[15px]"
            >
              <p>
                MINUS 1 is a luxury underground infrastructure brand — designing and delivering private, secure, and fully integrated subterranean environments. We do not build bunkers. We build a layer of life that sits below the everyday one, ready for any future the world decides to offer.
              </p>
              <p>
                Each project is engineered in military-grade alloys, finished in residential luxury, and concealed inside the architectural fabric of the homes above them. Continuity is the product. Privacy is the proof.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <ul className="divide-y divide-bone/10 border-y border-bone/10">
              {tenets.map((t, i) => (
                <motion.li
                  key={t.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.65, 0, 0.35, 1] }}
                  className="py-6 grid grid-cols-12 gap-4 group hover:bg-coal transition-colors px-2 -mx-2 cursor-default"
                >
                  <span className="label col-span-2 text-orange/70 group-hover:text-orange transition-colors">{t.num}</span>
                  <div className="col-span-10">
                    <h3 className="text-bone text-lg mb-2 group-hover:translate-x-2 transition-transform duration-500">{t.head}</h3>
                    <p className="text-silver text-sm leading-relaxed">{t.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-px bg-graphite border border-bone/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="bg-ink p-8 md:p-10 group hover:bg-coal transition-colors relative overflow-hidden cursor-default"
              whileHover={{ scale: 1.0 }}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="absolute top-0 left-0 h-px w-12 bg-orange"
              />
              <p className={`display text-5xl md:text-6xl mb-3 ${s.accent ? 'text-orange' : 'text-bone'}`}>
                {s.node}
              </p>
              <p className="text-silver text-xs leading-relaxed max-w-[18ch]">{s.l}</p>
              {/* hover sweep */}
              <span className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-orange/5 to-transparent group-hover:w-full transition-all duration-700 ease-out pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
