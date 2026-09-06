import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';

/**
 * "Qué hacemos" — la respuesta en TEXTO a lo que todo visitante venía a saber.
 *
 * Reemplaza a SpecialtiesShowcase, que decía lo mismo en tres videos (4.9 MB en
 * escritorio) y 240vh de scroll.
 *
 * Un interruptor cambia las cuatro celdas a la vez, del problema al arreglo.
 *
 * TODO ESTÁ MEDIDO PARA CABER DE UNA SOLA VISTA, y esa es la regla que manda
 * sobre las demás. El interruptor solo funciona si al tocarlo se ven cambiar
 * las cuatro celdas: si dos quedaron fuera de la pantalla, el gesto pierde la
 * gracia y queda un cambio de texto cualquiera. Por eso las celdas van en 2×2
 * y no apiladas, por eso los tamaños y los espacios se miden en `vh` además de
 * en `vw`, y por eso el texto de apoyo se recorta a dos renglones en el
 * teléfono. Cualquier cosa que se agregue aquí tiene que pagar su alto.
 *
 * NO HAY CONTENEDORES. Las celdas se apoyan en el fondo de la página con
 * filetes de un píxel entre ellas, y eso es todo: la sección se lee como parte
 * de la página y no como un widget pegado encima.
 *
 * Las cuatro celdas son iguales a propósito: la repetición ES el argumento
 * —cuatro problemas distintos, el mismo desenlace— y el desfase por `--i` hace
 * que el cambio se lea como una ola y no como un parpadeo.
 *
 * LOS DOS ESTADOS VIVEN SIEMPRE EN EL HTML. El cambio es opacidad, no montaje
 * condicional: Google y los rastreadores de IA leen el síntoma Y el arreglo
 * aunque nadie toque el interruptor. El estado que no se ve lleva `aria-hidden`
 * para que el lector de pantalla no narre los dos.
 */

/* La demostración automática: a los 2.2 s de que la sección entra en pantalla
 * cambia sola y vuelve. Un interruptor en reposo no dice que se pueda tocar.
 * Corre UNA vez y cualquier interacción la cancela. */
