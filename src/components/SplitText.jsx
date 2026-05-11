import { motion } from 'framer-motion';

/**
 * SplitText — fades each word up on viewport entry. No overflow clipping,
 * which was eating descenders and making whole sections look empty.
 */
export default function SplitText({
  children,
  className = '',
  delay = 0,
  stagger = 0.05,
  duration = 0.8,
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
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once, amount: 0.15 }}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}
