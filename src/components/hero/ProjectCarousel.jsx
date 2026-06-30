import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const PROJECTS = [
  { id:1, title:'Chuchulucos',    cat:'landing',  image:'/assets/image/portafolio/chuchu.webp',          gradient:'linear-gradient(145deg,#3b0764,#6d28d9,#db2777)', link:'https://chuchulucos.geckcodex.com/' },
  { id:2, title:'Agend-In',       cat:'landing',  image:'/assets/image/portafolio/agendin.webp',         gradient:'linear-gradient(145deg,#1e1b4b,#4f46e5,#0ea5e9)', link:'https://agend-in.geckcodex.com/' },
  { id:3, title:'LandingKit',     cat:'landing',  image:'/assets/image/portafolio/landig.webp',          gradient:'linear-gradient(145deg,#2e1065,#7c3aed,#c026d3)', link:'https://landig-plantilla.geckcodex.com/' },
  { id:4, title:'Chava Calderón', cat:'landing',  image:'/assets/image/portafolio/chava.webp',           gradient:'linear-gradient(145deg,#1a0636,#6d28d9,#9d174d)', link:'https://chavacalderon.mx/' },
  { id:5, title:'Mando',          cat:'landing',  image:'/assets/image/portafolio/mando.webp',           gradient:'linear-gradient(145deg,#0f172a,#1e3a8a,#312e81)' },
  { id:6, title:'Mi Caja POS',    cat:'landing',  image:'/assets/image/portafolio/micaja.webp',          gradient:'linear-gradient(145deg,#1c1917,#92400e,#d97706)', link:'https://mi-caja.geckcodex.com/' },
  { id:7, title:'FleetTrack',     cat:'mobile',   image:'/assets/image/portafolio/capital transpor.webp',gradient:'linear-gradient(145deg,#0c1a3d,#1d4ed8,#0ea5e9)' },
  { id:8, title:'Coronado Gym',   cat:'webapp',   image:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#0a2e1a,#15803d,#0d9488)' },
  { id:9, title:'GeckCRM',        cat:'software', image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#170d2e,#7c3aed,#2563eb)' },
];

const CAT_ACCENT = {
  landing:  '#e879f9',
  mobile:   '#60a5fa',
  webapp:   '#34d399',
  software: '#a78bfa',
};

/* Rueda en arco: triplicamos para densificar el arco y que el giro sea
 * infinito y sin saltos (reparto angular uniforme). */
const RING = [...PROJECTS, ...PROJECTS, ...PROJECTS];
const STEP = 360 / RING.length; // grados entre tarjeta y tarjeta sobre el círculo

/* ─── CARD ──────────────────────────────────────────────────────────── */
function Card({ project, catLabels, onEnter, onLeave, idx }) {
  const accent = CAT_ACCENT[project.cat];
  return (
    <div
      className="pc-card"
      onMouseEnter={(e) => onEnter(project, e, idx)}
      onMouseLeave={onLeave}
    >
      <div
        className="pc-card__frame"
        style={project.image ? undefined : { background: project.gradient }}
      >
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
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
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function ProjectCarousel() {
  const { t } = useLanguage();
  const [tooltip, setTooltip]   = useState(null);  // { project, top, left, align }
  const [paused,  setPaused]    = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null); // índice del slot activo
  const sectionRef              = useRef(null);

  /* Entrada — IntersectionObserver, sin scroll event, dispara una vez */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Cerrar tooltip al hacer scroll o al perder foco de página */
  useEffect(() => {
    if (!tooltip) return;
    const close = () => { setTooltip(null); setPaused(false); };
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [tooltip]);

  useEffect(() => {
    const reset = () => { setTooltip(null); setPaused(false); };
    document.addEventListener('visibilitychange', reset);
    return () => document.removeEventListener('visibilitychange', reset);
  }, []);

  const handleEnter = (project, e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const vw   = window.innerWidth;
    const tipW = 280;
    let align  = 'center';
    if (cx - tipW / 2 < 12)      align = 'left';
    if (cx + tipW / 2 > vw - 12) align = 'right';
    setTooltip({ project, top: rect.bottom + 12, cx, align });
    setPaused(true);
    setHoveredIdx(idx ?? null);
  };

  const handleLeave = () => {
    setTooltip(null);
    setPaused(false);
    setHoveredIdx(null);
  };

  /* Calcular left para el tooltip */
  const tipLeft = () => {
    if (!tooltip) return 0;
    const tipW = 280;
    if (tooltip.align === 'left')  return Math.max(12, tooltip.cx - tipW * 0.15);
    if (tooltip.align === 'right') return Math.min(window.innerWidth - tipW - 12, tooltip.cx - tipW * 0.85);
    return tooltip.cx - tipW / 2;
  };

  return (
    <>
      <section ref={sectionRef} className="pc-section">

        {/* Rueda en arco — las tarjetas giran sobre un círculo */}
        <div className="pc-stage">
          <div className="pc-stage__fade pc-stage__fade--l" aria-hidden="true" />
          <div className="pc-stage__fade pc-stage__fade--r" aria-hidden="true" />
          <div className={`pc-wheel${paused ? ' is-paused' : ''}`}>
            {RING.map((p, i) => (
              <div
                key={i}
                className={`pc-slot${hoveredIdx === i ? ' is-hovered' : ''}`}
                style={{ transform: `rotate(${i * STEP}deg) translateY(calc(var(--r) * -1))` }}
              >
                <Card project={p} catLabels={t.projectCarousel.catLabels} onEnter={handleEnter} onLeave={handleLeave} idx={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Título + CTA — debajo del arco */}
        <header className="pc-header">
          <h2 className="pc-h2">{t.projectCarousel.title}</h2>
          <p className="pc-lead">{t.projectCarousel.subtitle}</p>
          <div className="pc-cta">
            <a href="/portafolio" className="pc-cta__link">
              {t.projectCarousel.cta}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </header>

      </section>

      {/* Tooltip — position: fixed, nunca se corta */}
      {tooltip && (
        <div
          className="pc-tooltip"
          style={{ top: tooltip.top, left: tipLeft() }}
          onMouseEnter={() => { setTooltip(t => t); setPaused(true); }}
          onMouseLeave={handleLeave}
        >
          <p className="pc-tooltip__name">{tooltip.project.title}</p>
          <p className="pc-tooltip__sub">{t.projectCarousel.projects[tooltip.project.id]?.tagline}</p>
          {tooltip.project.link && (
            <a
              href={tooltip.project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pc-tooltip__link"
              onClick={e => { e.stopPropagation(); handleLeave(); }}
            >
              {t.projectCarousel.liveCta}
            </a>
          )}
          <div
            className="pc-tooltip__bar"
            style={{ background: CAT_ACCENT[tooltip.project.cat] }}
          />
        </div>
      )}

      <style>{`
        /* ── SECTION ─────────────────────────────────────── */
        .pc-section {
          background: var(--background);
          padding: 5rem 0 4rem;
          position: relative;
          overflow: hidden;
          /* Entrada: empieza invisible, sube con CSS */
          opacity: 0;
          transform: translateY(32px);
          transition: opacity .9s cubic-bezier(0.22,1,0.36,1), transform .9s cubic-bezier(0.22,1,0.36,1);
        }
        .pc-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── STAGE (arco) ────────────────────────────────── */
        /* Ventana recortada: sólo se ve la parte superior del círculo,
         * por eso las tarjetas dibujan un arco. El centro de la rueda
         * queda muy por debajo del stage (top: --r + offset). */
        .pc-stage {
          --r: 1280px;          /* radio del círculo */
          --cw: 230px;          /* ancho de tarjeta */
          --ch: 130px;          /* alto de tarjeta */
          position: relative;
          height: clamp(320px, 32vw, 460px);
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        /* Gradientes laterales — funden el arco en los bordes */
        .pc-stage__fade {
          position: absolute;
          top: 0; bottom: 0;
          width: clamp(60px, 12vw, 180px);
          z-index: 10;
          pointer-events: none;
        }
        .pc-stage__fade--l { left: 0;  background: linear-gradient(to right, var(--background) 0%, transparent 100%); }
        .pc-stage__fade--r { right: 0; background: linear-gradient(to left,  var(--background) 0%, transparent 100%); }

        /* ── RUEDA ───────────────────────────────────────── */
        .pc-wheel {
          position: absolute;
          left: 50%;
          top: calc(var(--r) + 100px);  /* centro del círculo, bajo el stage */
          width: 0;
          height: 0;
          will-change: transform;
          animation: pc-spin 110s linear infinite;
        }
        .pc-wheel.is-paused { animation-play-state: paused; }
        @keyframes pc-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        /* cada tarjeta se coloca en polar: rotate(ángulo) translateY(-radio) */
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

        /* al pausar (hover sobre una tarjeta): todo lo demás se difumina,
         * la tarjeta activa se mantiene nítida y al frente */
        .pc-wheel.is-paused .pc-slot {
          filter: blur(3px);
          opacity: .45;
        }
        .pc-wheel.is-paused .pc-slot.is-hovered {
          filter: none;
          opacity: 1;
          z-index: 30;
        }

        /* ── HEADER ──────────────────────────────────────── */
        .pc-header {
          text-align: center;
          margin-bottom: 0;
          padding: 0 1rem;
        }
        .pc-h2 {
          font-size: clamp(1.75rem, 4vw, 2.8rem);
          font-weight: 900;
          color: var(--text);
          margin: 0 0 .5rem;
          line-height: 1.1;
        }
        .pc-lead {
          font-size: .95rem;
          color: var(--text-muted);
          margin: 0;
          font-weight: 400;
          letter-spacing: .04em;
        }

        /* ── CARD ────────────────────────────────────────── */
        .pc-card {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .pc-card__frame {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 4px 20px rgba(0,0,0,0.45);
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
          background: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.78) 100%);
          z-index: 1;
        }
        .pc-card__info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: .9rem .85rem .8rem;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: .3rem;
        }
        .pc-card__cat {
          display: inline-flex;
          align-self: flex-start;
          padding: .15rem .55rem;
          border-radius: 100px;
          border: 1px solid;
          font-size: .54rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pc-card__name {
          font-size: .82rem;
          font-weight: 800;
          color: var(--brand-ivory);
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── CTA ─────────────────────────────────────────── */
        .pc-cta {
          text-align: center;
          margin-top: 1.6rem;
          position: relative;
          z-index: 20;
        }
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
        .pc-cta__link:hover {
          border-color: var(--accent);
          gap: .7rem;
        }

        /* ── TOOLTIP — position:fixed, nunca se corta ────── */
        .pc-tooltip {
          position: fixed;
          z-index: 9000;
          width: 280px;
          background: #fff;
          border-radius: 14px;
          padding: 1rem 1.1rem 1rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.22), 0 0 0 1.5px rgba(195,173,133,0.3);
          animation: pc-tip-in .28s cubic-bezier(0.34,1.56,0.64,1);
          pointer-events: auto;
        }
        @keyframes pc-tip-in {
          from { opacity: 0; transform: translateY(-10px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pc-tooltip__name {
          font-size: .92rem;
          font-weight: 800;
          color: #0B1D33;
          margin: 0 0 .25rem;
        }
        .pc-tooltip__sub {
          font-size: .78rem;
          color: #6B7280;
          margin: 0 0 .7rem;
          line-height: 1.4;
        }
        .pc-tooltip__link {
          display: inline-block;
          font-size: .72rem;
          font-weight: 700;
          color: var(--accent-text);
          text-decoration: none;
          letter-spacing: .04em;
          margin-bottom: .75rem;
        }
        .pc-tooltip__link:hover { text-decoration: underline; }
        .pc-tooltip__bar {
          height: 3px;
          width: 48px;
          border-radius: 100px;
        }

        /* ── MOBILE ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .pc-section { padding: 3.5rem 0 3rem; }
          .pc-stage {
            --r: 720px;
            --cw: 170px;
            --ch: 96px;
            height: clamp(230px, 46vw, 320px);
          }
          .pc-wheel { top: calc(var(--r) + 72px); animation-duration: 90s; }
          .pc-card__name { font-size: .75rem; }
        }
        @media (max-width: 480px) {
          .pc-stage {
            --r: 560px;
            --cw: 150px;
            --ch: 84px;
          }
          .pc-wheel { top: calc(var(--r) + 60px); animation-duration: 75s; }
        }

        /* ── REDUCED MOTION ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .pc-section { transition: none !important; opacity: 1; transform: none; }
          .pc-wheel { animation: none !important; will-change: auto; }
          .pc-card__frame { transition: none !important; will-change: auto; }
          .pc-tooltip { animation: none !important; }
        }
      `}</style>
    </>
  );
}