const DEMO_IN = 2200;
const DEMO_BACK = 1900;

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function WhatWeDo({ lang }) {
  const { t } = useLanguage(lang);
  const w = t.whatWeDo;
  const labels = w.labels || {};

  /* `false` = se ve el problema. Arranca ahí a propósito: el visitante tiene
     que reconocerse antes de que le enseñes la salida. */
  const [fixed, setFixed] = useState(false);
  const [inView, setInView] = useState(false);
  /* `touched` es un ref porque solo corta los temporizadores; el hint sí tiene
     que repintarse cuando el usuario toca, así que lleva estado propio. */
  const [interacted, setInteracted] = useState(false);

  const listRef = useRef(null);
  const touched = useRef(false);
  const timers = useRef([]);

  const choose = (next) => {
    touched.current = true;
    setInteracted(true);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setFixed(next);
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        timers.current.push(setTimeout(() => {
          if (touched.current) return;
          setFixed(true);
          timers.current.push(setTimeout(() => {
            if (touched.current) return;
            setFixed(false);
          }, DEMO_BACK));
        }, DEMO_IN));
      },
      /* Un tercio basta: con 2×2 la rejilla entera ya está en pantalla mucho
         antes de que el umbral se cumpla. */
      { threshold: 0.33 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <section className="wwd" id="que-hacemos">
        <header className="wwd__head">
          <span className="wwd__eyebrow">{w.eyebrow}</span>
          <h2 className="wwd__h2">
            {w.title} <span className="wwd__accent">{w.highlight}</span>
          </h2>

          {/* Dos botones y no un checkbox: cada estado tiene nombre propio y se
              puede llegar a él directo, sin deducir qué hace un toggle. */}
          <div className="wwd__switch" role="group" aria-label={`${labels.now} / ${labels.then}`}>
            <button type="button" className={`wwd__opt wwd__opt--now${fixed ? '' : ' is-on'}`} aria-pressed={!fixed} onClick={() => choose(false)}>
              {labels.now}
            </button>
            <button type="button" className={`wwd__opt wwd__opt--then${fixed ? ' is-on' : ''}`} aria-pressed={fixed} onClick={() => choose(true)}>
              {labels.then}
            </button>
            {/* Apunta a la palabra que hay que tocar y se va en cuanto la
                tocan. `aria-hidden`: para un lector de pantalla los botones ya
                se anuncian como botones, así que esto solo sería ruido. */}
            <span className={`wwd__hint${interacted ? ' is-off' : ''}`} aria-hidden="true">
              {w.switchHint}
            </span>
          </div>
        </header>

        <div ref={listRef} className={`wwd__grid${fixed ? ' is-fixed' : ''}${inView ? ' is-in' : ''}`}>
          {w.blocks.map((b, i) => (
            <div key={b.title} className="wwd__cell" style={{ '--i': i }}>
              <span className="wwd__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>

              {/* Los dos estados comparten celda: la rejilla mide lo que mida
                  el más alto y nada salta de altura al cambiar. */}
              <div className="wwd__stack">
                <div className="wwd__state wwd__state--now" aria-hidden={fixed}>
                  <p className="wwd__lead">{b.title}</p>
                  <p className="wwd__sub">{b.now}</p>
                </div>
                <div className="wwd__state wwd__state--then" aria-hidden={!fixed}>
                  <p className="wwd__lead">{b.win}</p>
                  <p className="wwd__sub">{b.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wwd__cta">
          <p className="wwd__cta-title">{w.ctaTitle}</p>
          <a href={localizedPath('contact', lang)} className="wwd__btn">
            <span>{w.cta}</span>
            <Arrow />
          </a>
        </div>
      </section>

      <style>{`
        /* El alto se mide contra la pantalla, no solo contra el ancho: en un
           portátil de 1440×720 los clamp por vw solos dejaban la cuarta celda
           fuera de vista. */
        .wwd {
          position: relative;
          padding: clamp(2.6rem, 7vh, 5rem) 1.25rem clamp(2.4rem, 6vh, 4rem);
          max-width: 1060px;
          margin: 0 auto;
        }

        /* ── Encabezado ── */
        .wwd__head {
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          margin-bottom: clamp(1.4rem, 3.5vh, 2.2rem);
        }
        .wwd__eyebrow {
          font-size: clamp(.68rem, .8vw, .76rem);
          font-weight: 700; letter-spacing: .28em;
          text-transform: uppercase; color: var(--accent-text);
          margin-bottom: .7rem;
        }
        .wwd__h2 {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.2vw + 1vh, 2.5rem);
          font-weight: 900; line-height: 1.14; color: var(--text);
          margin: 0 0 clamp(1rem, 2.5vh, 1.5rem);
          max-width: 21ch;
          text-wrap: balance;
        }
        .wwd__accent { color: var(--accent-text); }

        /* ── Interruptor: dos palabras y un filete ──
           Sin píldora a propósito. Era el único contenedor que quedaba en una
           sección donde no hay ninguno, y el segundo elemento dorado macizo
           junto al botón del CTA, al que le competía. Ahora el dorado macizo
           es del CTA y solo del CTA.

           El filete no se desliza de una palabra a otra: cada botón tiene el
           suyo y se escala. Un filete único obligaría a medir con JS el ancho
           del botón activo, que cambia con cada idioma ("Con nosotros" /
           "With us" / "Com a gente") y en cada resize. Colapsando el saliente
           hacia el lado del entrante y haciendo crecer al entrante desde ese
           mismo lado, el ojo lee una transferencia continua sin una sola
           medición. */
        .wwd__switch {
          display: inline-flex;
          align-items: center;
          gap: clamp(1.2rem, 4vw, 2.2rem);
        }
        .wwd__opt {
          position: relative;
          padding: .3rem .1rem .55rem;
          border: 0; background: none; cursor: pointer;
          font: inherit;
          font-size: clamp(.82rem, 1.1vw, .95rem);
          font-weight: 600;
          letter-spacing: .01em;
          color: var(--text-muted);
          transition: color .35s ease, font-weight .35s ease;
        }
        .wwd__opt.is-on { color: var(--text); font-weight: 800; }
        .wwd__opt::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 2px; border-radius: 2px;
          background: var(--text-muted);
          transform: scaleX(0);
          transition: transform .45s cubic-bezier(0.22, 1, 0.36, 1), background .45s ease;
        }
        .wwd__opt--now::after  { transform-origin: right; }
        .wwd__opt--then::after { transform-origin: left; }
        .wwd__opt.is-on::after { transform: scaleX(1); }
        /* Filete fantasma en la palabra apagada: sin él, dos palabras sueltas
           no dicen que sean botones. Con él se ve que la otra TAMBIÉN tiene
           estado, que es lo que invita a tocarla. */
        .wwd__opt:not(.is-on)::after { transform: scaleX(1); opacity: .18; }
        .wwd__opt:not(.is-on):hover::after,
        .wwd__opt:not(.is-on):focus-visible::after { opacity: .5; }
        .wwd__opt:not(.is-on):hover { color: var(--text); }
        /* El color del filete dice en qué estado estás: gris el problema,
           dorado el arreglo. */
        .wwd__opt--then.is-on::after { background: var(--accent); }
        .wwd__opt--then.is-on { color: var(--accent-text); }

        /* Tercera señal, y la única explícita: una flecha que apunta al botón
           y se retira al primer toque. */
        .wwd__hint {
          font-size: clamp(.68rem, .85vw, .76rem);
          font-weight: 600;
          color: var(--text-muted);
          white-space: nowrap;
          opacity: .85;
          transition: opacity .35s ease;
          animation: wwdNudge 2.4s ease-in-out infinite;
        }
        .wwd__hint::before { content: '←'; margin-right: .3rem; }
        .wwd__hint.is-off { opacity: 0; animation: none; }
        @keyframes wwdNudge {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(4px); }
        }

        /* ── Rejilla 2×2: sin caja, solo filetes ──
           Apiladas en cuatro filas, las dos últimas caían fuera de pantalla y
           el interruptor dejaba de tener gracia. */
        .wwd__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border-top: 1px solid var(--border);
        }
        .wwd__cell {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: clamp(.7rem, 1.6vw, 1.2rem);
          align-items: start;
          padding: clamp(1.1rem, 2.6vh, 1.8rem) 0;
          border-bottom: 1px solid var(--border);
          opacity: 0;
          transform: translateY(16px);
          transition: opacity .55s ease, transform .65s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: calc(var(--i) * .07s);
        }
        .is-in .wwd__cell { opacity: 1; transform: none; }
        /* El filete vertical solo entre columnas; el aire lo dan los paddings
           laterales para que el texto no lo toque. */
        .wwd__cell:nth-child(odd) {
          border-right: 1px solid var(--border);
          padding-right: clamp(1.1rem, 3vw, 2.2rem);
        }
        .wwd__cell:nth-child(even) { padding-left: clamp(1.1rem, 3vw, 2.2rem); }

        .wwd__num {
          font-family: var(--font-display);
          font-size: .72rem; font-weight: 800; letter-spacing: .18em;
          color: var(--accent-text);
          padding-top: .35rem;
          font-variant-numeric: tabular-nums;
        }

        .wwd__stack { display: grid; }
        .wwd__state {
          grid-area: 1 / 1;
          transition: opacity .5s ease, transform .55s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: calc(var(--i) * .06s);
        }
        /* El saliente sube y el entrante llega desde abajo, en la misma
           dirección en las cuatro celdas: se lee como una sola ola. */
        .wwd__state--now { opacity: 1; transform: none; }
        .wwd__state--then { opacity: 0; transform: translateY(12px); pointer-events: none; }
        .is-fixed .wwd__state--now { opacity: 0; transform: translateY(-12px); pointer-events: none; }
        .is-fixed .wwd__state--then { opacity: 1; transform: none; pointer-events: auto; }

        .wwd__lead {
          font-family: var(--font-display);
          font-size: clamp(1.02rem, .9vw + .7vh, 1.5rem);
          font-weight: 800; line-height: 1.16;
          color: var(--text);
          margin: 0 0 .4rem;
          text-wrap: balance;
        }
        .wwd__state--then .wwd__lead { color: var(--accent-text); }
        .wwd__sub {
          margin: 0;
          font-size: clamp(.82rem, .95vw, .93rem);
          line-height: 1.5; color: var(--text-muted);
        }

        /* ── CTA: una línea y el botón. El cuerpo largo que había aquí costaba
           tres renglones de alto y empujaba la rejilla fuera de vista. ── */
        .wwd__cta {
          margin-top: clamp(1.6rem, 4vh, 2.6rem);
          display: flex; flex-wrap: wrap;
          align-items: center; justify-content: center;
          gap: 1rem;
        }
        .wwd__cta-title {
          font-family: var(--font-display);
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          font-weight: 800; color: var(--text);
          margin: 0;
        }
        .wwd__btn {
          display: inline-flex; align-items: center; gap: .55rem;
          padding: .72rem 1.45rem;
          border-radius: 100px;
          background: var(--accent);
          color: var(--on-accent, #0B1D33);
          font-size: .88rem; font-weight: 800;
          text-decoration: none;
          transition: transform .25s ease, filter .25s ease;
        }
        .wwd__btn:hover { transform: translateY(-2px); filter: brightness(1.06); }

        /* ── Teléfono ──
           Sigue en 2×2: cuatro filas apiladas no caben en 640 px de alto útil,
           y ver las cuatro cambiar a la vez es justo el punto de la sección.
           El número se va a su propia línea porque en 170 px de ancho una
           columna para dos dígitos se comía el titular. */
        @media (max-width: 640px) {
          .wwd { padding-inline: 1rem; }
          .wwd__cell {
            grid-template-columns: 1fr;
            gap: .3rem;
            padding-block: clamp(.9rem, 2.2vh, 1.3rem);
          }
          .wwd__cell:nth-child(odd) { padding-right: .8rem; }
          .wwd__cell:nth-child(even) { padding-left: .8rem; }
          .wwd__num { padding-top: 0; font-size: .66rem; }
          .wwd__lead { font-size: clamp(.94rem, 3.6vw, 1.12rem); margin-bottom: .3rem; }
          /* Dos renglones de apoyo y lo demás se recorta: el titular es lo que
             tiene que caber entero. */
          .wwd__sub {
            font-size: .78rem; line-height: 1.45;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .wwd__switch { gap: 1.4rem; }
          .wwd__cta { flex-direction: column; gap: .8rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wwd__cell, .wwd__state, .wwd__opt::after, .wwd__btn { transition: none; }
          .wwd__hint { animation: none; }
          .wwd__cell { opacity: 1; transform: none; }
          .wwd__state--then { transform: none; }
          .is-fixed .wwd__state--now { transform: none; }
        }
      `}</style>
    </>
  );
}
