import { motion } from 'framer-motion'

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
]

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative bg-ink border-t hairline py-24 md:py-40 px-6 grain">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-16 md:mb-24 border-b hairline pb-6">
          <p className="label">N° 01 — Manifesto</p>
          <p className="label hidden md:block">A New Layer of Living</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            >
              <p className="display text-bone text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                Not a shelter.<br />
                <span className="italic text-silver">A new standard</span><br />
                of underground living.
              </p>

              <div className="mt-12 max-w-xl space-y-6 text-pale leading-relaxed text-[15px]">
                <p>
                  MINUS 1 is a luxury underground infrastructure brand — designing and delivering private, secure, and fully integrated subterranean environments. We do not build bunkers. We build a layer of life that sits below the everyday one, ready for any future the world decides to offer.
                </p>
                <p>
                  Each project is engineered in military-grade alloys, finished in residential luxury, and concealed inside the architectural fabric of the homes above them. Continuity is the product. Privacy is the proof.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <ul className="divide-y hairline border-y hairline">
              {tenets.map((t, i) => (
                <motion.li
                  key={t.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.65, 0, 0.35, 1] }}
                  className="py-6 grid grid-cols-12 gap-4"
                >
                  <span className="label col-span-2">{t.num}</span>
                  <div className="col-span-10">
                    <h3 className="text-bone text-lg mb-2">{t.head}</h3>
                    <p className="text-silver text-sm leading-relaxed">{t.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-px bg-graphite border hairline-strong"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          {[
            { v: '300%+', l: 'Surge in global demand since 2020' },
            { v: '$2B+', l: 'Underground shelter market valuation' },
            { v: '72h', l: 'Rapid deployment, fully containerized' },
            { v: 'N° 1', l: 'Luxury-positioned in category' },
          ].map((s, i) => (
            <div key={i} className="bg-ink p-8 md:p-10 group hover:bg-coal transition-colors relative">
              <span className="absolute top-0 left-0 h-px w-12 bg-orange" />
              <p className={`display text-5xl md:text-6xl mb-3 ${i === 0 ? 'text-orange' : 'text-bone'}`}>{s.v}</p>
              <p className="text-silver text-xs leading-relaxed max-w-[18ch]">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
