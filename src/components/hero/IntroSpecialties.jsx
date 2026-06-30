import { useState, useEffect, useRef } from 'react';

export default function IntroSpecialties() {
  const [visibility, setVisibility] = useState(0); // 0 a 1
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Centro de la sección
      const sectionCenter = sectionTop + sectionHeight / 2;
      // Centro del viewport
      const viewportCenter = scrollY + windowHeight / 2;

      // Distancia del centro de la sección al centro del viewport
      const distance = Math.abs(viewportCenter - sectionCenter);
      
      // Rango en el que queremos que esté visible (ajusta este valor)
      const fadeRange = windowHeight * 0.6; // 60% de la altura de la ventana
      
      // Calcular opacidad: 1 cuando está en el centro, 0 cuando está lejos
      const opacity = Math.max(0, 1 - distance / fadeRange);
      
      setVisibility(opacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecutar al montar

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular blur: máximo blur cuando visibility es 0, sin blur cuando es 1
  const blurAmount = (1 - visibility) * 10; // 10px de blur máximo

  return (
    <>
      <section ref={sectionRef} className="intro-specialties">
        <div
          className="intro-specialties__content"
          style={{
            opacity: visibility,
            transform: `translateY(${(1 - visibility) * 30}px) scale(${0.95 + visibility * 0.05})`,
            filter: `blur(${blurAmount}px)`,
            transition: 'opacity 0.1s linear, transform 0.1s linear, filter 0.1s linear'
          }}
        >
          <h2 className="intro-specialties__title">
            Nuestras Especialidades
          </h2>

          <div 
            className="intro-specialties__line"
            style={{
              transform: `scaleX(${visibility})`,
              opacity: visibility
            }}
          ></div>

          <p className="intro-specialties__text">
            Descubre las áreas donde destacamos y cómo podemos transformar tus ideas en realidad digital
          </p>
        </div>
      </section>

      <style jsx>{`
        .intro-specialties {
          background: #222220;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .intro-specialties__content {
          max-width: 900px;
          text-align: center;
          will-change: opacity, transform, filter;
        }

        .intro-specialties__title {
          font-size: 3.5rem;
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
        }

        .intro-specialties__line {
          width: 150px;
          height: 4px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent),
            #F4E4BC,
            var(--accent),
            transparent
          );
          margin: 0 auto 2rem;
          border-radius: 9999px;
          transform-origin: center;
          transition: transform 0.1s linear, opacity 0.1s linear;
        }

        .intro-specialties__text {
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1.8;
          color: #F4E4BC;
        }

        @media (max-width: 768px) {
          .intro-specialties {
            min-height: 50vh;
            padding: 3rem 1.5rem;
          }

          .intro-specialties__title {
            font-size: 2.5rem;
          }

          .intro-specialties__text {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
}