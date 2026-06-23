import { useEffect, useRef } from 'react';

const PROJECTS = [
  {
    id: 1,
    client: 'Capital Transport LLP',
    title: 'App de Gestión de Flotas',
    description: 'Plataforma móvil para monitoreo y gestión de unidades en tiempo real.',
    tag: 'App Móvil',
    logo: '/assets/image/CapitalTransport.webp',
    accent: '#1a3a5c',
  },
  {
    id: 2,
    client: 'Coronado Gym',
    title: 'Plataforma Web para Gimnasio',
    description: 'Sistema de control de membresías, acceso y pagos para socios.',
    tag: 'Web App',
    logo: '/assets/image/gym.webp',
    accent: '#2a1a0e',
  },
  {
    id: 3,
    client: 'Gobierno Municipal de Parral',
    title: 'Sistema de Gafetes Digitales',
    description: 'Plataforma para generación y gestión de credenciales municipales.',
    tag: 'Software',
    logo: '/assets/image/parral.webp',
    accent: '#1a2a1a',
  },
];

export default function PortfolioPreview() {
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const cardsRef   = useRef([]);
  const rafRef     = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const rect    = section.getBoundingClientRect();
        const vh      = window.innerHeight;
        const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));

        // Header
        if (headerRef.current) {
          const p = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
          headerRef.current.style.opacity   = p;
          headerRef.current.style.transform = `translateY(${(1 - p) * 24}px)`;
        }

        // Cards escalonadas
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const delay = i * 0.1;
          const p = Math.max(0, Math.min(1, (progress - 0.15 - delay) / 0.3));
          card.style.opacity   = p;
          card.style.transform = `translateY(${(1 - p) * 32}px)`;
        });

        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="pp-section">

        {/* Cabecera */}
        <div ref={headerRef} className="pp-header">
          <span className="pp-header__tag">Trabajo reciente</span>
          <h2 className="pp-header__title">Proyectos que hablan por sí solos</h2>
        </div>

        {/* Cards */}
        <div className="pp-grid">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              ref={el => cardsRef.current[i] = el}
              className="pp-card"
            >
              {/* Franja de acento superior */}
              <div className="pp-card__accent" style={{ background: p.accent }} />

              {/* Logo */}
              <div className="pp-card__logo-wrap">
                <img src={p.logo} alt={p.client} className="pp-card__logo" />
              </div>

              {/* Info */}
              <div className="pp-card__body">
                <span className="pp-card__tag">{p.tag}</span>
                <h3 className="pp-card__title">{p.title}</h3>
                <p  className="pp-card__desc">{p.description}</p>
                <span className="pp-card__client">{p.client}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={el => cardsRef.current[3] = el} className="pp-cta-wrap">
          <a href="/portafolio" className="pp-cta">
            Ver todos los proyectos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

      </section>

      <style>{`
        .pp-section {
          background: #21211F;
          padding: 6rem 2rem;
        }

        /* ── Header ── */
        .pp-header {
          text-align: center;
          margin-bottom: 3.5rem;
          opacity: 0;
          will-change: opacity, transform;
        }

        .pp-header__tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .pp-header__title {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 800;
          color: #F4E4BC;
          line-height: 1.15;
        }

        /* ── Grid ── */
        .pp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto 3rem;
        }

        /* ── Card ── */
        .pp-card {
          background: #2b2b29;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(195, 173, 133, 0.1);
          display: flex;
          flex-direction: column;
          opacity: 0;
          will-change: opacity, transform;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }

        .pp-card:hover {
          border-color: rgba(195, 173, 133, 0.35);
          transform: translateY(-4px) !important;
        }

        .pp-card__accent {
          height: 4px;
          width: 100%;
        }

        .pp-card__logo-wrap {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          height: 140px;
        }

        .pp-card__logo {
          max-width: 120px;
          max-height: 80px;
          object-fit: contain;
        }

        .pp-card__body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .pp-card__tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .pp-card__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #F4E4BC;
          line-height: 1.3;
        }

        .pp-card__desc {
          font-size: 0.875rem;
          color: rgba(244, 228, 188, 0.6);
          line-height: 1.6;
          flex: 1;
        }

        .pp-card__client {
          font-size: 0.75rem;
          color: rgba(195, 173, 133, 0.55);
          font-weight: 500;
          margin-top: 0.5rem;
        }

        /* ── CTA ── */
        .pp-cta-wrap {
          text-align: center;
          opacity: 0;
          will-change: opacity, transform;
        }

        .pp-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid rgba(195, 173, 133, 0.4);
          padding-bottom: 2px;
          transition: border-color 0.2s ease, gap 0.2s ease;
        }

        .pp-cta:hover {
          border-color: var(--accent);
          gap: 1rem;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .pp-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .pp-section {
            padding: 4rem 1.25rem;
          }

          .pp-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pp-header,
          .pp-card,
          .pp-cta-wrap {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
