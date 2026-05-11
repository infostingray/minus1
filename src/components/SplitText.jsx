import { motion } from 'framer-motion';

/**
 * SplitText — animates each word in a heading with a mask reveal.
 * Words slide up from below an invisible line on viewport entry.
 */
export default function SplitText({
  children,
  className = '',
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
  as: Tag = 'span',
  once = true,
}) {
  if (typeof children !== 'string') {
    return <Tag className={className}>{children}</Tag>;
  }

  const words = children.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ lineHeight: '1' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once, margin: '-10% 0px' }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
