import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, cubicBezier } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';

/* Curva de salida suave (la misma del resto del sitio) */
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

/* Flecha del CTA */
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ── Tarjeta del mosaico: aparece y se acomoda en su celda según el scroll ──
   Cada tarjeta es su propio componente → hooks estables aunque cambie idioma.
   Las interpolaciones llevan `ease` (antes eran lineales → entrada "trabada"). */
function MosaicCard({ progress, start, fromX = 0, fromY = 46, area, className, children }) {
  const end = start + 0.16;
  const o = useTransform(progress, [start, start + 0.07], [0, 1]);
  const x = useTransform(progress, [start, end], [fromX, 0], { ease: EASE_OUT });
  const y = useTransform(progress, [start, end], [fromY, 0], { ease: EASE_OUT });
  const scale = useTransform(progress, [start, end], [0.92, 1], { ease: EASE_OUT });
  return (
    <motion.div className={className} style={{ gridArea: area, opacity: o, x, y, scale }}>
      {children}
    </motion.div>
  );
}

export default function AboutTeaser({ lang }) {
  const { t } = useLanguage(lang);
  const a = t.aboutTeaser;
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /* Suaviza el progreso del scroll → el llenado del mosaico deja de sentirse
     "trabado" y gana inercia. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const points = a.points || [];

  /* ── Variante estática (prefers-reduced-motion): mosaico ya armado ── */
  if (reduce) {
    return (
      <>
        <section className="at-static">
          <div className="at-grid">
            <span className="at-badge" style={{ gridArea: 'badge' }}>
              <span className="at-badge__dot" />
              {a.eyebrow}
            </span>
            <div className="at-card at-card--title" style={{ gridArea: 'title' }}>
              <h2 className="at-title">
                {a.title} <span className="at-title__accent">{a.highlight}</span>
              </h2>
            </div>
            <div className="at-card at-card--parral" style={{ gridArea: 'parral' }}>
              <span className="at-card__kicker">{a.fromCity}</span>
              <p className="at-card__body">{a.body}</p>
            </div>
            {points.map((p, i) => (
              <div key={i} className="at-card at-card--point" style={{ gridArea: `p${i + 1}` }}>
                <span className="at-point__num">0{i + 1}</span>
                <span className="at-point__text">{p}</span>
              </div>
            ))}
            <a href={localizedPath("about", lang)} className="at-card at-card--cta" style={{ gridArea: 'cta' }}>
              <span>{a.cta}</span>
              <Arrow />
            </a>
          </div>
        </section>
        <style>{styles}</style>
      </>
    );
  }

  return (
    <>
      <section ref={sectionRef} className="at-section">
        <div className="at-sticky">
          <div className="at-grid">
            <MosaicCard progress={progress} start={0.0} fromX={-40} fromY={0} area="badge" className="at-badge">
              <span className="at-badge__dot" />
              {a.eyebrow}
            </MosaicCard>

            <MosaicCard progress={progress} start={0.1} fromX={-50} fromY={20} area="title" className="at-card at-card--title">
              <h2 className="at-title">
                {a.title} <span className="at-title__accent">{a.highlight}</span>
              </h2>
            </MosaicCard>

            <MosaicCard progress={progress} start={0.26} fromX={50} fromY={20} area="parral" className="at-card at-card--parral">
              <span className="at-card__kicker">{a.fromCity}</span>
              <p className="at-card__body">{a.body}</p>
            </MosaicCard>

            {points.map((p, i) => (
              <MosaicCard
                key={i}
                progress={progress}
                start={0.42 + i * 0.1}
                fromY={56}
                area={`p${i + 1}`}
                className="at-card at-card--point"
              >
                <span className="at-point__num">0{i + 1}</span>
                <span className="at-point__text">{p}</span>
              </MosaicCard>
            ))}

            <MosaicCard progress={progress} start={0.74} fromX={-40} fromY={30} area="cta" className="at-cta-cell">
              <a href={localizedPath("about", lang)} className="at-card at-card--cta">
                <span>{a.cta}</span>
                <Arrow />
              </a>
            </MosaicCard>
          </div>
        </div>
      </section>
      <style>{styles}</style>
    </>
  );
}

