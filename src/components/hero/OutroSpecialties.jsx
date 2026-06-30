import { useState, useEffect, useRef } from 'react';

export default function OutroSpecialties() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calcular progreso de scroll en la sección
      const sectionCenter = sectionTop + (sectionHeight / 2);
      const viewportCenter = scrollY + (windowHeight / 2);
      const distance = (viewportCenter - sectionCenter) / (windowHeight / 2);
      const progress = (distance + 1) / 2;

      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calcular opacidad (fade in mientras scrolleas)
  const getOpacity = () => {
    if (scrollProgress < 0.2) return scrollProgress / 0.2;
    if (scrollProgress > 0.8) return (1 - scrollProgress) / 0.2;
    return 1;
  };

  // Calcular blur (borroso al inicio, enfocado en centro)
  const getBlur = () => {
    if (scrollProgress < 0.3) return 10 - (scrollProgress / 0.3) * 10;
    if (scrollProgress > 0.7) return ((scrollProgress - 0.7) / 0.3) * 10;
    return 0;
  };

  // Calcular escala (crece mientras scrolleas)
  const getScale = () => {
    return 0.85 + (scrollProgress * 0.15); // De 0.85 a 1.0
  };

  const opacity = getOpacity();
  const blur = getBlur();
  const scale = getScale();

  return (
    <>
      <section 
        ref={sectionRef}
        className="outro-specialties"
      >
        <div 
          className="outro-specialties__content"
          style={{
            opacity: opacity,
            filter: `blur(${blur}px)`,
            transform: `scale(${scale})`,
            transition: 'opacity 0.3s ease-out, filter 0.3s ease-out, transform 0.3s ease-out'
          }}
        >
          <h2 className="outro-specialties__title">
            ¿Listo para Empezar?
          </h2>
          <div className="outro-specialties__line"></div>
          <p className="outro-specialties__text">
            Estas son solo algunas de nuestras especialidades. Explora todas nuestras soluciones y descubre cómo podemos ayudarte
          </p>
          <a href="/servicios" className="outro-specialties__button">
            <span className="outro-specialties__button-text">Explorar Todos los Servicios</span>
            <span className="outro-specialties__button-arrow">→</span>
          </a>
        </div>
      </section>

      <style jsx>{`
        .outro-specialties {
          background: #222220;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          position: relative;
          overflow: hidden;
        }


        .outro-specialties__content {
          max-width: 950px;
          text-align: center;
          will-change: opacity, filter, transform;
        }

        .outro-specialties__title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 2rem;
          background: linear-gradient(
            135deg,
            #F4E4BC 0%,
            var(--accent) 50%,
            #B8941F 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          letter-spacing: 0.02em;
          filter: drop-shadow(0 4px 20px rgba(195, 173, 133, 0.4));
        }

        .outro-specialties__line {
          width: 200px;
          height: 4px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent),
            #F4E4BC,
            var(--accent),
            transparent
          );
          margin: 0 auto 2.5rem;
          border-radius: 9999px;
        }

        .outro-specialties__text {
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1.8;
          color: #F4E4BC;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
          margin-bottom: 3rem;
        }

        .outro-specialties__button {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 3.5rem;
          background: linear-gradient(135deg, rgba(195, 173, 133, 0.18), rgba(195, 173, 133, 0.08));
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          color: var(--accent);
          font-weight: 700;
          font-size: 1.25rem;
          text-decoration: none;
          border-radius: 14px;
          border: 2px solid var(--accent);
          box-shadow: 
            0 0 25px rgba(195, 173, 133, 0.4),
            inset 0 0 20px rgba(195, 173, 133, 0.1);
          transition: all 0.4s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: buttonPulse 2.5s ease-in-out infinite;
        }

        .outro-specialties__button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(195, 173, 133, 0.3),
            transparent
          );
          transform: rotate(45deg);
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 
              0 0 25px rgba(195, 173, 133, 0.4),
              inset 0 0 20px rgba(195, 173, 133, 0.1);
          }
          50% {
            box-shadow: 
              0 0 40px rgba(195, 173, 133, 0.6),
              0 0 55px rgba(195, 173, 133, 0.3),
              inset 0 0 30px rgba(195, 173, 133, 0.2);
          }
        }

        .outro-specialties__button:hover {
          transform: scale(1.1) translateY(-4px);
          box-shadow: 
            0 0 45px rgba(195, 173, 133, 0.8),
            0 0 60px rgba(195, 173, 133, 0.4),
            inset 0 0 30px rgba(195, 173, 133, 0.25);
        }

        .outro-specialties__button-text {
          position: relative;
          z-index: 1;
        }

        .outro-specialties__button-arrow {
          font-size: 1.75rem;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        .outro-specialties__button:hover .outro-specialties__button-arrow {
          transform: translateX(10px);
        }

        @media (max-width: 767px) {
          .outro-specialties {
            min-height: 60vh;
            padding: 4rem 1.5rem;
          }

          .outro-specialties__title {
            font-size: 2.25rem;
          }

          .outro-specialties__text {
            font-size: 1.125rem;
            margin-bottom: 2.5rem;
          }

          .outro-specialties__line {
            width: 120px;
          }

          .outro-specialties__button {
            padding: 1.25rem 2.5rem;
            font-size: 1rem;
          }

          .outro-specialties__button-arrow {
            font-size: 1.5rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .outro-specialties__title {
            font-size: 3rem;
          }

          .outro-specialties__text {
            font-size: 1.25rem;
          }

          .outro-specialties__button {
            padding: 1.375rem 3rem;
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
}