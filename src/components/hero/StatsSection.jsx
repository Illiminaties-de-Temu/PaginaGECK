import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, cubicBezier } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const STATS_VALUES = [
  { value: 20,  suffix: '+' },
  { value: 5,   suffix: '' },
  { value: 48,  suffix: ' hr' },
  { value: 100, suffix: '%' },
];

const EASE = cubicBezier(0.22, 1, 0.36, 1);

/* Ventana de cada estadística dentro del progreso [0..1] del scroll.
   in → aparece · hold → centrada (número ya contado) · out/gone → se va hacia arriba.
   El tramo final [0.80..1] queda libre para el clímax (headline + CTA). */
const SLOTS = [
  { in: 0.02, hold: 0.11, out: 0.18, gone: 0.23 },
  { in: 0.21, hold: 0.30, out: 0.37, gone: 0.42 },
  { in: 0.40, hold: 0.49, out: 0.56, gone: 0.61 },
  { in: 0.59, hold: 0.68, out: 0.74, gone: 0.79 },
];

/* ── Una estadística contada por el scroll ── */
function StoryStat({ value, suffix, label, slot, progress }) {
  const opacity = useTransform(progress, [slot.in, slot.hold, slot.out, slot.gone], [0, 1, 1, 0]);
  const y       = useTransform(progress, [slot.in, slot.hold, slot.out, slot.gone], [70, 0, 0, -70], { ease: EASE });
  const scale   = useTransform(progress, [slot.in, slot.hold], [0.88, 1], { ease: EASE });
  const count   = useTransform(progress, [slot.in, slot.hold], [0, value]);
  const text    = useTransform(count, (v) => Math.round(v) + suffix);

  return (
    <motion.div className="sty__stat" style={{ opacity, y, scale }}>
      <motion.span className="sty__num">{text}</motion.span>
      <span className="sty__label">{label}</span>
    </motion.div>
  );
}

/* ── Clímax: a donde desemboca todo ── */
function Climax({ headline, cta, progress }) {
  const opacity = useTransform(progress, [0.80, 0.90], [0, 1]);
  const y       = useTransform(progress, [0.80, 0.92], [70, 0], { ease: EASE });
  const scale   = useTransform(progress, [0.80, 0.92], [0.92, 1], { ease: EASE });

  return (
    <motion.div className="sty__climax" style={{ opacity, y, scale }}>
      <p className="sty__headline">{headline}</p>
      <a href="/contacto" className="sty__btn">
        {cta}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </motion.div>
  );
}

export default function StatsSection() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const STATS = STATS_VALUES.map((s, i) => ({ ...s, label: t.stats.items[i].label }));

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90, damping: 26, mass: 0.35, restDelta: 0.0005,
  });

  /* ── Fallback estático (reduced-motion): sin sticky-scroll ── */
  if (reduce) {
    return (
      <>
        <section className="sty sty--static">
          <span className="sty__tag">{t.stats.tag}</span>
          <div className="sty__static-grid">
            {STATS.map((s, i) => (
              <div key={i} className="sty__static-item">
                <span className="sty__num">{s.value}{s.suffix}</span>
                <span className="sty__label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="sty__climax sty__climax--static">
            <p className="sty__headline">{t.stats.headline}</p>
            <a href="/contacto" className="sty__btn">
              {t.stats.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
        <style>{styles}</style>
      </>
    );
  }

  return (
    <>
      <section ref={sectionRef} className="sty">
        <div className="sty__stage">
          <span className="sty__tag">{t.stats.tag}</span>
          <div className="sty__deck">
            {STATS.map((s, i) => (
              <StoryStat key={i} {...s} slot={SLOTS[i]} progress={progress} />
            ))}
            <Climax headline={t.stats.headline} cta={t.stats.cta} progress={progress} />
          </div>
        </div>
      </section>
      <style>{styles}</style>
    </>
  );
}

const styles = `
  .sty {
    position: relative;
    height: 300vh;                 /* recorrido de scroll de la narrativa */
    background: var(--background);
  }

  /* Escenario fijo mientras se cuenta la historia */
  .sty__stage {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(2rem, 6vh, 4rem);
    padding: 2rem;
    overflow: hidden;
    text-align: center;
  }

  .sty__tag {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--text-muted);
    padding-bottom: 0.9rem;
    border-bottom: 2px solid var(--accent);
  }

  /* Lienzo donde se superponen las estadísticas y el clímax */
  .sty__deck {
    position: relative;
    width: 100%;
    max-width: 960px;
    height: clamp(280px, 46vh, 420px);
  }

  .sty__stat,
  .sty__climax {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(0.75rem, 2vh, 1.4rem);
    will-change: transform, opacity;
  }

  .sty__num {
    font-size: clamp(4.5rem, 15vw, 11rem);
    font-weight: 900;
    line-height: 0.9;
    color: var(--accent-text);
    letter-spacing: -0.04em;
  }

  .sty__label {
    font-size: clamp(1rem, 2.2vw, 1.5rem);
    font-weight: 400;
    color: var(--text-muted);
    letter-spacing: 0.01em;
    line-height: 1.4;
    max-width: 24ch;
  }

  /* ── Clímax ── */
  .sty__headline {
    font-size: clamp(1.8rem, 4.5vw, 3.2rem);
    font-weight: 800;
    color: var(--text);
    line-height: 1.12;
    letter-spacing: -0.02em;
    margin: 0 auto clamp(2rem, 4.5vh, 2.8rem);
    max-width: 18ch;
  }

  .sty__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1.1rem 2.8rem;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: var(--on-accent);
    background: var(--accent);
    border-radius: 999px;
    text-decoration: none;
    box-shadow: 0 16px 38px -10px color-mix(in srgb, var(--accent) 65%, transparent);
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 0.25s ease, gap 0.25s ease;
  }
  .sty__btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 52px -10px color-mix(in srgb, var(--accent) 75%, transparent);
    gap: 0.95rem;
  }
  .sty__btn svg { transition: transform 0.25s ease; }
  .sty__btn:hover svg { transform: translateX(3px); }

  /* ── Fallback estático ── */
  .sty--static {
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(2.5rem, 6vh, 4rem);
    padding: clamp(4rem, 9vh, 7rem) 2rem;
    text-align: center;
  }
  .sty__static-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem 1rem;
    max-width: 920px;
    width: 100%;
  }
  .sty__static-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .sty--static .sty__num { font-size: clamp(2.75rem, 6vw, 4.5rem); line-height: 1; }
  .sty__climax--static { position: static; inset: auto; }

  @media (max-width: 700px) {
    .sty__static-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (prefers-reduced-motion: reduce) {
    .sty__btn, .sty__btn svg { transition: none !important; }
  }
`;
