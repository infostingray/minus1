import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const lineUp = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] } },
}

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.65, 0, 0.35, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-ink grain">
      {/* Blueprint backdrop layer */}
      <motion.div
        className="absolute inset-0 blueprint-grid opacity-60"
        style={{ y, scale }}
      />

      {/* Background image as faint silhouette */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <img
          src="/images/installation-trench.jpg"
          alt=""
          className="h-full w-full object-cover grayscale opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/60 to-ink" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-between px-6 pt-32 pb-12 md:pt-36"
        style={{ opacity }}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Top metadata row */}
        <motion.div className="flex items-start justify-between" variants={fadeUp}>
          <div className="max-w-xs">
            <p className="label mb-3">— Filed Under</p>
            <p className="font-mono text-sm text-pale leading-relaxed">
              Subterranean Infrastructure / Private Continuity / Architectural Concealment
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="label mb-3">— Edition</p>
            <p className="font-mono text-sm text-pale">N° 001 · MMXXVI</p>
          </div>
        </motion.div>

        {/* Massive display title */}
        <div className="text-center -my-8 md:-my-12">
          <div className="overflow-hidden">
            <motion.h1
              variants={lineUp}
              className="display text-bone text-[26vw] md:text-[22vw] lg:text-[20vw] leading-[0.82]"
            >
              MINUS
            </motion.h1>
          </div>

          {/* Hairline + 1 + hairline */}
          <motion.div
            className="flex items-center justify-center gap-6 md:gap-10 my-2 md:my-4"
            variants={fadeUp}
          >
            <span className="h-px flex-1 max-w-[18vw] bg-bone/30" />
            <span className="display italic text-bone text-[14vw] md:text-[10vw] leading-none">
              1
            </span>
            <span className="h-px flex-1 max-w-[18vw] bg-bone/30" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.p
              variants={lineUp}
              className="font-mono text-[11px] md:text-xs tracking-[0.5em] uppercase text-silver"
            >
              A New Layer of Living
            </motion.p>
          </div>
        </div>

        {/* Bottom row */}
        <motion.div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-10 items-end" variants={fadeUp}>
          <div className="col-span-2 md:col-span-4">
            <p className="label mb-3">— Synopsis</p>
            <p className="text-pale text-sm md:text-base leading-relaxed max-w-sm">
              Private underground environments engineered for continuity, privacy, and control. Not a shelter. A new standard of subterranean living for the world's most discerning individuals.
            </p>
          </div>

          {/* Center: depth indicator */}
          <div className="hidden md:flex md:col-span-4 flex-col items-center">
            <p className="label mb-3">Descend</p>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-silver">scroll</span>
              <motion.span
                className="block w-px h-12 bg-bone/40 origin-top"
                animate={{ scaleY: [0.2, 1, 0.2] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="font-mono text-xs text-silver tabular-nums">−15.00m</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-4 md:text-right">
            <p className="label mb-3">— Origin</p>
            <p className="font-mono text-sm text-pale leading-relaxed">
              Engineered in the GCC<br/>
              Delivered Globally
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t hairline overflow-hidden bg-ink/60 backdrop-blur-sm z-10">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-8 px-4 label">
              <span>● Vault Series Available</span>
              <span>— Modular Citadel Compounds</span>
              <span>— Bespoke Ark Complexes</span>
              <span>— NBC-Grade Filtration</span>
              <span>— 72hr Rapid Deployment</span>
              <span>— Blast Resistance 1MPa</span>
              <span>● Filed N° 001 / MMXXVI</span>
              <span>— Vault Series Available</span>
              <span>— Modular Citadel Compounds</span>
              <span>— Bespoke Ark Complexes</span>
              <span>— NBC-Grade Filtration</span>
              <span>— 72hr Rapid Deployment</span>
              <span>— Blast Resistance 1MPa</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
