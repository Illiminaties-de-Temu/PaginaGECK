import { useState, useEffect, useRef } from 'react';

export default function ValuesSection() {
  const [cardProgress, setCardProgress] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const cardCenter = rect.top + rect.height / 2;
        
        const startOffset = windowHeight * 1.2;
        const endOffset = -windowHeight * 0.2;
        
        let progress;
        
        if (cardCenter > startOffset) {
          progress = 0;
        } else if (cardCenter < endOffset) {
          progress = 1;
        } else {
          const totalDistance = startOffset - endOffset;
          const currentDistance = cardCenter - endOffset;
          progress = 1 - (currentDistance / totalDistance);
          
          progress = easeOutQuart(Math.max(0, Math.min(1, progress)));
        }
        
        setCardProgress(prev => {
          const newProgress = [...prev];
          if (Math.abs(newProgress[index] - progress) > 0.01) {
            newProgress[index] = progress;
            return newProgress;
          }
          return prev;
        });
      });
    };

    const easeOutQuart = (x) => {
      return 1 - Math.pow(1 - x, 4);
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler);
    handleScroll();

    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  const values = [
    {
      id: 1,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Innovación Constante",
      description: "Siempre a la vanguardia tecnológica, explorando nuevas herramientas y metodologías para ofrecer soluciones que marquen la diferencia en el mercado digital."
    },
    {
      id: 2,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Calidad Excepcional",
      description: "Cada línea de código, cada pixel diseñado y cada funcionalidad implementada pasa por rigurosos estándares de calidad para garantizar resultados impecables."
    },
    {
      id: 3,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Compromiso Total",
      description: "Tu éxito es nuestro éxito. Nos involucramos profundamente en cada proyecto, comprometiéndonos con plazos, transparencia y comunicación constante."
    },
    {
      id: 4,
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Agilidad y Eficiencia",
      description: "Implementamos metodologías ágiles que nos permiten adaptarnos rápidamente, iterar con velocidad y entregar valor continuo en cada sprint del proyecto."
    }
  ];

  const getCardStyle = (progress) => {
    const translateY = 60 * (1 - progress);
    const scale = 0.95 + (0.05 * progress);
    
    return {
      opacity: progress,
      transform: `translateY(${translateY}px) scale(${scale})`,
    };
  };

  const getIconStyle = (progress) => {
    const iconProgress = Math.max(0, (progress - 0.2) / 0.8);
    const scale = 0.8 + (0.2 * iconProgress);
    
    return {
      opacity: iconProgress,
      transform: `scale(${scale})`,
    };
  };

  const getCornerStyle = (progress, isTopLeft) => {
    const cornerProgress = Math.max(0, (progress - 0.5) / 0.5);
    const distance = 15 * (1 - cornerProgress);
    
    return {
      opacity: cornerProgress * 0.6,
      transform: `translate(${isTopLeft ? -distance : distance}px, ${isTopLeft ? -distance : distance}px)`,
    };
  };

  const getGlowStyle = (progress) => {
    let glowOpacity = 0;
    if (progress > 0.5 && progress < 0.9) {
      glowOpacity = Math.sin((progress - 0.5) / 0.4 * Math.PI) * 0.5;
    }
    
    return {
      opacity: glowOpacity,
    };
  };

  return (
    <>
      <section className="values-section" ref={sectionRef}>
        <div className="values-section__container">
          {/* Header */}
          <div className="values-section__header">
            <div className="values-section__badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="currentColor"/>
              </svg>
              <span>Nuestros Valores</span>
            </div>
            <h2 className="values-section__title">
              Lo Que Nos Define Como
              <span className="values-section__title-highlight"> Equipo</span>
            </h2>
            <p className="values-section__description">
              Estos son los pilares fundamentales que guían cada decisión, 
              cada línea de código y cada interacción con nuestros clientes.
            </p>
          </div>

          {/* Grid de valores */}
          <div className="values-section__grid">
            {values.map((value, index) => (
              <div
                key={value.id}
                ref={el => cardRefs.current[index] = el}
                className={`values-card values-card--${index}`}
                style={getCardStyle(cardProgress[index])}
              >
                {/* Resplandor de entrada - SOLO durante animación de scroll */}
                <div 
                  className="values-card__entrance-glow"
                  style={getGlowStyle(cardProgress[index])}
                ></div>

                <div 
                  className="values-card__icon"
                  style={getIconStyle(cardProgress[index])}
                >
                  {value.icon}
                </div>

                <h3 className="values-card__title">{value.title}</h3>
                <p className="values-card__description">{value.description}</p>
                
                <div 
                  className="values-card__corner values-card__corner--tl"
                  style={getCornerStyle(cardProgress[index], true)}
                ></div>
                <div 
                  className="values-card__corner values-card__corner--br"
                  style={getCornerStyle(cardProgress[index], false)}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* SECCIÓN PRINCIPAL */
        .values-section {
          position: relative;
          width: 100%;
          background: Transparent;
          padding: 8rem 2rem;
          overflow: hidden;
          min-height: 200vh;
        }

        .values-section__container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* HEADER */
        .values-section__header {
          text-align: center;
          margin-bottom: 5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .values-section__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(195, 173, 133, 0.1);
          border: 1px solid rgba(195, 173, 133, 0.3);
          border-radius: 50px;
          color: var(--accent);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .values-section__title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.2;
          color: #f5f5f5;
          margin: 0;
          max-width: 700px;
        }

        .values-section__title-highlight {
          background: linear-gradient(135deg, var(--accent) 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .values-section__description {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0;
          max-width: 600px;
        }

        /* GRID ASIMÉTRICO */
        .values-section__grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 2rem;
        }

        /* CARDS - SIN BRILLOS EN HOVER */
        .values-card {
          position: relative;
          padding: 3rem;
          background: rgba(27, 54, 93, 0.3);
          border: 1px solid rgba(195, 173, 133, 0.2);
          border-radius: 24px;
          backdrop-filter: blur(10px);
          overflow: hidden;
          
          transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          
          will-change: transform, opacity;
        }

        /* Layout asimétrico */
        .values-card--0 {
          grid-column: 1 / 8;
        }

        .values-card--1 {
          grid-column: 8 / 13;
        }

        .values-card--2 {
          grid-column: 1 / 5;
        }

        .values-card--3 {
          grid-column: 5 / 13;
        }

        /* Hover SIN brillos - solo movimiento y borde */
        .values-card:hover {
          transform: translateY(-10px) scale(1.02) !important;
          border-color: rgba(195, 173, 133, 0.5);
          box-shadow: 0 20px 60px rgba(195, 173, 133, 0.2);
        }

        /* Resplandor SOLO durante animación de entrada */
        .values-card__entrance-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, 
            transparent, 
            rgba(195, 173, 133, 0.3), 
            transparent
          );
          border-radius: 24px;
          pointer-events: none;
          z-index: -1;
        }

        /* Icon - SIN brillos en hover */
        .values-card__icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(195, 173, 133, 0.1);
          border: 2px solid rgba(195, 173, 133, 0.3);
          border-radius: 20px;
          color: var(--accent);
          margin-bottom: 2rem;
          transition: background 0.4s ease, border-color 0.4s ease;
          will-change: transform, opacity;
        }

        .values-card:hover .values-card__icon {
          transform: scale(1.1) rotate(5deg) !important;
          background: rgba(195, 173, 133, 0.2);
          border-color: rgba(195, 173, 133, 0.5);
        }

        /* Title */
        .values-card__title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f5f5f5;
          margin: 0 0 1rem 0;
          transition: color 0.3s ease;
        }

        .values-card:hover .values-card__title {
          color: var(--accent);
        }

        /* Description */
        .values-card__description {
          font-size: 1rem;
          line-height: 1.7;
          color: #a0a0a0;
          margin: 0;
        }

        /* Decorative corners */
        .values-card__corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--accent);
          transition: top 0.4s ease, left 0.4s ease, bottom 0.4s ease, right 0.4s ease;
          will-change: transform, opacity;
        }

        .values-card__corner--tl {
          top: 1rem;
          left: 1rem;
          border-right: none;
          border-bottom: none;
        }

        .values-card__corner--br {
          bottom: 1rem;
          right: 1rem;
          border-left: none;
          border-top: none;
        }

        .values-card:hover .values-card__corner--tl {
          top: 0.5rem;
          left: 0.5rem;
        }

        .values-card:hover .values-card__corner--br {
          bottom: 0.5rem;
          right: 0.5rem;
        }

        /* ============================================
           RESPONSIVE - TABLET
           ============================================ */
        @media (max-width: 1024px) {
          .values-section__title {
            font-size: 3rem;
          }

          .values-card--0 {
            grid-column: 1 / 7;
          }

          .values-card--1 {
            grid-column: 7 / 13;
          }

          .values-card--2 {
            grid-column: 1 / 7;
          }

          .values-card--3 {
            grid-column: 7 / 13;
          }

          .values-section__grid {
            gap: 1.5rem;
          }
        }

        /* ============================================
           RESPONSIVE - MÓVIL
           ============================================ */
        @media (max-width: 768px) {
          .values-section {
            padding: 5rem 1.5rem;
            min-height: auto;
          }

          .values-section__header {
            margin-bottom: 3rem;
            gap: 1rem;
          }

          .values-section__badge {
            font-size: 0.85rem;
            padding: 0.4rem 0.9rem;
          }

          .values-section__title {
            font-size: 2.2rem;
          }

          .values-section__description {
            font-size: 1rem;
            max-width: 100%;
          }

          .values-section__grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .values-card--0,
          .values-card--1,
          .values-card--2,
          .values-card--3 {
            grid-column: 1 / -1;
          }

          .values-card {
            padding: 2rem;
          }

          .values-card__icon {
            width: 70px;
            height: 70px;
            margin-bottom: 1.5rem;
          }

          .values-card__title {
            font-size: 1.5rem;
          }

          .values-card__description {
            font-size: 0.95rem;
            line-height: 1.6;
          }

          .values-card__corner {
            width: 15px;
            height: 15px;
          }
        }

        /* ============================================
           MÓVIL PEQUEÑO
           ============================================ */
        @media (max-width: 480px) {
          .values-section {
            padding: 4rem 1rem;
          }

          .values-section__title {
            font-size: 1.8rem;
          }

          .values-section__description {
            font-size: 0.95rem;
          }

          .values-card {
            padding: 1.5rem;
          }

          .values-card__icon {
            width: 60px;
            height: 60px;
          }

          .values-card__title {
            font-size: 1.3rem;
          }

          .values-card__description {
            font-size: 0.9rem;
          }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .values-card,
          .values-card__icon,
          .values-card__corner {
            transition: none !important;
          }
          
          .values-card {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}