import { useEffect, useRef, useState } from 'react';
import { cubicBezier, motion, useReducedMotion } from 'framer-motion';

/* Las dudas de contratacion.
 *
 * Eran tres <details> nativos, uno debajo de otro y con la primera abierta.
 * Funcionaban, pero se abrian de golpe y la cabecera se perdia arriba en
 * cuanto la lista crecio a siete: el que va leyendo respuestas deja de saber
 * de que trata la seccion.
 *
 * Ahora la cabecera se queda fija a un lado mientras la lista corre al otro,
 * y solo hay una respuesta abierta a la vez. No es por ahorrar espacio: es
 * que estas preguntas se leen de una en una —"¿cuanto tardan?", y ya— y con
 * seis respuestas desplegadas a la vez ninguna se lee.
 *
 * Lo que se pierde del <details> nativo se repone a mano: el boton lleva
 * aria-expanded y aria-controls, y la respuesta su region con id. Sin eso,
 * un lector de pantalla oye siete botones sueltos sin saber que abren.
 *
 * Se abre con solo pasar por encima: recorrer la lista con el raton va
 * contestando pregunta por pregunta sin pedir un clic por cada una. Con dos
 * cuidados, porque el gesto tiene trampa. Uno, un respiro de 130 ms antes de
 * abrir: al abrirse una respuesta las preguntas de abajo bajan, y sin ese
 * respiro el cursor las va rozando de paso y la lista se dispara sola. Dos,
 * solo donde hay raton de verdad: en una pantalla tactil el navegador finge
 * un hover al tocar y la respuesta se abriria dos veces, por el falso hover
 * y por el clic. Al salir no se cierra nada — lo ultimo que leiste sigue
 * abierto, que es lo que uno espera.
 *
 * Las respuestas cerradas siguen en el DOM, plegadas a altura cero, en vez
 * de desmontarse. Es deliberado: esta seccion existe tanto para el visitante
 * como para quien la lee sin abrir nada —Google y los buscadores de IA
 * citan estos pares pregunta/respuesta—, y lo que no esta en el HTML no se
 * cita. El JSON-LD de FAQPage sale de estos mismos textos.
 */

const EASE = cubicBezier(0.22, 1, 0.36, 1);

export default function HiringFaq({ hiring }) {
  /* La primera abierta: la seccion tiene que llegar contestando algo, no
     como siete lineas cerradas que hay que ponerse a abrir. */
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  /* Puntero fino y con hover real: raton o trackpad, no dedo. */
  const [hoverable, setHoverable] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setHoverable(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      clearTimeout(timer.current);
    };
  }, []);

  const hoverOpen = (i) => {
    if (!hoverable) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(i), 130);
  };
  const cancelHover = () => clearTimeout(timer.current);

  return (
    <div className="hfaq">
      <header className="hfaq__head">
        <span className="paths__eyebrow">{hiring.eyebrow}</span>
        <h2 className="paths__title">{hiring.title}</h2>
        <p className="paths__lead hfaq__lead">{hiring.lead}</p>
      </header>

      <ul className="hfaq__list">
        {hiring.items.map((it, i) => {
          const on = i === open;
          return (
            <li className={`hfaq__item${on ? ' is-on' : ''}`} key={it.q}>
              <button
                type="button"
                className="hfaq__q"
                aria-expanded={on}
                aria-controls={`hfaq-a-${i}`}
                id={`hfaq-q-${i}`}
                onClick={() => setOpen(on ? -1 : i)}
                onMouseEnter={() => hoverOpen(i)}
                onMouseLeave={cancelHover}
              >
                <span className="hfaq__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="hfaq__q-t">{it.q}</span>
                {/* Una cruz que gira hasta ser un menos: el mismo trazo
                    contando que lo que abriste se cierra por donde vino. */}
                <span className="hfaq__ico" aria-hidden="true">
                  <span className="hfaq__ico-bar" />
                  <span className="hfaq__ico-bar hfaq__ico-bar--v" />
                </span>
              </button>

              <motion.div
                className="hfaq__a"
                id={`hfaq-a-${i}`}
                role="region"
                aria-labelledby={`hfaq-q-${i}`}
                initial={false}
                animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.36, ease: EASE }}
              >
                <p className="hfaq__a-t">{it.a}</p>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
