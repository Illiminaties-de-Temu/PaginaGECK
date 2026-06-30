import { useEffect, useRef } from 'react';

export default function CTASection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const rafRef     = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const rect     = section.getBoundingClientRect();
        const vh       = window.innerHeight;
        const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));

        if (contentRef.current) {
          const p = Math.max(0, Math.min(1, (progress - 0.1) / 0.4));
          contentRef.current.style.opacity   = p;
          contentRef.current.style.transform = `translateY(${(1 - p) * 28}px)`;
        }

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
      <section ref={sectionRef} className="cta-section">

        {/* Resplandor de fondo */}
        <div className="cta-section__glow" />

        <div ref={contentRef} className="cta-section__content">

          <p className="cta-section__eyebrow">¿Tienes un proyecto en mente?</p>

          <h2 className="cta-section__headline">
            Construyamos algo
            <br />
            <span className="cta-section__headline-accent">extraordinario juntos</span>
          </h2>

          <p className="cta-section__sub">
            Cuéntanos tu idea. Nosotros la convertimos en tecnología que funciona.
          </p>

          <div className="cta-section__actions">
            <a href="/contacto" className="cta-section__btn cta-section__btn--primary">
              Empezar ahora
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="/portafolio" className="cta-section__btn cta-section__btn--ghost">
              Ver nuestro trabajo
            </a>
          </div>

        </div>

      </section>

      <style>{`
        .cta-section {
          background: #0B1D33;
          position: relative;
          overflow: hidden;
          padding: 8rem 2rem;
          text-align: center;
        }

        /* Resplandor dorado central muy sutil */
        .cta-section__glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse at center, rgba(195, 173, 133, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-section__content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0;
          will-change: opacity, transform;
        }

        .cta-section__eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.5rem;
        }

        .cta-section__headline {
          font-size: clamp(2.2rem, 5vw, 3.75rem);
          font-weight: 900;
          line-height: 1.1;
          color: #F4E4BC;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .cta-section__headline-accent {
          color: var(--accent);
        }

        .cta-section__sub {
          font-size: clamp(0.95rem, 1.5vw, 1.15rem);
          font-weight: 300;
          color: rgba(244, 228, 188, 0.6);
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        .cta-section__actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-section__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.875rem 2.25rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          border-radius: 10px;
          transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
        }

        .cta-section__btn--primary {
          background: var(--accent);
          color: #0B1D33;
          border: 1px solid var(--accent);
          box-shadow: 0 0 24px rgba(195, 173, 133, 0.25);
        }

        .cta-section__btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 36px rgba(195, 173, 133, 0.45);
        }

        .cta-section__btn--primary svg {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cta-section__btn--primary:hover svg {
          transform: translateX(4px);
        }

        .cta-section__btn--ghost {
          background: transparent;
          color: rgba(244, 228, 188, 0.75);
          border: 1px solid rgba(244, 228, 188, 0.2);
        }

        .cta-section__btn--ghost:hover {
          color: #F4E4BC;
          border-color: rgba(244, 228, 188, 0.45);
          transform: translateY(-2px);
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .cta-section {
            padding: 6rem 1.5rem;
          }

          .cta-section__glow {
            width: 100%;
            height: 300px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-section__content {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
