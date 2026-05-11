import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const navItems = [
  { num: '01', label: 'Manifesto', href: '#manifesto' },
  { num: '02', label: 'Bunkers', href: '#bunkers' },
  { num: '03', label: 'Domes', href: '#domes' },
  { num: '04', label: 'Archive', href: '#gallery' },
  { num: '05', label: 'Catalogue', href: '#catalogue' },
  { num: '06', label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const h = String(d.getUTCHours()).padStart(2, '0')
      const m = String(d.getUTCMinutes()).padStart(2, '0')
      const s = String(d.getUTCSeconds()).padStart(2, '0')
      setTime(h + ':' + m + ':' + s + ' UTC')
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 hidden md:flex items-center justify-between px-6 py-2 border-b hairline bg-ink/80 backdrop-blur-md">
        <div className="flex items-center gap-6 label">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
            <span className="text-orange">Operational</span>
          </span>
          <span>25.2048 N / 55.2708 E</span>
        </div>
        <div className="flex items-center gap-6 label">
          <span>Depth Index <span className="text-orange">-15.00m</span></span>
          <span className="tabular-nums">{time}</span>
        </div>
      </div>

      <header className={'fixed left-0 right-0 z-40 transition-all duration-500 md:top-9 top-0 ' + (scrolled ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent')}>
        <div className="flex items-center justify-between px-6 py-5 border-b hairline">
          <a href="#top" className="text-bone hover:opacity-70 transition-opacity">
            <Logo />
          </a>

          <nav className="hidden lg:flex items-center gap-10">
            {navItems.slice(0, 4).map((item) => (
              <a key={item.label} href={item.href} className="group flex items-center gap-2 text-bone link-underline">
                <span className="label text-silver group-hover:text-bone transition-colors">{item.num}</span>
                <span className="text-sm tracking-wide">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Hamburger — mobile/tablet only, opens slide-out menu */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu"
              className="lg:hidden flex flex-col gap-[5px] p-2 text-bone hover:text-orange transition-colors"
            >
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-concierge'))}
              className="group flex items-center gap-3 bg-orange text-ink px-4 md:px-5 py-2.5 hover:bg-orange-bright transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase">Concierge</span>
              <span className="hidden md:inline">→</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-ink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <motion.div className="absolute inset-0 grain" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }} />

            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b hairline">
                <Logo />
                <button onClick={() => setOpen(false)} className="group flex items-center gap-3 border hairline-strong px-4 py-2.5 hover:bg-bone hover:text-ink transition-colors duration-300" aria-label="Close menu">
                  <span className="font-mono text-[11px] tracking-[0.22em] uppercase">Close</span>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 grid lg:grid-cols-12 gap-px bg-graphite overflow-hidden">
                <div className="lg:col-span-7 bg-ink p-10 lg:p-16 flex flex-col justify-between">
                  <div>
                    <p className="label mb-10">— Index of Sections</p>
                    <ul className="space-y-2">
                      {navItems.map((item, i) => (
                        <motion.li key={item.label} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, ease: [0.65, 0, 0.35, 1], duration: 0.7 }}>
                          <a href={item.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-6 py-3 border-b hairline hover:border-bone transition-colors">
                            <span className="label text-silver group-hover:text-bone transition-colors">{item.num}</span>
                            <span className="display text-5xl lg:text-7xl text-bone group-hover:translate-x-2 transition-transform duration-500">{item.label}</span>
                            <span className="ml-auto label opacity-0 group-hover:opacity-100 transition-opacity">↗ Enter</span>
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-8 max-w-md">
                    <div>
                      <p className="label mb-2">Studio</p>
                      <p className="text-sm text-pale leading-relaxed">Dubai International Financial Centre, Tower 2, L-17</p>
                    </div>
                    <div>
                      <p className="label mb-2">Hours</p>
                      <p className="text-sm text-pale leading-relaxed">By Appointment, 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-coal p-10 lg:p-16 relative overflow-hidden">
                  <div className="absolute top-6 right-6 label">Clearance · Tier I</div>
                  <div className="relative h-full flex flex-col justify-between">
                    <div>
                      <p className="label mb-6">— Direct Line</p>
                      <a href="mailto:vault@minus1.studio" className="display text-3xl lg:text-4xl text-bone link-underline">vault@minus1.studio</a>
                      <p className="mt-4 font-mono text-sm text-silver">+971 4 000 0000</p>
                    </div>

                    <svg viewBox="0 0 300 300" className="absolute -right-20 -bottom-20 w-[420px] opacity-[0.07]" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="50" y="50" width="200" height="200" />
                      <rect x="80" y="80" width="140" height="140" />
                      <line x1="50" y1="150" x2="250" y2="150" />
                      <line x1="150" y1="50" x2="150" y2="250" />
                      <circle cx="150" cy="150" r="40" />
                      <circle cx="150" cy="150" r="80" />
                    </svg>

                    <div>
                      <p className="label mb-3">Active Inquiries</p>
                      <div className="flex items-baseline gap-3">
                        <span className="display text-6xl text-bone">14</span>
                        <span className="font-mono text-xs text-silver">queued · 72h response</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
