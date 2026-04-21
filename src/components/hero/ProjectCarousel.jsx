import { useState, useEffect, useRef } from 'react';

/*
 * PROYECTOS — mismas imágenes que el portafolio.
 * Los que no tienen imagen usan su gradiente como fondo.
 */
const PROJECTS = [
  { id:1,  title:'Chuchulucos',      tagline:'Botanas Artesanales',           cat:'landing',  image:'/assets/image/portafolio/chuchu.webp',           gradient:'linear-gradient(145deg,#3b0764,#6d28d9,#db2777)', link:'https://chuchulucos.geckcodex.com/' },
  { id:2,  title:'Agend-In',         tagline:'Citas vía WhatsApp',            cat:'landing',  image:'/assets/image/portafolio/agendin.webp',           gradient:'linear-gradient(145deg,#1e1b4b,#4f46e5,#0ea5e9)', link:'https://agend-in.geckcodex.com/' },
  { id:3,  title:'LandingKit',       tagline:'Plantilla Pro',                 cat:'landing',  image:'/assets/image/portafolio/landig.webp',            gradient:'linear-gradient(145deg,#2e1065,#7c3aed,#c026d3)', link:'https://landig-plantilla.geckcodex.com/' },
  { id:4,  title:'Chava Calderón',   tagline:'Figura de Autoridad',           cat:'landing',  image:'/assets/image/portafolio/chava.webp',             gradient:'linear-gradient(145deg,#1a0636,#6d28d9,#9d174d)', link:'https://chavacalderon.mx/' },
  { id:5,  title:'BizBot',           tagline:'Tu Negocio en WhatsApp',        cat:'landing',  image:'/assets/image/portafolio/lofo.webp',              gradient:'linear-gradient(145deg,#0f172a,#1e3a8a,#312e81)' },
  { id:6,  title:'Mi Caja POS',      tagline:'POS Bueno, Bonito y Barato',    cat:'landing',  image:'/assets/image/portafolio/micaja.webp',            gradient:'linear-gradient(145deg,#1c1917,#92400e,#d97706)', link:'https://mi-caja.geckcodex.com/' },
  { id:7,  title:'FleetTrack',       tagline:'Gestión de Flotilla',           cat:'mobile',   image:'/assets/image/portafolio/capital transpor.webp',  gradient:'linear-gradient(145deg,#0c1a3d,#1d4ed8,#0ea5e9)' },
  { id:8,  title:'SpendWise',        tagline:'Control de Gastos',             cat:'mobile',   image:'/assets/image/portafolio/mando.webp',             gradient:'linear-gradient(145deg,#0e2a5c,#2563eb,#06b6d4)' },
  { id:9,  title:'GymHub',           tagline:'Gestión de Gimnasio',           cat:'webapp',   image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#0a2e1a,#15803d,#0d9488)' },
  { id:10, title:'StoreTools',       tagline:'Tiendas de Conveniencia',       cat:'webapp',   image:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#0d3321,#16a34a,#0f766e)' },
  { id:11, title:'BadgePrint',       tagline:'Gafetes Gubernamentales',       cat:'webapp',   image:'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#1c1917,#064e3b,#0f766e)' },
  { id:12, title:'SafePosture',      tagline:'Ergonomía Industrial',          cat:'software', image:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#1e0a3c,#6d28d9,#4338ca)' },
  { id:13, title:'RanchoControl',    tagline:'Gestión de Rancho',             cat:'software', image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#0f172a,#5b21b6,#4f46e5)' },
  { id:14, title:'DrowsyGuard',      tagline:'Anti-Somnolencia',              cat:'software', image:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#1a0533,#7c3aed,#6d28d9)' },
  { id:15, title:'EduAI',            tagline:'ML para Escuelas',              cat:'software', image:'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#09090b,#5b21b6,#4338ca)' },
  { id:16, title:'GeckCRM',          tagline:'CRM para Negocios',             cat:'software', image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=80&auto=format&fit=crop', gradient:'linear-gradient(145deg,#170d2e,#7c3aed,#2563eb)' },
];

const CAT_ACCENT = {
  landing:  '#e879f9',
  mobile:   '#60a5fa',
  webapp:   '#34d399',
  software: '#a78bfa',
};
const CAT_LABEL = {
  landing:  'Landing',
  mobile:   'App Móvil',
  webapp:   'Web',
  software: 'Software & IA',
};

/* ─── CARD ──────────────────────────────────────────────────────────── */
function Card({ project, onEnter, onLeave }) {
  const accent = CAT_ACCENT[project.cat];
  return (
    <div
      className="pc-card"
      onMouseEnter={(e) => onEnter(project, e)}
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
            {CAT_LABEL[project.cat]}
          </span>
          <p className="pc-card__name">{project.title}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function ProjectCarousel() {
  const [tooltip, setTooltip]   = useState(null);  // { project, top, left, align }
  const [paused,  setPaused]    = useState(false);
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

  /* Cerrar tooltip al hacer scroll */
  useEffect(() => {
    if (!tooltip) return;
    const close = () => { setTooltip(null); setPaused(false); };
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [tooltip]);

  const handleEnter = (project, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const vw   = window.innerWidth;
    const tipW = 280;
    let align  = 'center';
    if (cx - tipW / 2 < 12)      align = 'left';
    if (cx + tipW / 2 > vw - 12) align = 'right';
    setTooltip({ project, top: rect.bottom + 12, cx, align });
    setPaused(true);
  };

  const handleLeave = () => {
    setTooltip(null);
    setPaused(false);
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

        {/* Gradientes laterales — faden el carousel en los bordes */}
        <div className="pc-fade pc-fade--l" aria-hidden="true" />
        <div className="pc-fade pc-fade--r" aria-hidden="true" />

        {/* Título */}
        <header className="pc-header">
          <h2 className="pc-h2">Proyectos Destacados</h2>
          <p className="pc-lead">lo que hemos construido</p>
        </header>

        {/* Track — animación CSS pura, dirección DERECHA */}
        <div className="pc-viewport">
          <div className={`pc-track${paused ? ' is-paused' : ''}`}>
            {[...PROJECTS, ...PROJECTS].map((p, i) => (
              <Card key={i} project={p} onEnter={handleEnter} onLeave={handleLeave} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pc-cta">
          <a href="/portafolio" className="pc-cta__link">
            Ver portafolio completo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

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
          <p className="pc-tooltip__sub">{tooltip.project.tagline}</p>
          {tooltip.project.link && (
            <a
              href={tooltip.project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pc-tooltip__link"
              onClick={e => e.stopPropagation()}
            >
              Ver en vivo ↗
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
          background: #222220;
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

        /* Gradientes laterales — cortan el carousel */
        .pc-fade {
          position: absolute;
          top: 0; bottom: 0;
          width: clamp(60px, 10vw, 140px);
          z-index: 10;
          pointer-events: none;
        }
        .pc-fade--l { left: 0;  background: linear-gradient(to right,  #222220 0%, transparent 100%); }
        .pc-fade--r { right: 0; background: linear-gradient(to left,   #222220 0%, transparent 100%); }

        /* ── HEADER ──────────────────────────────────────── */
        .pc-header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding: 0 1rem;
        }
        .pc-h2 {
          font-size: clamp(1.75rem, 4vw, 2.8rem);
          font-weight: 900;
          color: #D4AF37;
          margin: 0 0 .5rem;
          line-height: 1.1;
        }
        .pc-lead {
          font-size: .95rem;
          color: rgba(244,228,188,0.45);
          margin: 0;
          font-weight: 400;
          letter-spacing: .04em;
        }

        /* ── VIEWPORT ────────────────────────────────────── */
        .pc-viewport {
          overflow: hidden;   /* clip horizontal */
          padding: .5rem 0 1.5rem; /* espacio para sombra de cards */
        }

        /* ── TRACK — CSS animation, dirección DERECHA ───── */
        /*
         * Doble lista → totalWidth = 2 × (cardW + gap) × N
         * Animation: translateX(-50%) → translateX(0) = se mueve hacia la derecha
         * La GPU lo anima en el compositor, sin tocar el main thread.
         */
        .pc-track {
          display: flex;
          gap: 14px;
          width: max-content;
          will-change: transform;
          animation: pc-right 90s linear infinite;
        }
        .pc-track.is-paused {
          animation-play-state: paused;
        }
        @keyframes pc-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* ── CARD ────────────────────────────────────────── */
        .pc-card {
          flex-shrink: 0;
          width: 240px;
          cursor: pointer;
        }
        .pc-card__frame {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 4px 20px rgba(0,0,0,0.45);
          transition: border-color .28s ease, box-shadow .28s ease, transform .32s cubic-bezier(0.22,1,0.36,1);
          will-change: transform;
        }
        .pc-card__frame:hover {
          border-color: rgba(212,175,55,0.45);
          box-shadow: 0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.14);
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
          color: #F4E4BC;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── CTA ─────────────────────────────────────────── */
        .pc-cta {
          text-align: center;
          margin-top: 2.2rem;
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
          color: #D4AF37;
          text-decoration: none;
          border-bottom: 1px solid rgba(212,175,55,0.35);
          padding-bottom: 2px;
          transition: border-color .2s, gap .2s;
        }
        .pc-cta__link:hover {
          border-color: #D4AF37;
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
          box-shadow: 0 20px 60px rgba(0,0,0,0.22), 0 0 0 1.5px rgba(212,175,55,0.3);
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
          color: #D4AF37;
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
          .pc-card { width: 180px; }
          .pc-track { gap: 10px; animation-duration: 70s; }
          .pc-card__name { font-size: .75rem; }
        }
        @media (max-width: 480px) {
          .pc-card { width: 150px; }
          .pc-track { animation-duration: 55s; }
        }

        /* ── REDUCED MOTION ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .pc-section { transition: none !important; opacity: 1; transform: none; }
          .pc-track { animation: none !important; }
          .pc-card__frame { transition: none !important; will-change: auto; }
          .pc-tooltip { animation: none !important; }
        }
      `}</style>
    </>
  );
}
