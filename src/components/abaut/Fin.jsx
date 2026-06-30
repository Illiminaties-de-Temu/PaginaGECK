import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export default function AboutCTA() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    projects: 0,
    clients: 0,
    satisfaction: 0
  });
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Targets para los contadores
  const targets = {
    projects: 50,
    clients: 30,
    satisfaction: 98
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const duration = 2000;
    const startTime = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCounts({
        projects: Math.floor(targets.projects * progress),
        clients: Math.floor(targets.clients * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });
      if (progress < 1) requestAnimationFrame(frame);
      else setCounts(targets);
    };

    requestAnimationFrame(frame);
  };

  return (
    <>
      <section className="about-cta" ref={sectionRef}>
        {/* Fondo con efectos */}
        <div className="about-cta__background">
          <div className="about-cta__orb about-cta__orb--1"></div>
          <div className="about-cta__orb about-cta__orb--2"></div>
        </div>

        <div className="about-cta__container">
          {/* Stats Grid */}
          <div className={`about-cta__stats ${isVisible ? 'about-cta__stats--visible' : ''}`}>
            <div className="stat-card">
              <div className="stat-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-card__number">{counts.projects}+</div>
              <div className="stat-card__label">{t.fin.stats.projects}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-card__number">{counts.clients}+</div>
              <div className="stat-card__label">{t.fin.stats.clients}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-card__number">{counts.satisfaction}%</div>
              <div className="stat-card__label">{t.fin.stats.satisfaction}</div>
            </div>
          </div>

          {/* CTA Content */}
          <div className={`about-cta__content ${isVisible ? 'about-cta__content--visible' : ''}`}>
            <h2 className="about-cta__title">
              {t.fin.title}
              <span className="about-cta__title-highlight">{t.fin.highlight}</span>
            </h2>
            <p className="about-cta__description">
              {t.fin.description}
            </p>

            <div className="about-cta__buttons">
              <button className="about-cta__button about-cta__button--primary">
                <span>{t.fin.btnPrimary}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="about-cta__button about-cta__button--secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t.fin.btnSecondary}</span>
              </button>
            </div>

            {/* Características rápidas */}
            <div className="about-cta__features">
              {t.fin.features.map((f, i) => (
                <div key={i} className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="currentColor"/>
                  </svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* SECCIÓN PRINCIPAL */
        .about-cta {
          position: relative;
          width: 100%;
          background: transparent;
          padding: 8rem 2rem;
          overflow: hidden;
        }

        /* FONDO */
        .about-cta__background {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .about-cta__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          animation: float 15s ease-in-out infinite;
        }

        .about-cta__orb--1 {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(195, 173, 133, 0.15), transparent);
          top: -20%;
          right: -10%;
          animation-delay: 0s;
        }

        .about-cta__orb--2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(74, 158, 255, 0.1), transparent);
          bottom: -20%;
          left: -10%;
          animation-delay: 7s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(40px, -40px, 0) scale(1.1);
          }
          66% {
            transform: translate3d(-40px, 40px, 0) scale(0.9);
          }
        }

        .about-cta__container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* STATS GRID */
        .about-cta__stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 5rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .about-cta__stats--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .stat-card {
          padding: 2.5rem;
          background: rgba(27, 54, 93, 0.4);
          border: 1px solid rgba(195, 173, 133, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          text-align: center;
          transition: all 0.4s ease;
        }

        .stat-card:hover {
          transform: translateY(-10px);
          border-color: rgba(195, 173, 133, 0.5);
          box-shadow: 0 20px 60px rgba(195, 173, 133, 0.2);
        }

        .stat-card__icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(195, 173, 133, 0.1);
          border: 2px solid rgba(195, 173, 133, 0.3);
          border-radius: 50%;
          color: var(--accent);
          transition: all 0.4s ease;
        }

        .stat-card:hover .stat-card__icon {
          transform: scale(1.1) rotate(10deg);
          background: rgba(195, 173, 133, 0.2);
        }

        .stat-card__number {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent) 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 0.75rem;
        }

        .stat-card__label {
          font-size: 1rem;
          color: #a0a0a0;
          font-weight: 500;
        }

        /* CTA CONTENT */
        .about-cta__content {
          text-align: center;
          padding: 4rem;
          background: rgba(27, 54, 93, 0.3);
          border: 1px solid rgba(195, 173, 133, 0.2);
          border-radius: 32px;
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.3s;
        }

        .about-cta__content--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-cta__title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.2;
          color: #f5f5f5;
          margin: 0 0 1.5rem 0;
        }

        .about-cta__title-highlight {
          background: linear-gradient(135deg, var(--accent) 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .about-cta__description {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #a0a0a0;
          margin: 0 0 3rem 0;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        /* BUTTONS */
        .about-cta__buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .about-cta__button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .about-cta__button--primary {
          background: linear-gradient(135deg, var(--accent) 0%, #f4d03f 100%);
          color: #0b1f49;
          box-shadow: 0 4px 20px rgba(195, 173, 133, 0.3);
        }

        .about-cta__button--primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(195, 173, 133, 0.5);
        }

        .about-cta__button--secondary {
          background: rgba(195, 173, 133, 0.1);
          color: var(--accent);
          border: 2px solid rgba(195, 173, 133, 0.3);
        }

        .about-cta__button--secondary:hover {
          background: rgba(195, 173, 133, 0.2);
          border-color: rgba(195, 173, 133, 0.5);
          transform: translateY(-3px);
        }

        /* FEATURES */
        .about-cta__features {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #a0a0a0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .feature-item svg {
          color: var(--accent);
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .about-cta__stats {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-bottom: 3rem;
          }

          .about-cta__title {
            font-size: 3rem;
          }

          .about-cta__content {
            padding: 3rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .about-cta {
            padding: 5rem 1.5rem;
          }

          .stat-card {
            padding: 2rem;
          }

          .stat-card__number {
            font-size: 3rem;
          }

          .about-cta__content {
            padding: 2rem 1.5rem;
          }

          .about-cta__title {
            font-size: 2.5rem;
          }

          .about-cta__description {
            font-size: 1.1rem;
          }

          .about-cta__buttons {
            flex-direction: column;
            width: 100%;
          }

          .about-cta__button {
            width: 100%;
            justify-content: center;
          }

          .about-cta__features {
            flex-direction: column;
            gap: 1rem;
          }

          .feature-item {
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-cta__orb,
          .stat-card,
          .about-cta__button {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}