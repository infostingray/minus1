import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * Counter — animates a number from 0 to target when scrolled into view.
 * Preserves any non-numeric suffix/prefix passed via `prefix` and `suffix`.
 */
export default function Counter({ to, prefix = '', suffix = '', duration = 2, decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    return rounded.on('change', (v) => setDisplay(v));
  }, [rounded]);

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, {
        duration,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, mv, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
