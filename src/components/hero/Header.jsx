import { useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export default function Header() {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const scrollRef    = useRef(null);
  const rafRef       = useRef(null);

  /* ── Fade de entrada ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.style.opacity = '1';
    }, 150);
    return () => clearTimeout(t);
  }, []);

  /* ── Transición de salida con scroll (DOM directo, sin setState) ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const container = containerRef.current;
    const scrollHint = scrollRef.current;

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.55));

        // Contenido: fade out + drift suave hacia arriba
        if (container) {
          container.style.opacity  = String(1 - progress);
          container.style.transform = `translate(-50%, calc(-50% - ${progress * 22}px))`;
        }

        // Scroll hint desaparece antes
        if (scrollHint) {
          const hintProgress = Math.min(1, window.scrollY / (window.innerHeight * 0.25));
          scrollHint.style.opacity = String((1 - hintProgress) * 0.35);
        }

        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="hdr">

        <p className="hdr__eyebrow">{t.header.eyebrow}</p>

        <h1 className="hdr__title">
          {t.header.title}
          <span className="hdr__title-accent"> {t.header.titleAccent}</span>
        </h1>

        <p className="hdr__phrase">
          {t.header.phrase}
        </p>

        <div className="hdr__ctas">
          <a href="/portafolio" className="hdr__cta hdr__cta--solid">{t.header.ctaSolid}</a>
          <a href="/contacto"   className="hdr__cta hdr__cta--ghost">{t.header.ctaGhost}</a>
        </div>

      </div>

      {/* Scroll hint */}
      <div ref={scrollRef} className="hdr-scroll">
        <div className="hdr-scroll__line" />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>

      <style>{`
        .hdr {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
          max-width: 720px;
          padding: 0 2rem;
          opacity: 0;
          transition: opacity 1.4s ease;
          will-change: opacity, transform;
          z-index: 5; /* por encima del canvas del modelo 3D */
        }

        /* Velo radial suave detrás del texto para legibilidad sobre el modelo */
        .hdr::before {
          content: '';
          position: absolute;
          inset: -18% -10%;
          z-index: -1;
          background: radial-gradient(
            ellipse at center,
            rgba(5, 13, 26, 0.55) 0%,
            rgba(5, 13, 26, 0.32) 45%,
            transparent 75%
          );
          pointer-events: none;
        }

        /* ── Eyebrow ── */
        .hdr__eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          opacity: 0.85;
          margin-bottom: 1.25rem;
        }

        /* ── Título h1 ── */
        .hdr__title {
          font-size: clamp(2rem, 5vw, 3.6rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #F4E4BC;
          margin-bottom: 1.1rem;
        }
        .hdr__title-accent {
          display: block;
          color: var(--accent);
          font-weight: 300;
        }

        /* ── Subtítulo ── */
        .hdr__phrase {
          font-size: clamp(0.9rem, 1.6vw, 1.1rem);
          font-weight: 300;
          line-height: 1.7;
          letter-spacing: 0.01em;
          color: rgba(244,228,188,0.6);
          margin-bottom: 2.5rem;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── CTAs ── */
        .hdr__ctas {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hdr__cta {
          display: inline-block;
          padding: 0.75rem 1.875rem;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 8px;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .hdr__cta:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .hdr__cta--solid {
          background: var(--accent);
          color: #0B1D33;
          border: 1px solid var(--accent);
        }

        .hdr__cta--ghost {
          background: transparent;
          color: #F4E4BC;
          border: 1px solid rgba(244, 228, 188, 0.35);
        }

        /* ── Scroll hint ── */
        .hdr-scroll {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          color: rgba(244, 228, 188, 0.35);
          opacity: 0;
          z-index: 5;
          will-change: opacity;
          animation: hdr-scroll-in 1s ease-out 1.8s both,
                     hdr-scroll-bob 2.5s ease-in-out 2.8s infinite;
        }

        .hdr-scroll__line {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, transparent, rgba(244, 228, 188, 0.35));
        }

        @keyframes hdr-scroll-in {
          from { opacity: 0; }
          to   { opacity: 0.35; }
        }

        @keyframes hdr-scroll-bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(5px); }
        }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .hdr__title { font-size: clamp(1.7rem, 7vw, 2.4rem); }
          .hdr__phrase { font-size: 0.88rem; }
          .hdr__eyebrow { font-size: 0.62rem; letter-spacing: 0.18em; }
          .hdr__cta { padding: 0.7rem 1.5rem; font-size: 0.8rem; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .hdr {
            transition: none;
            opacity: 1;
          }
          .hdr-scroll {
            animation: none;
            opacity: 0.35;
          }
        }
      `}</style>
    </>
  );
}
