import { motion } from 'framer-motion';
import Logo from './Logo';
import SplitText from './SplitText';
import Magnetic from './Magnetic';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-ink text-bone overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-bone/15" />

      <div className="px-6 md:px-12 max-w-[1600px] mx-auto pt-24 md:pt-40 pb-12">
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-3">
            <div className="label text-bone/40">N° 04 â Contact</div>
            <div className="label text-bone/30 mt-2">â60.00m</div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
              <SplitText as="span" className="block">Begin your</SplitText>
              <SplitText as="span" className="block italic text-bone/60" delay={0.15}>descent.</SplitText>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-24 md:mb-32 border-t border-bone/15 pt-12">
          <div className="col-span-12 md:col-span-3">
            <div className="label text-bone/40 mb-3">Studio</div>
            <address className="not-italic text-bone/80 leading-relaxed text-sm">
              Dubai International<br />
              Financial Centre<br />
              Tower 2, Level 17<br />
              Dubai, UAE
            </address>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="label text-bone/40 mb-3">Direct</div>
            <a href="mailto:vault@minus1.studio" className="block text-bone link-underline mb-2 text-sm">
              vault@minus1.studio
            </a>
            <a href="tel:+97140000000" className="block text-bone/80 text-sm">
              +971 4 000 0000
            </a>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="label text-bone/40 mb-3">Discretion</div>
            <p className="text-bone/80 leading-relaxed text-sm">
              All correspondence is encrypted and held under signed NDA. Initial consultations are conducted in person at the client&apos;s location.
            </p>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="label text-bone/40 mb-3">Clearance</div>
            <p className="text-bone/80 leading-relaxed text-sm mb-4">
              Engagement is by referral and qualification. Submit an enquiry to begin verification.
            </p>
            <Magnetic strength={0.3}>
              <a
                href="mailto:vault@minus1.studio?subject=Enquiry"
                data-cursor="SEND"
                className="inline-block label bg-orange text-ink hover:bg-orange-bright transition-all px-5 py-3"
              >
                Request Access
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="border-t border-bone/15 pt-12 mb-12">
          <div className="display text-[18vw] md:text-[14vw] leading-[0.85] tracking-tighter text-bone/95 select-none">
            MINUS&nbsp;1
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 border-t border-bone/15 pt-6 label text-bone/40">
          <div className="col-span-6 md:col-span-3 flex items-center gap-3">
            <Logo className="w-5 h-5 text-orange" />
            <span>MINUS 1 Â· MMXXVI</span>
          </div>
          <div className="hidden md:block md:col-span-3">
            All rights reserved
          </div>
          <div className="hidden md:block md:col-span-3">
            25.2048° N Â· 55.2708° E
          </div>
          <div className="col-span-6 md:col-span-3 text-right">
            Site v.1.0 â Engineered in Dubai
          </div>
        </div>
      </div>
    </footer>
  );
}
