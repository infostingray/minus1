import { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * Magnetic — wraps any child element to make it gravitate toward the cursor on hover.
 */
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 20, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 20, mass: 0.4 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