const styles = `
  /* ── Scrollytelling: sección alta, mosaico fijo (sticky) que se va llenando ── */
  .at-section {
    background: transparent;
    height: 320vh;
    position: relative;
  }
  .at-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(4.5rem, 9vh, 7rem) clamp(1.4rem, 5vw, 5rem) clamp(2rem, 5vh, 4rem);
  }

  /* ── Mosaico bento ── */
  .at-grid {
    width: 100%;
    max-width: 1300px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto 1fr auto auto;
    grid-template-areas:
      "badge  badge  parral parral"
      "title  title  parral parral"
      "title  title  p1     p2"
      "cta    cta    p3     p3";
    gap: clamp(0.7rem, 1.2vw, 1.1rem);
    height: min(78vh, 660px);
  }
  .at-grid > * { will-change: transform, opacity; }

  /* ── Badge "Quiénes Somos" (navy, horizontal) ── */
  .at-badge {
    align-self: center;
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-size: clamp(0.74rem, 1vw, 0.88rem);
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--brand-ivory);
    background: var(--navy);
    padding: 0.7rem 1.25rem;
    border-radius: 100px;
    white-space: nowrap;
    box-shadow: 0 10px 26px -14px rgba(13, 22, 37, 0.7);
  }
  .at-badge__dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent);
    flex: none;
    box-shadow: 0 0 0 0 rgba(195, 173, 133, 0.6);
    animation: atDotPulse 2.6s ease-out infinite;
  }
  @keyframes atDotPulse {
    0%   { box-shadow: 0 0 0 0 rgba(195, 173, 133, 0.55); }
    70%  { box-shadow: 0 0 0 7px rgba(195, 173, 133, 0); }
    100% { box-shadow: 0 0 0 0 rgba(195, 173, 133, 0); }
  }

  /* ── Tarjeta base ── */
  .at-card {
    position: relative;
    border-radius: 22px;
    padding: clamp(1.3rem, 2.2vw, 2.2rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.45);
    transition: box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
  }
  /* Filo superior tenue: da volumen sin cambiar la paleta. */
  .at-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  /* Tarjeta del título — navy de fondo, foco visual principal */
  .at-card--title {
    overflow: hidden;
    background:
      radial-gradient(120% 120% at 100% 0%, rgba(195, 173, 133, 0.18) 0%, rgba(195, 173, 133, 0) 45%),
      var(--navy);
    border-color: var(--navy);
    justify-content: flex-end;
    box-shadow: 0 22px 60px -28px rgba(13, 22, 37, 0.85);
  }
  .at-title {
    font-size: clamp(1.9rem, 3.6vw, 3.4rem);
    font-weight: 900;
    line-height: 1.05;
    color: var(--brand-ivory);
    margin: 0;
  }
  .at-title__accent {
    color: var(--accent);
    font-weight: 300;
  }

  /* Tarjeta "Desde Parral" + body */
  .at-card--parral { gap: 0.9rem; }
  .at-card__kicker {
    font-size: clamp(1.1rem, 1.7vw, 1.5rem);
    font-weight: 800;
    color: var(--text);
    line-height: 1.15;
  }
  .at-card__kicker::before {
    content: '';
    display: block;
    width: 2.2rem;
    height: 3px;
    background: var(--accent);
    margin-bottom: 1rem;
    border-radius: 2px;
  }
  .at-card__body {
    font-size: clamp(0.92rem, 1.15vw, 1.08rem);
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0;
  }

  /* Tarjetas de puntos — número grande "marca de agua" + texto al frente */
  .at-card--point {
    overflow: hidden;
    justify-content: flex-end;
    gap: 0.6rem;
  }
  .at-card--point:hover {
    border-color: var(--accent);
    box-shadow: 0 18px 44px -22px rgba(0, 0, 0, 0.55);
    background: var(--surface-2);
  }
  .at-point__num {
    position: absolute;
    top: -0.6rem;
    right: 0.4rem;
    font-family: var(--font-display), system-ui, sans-serif;
    font-size: clamp(3.4rem, 7vw, 5rem);
    font-weight: 900;
    line-height: 1;
    color: var(--accent);
    opacity: 0.14;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }
  .at-card--point:hover .at-point__num { opacity: 0.26; }
  .at-point__text {
    position: relative;
    font-size: clamp(0.95rem, 1.3vw, 1.18rem);
    font-weight: 700;
    color: var(--text);
    line-height: 1.25;
  }
  /* Línea de acento que crece en hover bajo el texto */
  .at-point__text::after {
    content: '';
    display: block;
    width: 1.4rem;
    height: 3px;
    margin-top: 0.7rem;
    border-radius: 2px;
    background: var(--accent);
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .at-card--point:hover .at-point__text::after { width: 2.8rem; }

  /* Celda y botón CTA */
  .at-cta-cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .at-card--cta {
    flex-direction: row;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
    height: 100%;
    justify-content: center;
    background:
      radial-gradient(140% 140% at 0% 100%, rgba(195, 173, 133, 0.22) 0%, rgba(195, 173, 133, 0) 50%),
      var(--navy);
    border-color: var(--navy);
    color: var(--brand-ivory);
    font-weight: 700;
    letter-spacing: 0.01em;
    font-size: clamp(0.95rem, 1.2vw, 1.1rem);
    text-decoration: none;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
  }
  .at-card--cta:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 44px -18px rgba(13, 22, 37, 0.8);
  }
  /* La flecha vive en un chip dorado que se desliza en hover */
  .at-card--cta svg {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    padding: 7px;
    border-radius: 50%;
    color: var(--brand-navy);
    background: var(--accent);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .at-card--cta:hover svg { transform: translateX(5px); }

  /* ── Mobile: el mosaico se vuelve una columna ──
     Importante: la capa .at-sticky mide 100vh; si las celdas apiladas miden
     más, se derraman sobre las secciones vecinas (encimado). Por eso aquí
     comprimimos tipografías/paddings/gaps, mantenemos 2 columnas hasta muy
     estrecho, y recortamos cualquier sobrante con overflow:hidden. */
  @media (max-width: 768px) {
    .at-section { height: 300vh; }
    .at-sticky {
      align-content: center;
      overflow: hidden;
      padding: clamp(4.5rem, 9vh, 7rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 4vh, 3rem);
    }
    .at-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto auto auto;
      grid-template-areas:
        "badge  badge"
        "title  title"
        "parral parral"
        "p1     p2"
        "cta    p3";
      height: auto;
      max-height: 100%;
      gap: 0.55rem;
    }
    .at-card { padding: clamp(0.85rem, 3vw, 1.3rem); border-radius: 16px; }
    .at-card--title { justify-content: center; }
    .at-title { font-size: clamp(1.6rem, 6.5vw, 2.4rem); }
    .at-card__body {
      font-size: 0.9rem;
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .at-badge { padding: 0.5rem 1rem; font-size: 0.7rem; }
  }
  @media (max-width: 380px) {
    .at-grid {
      grid-template-columns: 1fr;
      grid-template-areas:
        "badge"
        "title"
        "parral"
        "p1"
        "p2"
        "p3"
        "cta";
    }
    .at-card__body { -webkit-line-clamp: 3; }
  }

  /* ── Variante estática ── */
  .at-static {
    background: transparent;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: clamp(5rem, 12vh, 8rem) clamp(1.4rem, 5vw, 5rem);
  }
  .at-static .at-grid { height: auto; }

  @media (prefers-reduced-motion: reduce) {
    .at-card--cta, .at-card--cta svg { transition: none !important; }
    .at-badge__dot { animation: none !important; }
  }
`;
