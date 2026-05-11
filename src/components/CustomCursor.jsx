import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);

  const x = useSpring(0, { stiffness: 500, damping: 50, mass: 0.5 });
  const y = useSpring(0, { stiffness: 500, damping: 50, mass: 0.5 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e) => {
      const el = e.target.closest('[data-cursor]');
      if (el) {
        setHovering(true);
        setLabel(el.getAttribute('data-cursor') || '');
        return;
      }
      const interactive = e.target.closest('a, button, [role="button"]');
      if (interactive) {
        setHovering(true);
        setLabel('');
      } else {
        setHovering(false);
        setLabel('');
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y, visible]);

  return (
    <motion.div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference hidden md:block"
      style={{ x, y, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: hovering ? (label ? 3 : 2) : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="w-3 h-3 rounded-full border border-bone bg-transparent" />
        {label && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[7px] tracking-[0.2em] uppercase text-bone whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
