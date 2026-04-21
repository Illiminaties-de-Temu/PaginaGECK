import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Descubrimiento',
    description: 'Analizamos tu negocio, objetivos y audiencia para crear una estrategia sólida.',
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Wireframes y prototipos interactivos que visualizan la experiencia antes del desarrollo.',
  },
  {
    number: '03',
    title: 'Desarrollo',
    description: 'Código limpio, escalable y siguiendo las mejores prácticas del sector.',
  },
  {
    number: '04',
    title: 'Testing & QA',
    description: 'Pruebas exhaustivas de funcionalidad, rendimiento y seguridad.',
  },
  {
    number: '05',
    title: 'Lanzamiento',
    description: 'Despliegue, soporte continuo y actualizaciones para asegurar el éxito.',
  },
];

const easeExpo = [0.16, 1, 0.3, 1];

export default function ProcessTimeline() {
  return (
    <section className="pt-section">

      {/* Heading */}
      <motion.div
        className="pt-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: easeExpo }}
      >
        <p className="pt-eyebrow">Nuestro Proceso</p>
        <h2 className="pt-title">
          De idea <span className="pt-gold">a realidad</span>
        </h2>
      </motion.div>

      {/* Stepper */}
      <div className="pt-stepper">

        {/* Línea que se dibuja de izquierda a derecha al entrar en vista */}
        <motion.div
          className="pt-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, delay: 0.2, ease: easeExpo }}
          style={{ transformOrigin: 'left center' }}
        />

        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            className="pt-step"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: easeExpo }}
          >
            {/* Círculo con spring */}
            <motion.div
              className="pt-circle"
              initial={{ scale: 0.4, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: 0.1 + i * 0.1,
                type: 'spring',
                stiffness: 220,
                damping: 16,
              }}
            >
              <span className="pt-number">{step.number}</span>
            </motion.div>

            {/* Contenido */}
            <motion.div
              className="pt-content"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: easeExpo }}
            >
              <h3 className="pt-step-title">{step.title}</h3>
              <p className="pt-step-desc">{step.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .pt-section {
          width: 100%;
          padding: 120px 60px 140px;
          font-family: 'Outfit', sans-serif;
          background: transparent;
          box-sizing: border-box;
        }

        /* ── Heading ── */
        .pt-heading {
          text-align: center;
          margin-bottom: 88px;
        }
        .pt-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #D4AF37;
          margin: 0 0 16px;
          opacity: 0.9;
        }
        .pt-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.15;
        }
        .pt-gold {
          color: #D4AF37;
          font-weight: 300;
        }

        /* ── Stepper container ── */
        .pt-stepper {
          position: relative;
          display: flex;
          align-items: flex-start;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Línea horizontal animada */
        .pt-line {
          position: absolute;
          top: 36px; /* centro del círculo de 72px */
          left: calc(10% + 36px);
          right: calc(10% + 36px);
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(212, 175, 55, 0.4) 10%,
            rgba(212, 175, 55, 0.4) 90%,
            transparent
          );
          pointer-events: none;
        }

        /* ── Step ── */
        .pt-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 0 16px;
        }

        /* ── Círculo ── */
        .pt-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.4);
          background: #0B1D33;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition: border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
          cursor: default;
        }
        .pt-step:hover .pt-circle {
          border-color: rgba(212, 175, 55, 0.85);
          background: rgba(212, 175, 55, 0.07);
          box-shadow: 0 0 24px rgba(212, 175, 55, 0.18);
        }
        .pt-number {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #D4AF37;
        }

        /* ── Contenido ── */
        .pt-content {
          text-align: center;
          max-width: 180px;
        }
        .pt-step-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 10px;
          transition: color 0.25s ease;
          line-height: 1.3;
        }
        .pt-step:hover .pt-step-title {
          color: #D4AF37;
        }
        .pt-step-desc {
          font-size: 0.82rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.42);
          margin: 0;
        }

        /* ── Mobile vertical ── */
        @media (max-width: 760px) {
          .pt-section { padding: 80px 28px 96px; }
          .pt-heading  { margin-bottom: 60px; }

          .pt-stepper {
            flex-direction: column;
            gap: 0;
          }

          .pt-line {
            top: calc(10% + 36px);
            bottom: calc(10% + 36px);
            left: 36px;
            right: auto;
            width: 1px;
            height: auto;
            background: linear-gradient(
              to bottom,
              transparent,
              rgba(212, 175, 55, 0.4) 10%,
              rgba(212, 175, 55, 0.4) 90%,
              transparent
            );
            /* override scaleX → use scaleY */
            transform-origin: top center !important;
          }

          .pt-step {
            flex-direction: row;
            align-items: flex-start;
            padding: 0 0 48px 0;
            gap: 20px;
          }
          .pt-step:last-child { padding-bottom: 0; }

          .pt-circle { flex-shrink: 0; }

          .pt-content {
            text-align: left;
            max-width: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pt-circle  { transition: none; }
          .pt-step-title { transition: none; }
        }
      `}</style>
    </section>
  );
}
