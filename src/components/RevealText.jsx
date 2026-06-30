import { motion, useReducedMotion } from 'framer-motion';

/* Reveal de texto enmascarado, palabra por palabra (estilo SplitText/GSAP).
 * Cada palabra sube desde abajo dentro de una máscara, con stagger al entrar.
 *
 * Props:
 *  - segments: [{ text, className? }]  → permite mezclar estilos (p.ej. acento)
 *  - as: tag del contenedor ('h2', 'span', ...)
 *  - stagger, duration, delay, once, amount
 */
export default function RevealText({
  segments,
  as = 'span',
  className = '',
  stagger = 0.045,
  duration = 0.7,
  delay = 0,
  once = true,
  amount = 0.5,
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.span;

  // Aplana las palabras conservando la clase de cada segmento
  const words = [];
  segments.forEach((seg, si) => {
    seg.text.split(' ').forEach((w, wi) => {
      words.push({ w, className: seg.className || '', key: `${si}-${wi}` });
    });
  });

  const fullText = segments.map((s) => s.text).join(' ');

  if (reduce) {
    return (
      <Tag className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className || ''}>
            {i > 0 ? ' ' : ''}{s.text}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      aria-label={fullText}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map(({ w, className: wc, key }) => (
        <span
          key={key}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
        >
          <motion.span
            className={wc}
            style={{ display: 'inline-block', willChange: 'transform' }}
            variants={{ hidden: { y: '115%' }, show: { y: 0 } }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
