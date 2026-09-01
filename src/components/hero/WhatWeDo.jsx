import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';

/**
 * "Qué hacemos" — la respuesta en TEXTO a lo que todo visitante venía a saber.
 *
 * Reemplaza a SpecialtiesShowcase, que decía lo mismo en tres videos (4.9 MB en
 * escritorio) y 240vh de scroll.
 *
 * Va en acordeón y no en mosaico por una razón concreta: los cuatro bloques
 * abiertos a la vez son doce párrafos apilados, un muro que nadie lee. Así se
 * escanean cuatro titulares de un vistazo y solo se abre el que duele.
 *
 * El texto cerrado NO se desmonta: sigue en el HTML (solo colapsado por CSS),
 * porque es justo el contenido que leen Google y los rastreadores de IA.
 *
 * Cada bloque abre con el DOLOR ("Deja de pelearte con Excel") y deja el nombre
 * técnico del servicio en el subtítulo. El cliente lee el titular; el buscador
 * lee los dos.
 */

/* Ruido determinista: la misma POSICIÓN de letra recibe siempre el mismo
 * desvío. Con Math.random el HTML del servidor y el del cliente no coincidirían
 * y React marcaría error de hidratación. */
const rnd = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/* Los desvíos se emiten UNA vez como reglas `nth-child`, no como `style` inline
 * en cada carácter: inline costaba 16 KB de HTML repetido en cada titular y en
 * cada idioma. 44 alcanza para el titular más largo; de ahí en adelante el
 * patrón se repite y nadie lo nota. */
const SCATTER_N = 44;
const scatterCSS = Array.from({ length: SCATTER_N }, (_, i) => {
  const dx = ((rnd(i * 3 + 1) - 0.5) * 15).toFixed(2);
  const dy = ((rnd(i * 3 + 2) - 0.5) * 20).toFixed(2);
  const rot = ((rnd(i * 3 + 3) - 0.5) * 24).toFixed(2);
  const d = (i * 0.012).toFixed(3);
  return `.wwd__ch:nth-child(${SCATTER_N}n+${i + 1}){--dx:${dx}px;--dy:${dy}px;--rot:${rot}deg;--d:${d}s}`;
}).join('');

/* Titular partido carácter por carácter para poder dispersarlo al pasar el
 * cursor. El `aria-label` del contenedor define el nombre accesible del botón:
 * con él presente, el lector de pantalla ya no recorre los fragmentos, así que
 * no deletrea el título letra por letra. */
