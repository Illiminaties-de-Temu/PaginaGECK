import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

/**
 * FaqSection — bloque de preguntas frecuentes.
 *
 * Usa <details>/<summary> nativos a propósito: el texto de las respuestas existe
 * en el HTML aunque el acordeón esté cerrado y aunque React nunca se hidrate.
 * Es el formato que los motores de respuesta con IA (ChatGPT Search, Perplexity,
 * AI Overviews) extraen y citan con más facilidad, y el que alimenta el
 * FAQPage de datos estructurados que emite la página.
 *
 * Apertura por hover: en escritorio basta con pasar el mouse. El clic sigue
 * funcionando igual, y en táctil el hover se desactiva por completo — sin eso,
 * un toque en móvil dispara hover Y clic, y la pregunta se abriría y cerraría
 * en el mismo gesto.
 */
export default function FaqSection() {
  const { t } = useLanguage();
  const f = t.faq;

  // Índice abierto. Acordeón: una respuesta a la vez.
  const [openIdx, setOpenIdx] = useState(0);

  // ¿El dispositivo tiene puntero real? Solo entonces se abre por hover.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Pequeño retardo: evita que las respuestas se disparen una tras otra al
  // arrastrar el mouse por encima de la lista camino a otra parte.
  const hoverTimer = useRef(null);
  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  useEffect(() => clearHoverTimer, []);

  const handleEnter = (i) => {
    if (!canHover) return;
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setOpenIdx(i), 110);
  };

  const handleLeave = () => {
    if (!canHover) return;
    clearHoverTimer();
  };

  // El summary controla la apertura desde React, no desde el navegador: sin
  // preventDefault el <details> haría su propio toggle y pelearía con el estado.
  const handleClick = (e, i) => {
    e.preventDefault();
    clearHoverTimer();
    setOpenIdx((prev) => (prev === i ? -1 : i));
  };

  return (
    <section className="gc-faq" aria-labelledby="gc-faq-title">
      <div className="gc-faq__inner">
        <header className="gc-faq__header">
          <p className="gc-faq__badge">{f.badge}</p>
          <h2 className="gc-faq__title" id="gc-faq-title">
            {f.title} <span className="gc-faq__accent">{f.titleSpan}</span>
          </h2>
          <p className="gc-faq__subtitle">{f.subtitle}</p>
        </header>

        <div className="gc-faq__list" onMouseLeave={handleLeave}>
          {f.items.map((item, i) => (
            <details
              className="gc-faq__item"
              key={i}
              open={openIdx === i}
              onMouseEnter={() => handleEnter(i)}
            >
              <summary className="gc-faq__q" onClick={(e) => handleClick(e, i)}>
                <h3 className="gc-faq__q-text">{item.q}</h3>
                <span className="gc-faq__icon" aria-hidden="true" />
              </summary>
              <div className="gc-faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>

        <p className="gc-faq__cta">
          {f.ctaText}{' '}
          <a href="/contacto/" className="gc-faq__cta-link">
            {f.ctaLink}
          </a>
        </p>
      </div>

      <style>{`
        .gc-faq {
          background: transparent;
          color: var(--text);
          padding: clamp(80px, 12vh, 130px) 1.5rem;
        }

        .gc-faq__inner { max-width: 860px; margin: 0 auto; }

        .gc-faq__header { text-align: center; margin-bottom: clamp(38px, 6vh, 60px); }

        .gc-faq__badge {
          font-family: var(--font-display, inherit);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.72rem;
          color: var(--accent-text);
          margin: 0 0 0.9rem;
        }

        .gc-faq__title {
          font-family: var(--font-display, inherit);
          font-size: clamp(1.9rem, 5vw, 3rem);
          line-height: 1.1;
          margin: 0 0 0.9rem;
          color: var(--text);
        }

        .gc-faq__accent { color: var(--accent-text); }

        .gc-faq__subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          margin: 0;
        }

        .gc-faq__list {
          border-top: 1px solid var(--border);
        }

        .gc-faq__item {
          border-bottom: 1px solid var(--border);
        }

        .gc-faq__q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          cursor: pointer;
          padding: 1.35rem 0.25rem;
          list-style: none;
        }

        .gc-faq__q::-webkit-details-marker { display: none; }

        .gc-faq__q-text {
          font-family: var(--font-display, inherit);
          font-size: clamp(1rem, 2.2vw, 1.15rem);
          font-weight: 600;
          line-height: 1.4;
          margin: 0;
          color: var(--text);
          transition: color 0.25s ease;
        }

        .gc-faq__item[open] .gc-faq__q-text,
        .gc-faq__q:hover .gc-faq__q-text { color: var(--accent-text); }

        /* Icono +/− dibujado con CSS: sin dependencias ni SVG extra */
        .gc-faq__icon {
          position: relative;
          flex: 0 0 auto;
          width: 18px;
          height: 18px;
        }
        .gc-faq__icon::before,
        .gc-faq__icon::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: var(--accent-text);
          transform: translateY(-50%);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gc-faq__icon::after { transform: translateY(-50%) rotate(90deg); }
        .gc-faq__item[open] .gc-faq__icon::after { transform: translateY(-50%) rotate(0deg); }

        .gc-faq__a {
          padding: 0 2.5rem 1.6rem 0.25rem;
          animation: gc-faq-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes gc-faq-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .gc-faq__a p {
          margin: 0;
          font-size: 0.98rem;
          line-height: 1.75;
          color: var(--text-muted);
        }

        .gc-faq__cta {
          text-align: center;
          margin: clamp(38px, 6vh, 56px) 0 0;
          font-size: 0.98rem;
          color: var(--text-muted);
        }

        .gc-faq__cta-link {
          color: var(--accent-text);
          font-weight: 600;
          border-bottom: 1px solid currentColor;
          padding-bottom: 1px;
        }

        @media (prefers-reduced-motion: reduce) {
          .gc-faq__icon::before,
          .gc-faq__icon::after,
          .gc-faq__q-text { transition: none; }
          .gc-faq__a { animation: none; }
        }
      `}</style>
    </section>
  );
}
