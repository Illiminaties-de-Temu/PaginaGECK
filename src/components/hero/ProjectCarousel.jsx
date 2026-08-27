import { useState, useEffect, useRef } from 'react';
import {
  motion, useScroll, useSpring, useTransform, useMotionTemplate,
  useMotionValueEvent, useReducedMotion,
} from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';

const PROJECTS = [
  { id:1, title:'Chuchulucos',    cat:'landing',  image:'/assets/image/portafolio/chuchu.webp',          link:'https://chuchulucos.geckcodex.com/' },
  { id:2, title:'Agend-In',       cat:'landing',  image:'/assets/image/portafolio/agendin.webp',         link:'https://agend-in.geckcodex.com/' },
  { id:3, title:'LandingKit',     cat:'landing',  image:'/assets/image/portafolio/landig.webp',          link:'https://landig-plantilla.geckcodex.com/' },
  { id:6, title:'Mi Caja POS',    cat:'landing',  image:'/assets/image/portafolio/micaja.webp',          link:'https://mi-caja.geckcodex.com/' },
  { id:7, title:'FleetTrack',     cat:'mobile',   image:'/assets/image/portafolio/capital transpor.webp' },
  { id:8, title:'Coronado Gym',   cat:'webapp',   image:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&q=80&auto=format&fit=crop' },
];

/* Acentos de categoría dentro de la paleta (oro / bronce), sin arcoíris */
const CAT_ACCENT = {
  landing:  '#C3AD85',
  mobile:   '#D9C49A',
  webapp:   '#957952',
  software: '#B5A079',
};

const FALLBACK_BG = 'linear-gradient(145deg,#0D1625,#16223A,#2A3441)';

const RING = [...PROJECTS, ...PROJECTS, ...PROJECTS];
const STEP = 360 / RING.length;

/* ─── CONTENIDO DE TARJETA ───────────────────────────────────────────── */
function CardInner({ project, catLabels }) {
  const accent = CAT_ACCENT[project.cat];
  return (
    <div
      className="pc-card__frame"
      style={project.image ? undefined : { background: FALLBACK_BG }}
    >
      {project.image && (
        <img
          src={project.image}
          alt={`${project.title} — proyecto desarrollado por Geck Codex`}
          className="pc-card__img"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      )}
      <div className="pc-card__veil" />
      <div className="pc-card__info">
        <span
          className="pc-card__cat"
          style={{ color: accent, borderColor: accent + '55', background: accent + '18' }}
        >
          {catLabels[project.cat]}
        </span>
        <p className="pc-card__name">{project.title}</p>
      </div>
    </div>
  );
}

/* ─── SLOT — posición polar fija + entrada animada por scroll ─────────── */
function WheelSlot({ p, i, progress, catLabels, hovered, onEnter, onLeave, reduce }) {
  /* Todas las tarjetas entran en la MISMA ventana de scroll (sin escalonado por
     índice) para que el arco aparezca de un jalón y no "por partes". */
  const start = 0.18;
  const opacity = useTransform(progress, [start, start + 0.12], [0, 1]);
  const scale   = useTransform(progress, [start, start + 0.18], [0.5, 1]);
  const yNum    = useTransform(progress, [start, start + 0.18], [70, 0]);
  const y       = useMotionTemplate`${yNum}px`;

  return (
    <div
      className={`pc-slot${hovered ? ' is-hovered' : ''}`}
      style={{ transform: `rotate(${i * STEP}deg) translateY(calc(var(--r) * -1))` }}
    >
      <motion.div
        className="pc-card"
        style={reduce ? undefined : { opacity, scale, translateY: y }}
        onMouseEnter={(e) => onEnter(p, i)}
        onMouseLeave={onLeave}
      >
        <CardInner project={p} catLabels={catLabels} />
      </motion.div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function ProjectCarousel({ lang }) {
  const { t } = useLanguage(lang);
  const reduce = useReducedMotion();
  const [active,  setActive]  = useState(null);   // { project, idx }
  const [assembled, setAssembled] = useState(false);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => setAssembled(v > 0.5));

  /* Transforms del título (aparece primero, sube y se asienta) */
  const headYNum  = useTransform(progress, [0, 0.4], [32, 0]);
  const headY     = useMotionTemplate`${headYNum}vh`;
  const headScale = useTransform(progress, [0, 0.4], [1.12, 1]);
  const ctaOp     = useTransform(progress, [0.5, 0.7], [0, 1]);

  /* Transforms del escenario (arco) */
  const stageOp   = useTransform(progress, [0.12, 0.4], [0, 1]);
  const stageYNum = useTransform(progress, [0.12, 0.45], [50, 0]);
  const stageY    = useMotionTemplate`${stageYNum}px`;
  const capOp     = useTransform(progress, [0.4, 0.62], [0, 1]);

  /* Al scrollear o cambiar de pestaña, soltar el hover (resume el giro) */
  useEffect(() => {
    const reset = () => setActive(null);
    window.addEventListener('scroll', reset, { passive: true });
    document.addEventListener('visibilitychange', reset);
    return () => {
      window.removeEventListener('scroll', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, []);

  const handleEnter = (project, idx) => setActive({ project, idx });
  const handleLeave = () => setActive(null);

  const paused = active !== null;
  const wheelClass =
    'pc-wheel' +
    (!reduce && assembled ? ' is-spinning' : '') +
    (paused ? ' is-paused' : '');

  const ap = active?.project;
  const apAccent = ap ? CAT_ACCENT[ap.cat] : null;
  const apTag = ap ? t.projectCarousel.projects[ap.id]?.tagline : null;

  return (
    <>
      <section ref={sectionRef} className={`pc-section${reduce ? ' pc-section--static' : ''}`}>
        <div className="pc-sticky">
          {/* Título — aparece primero y se asienta arriba */}
          <motion.header
            className="pc-header"
            style={reduce ? undefined : { translateY: headY, scale: headScale }}
          >
            <h2 className="pc-h2">{t.projectCarousel.title}</h2>
          </motion.header>

          {/* Arco — se ensambla al scrollear */}
          <motion.div
            className="pc-stage"
            style={reduce ? undefined : { opacity: stageOp, translateY: stageY }}
          >
            <div className="pc-stage__fade pc-stage__fade--t" aria-hidden="true" />
            <div className="pc-stage__fade pc-stage__fade--b" aria-hidden="true" />
            <div className="pc-stage__fade pc-stage__fade--l" aria-hidden="true" />
            <div className="pc-stage__fade pc-stage__fade--r" aria-hidden="true" />
            <div className={wheelClass}>
              {RING.map((p, i) => (
                <WheelSlot
                  key={i}
                  p={p}
                  i={i}
                  progress={progress}
                  catLabels={t.projectCarousel.catLabels}
                  hovered={active?.idx === i}
                  onEnter={handleEnter}
                  onLeave={handleLeave}
                  reduce={reduce}
                />
              ))}
            </div>
          </motion.div>

          {/* Leyenda integrada — reemplaza al modal flotante */}
          <motion.div className="pc-caption" style={reduce ? undefined : { opacity: capOp }}>
            {ap ? (
              <div key={ap.id} className="pc-cap__detail">
                <span
                  className="pc-cap__cat"
                  style={{ color: apAccent, borderColor: apAccent + '55', background: apAccent + '14' }}
                >
                  {t.projectCarousel.catLabels[ap.cat]}
                </span>
                <h3 className="pc-cap__name">{ap.title}</h3>
                {apTag && <p className="pc-cap__tag">{apTag}</p>}
                {ap.link && (
                  <a href={ap.link} target="_blank" rel="noopener noreferrer" className="pc-cap__live">
                    {t.projectCarousel.liveCta}
                  </a>
                )}
              </div>
            ) : (
              <p className="pc-cap__hint">{t.projectCarousel.subtitle}</p>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div className="pc-cta" style={reduce ? undefined : { opacity: ctaOp }}>
            <a href={localizedPath("portfolio", lang)} className="pc-cta__link">
              {t.projectCarousel.cta}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      <style>{`
        /* ── SECTION ─────────────────────────────────────── */
        .pc-section {
          background: var(--background);
          height: 185vh;
          position: relative;
        }
        .pc-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: clamp(3rem, 8vh, 5.5rem);
          overflow: hidden;
        }

        /* ── HEADER ──────────────────────────────────────── */
        .pc-header { text-align: center; padding: 0 1rem; will-change: transform; }
        .pc-h2 {
          font-size: clamp(1.9rem, 4.4vw, 3rem);
          font-weight: 900;
          color: var(--text);
          margin: 0;
          line-height: 1.08;
        }

        /* ── STAGE (arco) ────────────────────────────────── */
        .pc-stage {
          --r: 1500px;
          --cw: 200px;
          --ch: 256px;
          position: relative;
          width: 100%;
          height: clamp(360px, 40vw, 500px);
          margin-top: clamp(1.2rem, 3.5vh, 2.6rem);
          overflow: hidden;
          will-change: transform, opacity;
        }

        /* Degradados que funden el arco en los 4 bordes (sin techo/piso duro) */
        .pc-stage__fade { position: absolute; z-index: 10; pointer-events: none; }
        .pc-stage__fade--l { top: 0; bottom: 0; left: 0;  width: clamp(50px, 11vw, 170px); background: linear-gradient(to right, var(--background) 0%, transparent 100%); }
        .pc-stage__fade--r { top: 0; bottom: 0; right: 0; width: clamp(50px, 11vw, 170px); background: linear-gradient(to left,  var(--background) 0%, transparent 100%); }
        .pc-stage__fade--t { top: 0; left: 0; right: 0;    height: 70px;  background: linear-gradient(to bottom, var(--background) 0%, transparent 100%); }
        .pc-stage__fade--b { bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(to top,    var(--background) 0%, transparent 100%); }

        /* ── RUEDA ───────────────────────────────────────── */
        .pc-wheel {
          position: absolute;
          left: 50%;
          top: calc(var(--r) + 150px);
          width: 0;
          height: 0;
          will-change: transform;
        }
        /* El giro se mantiene SIEMPRE que esté armado; el hover sólo lo pausa
         * en su lugar (no reinicia) con animation-play-state. */
        .pc-wheel.is-spinning { animation: pc-spin 110s linear infinite; }
        .pc-wheel.is-paused { animation-play-state: paused; }
        @keyframes pc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        .pc-slot {
          position: absolute;
          top: 0; left: 0;
          width: var(--cw);
          height: var(--ch);
          margin-left: calc(var(--cw) / -2);
          margin-top: calc(var(--ch) / -2);
          transform-origin: center center;
          transition: filter .3s ease, opacity .3s ease;
        }

        .pc-wheel.is-paused .pc-slot { filter: blur(3px); opacity: .42; }
        .pc-wheel.is-paused .pc-slot.is-hovered { filter: none; opacity: 1; z-index: 30; }

        /* ── CARD ────────────────────────────────────────── */
        .pc-card { width: 100%; height: 100%; cursor: pointer; will-change: transform, opacity; }
        .pc-card__frame {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 6px 26px rgba(0,0,0,0.5);
          transition: border-color .28s ease, box-shadow .28s ease, transform .32s cubic-bezier(0.22,1,0.36,1);
        }
        .pc-card__frame:hover {
          border-color: rgba(195,173,133,0.45);
          box-shadow: 0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(195,173,133,0.14);
          transform: translateY(-5px) scale(1.03);
        }
        .pc-card__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          z-index: 0;
        }
        .pc-card__veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 42%, rgba(0,0,0,0.82) 100%);
          z-index: 1;
        }
        .pc-card__info {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 1.1rem 1rem 1rem;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: .45rem;
        }
        .pc-card__cat {
          display: inline-flex;
          align-self: flex-start;
          padding: .2rem .65rem;
          border-radius: 100px;
          border: 1px solid;
          font-size: .58rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pc-card__name {
          font-size: .98rem;
          font-weight: 800;
          color: var(--brand-ivory);
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── LEYENDA (reemplaza al modal) ────────────────── */
        .pc-caption {
          min-height: 104px;
          margin-top: clamp(.8rem, 2vh, 1.4rem);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          text-align: center;
          padding: 0 1.2rem;
          width: 100%;
          max-width: 560px;
        }
        .pc-cap__hint {
          font-size: .95rem;
          color: var(--text-muted);
          margin: 0;
          letter-spacing: .03em;
        }
        .pc-cap__detail {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .5rem;
          animation: pc-cap-in .3s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes pc-cap-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pc-cap__cat {
          font-size: .6rem;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: .25rem .7rem;
          border: 1px solid;
          border-radius: 100px;
        }
        .pc-cap__name {
          font-size: clamp(1.15rem, 2.2vw, 1.5rem);
          font-weight: 900;
          color: var(--text);
          margin: 0;
          line-height: 1.1;
        }
        .pc-cap__tag {
          font-size: .88rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.45;
          max-width: 440px;
        }
        .pc-cap__live {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          font-size: .74rem;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--accent-text);
          text-decoration: none;
          margin-top: .15rem;
          transition: gap .2s ease;
        }
        .pc-cap__live::after { content: '→'; font-size: .9rem; }
        .pc-cap__live:hover { gap: .6rem; }

        /* ── CTA ─────────────────────────────────────────── */
        .pc-cta { text-align: center; margin-top: clamp(.6rem, 1.6vh, 1.2rem); position: relative; z-index: 20; }
        .pc-cta__link {
          display: inline-flex;
          align-items: center;
          gap: .45rem;
          font-size: .8rem;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--accent-text);
          text-decoration: none;
          border-bottom: 1px solid var(--accent);
          padding-bottom: 2px;
          transition: border-color .2s, gap .2s;
        }
        .pc-cta__link:hover { gap: .7rem; }

        /* ── MOBILE ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .pc-stage {
            --r: 900px;
            --cw: 152px;
            --ch: 196px;
            height: clamp(300px, 56vw, 380px);
          }
          .pc-wheel { top: calc(var(--r) + 112px); }
          /* Radio ~900 (vs 1500 en desktop): para conservar la MISMA velocidad
             lineal percibida que en desktop hay que acortar la vuelta. */
          .pc-wheel.is-spinning { animation-duration: 64s; }
          .pc-stage__fade--b { height: 96px; }
          .pc-card__name { font-size: .85rem; }
        }
        @media (max-width: 480px) {
          .pc-stage { --r: 680px; --cw: 132px; --ch: 172px; }
          .pc-wheel { top: calc(var(--r) + 96px); }
          /* Radio ~680: misma lógica, vuelta aún más corta para no sentirse lento. */
          .pc-wheel.is-spinning { animation-duration: 48s; }
        }

        /* ── ESTÁTICO (reduced-motion) ───────────────────── */
        .pc-section--static { height: auto; }
        .pc-section--static .pc-sticky {
          position: static;
          height: auto;
          padding: clamp(3.5rem, 9vh, 6rem) 0 4rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .pc-wheel { animation: none !important; will-change: auto; }
          .pc-card__frame { transition: none !important; }
          .pc-cap__detail { animation: none !important; }
        }
      `}</style>
    </>
  );
}
