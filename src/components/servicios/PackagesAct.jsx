import { useEffect, useRef, useState } from 'react';
import {
  cubicBezier, motion, useReducedMotion, useScroll, useSpring, useTransform,
} from 'framer-motion';
import PackagePicker from './PackagePicker.jsx';
import { ENTERPRISE, PACKAGES } from '../../data/packages.js';

/* El acto de los paquetes, contado con el scroll.
 *
 * Mismo aparato que SpecialtiesShowcase y StatsSection en el index: la
 * seccion se clava, el scroll avanza un progreso suavizado con useSpring y
 * cada pieza entra en su compas.
 *
 *   titulo → bajada → (pildoras + panel, juntos) → lo que no incluye
 *
 * El panel es interactivo, asi que el relato termina en el 72% del recorrido
 * y el resto es reposo: casi una pantalla entera de scroll con todo quieto y
 * clavado, que es donde se juega con los interruptores.
 */

const EASE = cubicBezier(0.22, 1, 0.36, 1);

/* Los diez, en el orden del dato: primero los que se arman con el selector y
   al final los dos escalones Enterprise, que no salen de una combinacion. */
const ALL_IDS = [...PACKAGES.map((p) => p.id), ENTERPRISE.shop.id, ENTERPRISE.base.id];

/* Compases del relato, en fraccion del recorrido. */
const BEATS = {
  title: [0.00, 0.14],
  lead:  [0.10, 0.26],
  pills: [0.28, 0.44],
  panel: [0.30, 0.48],
  fine:  [0.56, 0.72],
};

export default function PackagesAct({ custom, lang }) {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);

  /* El relato arranca APAGADO y solo se enciende al montar.
   *
   * Asi el HTML servido lleva la seccion en flujo normal y con todo visible:
   * nada de opacidad cero en el codigo fuente, que es lo que pasa cuando el
   * scroll gobierna la opacidad desde el primer render. */
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduce) { setOn(false); return; }
    /* Alto minimo tambien: la escena entera tiene que caber en una pantalla
       para poder clavarse. En un portatil bajo no cabe, y ahi vale mas el
       flujo normal que una escena recortada. */
    const mq = window.matchMedia('(min-width: 821px) and (min-height: 701px)');
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  /* Suaviza el progreso: sin esto el relato avanza a tirones con la rueda. */
  const p = useSpring(scrollYProgress, {
    stiffness: 90, damping: 26, mass: 0.35, restDelta: 0.0005,
  });

  /* Cada compas es una pareja opacidad/desplazamiento sobre el mismo
     progreso. Los hooks van todos aqui arriba y en numero fijo. */
  const useCue = (key, rise = 40) => ({
    opacity: useTransform(p, BEATS[key], [0, 1]),
    y: useTransform(p, BEATS[key], [rise, 0], { ease: EASE }),
  });

  const title = useCue('title');
  const lead = useCue('lead', 28);
  const fine = useCue('fine', 30);
  const panel = useCue('panel', 46);

  /* Las pastillas entran escalonadas dentro de su propio compas: las cuatro
     piezas y, al final, el interruptor de nivel. Son cinco llamadas escritas
     una a una y no un bucle porque los hooks tienen que ser los mismos, en el
     mismo orden, en cada render. */
  const [pa, pb] = BEATS.pills;
  const step = (pb - pa) / 7;
  const pillAt = (n) => ({
    opacity: useTransform(p, [pa + step * n, pb + step * n], [0, 1]),
    y: useTransform(p, [pa + step * n, pb + step * n], [22, 0], { ease: EASE }),
  });
  const pill0 = pillAt(0);
  const pill1 = pillAt(1);
  const pill2 = pillAt(2);
  const pill3 = pillAt(3);
  const pill4 = pillAt(4);

  const story = on ? { pills: [pill0, pill1, pill2, pill3, pill4], panel } : null;

  return (
    <section
      className={`pact${on ? ' is-on' : ''}`}
      id="paquetes"
      ref={trackRef}
    >
      <div className="pact__stage">
        <motion.header className="paths__head" style={on ? title : undefined}>
          <h2 className="paths__title">{custom.packagesTitle}</h2>
        </motion.header>

        <motion.p className="paths__lead pact__lead" style={on ? lead : undefined}>
          {custom.packagesLead}
        </motion.p>

        <PackagePicker custom={custom} lang={lang} story={story} />

        {/* Ultimo compas: la letra chica de lo que se acaba de cotizar. */}
        <motion.div className="paths__fine" style={on ? fine : undefined}>
          <h3 className="paths__fine-title">{custom.exclTitle}</h3>
          <ul className="paths__excl">
            {custom.excl.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </motion.div>
      </div>

      {/* El selector ensena un paquete a la vez, que es lo que hace que se
          entienda; el coste es que los otros nueve no existen para quien lee
          la pagina sin tocarla —un rastreador, un buscador de IA, alguien con
          lector de pantalla—. Esta lista los pone a todos en el HTML sin
          deshacer el selector: va plegada, fuera de la escena clavada, y
          repite los mismos textos, no unos nuevos que se desincronicen.

          Sin precios a proposito: el precio se ve en el selector, donde va
          acompanado de su alcance. */}
      <details className="pkgall">
        <summary className="pkgall__sum">{custom.allTitle}</summary>
        <ul className="pkgall__list">
          {ALL_IDS.map((id) => {
            const d = custom.packages[id];
            return (
              <li className="pkgall__it" key={id}>
                <h3 className="pkgall__n">{d.name}</h3>
                <p className="pkgall__d">{d.d}</p>
                <p className="pkgall__l">{d.limit}</p>
              </li>
            );
          })}
        </ul>
      </details>
    </section>
  );
}
