import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const CLIENTS_BASE = [
  { id:1, name:'Gobierno Municipal de Parral',     logo:'assets/image/parral.webp' },
  { id:2, name:'Las Chikis Restaurante',            logo:'assets/image/laschikis.webp' },
  { id:3, name:'Capital Transport LLP',             logo:'assets/image/CapitalTransport.webp' },
  { id:4, name:'Instituto Tecnológico de Parral',   logo:'assets/image/yec.webp' },
  { id:5, name:'Coronado Gym',                      logo:'assets/image/gym.webp' },
];

export default function ClientCarousel() {
  const { t } = useLanguage();
  const CLIENTS = CLIENTS_BASE.map(c => ({ ...c, desc: t.clients.descriptions[c.id] }));
  const [activeId,  setActiveId]  = useState(null);
  const [tooltip,   setTooltip]   = useState(null); // { client, top, left }
  const [paused,    setPaused]    = useState(false);
  const sectionRef                = useRef(null);

  /* Entrada — IntersectionObserver, sin scroll event */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Cerrar tooltip al scroll */
  useEffect(() => {
    if (!tooltip) return;
    const close = () => { setTooltip(null); setActiveId(null); setPaused(false); };
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [tooltip]);

  const handleEnter = (client, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const vw   = window.innerWidth;
    const tipW = 280;
    let left   = cx - tipW / 2;
    if (left < 12)          left = 12;
    if (left + tipW > vw - 12) left = vw - tipW - 12;
    setTooltip({ client, top: rect.bottom + 12, left });
    setActiveId(client.id);
    setPaused(true);
  };

  const handleLeave = () => {
    setTooltip(null);
    setActiveId(null);
    setPaused(false);
  };

  return (
    <>
      <section ref={sectionRef} className="cc-section">

        {/* Gradientes laterales */}
        <div className="cc-fade cc-fade--l" aria-hidden="true" />
        <div className="cc-fade cc-fade--r" aria-hidden="true" />

        {/* Título */}
        <header className="cc-header">
          <h2 className="cc-h2">{t.clients.title}</h2>
          <p className="cc-lead">{t.clients.subtitle}</p>
        </header>

        {/* Track — CSS animation, dirección IZQUIERDA A DERECHA */}
        <div className="cc-viewport">
          <div className={`cc-track${paused ? ' is-paused' : ''}`}>
            {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((c, i) => {
              const isActive = activeId === c.id;
              return (
                <div
                  key={i}
                  className={`cc-logo${isActive ? ' is-active' : activeId !== null ? ' is-dim' : ''}`}
                  onMouseEnter={(e) => handleEnter(c, e)}
                  onMouseLeave={handleLeave}
                >
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="cc-logo__img"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* Tooltip — position: fixed */}
      {tooltip && (
        <div
          className="cc-tooltip"
          style={{ top: tooltip.top, left: tooltip.left }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={handleLeave}
        >
          <p className="cc-tooltip__name">{tooltip.client.name}</p>
          <p className="cc-tooltip__desc">{tooltip.client.desc}</p>
          <div className="cc-tooltip__bar" />
        </div>
      )}

      <style>{`
        /* ── SECTION ─────────────────────────────────────── */
        .cc-section {
          background: #222220;
          padding: 5rem 0 4.5rem;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(212,175,55,0.06);
          /* Entrada */
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .85s cubic-bezier(0.22,1,0.36,1), transform .85s cubic-bezier(0.22,1,0.36,1);
        }
        .cc-section.is-visible { opacity: 1; transform: translateY(0); }

        .cc-fade {
          position: absolute;
          top: 0; bottom: 0;
          width: clamp(60px, 10vw, 140px);
          z-index: 10;
          pointer-events: none;
        }
        .cc-fade--l { left: 0;  background: linear-gradient(to right, #222220, transparent); }
        .cc-fade--r { right: 0; background: linear-gradient(to left,  #222220, transparent); }

        /* ── HEADER ──────────────────────────────────────── */
        .cc-header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding: 0 1rem;
        }
        .cc-h2 {
          font-size: clamp(1.6rem, 4vw, 2.6rem);
          font-weight: 900;
          color: #D4AF37;
          margin: 0 0 .5rem;
          line-height: 1.1;
        }
        .cc-lead {
          font-size: .9rem;
          color: rgba(244,228,188,0.42);
          margin: 0;
          letter-spacing: .04em;
        }

        /* ── VIEWPORT ────────────────────────────────────── */
        .cc-viewport {
          overflow: hidden;
          padding: .75rem 0;
        }

        /* ── TRACK — CSS animation, izquierda → derecha ─── */
        /*
         * 4 copias + margin-right en cada logo (no gap en track).
         * margin-right garantiza que cada item ocupa width+spacing exactos,
         * haciendo que -50% coincida perfecto con el clone del item 1.
         */
        .cc-track {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
          animation: cc-right 30s linear infinite;
        }
        .cc-track.is-paused { animation-play-state: paused; }

        @keyframes cc-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        /* ── LOGO CARD ───────────────────────────────────── */
        .cc-logo {
          flex-shrink: 0;
          width: 130px;
          height: 130px;
          margin-right: 48px;
          background: #fff;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(0,0,0,0.35);
          border: 1.5px solid transparent;
          transition:
            transform    .35s cubic-bezier(0.22,1,0.36,1),
            border-color .25s ease,
            box-shadow   .25s ease,
            opacity      .25s ease,
            filter       .25s ease;
          will-change: transform;
        }
        .cc-logo:hover,
        .cc-logo.is-active {
          transform: scale(1.12);
          border-color: #D4AF37;
          box-shadow: 0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.25);
        }
        .cc-logo.is-dim {
          opacity: .22;
          filter: grayscale(1);
          transform: scale(.92);
        }
        .cc-logo__img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: filter .3s ease;
        }
        .cc-logo:not(.is-active):not(:hover) .cc-logo__img {
          filter: grayscale(.7) opacity(.75);
        }

        /* ── TOOLTIP ─────────────────────────────────────── */
        .cc-tooltip {
          position: fixed;
          z-index: 9000;
          width: 280px;
          background: #fff;
          border-radius: 14px;
          padding: 1rem 1.1rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 0 0 1.5px rgba(212,175,55,0.28);
          animation: cc-tip-in .28s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes cc-tip-in {
          from { opacity: 0; transform: translateY(-8px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cc-tooltip__name {
          font-size: .9rem;
          font-weight: 800;
          color: #0B1D33;
          margin: 0 0 .3rem;
        }
        .cc-tooltip__desc {
          font-size: .78rem;
          color: #6B7280;
          margin: 0 0 .75rem;
          line-height: 1.45;
        }
        .cc-tooltip__bar {
          height: 3px;
          width: 44px;
          background: linear-gradient(90deg, #D4AF37, #B8941F);
          border-radius: 100px;
        }

        /* ── MOBILE ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .cc-section { padding: 3.5rem 0 3rem; }
          .cc-logo { width: 100px; height: 100px; padding: 14px; border-radius: 14px; margin-right: 32px; }
          .cc-track { animation-duration: 22s; }
        }

        /* ── REDUCED MOTION ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .cc-section { transition: none !important; opacity: 1; transform: none; }
          .cc-track { animation: none !important; transform: translateX(-50%) !important; }
          .cc-logo { transition: none !important; will-change: auto; }
          .cc-tooltip { animation: none !important; }
        }
      `}</style>
    </>
  );
}
