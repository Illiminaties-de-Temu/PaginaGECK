export default function UnderConstruction() {
  return (
    <>
      <section className="under-construction">
        {/* Fondo animado */}
        <div className="under-construction__background">
          <div className="under-construction__orb under-construction__orb--1"></div>
          <div className="under-construction__orb under-construction__orb--2"></div>
        </div>

        <div className="under-construction__container">
          
          {/* Icono animado */}
          <div className="under-construction__icon-wrapper">
            <div className="under-construction__icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="under-construction__pulse"></div>
          </div>

          {/* Badge */}
          <div className="under-construction__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>En Remodelación</span>
          </div>

          {/* Título */}
          <h1 className="under-construction__title">
            Estamos Trabajando en Algo
            <span className="under-construction__title-highlight"> Increíble</span>
          </h1>

          {/* Descripción */}
          <p className="under-construction__description">
            Esta sección está siendo completamente renovada para ofrecerte 
            una mejor experiencia. Muy pronto estará de vuelta con mejoras increíbles.
          </p>

          {/* Barra de progreso animada */}
          <div className="under-construction__progress-container">
            <div className="under-construction__progress-bar">
              <div className="under-construction__progress-fill"></div>
            </div>
            <p className="under-construction__progress-text">Progreso de desarrollo</p>
          </div>

          {/* Puntos animados */}
          <div className="under-construction__dots">
            <span className="under-construction__dot"></span>
            <span className="under-construction__dot"></span>
            <span className="under-construction__dot"></span>
          </div>

          {/* Mensaje final */}
          <div className="under-construction__message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Gracias por tu paciencia</span>
          </div>

        </div>
      </section>

      <style jsx>{`
        /* SECCIÓN PRINCIPAL */
        .under-construction {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          position: relative;
          overflow: hidden;
          padding: 4rem 2rem;
        }

        /* FONDO ANIMADO */
        .under-construction__background {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .under-construction__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          animation: float 15s ease-in-out infinite;
        }

        .under-construction__orb--1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(195, 173, 133, 0.15), transparent);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }

        .under-construction__orb--2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(195, 173, 133, 0.08), transparent);
          bottom: -10%;
          right: -10%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(30px, -30px, 0) scale(1.1);
          }
          66% {
            transform: translate3d(-30px, 30px, 0) scale(0.9);
          }
        }

        /* CONTAINER */
        .under-construction__container {
          position: relative;
          z-index: 1;
          max-width: 800px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        /* ICONO */
        .under-construction__icon-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        .under-construction__icon {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(195, 173, 133, 0.1);
          border: 2px solid rgba(195, 173, 133, 0.3);
          border-radius: 50%;
          color: var(--accent);
          animation: iconBounce 3s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        .under-construction__pulse {
          position: absolute;
          inset: -10px;
          border: 2px solid var(--accent);
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* BADGE */
        .under-construction__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(195, 173, 133, 0.1);
          border: 1px solid rgba(195, 173, 133, 0.3);
          border-radius: 50px;
          color: var(--accent-text);
          font-size: 0.9rem;
          font-weight: 600;
          animation: fadeInUp 0.8s ease-out;
        }

        /* TÍTULO */
        .under-construction__title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.2;
          color: var(--text);
          margin: 0;
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }

        .under-construction__title-highlight {
          color: var(--accent-text);
          display: block;
        }

        /* DESCRIPCIÓN */
        .under-construction__description {
          font-size: 1.25rem;
          line-height: 1.8;
          color: var(--text-muted);
          margin: 0;
          max-width: 600px;
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }

        /* BARRA DE PROGRESO */
        .under-construction__progress-container {
          width: 100%;
          max-width: 500px;
          margin-top: 1rem;
          animation: fadeInUp 0.8s ease-out 0.6s backwards;
        }

        .under-construction__progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(195, 173, 133, 0.1);
          border-radius: 50px;
          overflow: hidden;
          position: relative;
        }

        .under-construction__progress-fill {
          height: 100%;
          width: 70%;
          background: linear-gradient(90deg, var(--accent), var(--brand-bronze));
          border-radius: 50px;
          position: relative;
          animation: progressGrow 2s ease-out forwards, progressShine 2s ease-in-out infinite;
        }

        @keyframes progressGrow {
          from {
            width: 0%;
          }
          to {
            width: 70%;
          }
        }

        @keyframes progressShine {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }

        .under-construction__progress-text {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* PUNTOS ANIMADOS */
        .under-construction__dots {
          display: flex;
          gap: 0.5rem;
          animation: fadeInUp 0.8s ease-out 0.8s backwards;
        }

        .under-construction__dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          animation: dotBounce 1.4s ease-in-out infinite;
        }

        .under-construction__dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .under-construction__dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* MENSAJE FINAL */
        .under-construction__message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: rgba(195, 173, 133, 0.05);
          border: 1px solid rgba(195, 173, 133, 0.2);
          border-radius: 12px;
          color: var(--text-muted);
          font-size: 1rem;
          font-weight: 500;
          margin-top: 1rem;
          animation: fadeInUp 0.8s ease-out 1s backwards;
        }

        /* ANIMACIONES */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .under-construction {
            padding: 3rem 1.5rem;
          }

          .under-construction__icon {
            width: 90px;
            height: 90px;
          }

          .under-construction__icon svg {
            width: 80px;
            height: 80px;
          }

          .under-construction__title {
            font-size: 2.5rem;
          }

          .under-construction__description {
            font-size: 1.1rem;
          }

          .under-construction__message {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .under-construction__title {
            font-size: 2rem;
          }

          .under-construction__description {
            font-size: 1rem;
          }

          .under-construction__badge {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </>
  );
}