function DisperseTitle({ text }) {
  return (
    <span className="wwd__title" aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={`${ch}-${i}`} className="wwd__ch">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function WhatWeDo({ lang }) {
  const { t } = useLanguage(lang);
  const w = t.whatWeDo;
  /* El primero abierto: la sección nunca se ve como una lista muerta. */
  const [open, setOpen] = useState(0);

  return (
    <>
      <section className="wwd" id="que-hacemos">
        <header className="wwd__head">
          <span className="wwd__eyebrow">{w.eyebrow}</span>
          <h2 className="wwd__h2">
            {w.title} <span className="wwd__accent">{w.highlight}</span>
          </h2>
        </header>

        <div className="wwd__list">
          {w.blocks.map((b, i) => {
            const isOpen = open === i;
            const num = String(i + 1).padStart(2, '0');
            return (
              <div key={b.title} className={`wwd__row${isOpen ? ' is-open' : ''}`}>
                {/* Número gigante de marca de agua: da escala a la fila abierta
                    sin costar un solo byte de imagen. */}
                <span className="wwd__ghost" aria-hidden="true">{num}</span>

                <h3 className="wwd__rowhead">
                  <button
                    type="button"
                    className="wwd__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`wwd-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="wwd__num" aria-hidden="true">{num}</span>
                    <span className="wwd__titles">
                      <DisperseTitle text={b.title} />
                      <span className="wwd__kicker">{b.kicker}</span>
                    </span>
                    <span className="wwd__sign" aria-hidden="true" />
                  </button>
                </h3>

                <div id={`wwd-panel-${i}`} className="wwd__panel">
                  <div className="wwd__panel-inner">
                    {b.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    <span className="wwd__rule" aria-hidden="true" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wwd__cta">
          <p className="wwd__cta-title">{w.ctaTitle}</p>
          <p className="wwd__cta-body">{w.ctaBody}</p>
          <a href={localizedPath('contact', lang)} className="wwd__btn">
            <span>{w.cta}</span>
            <Arrow />
          </a>
        </div>
      </section>

      <style>{`
        .wwd {
          position: relative;
          padding: clamp(4rem, 11vh, 7.5rem) 1.25rem clamp(3.5rem, 9vh, 6rem);
          max-width: 1080px;
          margin: 0 auto;
        }

        /* ── Encabezado ── */
        .wwd__head { text-align: center; margin-bottom: clamp(2.5rem, 6vh, 4rem); }
        .wwd__eyebrow {
          display: inline-block;
          font-size: .78rem; font-weight: 700; letter-spacing: .28em;
          text-transform: uppercase; color: var(--accent-text);
          margin-bottom: .9rem;
        }
        .wwd__h2 {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4.2vw, 2.9rem);
          font-weight: 900; line-height: 1.15; color: var(--text);
          margin: 0; max-width: 20ch; margin-inline: auto;
          text-wrap: balance;
        }
        .wwd__accent { color: var(--accent-text); }

        /* ── Acordeón ── */
        .wwd__list { border-top: 1px solid var(--border); }
        .wwd__row {
          position: relative;
          border-bottom: 1px solid var(--border);
          /* Las filas cerradas se apagan: la abierta manda. */
          opacity: .38;
          transition: opacity .4s ease;
        }
        .wwd__row.is-open,
        .wwd__row:hover,
        .wwd__row:focus-within { opacity: 1; }

        /* Número de marca de agua, detrás de todo */
        .wwd__ghost {
          position: absolute;
          right: clamp(-.5rem, 1vw, 1.5rem);
          top: 50%;
          transform: translateY(-50%) scale(.9);
          font-family: var(--font-display);
          font-size: clamp(6rem, 15vw, 12rem);
          font-weight: 900; line-height: 1;
          color: var(--accent);
          opacity: 0;
          pointer-events: none;
          user-select: none;
          transition: opacity .5s ease, transform .5s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .is-open .wwd__ghost { opacity: .09; transform: translateY(-50%) scale(1); }

        .wwd__rowhead { position: relative; z-index: 1; margin: 0; font-size: inherit; font-weight: inherit; }
        .wwd__trigger {
          width: 100%;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: clamp(1rem, 3vw, 2rem);
          padding: clamp(1.5rem, 3.4vw, 2.3rem) .25rem;
          background: none; border: 0;
          text-align: left; cursor: pointer;
          color: inherit; font: inherit;
        }
        .wwd__num {
          font-family: var(--font-display);
          font-size: clamp(.8rem, 1.4vw, .95rem);
          font-weight: 800; letter-spacing: .12em;
          color: var(--accent-text);
          opacity: .55;
          transition: opacity .3s ease;
        }
        .is-open .wwd__num { opacity: 1; }

        .wwd__titles { display: block; min-width: 0; }

        /* Titular en caja alta y a gran escala: es el gancho de la fila. */
        .wwd__title {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 4vw, 2.6rem);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -0.015em;
          text-transform: uppercase;
          color: var(--text);
          transition: color .3s ease;
        }
        .is-open .wwd__title { color: var(--accent-text); }

        /* Dispersión letra a letra. Solo en las filas cerradas: sobre la abierta
           distraería de lo que se está leyendo. */
        .wwd__ch {
          display: inline-block;
          transition: transform .5s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--d);
        }
        ${scatterCSS}
        .wwd__row:not(.is-open) .wwd__trigger:hover .wwd__ch,
        .wwd__row:not(.is-open) .wwd__trigger:focus-visible .wwd__ch {
          transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
        }

        .wwd__kicker {
          display: block;
          margin-top: .65rem;
          font-size: clamp(.72rem, 1.3vw, .8rem);
          font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* Signo +/− dibujado con dos barras: la vertical desaparece al abrir. */
        .wwd__sign {
          position: relative;
          width: 40px; height: 40px;
          flex: none;
          border: 1px solid var(--border-strong);
          border-radius: 50%;
          transition: border-color .3s ease, transform .3s ease, background-color .3s ease;
        }
        .wwd__sign::before,
        .wwd__sign::after {
          content: '';
          position: absolute; inset: 50% 50%;
          background: var(--accent-text);
          transition: transform .3s cubic-bezier(0.22, 1, 0.36, 1), opacity .3s ease;
        }
        .wwd__sign::before { width: 14px; height: 1.5px; transform: translate(-50%, -50%); }
        .wwd__sign::after  { width: 1.5px; height: 14px; transform: translate(-50%, -50%); }
        .is-open .wwd__sign {
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          transform: rotate(180deg);
        }
        .is-open .wwd__sign::after { opacity: 0; transform: translate(-50%, -50%) scaleY(0); }
        .wwd__trigger:hover .wwd__sign { border-color: var(--accent); }

        /* Colapso por grid (0fr → 1fr): anima sin medir alturas en JS y deja el
           texto en el DOM aunque esté cerrado. */
        .wwd__panel {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows .45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .is-open .wwd__panel { grid-template-rows: 1fr; }
        .wwd__panel-inner {
          overflow: hidden;
          /* Cerrado: fuera del recorrido de tabulación, pero presente en el HTML. */
          visibility: hidden;
          opacity: 0;
          transition: visibility .45s, opacity .35s ease;
        }
        .is-open .wwd__panel-inner { visibility: visible; opacity: 1; }

        .wwd__panel-inner p {
          font-size: clamp(.96rem, 1.6vw, 1.06rem);
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0 0 .95rem;
          max-width: 62ch;
          padding-left: clamp(0px, 3.5vw, 3.4rem);
          text-wrap: pretty;
        }
        .wwd__panel-inner p:first-child { padding-top: .2rem; }
        .wwd__panel-inner p:last-child {
          color: var(--text);
          font-weight: 500;
        }

        /* Línea dorada que se dibuja al abrir: cierra el bloque y marca dónde
           terminó lo que estabas leyendo. */
        .wwd__rule {
          display: block;
          height: 2px;
          margin: 1.5rem 0 clamp(1.6rem, 3.4vw, 2.3rem);
          margin-left: clamp(0px, 3.5vw, 3.4rem);
          max-width: 340px;
          background: linear-gradient(90deg, var(--accent), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .7s cubic-bezier(0.22, 1, 0.36, 1) .12s;
        }
        .is-open .wwd__rule { transform: scaleX(1); }

        /* ── Cierre ── */
        .wwd__cta {
          margin-top: clamp(2.6rem, 6vh, 4rem);
          text-align: center;
          padding: clamp(1.8rem, 4vw, 2.8rem) 1.25rem;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: color-mix(in srgb, var(--accent) 6%, var(--surface));
        }
        .wwd__cta-title {
          font-family: var(--font-display);
          font-size: clamp(1.15rem, 2.2vw, 1.5rem);
          font-weight: 800; color: var(--text); margin: 0 0 .7rem;
        }
        .wwd__cta-body {
          font-size: clamp(.94rem, 1.5vw, 1.02rem);
          line-height: 1.65; color: var(--text-muted);
          margin: 0 auto 1.6rem; max-width: 56ch;
        }
        .wwd__btn {
          display: inline-flex; align-items: center; gap: .6rem;
          padding: .85rem 1.9rem;
          border-radius: 999px;
          background: var(--accent);
          color: var(--brand-navy);
          font-weight: 700; font-size: .98rem;
          text-decoration: none;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .wwd__btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px color-mix(in srgb, var(--accent) 35%, transparent);
        }

        .wwd__trigger:focus-visible,
        .wwd__btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        @media (max-width: 560px) {
          .wwd__trigger { gap: .9rem; padding-block: 1.35rem; }
          .wwd__sign { width: 32px; height: 32px; }
          .wwd__num { align-self: start; padding-top: .35rem; }
          .wwd__ghost { font-size: 7rem; right: -1rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wwd__panel, .wwd__panel-inner, .wwd__sign, .wwd__sign::before,
          .wwd__sign::after, .wwd__title, .wwd__btn, .wwd__num, .wwd__ch,
          .wwd__ghost, .wwd__rule, .wwd__row {
            transition: none !important;
          }
          /* Sin dispersión ni barrido: el contenido se muestra sin movimiento. */
          .wwd__row:not(.is-open) .wwd__trigger:hover .wwd__ch { transform: none; }
          .wwd__rule { transform: scaleX(1); }
          .wwd__btn:hover { transform: none; }
        }
      `}</style>
    </>
  );
}
