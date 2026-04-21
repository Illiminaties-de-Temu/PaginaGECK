import { useState, useEffect, useRef } from 'react';

export default function ServiceSection({ 
  videoDesktop,
  videoMobile,
  poster,
  title, 
  description, 
  link,
  buttonText 
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  /* ===========================
      Detección de Mobile
     =========================== */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ===========================
      Lógica de Scroll "Carrusel"
     =========================== */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculamos cuánto de la sección está visible (0 a 1)
      // 0 = la sección empieza a asomar por abajo
      // 0.5 = la sección está centrada
      // 1 = la sección terminó de pasar
      const sectionVisibleHeight = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const progress = currentPos / sectionVisibleHeight;

      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ===========================
      Cálculos de Movimiento
     =========================== */
  
  // El video solo es visible cuando la sección está cerca del centro (0.3 a 0.7)
  const videoOpacity = scrollProgress > 0.1 && scrollProgress < 0.9 ? 1 : 0;

  // El texto viaja desde abajo (100%) hasta arriba (-100%)
  // Ajustamos el rango para que el "punto dulce" (centro) sea en scrollProgress 0.5
  const textY = (0.5 - scrollProgress) * 1500; // Multiplicador de velocidad de desplazamiento
  const textOpacity = scrollProgress > 0.3 && scrollProgress < 0.7 ? 1 : 0;

  return (
    <>
      <section className="service-section" ref={sectionRef}>
        
        {/* FONTO FIJO (VIDEOS) */}
        <div 
          className="service-section__video-wrapper"
          style={{ opacity: videoOpacity }}
        >
          <video
            autoPlay loop muted playsInline
            key={isMobile ? 'm' : 'd'}
            className={`service-section__video ${!isMobile ? 'is-active' : ''}`}
            style={{ opacity: !isMobile ? 1 : 0 }}
          >
            <source src={videoDesktop} type="video/mp4" />
          </video>

          <video
            autoPlay loop muted playsInline
            className={`service-section__video ${isMobile ? 'is-active' : ''}`}
            style={{ opacity: isMobile ? 1 : 0 }}
          >
            <source src={videoMobile} type="video/mp4" />
          </video>
          
          <div className="service-section__overlay" />
        </div>

        {/* CAPA DE TEXTO QUE "SUBE" */}
        <div
          className="service-section__content-container"
          style={{
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
          }}
        >
          <div className="service-section__text-box">
            <h2 className="service-section__title">{title}</h2>
            <p className="service-section__description">{description}</p>
            <a href={link} className="service-section__button">
              <span>{buttonText}</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .service-section {
          position: relative;
          width: 100%;
          height: 150vh; /* Altura extra para dar margen al desplazamiento del texto */
          background: #030c1d;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        /* Video fijo como fondo */
        .service-section__video-wrapper {
          position: fixed; /* Mantiene el video quieto mientras el scroll sucede */
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
          transition: opacity 0.8s ease;
        }

        .service-section__video {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.4);
          transition: opacity 1s ease;
        }

        .service-section__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #030c1d 0%, transparent 20%, transparent 80%, #030c1d 100%);
        }

        /* Contenedor del contenido que se mueve */
        .service-section__content-container {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding-left: 10%;
          will-change: transform, opacity;
          transition: opacity 0.5s ease-out;
        }

        .service-section__text-box {
          max-width: 650px;
        }

        .service-section__title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 900;
          color: #D4AF37;
          margin-bottom: 20px;
          text-transform: uppercase;
          line-height: 1;
        }

        .service-section__description {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: #F4E4BC;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .service-section__button {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          padding: 15px 35px;
          border: 2px solid #D4AF37;
          color: #D4AF37;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .service-section__button:hover {
          background: #D4AF37;
          color: #030c1d;
        }

        @media (max-width: 767px) {
          .service-section { height: 120vh; }
          .service-section__content-container { padding-left: 5%; padding-right: 5%; }
        }
      `}</style>
    </>
  );
}