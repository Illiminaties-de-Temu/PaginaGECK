import { useState, useEffect, useRef } from 'react';

const SERVICES = [
  {
    id: 'ia',
    title: 'IA & Automatización',
    description: 'Desarrollamos soluciones de inteligencia artificial y visión por computadora que transforman tu negocio',
    link: '/servicios#ia',
    buttonText: 'Explorar IA',
    videoDesktop: '/assets/video/ia.mp4',
    videoMobile: '/assets/video/ia-cel.mp4',
    poster: '/assets/image/ia-poster.webp',
    tag: 'Inteligencia Artificial',
  },
  {
    id: 'web',
    title: 'Desarrollo Web',
    description: 'Creamos aplicaciones web modernas, rápidas y escalables con las mejores tecnologías del mercado',
    link: '/servicios#web',
    buttonText: 'Explorar Web',
    videoDesktop: '/assets/video/web.mp4',
    videoMobile: '/assets/video/web-movil.mp4',
    poster: '/assets/image/web-poster.webp',
    tag: 'Web & E-commerce',
  },
  {
    id: 'mobile',
    title: 'Desarrollo Móvil',
    description: 'Apps móviles nativas y multiplataforma que tus usuarios amarán y usarán todos los días',
    link: '/servicios#mobile',
    buttonText: 'Explorar Móvil',
    videoDesktop: '/assets/video/cel.mp4',
    videoMobile: '/assets/video/cel.mp4',
    poster: '/assets/image/cel-poster.webp',
    tag: 'iOS & Android',
  },
];

