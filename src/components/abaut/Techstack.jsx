import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const categoriesBase = [
  { id: 'frontend',  techs: [ { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB' }, { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs/ffffff' }, { name: 'Astro', logo: 'https://cdn.simpleicons.org/astro/FF5D01' }, { name: 'TypeScript', logo: 'https://cdn.simpleicons.org/typescript/3178C6' }, { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' }, { name: 'Tailwind', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' }, { name: 'HTML', logo: 'https://cdn.simpleicons.org/html5/E34F26' }, { name: 'CSS', logo: 'https://cdn.simpleicons.org/css/1572B6' } ] },
  { id: 'mobile',    techs: [ { name: 'Flutter', logo: 'https://cdn.simpleicons.org/flutter/02569B' }, { name: 'Swift', logo: 'https://cdn.simpleicons.org/swift/F05138' }, { name: 'Kotlin', logo: 'https://cdn.simpleicons.org/kotlin/7F52FF' } ] },
  { id: 'design',    techs: [ { name: 'Figma', logo: 'https://cdn.simpleicons.org/figma/F24E1E' }, { name: 'Vite', logo: 'https://cdn.simpleicons.org/vite/646CFF' } ] },
  { id: 'cloud',     techs: [ { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' }, { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/2496ED' }, { name: 'Git', logo: 'https://cdn.simpleicons.org/git/F05032' }, { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/ffffff' }, { name: 'Vercel', logo: 'https://cdn.simpleicons.org/vercel/ffffff' } ] },
  { id: 'backend',   techs: [ { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/339933' }, { name: 'Python', logo: 'https://cdn.simpleicons.org/python/3776AB' }, { name: 'Django', logo: 'https://cdn.simpleicons.org/django/ffffff' }, { name: 'FastAPI', logo: 'https://cdn.simpleicons.org/fastapi/009688' }, { name: 'PHP', logo: 'https://cdn.simpleicons.org/php/777BB4' }, { name: 'GraphQL', logo: 'https://cdn.simpleicons.org/graphql/E10098' } ] },
  { id: 'databases', techs: [ { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql/4169E1' }, { name: 'MongoDB', logo: 'https://cdn.simpleicons.org/mongodb/47A248' }, { name: 'Redis', logo: 'https://cdn.simpleicons.org/redis/DC382D' }, { name: 'Supabase', logo: 'https://cdn.simpleicons.org/supabase/3ECF8E' }, { name: 'Firebase', logo: 'https://cdn.simpleicons.org/firebase/FFCA28' }, { name: 'Prisma', logo: 'https://cdn.simpleicons.org/prisma/ffffff' } ] },
];

const easeExpo = [0.16, 1, 0.3, 1];
const N = categoriesBase.length;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 22, scale: 0.8 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: easeExpo } },
};

function pad(n) { return String(n).padStart(2, '0'); }

function IconList({ techs }) {
  return (
    <motion.div className="bts-icons" variants={container} initial="hidden" animate="show">
      {techs.map((tech) => (
        <motion.div key={tech.name} className="bts-icon" variants={item}>
          <img src={tech.logo} alt={tech.name} className="bts-icon__img" loading="lazy" width="48" height="48" />
          <span className="bts-icon__name">{tech.name}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function TechStack() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const categories = categoriesBase.map((c) => ({ ...c, label: t.tech.catLabels[c.id] }));

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive(idx);
  });

  /* ── Fallback estático (reduced-motion): lista de categorías ── */
  if (reduce) {
    return (
      <section className="bts-section bts-section--static">
        <div className="bts-heading">
          <p className="bts-eyebrow">{t.tech.eyebrow}</p>
          <h2 className="bts-title">{t.tech.title} <span className="bts-gold">{t.tech.highlight}</span></h2>
        </div>
        <div className="bts-static-list">
          {categories.map((c, i) => (
            <div key={c.id} className="bts-static-cat">
              <span className="bts-cat-num">{pad(i + 1)}</span>
              <div>
                <span className="bts-cat-label">{c.label}</span>
                <div className="bts-icons">
                  {c.techs.map((tech) => (
                    <div key={tech.name} className="bts-icon">
                      <img src={tech.logo} alt={tech.name} className="bts-icon__img" loading="lazy" width="48" height="48" />
                      <span className="bts-icon__name">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>{styles}</style>
      </section>
    );
  }

  const current = categories[active];

  return (
    <section ref={sectionRef} className="bts-section" style={{ height: `${N * 72}vh` }}>
      <div className="bts-stage">

        <div className="bts-heading">
          <p className="bts-eyebrow">{t.tech.eyebrow}</p>
          <h2 className="bts-title">{t.tech.title} <span className="bts-gold">{t.tech.highlight}</span></h2>
        </div>

        <div className="bts-body">

          {/* Índice de categorías (desktop) */}
          <nav className="bts-index" aria-hidden="true">
            {categories.map((c, i) => (
              <span key={c.id} className={`bts-index__item${i === active ? ' is-active' : ''}`}>
                <span className="bts-index__num">{pad(i + 1)}</span>
                {c.label}
              </span>
            ))}
          </nav>

          {/* Showcase de la categoría activa */}
          <div className="bts-show">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={current.id}
                className="bts-panel"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easeExpo } }}
                exit={{ opacity: 0, y: -24, transition: { duration: 0.3, ease: easeExpo } }}
              >
                <span className="bts-panel__count">{pad(active + 1)} <span className="bts-panel__total">/ {pad(N)}</span></span>
                <h3 className="bts-panel__label">{current.label}</h3>
                <IconList techs={current.techs} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progreso (mobile + refuerzo) */}
        <div className="bts-progress" aria-hidden="true">
          {categories.map((c, i) => (
            <span key={c.id} className={`bts-progress__dot${i === active ? ' is-active' : ''}`} />
          ))}
        </div>
      </div>

      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .bts-section {
    position: relative;
    width: 100%;
    background: transparent;
    font-family: var(--font-body);
  }

  .bts-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: clamp(2.5rem, 7vh, 5rem) clamp(1.5rem, 5vw, 4rem);
    box-sizing: border-box;
    overflow: hidden;
  }

  /* ── Heading ── */
  .bts-heading { text-align: center; flex-shrink: 0; }
  .bts-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 14px;
    opacity: 0.9;
  }
  .bts-title {
    font-size: clamp(1.8rem, 4.5vw, 3.4rem);
    font-weight: 700;
    color: var(--text);
    margin: 0;
    line-height: 1.15;
  }
  .bts-gold { color: var(--accent-text); font-weight: 300; }

  /* ── Cuerpo: índice + showcase ── */
  .bts-body {
    flex: 1;
    display: flex;
    align-items: center;
    gap: clamp(2rem, 6vw, 5rem);
    max-width: 1180px;
    width: 100%;
    margin: 0 auto;
  }

  /* Índice lateral */
  .bts-index {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-shrink: 0;
    width: 230px;
  }
  .bts-index__item {
    display: flex;
    align-items: baseline;
    gap: 0.8rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-muted);
    opacity: 0.45;
    transition: opacity 0.35s ease, color 0.35s ease, transform 0.35s ease;
  }
  .bts-index__num {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }
  .bts-index__item.is-active {
    opacity: 1;
    color: var(--accent-text);
    transform: translateX(6px);
  }
  .bts-index__item.is-active .bts-index__num { color: var(--accent); }

  /* Showcase */
  .bts-show {
    flex: 1;
    position: relative;
    min-height: 360px;
    display: flex;
    align-items: center;
  }
  .bts-panel {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    will-change: transform, opacity;
  }
  .bts-panel__count {
    font-family: ui-monospace, 'Courier New', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--accent);
    margin-bottom: 0.6rem;
  }
  .bts-panel__total { color: var(--text-muted); }
  .bts-panel__label {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    color: var(--text);
    margin: 0 0 2rem;
    line-height: 1.1;
  }

  /* ── Iconos ── */
  .bts-icons {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(1.4rem, 2.5vw, 2.4rem);
    align-content: flex-start;
  }
  .bts-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    cursor: default;
  }
  .bts-icon__img {
    width: 66px;
    height: 66px;
    padding: 13px;
    box-sizing: border-box;
    object-fit: contain;
    background: #0f2138;
    border: 1px solid color-mix(in srgb, var(--accent) 16%, transparent);
    border-radius: 14px;
    transition: transform 0.25s ease, border-color 0.25s ease;
  }
  .bts-icon:hover .bts-icon__img {
    transform: translateY(-4px) scale(1.08);
    border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  }
  .bts-icon__name {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  /* ── Progreso (puntos) ── */
  .bts-progress {
    display: flex;
    justify-content: center;
    gap: 0.6rem;
    flex-shrink: 0;
    margin-top: 1.5rem;
  }
  .bts-progress__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
    transition: background 0.35s ease, transform 0.35s ease;
  }
  .bts-progress__dot.is-active {
    background: var(--accent);
    transform: scale(1.4);
  }

  /* ── Mobile ── */
  @media (max-width: 820px) {
    .bts-index { display: none; }
    .bts-body { justify-content: center; text-align: center; }
    .bts-show { min-height: 320px; }
    .bts-panel { align-items: center; text-align: center; }
    .bts-icons { justify-content: center; }
  }

  /* ── Fallback estático ── */
  .bts-section--static {
    padding: 120px 28px 140px;
  }
  .bts-section--static .bts-heading { margin-bottom: 72px; }
  .bts-static-list {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }
  .bts-static-cat { display: flex; gap: 24px; align-items: flex-start; }
  .bts-cat-num {
    font-family: ui-monospace, monospace;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--accent);
    padding-top: 6px;
  }
  .bts-cat-label {
    display: block;
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 1.2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .bts-icon__img { transition: none; }
  }
`;
