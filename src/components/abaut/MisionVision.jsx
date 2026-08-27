import { useRef } from 'react';
import {
  motion, useScroll, useSpring, useTransform, useMotionTemplate, useReducedMotion,
} from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const EASE = [0.22, 1, 0.36, 1];

export default function MisionVision({ lang }) {
  const { t } = useLanguage(lang);
  const m = t.mission;
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  /* Progreso del scroll a lo largo de toda la sección (sticky). */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });

  /* Mismo gesto que cerrar el menú: la Visión queda de fondo (completa) y la
     Misión, encima, se contrae como un círculo sólido hasta el punto del botón
     del menú (arriba a la derecha), revelando la Visión. Un solo movimiento,
     sin huecos. El radio cubre desde esa esquina hasta la opuesta. */
  const ORIGIN = 'calc(100% - 4.5rem) 3rem';
  const rMission = useTransform(p, [0.08, 0.92], ['175%', '0%']);
  const clipMission = useMotionTemplate`circle(${rMission} at ${ORIGIN})`;

  /* El texto de la Misión se desvanece pronto (deja un círculo sólido que se
     cierra), y el de la Visión aparece cuando ya está revelada. */
  const missionFade = useTransform(p, [0, 0.32], [1, 0]);
  const visionFade  = useTransform(p, [0.5, 0.82], [0, 1]);

  /* Indicador de fase. */
  const missionDim = useTransform(p, [0.35, 0.55], [1, 0.35]);
  const visionDim  = useTransform(p, [0.45, 0.65], [0.35, 1]);
  const barScale   = useTransform(p, [0.08, 0.92], [0, 1]);

  /* ── Fallback estático (reduced-motion): las dos, apiladas ── */
  if (reduce) {
    return (
      <section className="mv2-static">
        <p className="mv2-eyebrow">{m.eyebrow}</p>
        <h2 className="mv2-tagline">{m.tagline}</h2>
        <div className="mv2-static-grid">
          {[
            { n: '01', label: m.missionLabel, title: m.missionTitle, text: m.missionText },
            { n: '02', label: m.visionLabel,  title: m.visionTitle,  text: m.visionText },
          ].map((c) => (
            <article key={c.n} className="mv2-static-card">
              <span className="mv2-num">{c.n}</span>
              <span className="mv2-label">{c.label}</span>
              <h3 className="mv2-title">{c.title}</h3>
              <p className="mv2-text">{c.text}</p>
            </article>
          ))}
        </div>
        <style>{styles}</style>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="mv2-section">
      <div className="mv2-stage">

        {/* Indicador de fase (siempre visible, encima de los paneles) */}
        <div className="mv2-progress">
          <motion.span className="mv2-progress__item" style={{ opacity: missionDim }}>
            <span className="mv2-progress__num">01</span> {m.missionLabel}
          </motion.span>
          <span className="mv2-progress__track">
            <motion.span className="mv2-progress__fill" style={{ scaleX: barScale }} />
          </span>
          <motion.span className="mv2-progress__item" style={{ opacity: visionDim }}>
            <span className="mv2-progress__num">02</span> {m.visionLabel}
          </motion.span>
        </div>

        {/* Panel VISIÓN — queda de fondo, completo */}
        <article className="mv2-panel mv2-panel--vision">
          <motion.div className="mv2-panel__inner" style={{ opacity: visionFade }}>
            <span className="mv2-label">{m.visionLabel}</span>
            <h2 className="mv2-title">{m.visionTitle}</h2>
            <p className="mv2-text">{m.visionText}</p>
          </motion.div>
        </article>

        {/* Panel MISIÓN — encima, se contrae hasta el botón (cierre del menú) */}
        <motion.article className="mv2-panel mv2-panel--mission" style={{ clipPath: clipMission }}>
          <motion.div className="mv2-panel__inner" style={{ opacity: missionFade }}>
            <span className="mv2-label">{m.missionLabel}</span>
            <h2 className="mv2-title">{m.missionTitle}</h2>
            <p className="mv2-text">{m.missionText}</p>
          </motion.div>
        </motion.article>

      </div>

      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .mv2-section {
    position: relative;
    width: 100%;
    height: 260vh;
    font-family: var(--font-body);
  }
  .mv2-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Indicador de fase ── */
  .mv2-progress {
    position: absolute;
    top: clamp(2rem, 9vh, 5rem);
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    align-items: center;
    gap: clamp(0.8rem, 3vw, 2rem);
    pointer-events: none;
    width: min(640px, 86vw);
  }
  .mv2-progress__item {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: clamp(0.78rem, 1.6vw, 0.95rem);
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text);
    white-space: nowrap;
  }
  .mv2-progress__num { font-size: 0.7em; color: var(--accent); }
  .mv2-progress__track {
    flex: 1;
    height: 2px;
    border-radius: 2px;
    background: var(--border);
    overflow: hidden;
  }
  .mv2-progress__fill {
    display: block;
    height: 100%;
    width: 100%;
    transform-origin: left center;
    background: var(--accent);
  }

  /* ── Paneles a pantalla completa ── */
  .mv2-panel {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: clip-path;
  }
  .mv2-panel--mission { background: var(--background); z-index: 2; }
  .mv2-panel--vision  {
    z-index: 1;
    background:
      radial-gradient(120% 120% at calc(100% - 4.5rem) 3rem,
        color-mix(in srgb, var(--accent) 14%, var(--background)),
        var(--background) 70%);
  }

  .mv2-panel__inner {
    width: min(720px, 88vw);
    text-align: center;
    padding: 1.5rem;
  }
  .mv2-label {
    display: inline-block;
    font-size: clamp(0.72rem, 1.6vw, 0.85rem);
    text-transform: uppercase;
    letter-spacing: 0.28em;
    color: var(--accent);
    margin-bottom: 1.25rem;
  }
  .mv2-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--text);
    margin: 0 0 1.5rem;
  }
  .mv2-text {
    font-size: clamp(1.05rem, 2.2vw, 1.4rem);
    line-height: 1.6;
    color: var(--text-muted);
    margin: 0 auto;
    max-width: 600px;
  }

  /* ── Fallback estático ── */
  .mv2-static {
    padding: clamp(5rem, 12vh, 9rem) 2rem;
    text-align: center;
  }
  .mv2-eyebrow {
    font-size: 0.72rem; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--text-muted); margin: 0 0 1rem;
  }
  .mv2-tagline {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800;
    color: var(--accent-text); margin: 0 0 3rem;
  }
  .mv2-static-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;
    max-width: 1100px; margin: 0 auto;
  }
  .mv2-static-card {
    padding: clamp(2rem, 4vw, 3rem);
    border-radius: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    text-align: left;
  }
  .mv2-num {
    display: block; font-size: 0.85rem; font-weight: 700;
    color: color-mix(in srgb, var(--accent) 60%, transparent); margin-bottom: 1rem;
  }
  .mv2-static-card .mv2-text { text-align: left; max-width: none; }

  @media (max-width: 760px) {
    .mv2-static-grid { grid-template-columns: 1fr; }
  }
`;