export default function SpecialtiesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(1); // 0→1: fade in del activo
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef(null);
  const prevIndexRef = useRef(0);
  const videoRefs = useRef([]);

  /* ── Detectar mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Scroll → índice activo ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const { top, height } = wrapperRef.current.getBoundingClientRect();
      // progress 0 cuando el wrapper entra al viewport, 1 cuando sale
      const scrolled = -top / (height - window.innerHeight);
      const clamped = Math.max(0, Math.min(1, scrolled));

      const phaseSize = 1 / SERVICES.length;
      const rawIndex = Math.floor(clamped / phaseSize);
      const newIndex = Math.min(rawIndex, SERVICES.length - 1);

      // Progreso dentro de la fase actual (0→1)
      const phaseProgress = (clamped - newIndex * phaseSize) / phaseSize;

      if (newIndex !== prevIndexRef.current) {
        prevIndexRef.current = newIndex;
        setActiveIndex(newIndex);
        setTransitionProgress(0); // reinicia fade
      } else {
        // usa el progreso de fase para controlar el fade-in del texto
        setTransitionProgress(Math.min(1, phaseProgress * 3)); // rápido al inicio
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Asegurar que el video activo esté reproduciéndose ── */
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  const active = SERVICES[activeIndex];

  return (
    <>
      {/* Wrapper con altura para dar espacio al scroll */}
      <div ref={wrapperRef} className="sc-wrapper">

        {/* Sección sticky que se queda fija */}
        <div className="sc-sticky">

          {/* ── Videos (uno por servicio, crossfade via opacity) ── */}
          <div className="sc-videos">
            {SERVICES.map((s, i) => (
              <video
                key={s.id}
                ref={el => videoRefs.current[i] = el}
                autoPlay={i === 0}
                loop
                muted
                playsInline
                poster={s.poster}
                className="sc-video"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
              >
                <source src={isMobile ? s.videoMobile : s.videoDesktop} type="video/mp4" />
              </video>
            ))}
            {/* Overlay oscuro sobre el video */}
            <div className="sc-overlay" />
          </div>

          {/* ── Cabecera fija arriba ── */}
          <div className="sc-header">
            <span className="sc-header__label">Nuestras Especialidades</span>
          </div>

          {/* ── Contenido central del servicio activo ── */}
          <div
            className="sc-content"
            style={{
              opacity: transitionProgress,
              transform: `translateY(${(1 - transitionProgress) * 24}px)`,
            }}
          >
            <span className="sc-content__tag">{active.tag}</span>
            <h2 className="sc-content__title">{active.title}</h2>
            <p className="sc-content__description">{active.description}</p>
            <a href={active.link} className="sc-content__button">
              <span>{active.buttonText}</span>
              <span className="sc-content__arrow">→</span>
            </a>
          </div>

          {/* ── Indicador lateral derecho ── */}
          <nav className="sc-nav" aria-label="Servicios">
            {SERVICES.map((s, i) => (
              <button
                key={s.id}
                className={`sc-nav__dot ${i === activeIndex ? 'sc-nav__dot--active' : ''}`}
                aria-label={s.title}
                aria-current={i === activeIndex}
                onClick={() => {
                  if (!wrapperRef.current) return;
                  const { top: wTop } = wrapperRef.current.getBoundingClientRect();
                  const wHeight = wrapperRef.current.offsetHeight - window.innerHeight;
                  const targetProgress = (i / SERVICES.length) + 0.01;
                  const targetScroll = window.scrollY + wTop + wHeight * targetProgress;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }}
              />
            ))}
          </nav>

          {/* ── Contador abajo ── */}
          <div className="sc-counter">
            <span className="sc-counter__current">0{activeIndex + 1}</span>
            <span className="sc-counter__sep"> / </span>
            <span className="sc-counter__total">0{SERVICES.length}</span>
          </div>

          {/* ── Barra de progreso inferior ── */}
          <div className="sc-progress">
            {SERVICES.map((s, i) => (
              <div
                key={s.id}
                className={`sc-progress__bar ${i === activeIndex ? 'sc-progress__bar--active' : ''} ${i < activeIndex ? 'sc-progress__bar--done' : ''}`}
              />
            ))}
          </div>

        </div>
      </div>

      <style>{`
        /* ────────────────────────────
           WRAPPER  (da altura al scroll)
        ──────────────────────────── */
        .sc-wrapper {
          position: relative;
          height: 240vh; /* ~47vh por servicio scrolleable — transición más ágil */
        }

        /* ────────────────────────────
           STICKY  (la pantalla fija)
        ──────────────────────────── */
        .sc-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #0B1D33;
        }

        /* ────────────────────────────
           VIDEOS
        ──────────────────────────── */
        .sc-videos {
          position: absolute;
          inset: 0;
        }

        .sc-video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          transform: translate(-50%, -50%);
          object-fit: cover;
          transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(11, 29, 51, 0.75) 0%,
            rgba(11, 29, 51, 0.45) 50%,
            rgba(11, 29, 51, 0.65) 100%
          );
        }

        /* ────────────────────────────
           CABECERA
        ──────────────────────────── */
        .sc-header {
          position: absolute;
          top: 2.5rem;
          left: 5rem;
          z-index: 10;
        }

        .sc-header__label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #D4AF37;
          opacity: 0.85;
        }

        /* ────────────────────────────
           CONTENIDO  (texto del servicio)
        ──────────────────────────── */
        .sc-content {
          position: absolute;
          bottom: 18%;
          left: 5rem;
          max-width: 600px;
          z-index: 10;
          transition: opacity 0.35s ease, transform 0.35s ease;
          will-change: opacity, transform;
        }

        .sc-content__tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #D4AF37;
          border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 1.25rem;
        }

        .sc-content__title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900;
          line-height: 1.05;
          margin-bottom: 1.25rem;
          background: linear-gradient(135deg, #F4E4BC, #D4AF37, #B8941F);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sc-content__description {
          font-size: clamp(1rem, 1.5vw, 1.35rem);
          color: #F4E4BC;
          line-height: 1.7;
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 500px;
        }

        .sc-content__button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 2.25rem;
          background: rgba(212, 175, 55, 0.12);
          backdrop-filter: blur(12px);
          color: #D4AF37;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          text-decoration: none;
          border-radius: 10px;
          border: 1.5px solid rgba(212, 175, 55, 0.6);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }

        .sc-content__button:hover {
          background: rgba(212, 175, 55, 0.22);
          border-color: #D4AF37;
          transform: translateY(-2px);
        }

        .sc-content__arrow {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-size: 1.1rem;
        }

        .sc-content__button:hover .sc-content__arrow {
          transform: translateX(6px);
        }

        /* ────────────────────────────
           NAVEGACIÓN  (puntos laterales)
        ──────────────────────────── */
        .sc-nav {
          position: absolute;
          right: 3rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .sc-nav__dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(244, 228, 188, 0.3);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease, height 0.3s ease;
        }

        .sc-nav__dot--active {
          background: #D4AF37;
          height: 28px;
          transform: scaleX(1);
        }

        .sc-nav__dot:hover:not(.sc-nav__dot--active) {
          background: rgba(212, 175, 55, 0.6);
        }

        /* ────────────────────────────
           CONTADOR
        ──────────────────────────── */
        .sc-counter {
          position: absolute;
          bottom: 3.5rem;
          right: 3rem;
          z-index: 10;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
        }

        .sc-counter__current {
          font-weight: 700;
          font-size: 1.1rem;
          color: #D4AF37;
        }

        .sc-counter__sep {
          color: rgba(244, 228, 188, 0.3);
          margin: 0 0.2rem;
        }

        .sc-counter__total {
          color: rgba(244, 228, 188, 0.4);
        }

        /* ────────────────────────────
           BARRA DE PROGRESO
        ──────────────────────────── */
        .sc-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          display: flex;
          z-index: 10;
        }

        .sc-progress__bar {
          flex: 1;
          background: rgba(212, 175, 55, 0.15);
          transition: background 0.5s ease;
        }

        .sc-progress__bar--done {
          background: rgba(212, 175, 55, 0.45);
        }

        .sc-progress__bar--active {
          background: #D4AF37;
        }

        /* ────────────────────────────
           MOBILE
        ──────────────────────────── */
        @media (max-width: 767px) {
          .sc-header {
            left: 1.5rem;
            top: 1.75rem;
          }

          .sc-content {
            left: 1.5rem;
            right: 1.5rem;
            bottom: 14%;
            max-width: 100%;
          }

          .sc-nav {
            right: 1.25rem;
          }

          .sc-counter {
            right: 1.25rem;
            bottom: 2.5rem;
          }
        }

        /* ────────────────────────────
           REDUCIR MOVIMIENTO
        ──────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .sc-video,
          .sc-content,
          .sc-content__button,
          .sc-nav__dot {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
