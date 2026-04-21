import { useEffect, useRef, useState } from 'react';

export default function VideoBackground({ children }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  /* ── Detectar mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Parallax suave en el video ── */
  useEffect(() => {
    const video = videoRef.current;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion && video) {
      video.pause();
      return;
    }

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const offset = window.scrollY * 0.3;
        if (video) {
          video.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
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
      {/* Hero section contenida — ya NO es fixed */}
      <section className="hero-section">

        {/* Video de fondo */}
        <div className="hero-video-wrapper">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/image/geck-poster.webp"
            className="hero-video"
            key={isMobile ? 'mobile' : 'desktop'}
          >
            <source
              src={isMobile ? '/assets/video/geck-movil.mp4' : '/assets/video/geck-bg.mp4'}
              type="video/mp4"
            />
          </video>

          {/* Overlay de color */}
          <div className="hero-overlay" />

          {/* Viñeta radial */}
          <div className="hero-vignette" />

        </div>

        {/* Contenido */}
        <div className="hero-content-wrapper">
          {children}
        </div>

      </section>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Video ── */
        .hero-video-wrapper {
          position: absolute;
          inset: 0;
        }

        .hero-video {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 115%; /* sobredimensionado para el parallax */
          object-fit: cover;
          transform: translate(-50%, -50%);
          filter: brightness(0.55) contrast(1.1);
          will-change: transform;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(11, 29, 51, 0.72) 0%,
            rgba(5, 13, 26, 0.65) 50%,
            rgba(11, 31, 73, 0.72) 100%
          );
          pointer-events: none;
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(5, 13, 26, 0.45) 60%,
            rgba(5, 13, 26, 0.85) 100%
          );
          pointer-events: none;
        }


        /* ── Contenido ── */
        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          height: 100%;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .hero-video {
            filter: brightness(0.5) contrast(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-video {
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>
    </>
  );
}
