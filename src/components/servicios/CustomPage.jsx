import { cubicBezier, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';
import { SERVICES_STATIC } from '../../data/services.js';
import ServiceFocus from './ServiceFocus.jsx';
import PackagesAct from './PackagesAct.jsx';
import '../../styles/servicios-paths.css';

/* La misma curva que usan AboutTeaser, StatsSection y SpecialtiesShowcase en
   el index. Que las dos paginas se muevan igual no es decoracion: es lo que
   hace que se sientan el mismo sitio. */
const EASE = cubicBezier(0.22, 1, 0.36, 1);

/* El cierre entra en tres tiempos y por lados distintos: la garantia empuja
   desde la izquierda, la llamada a la accion le responde desde la derecha y
   el puente al ecosistema sube al final. El orden es el del argumento —te
   respaldo, te invito, y si te equivocaste de camino, por aqui.

   Las distancias van en porcentaje del propio elemento: cada pieza arranca
   completamente fuera de su sitio y entra desde fuera de la pagina, en vez
   de dar un empujoncito dentro de un marco que ya estaba pintado. El
   recorte lo hace `overflow-x: clip` en la raiz de la pagina. */
const slide = (from, delay) => ({
  hidden: from === 'up'
    ? { opacity: 0, y: '130%' }
    : { opacity: 0, x: from === 'left' ? '-125%' : '125%' },
  show: {
    opacity: 1, x: 0, y: 0,
    transition: { duration: 0.95, ease: EASE, delay },
  },
});
const CLOSE = {
  warranty: slide('left', 0),
  act: slide('right', 0.22),
  bridge: slide('up', 0.46),
};

/* Pagina de desarrollo a medida.
 *
 * El catalogo de servicios vive aqui en HTML estatico —no dentro de un modal—
 * porque es el texto por el que esta pagina puede encontrarse en Google. Los
 * ids de cada tarjeta son los slugs (#web, #ia, #mobile) a los que ya apuntan
 * enlaces desde la home: mover el bloque sin conservarlos los habria roto. */
export default function CustomPage({ lang }) {
  const { t } = useLanguage(lang);
  const reduce = useReducedMotion();
  const s = t.services;
  const { custom } = s;

  const services = SERVICES_STATIC.map((x) => ({ ...x, ...s.items[x.slug] }));
  const cats = s.categories;

  return (
    <div className="paths">
      <section className="paths__sec paths__sec--first">
        <header className="paths__head">
          <span className="paths__eyebrow">{custom.eyebrow}</span>
          <h1 className="paths__title">{custom.title}</h1>
          <p className="paths__lead">{custom.lead}</p>
        </header>

      </section>

      {/* Catalogo */}
      <section className="paths__sec" id="catalogo">
        <header className="paths__head">
          <h2 className="paths__title">{s.detail.title}</h2>
          <p className="paths__lead">{s.detail.subtitle}</p>
        </header>
        {/* Una nitida y el resto fuera de foco, como la helice pero en
            vertical y en el scroll normal. La logica vive en su propio
            componente porque muta estilos por fotograma y no debe arrastrar
            a React en cada scroll. */}
        <ServiceFocus services={services} cats={cats} />
      </section>

      {/* Paquetes de referencia. Van DESPUES del catalogo: primero se ve
          que construimos y luego, ya sabiendo de que se habla, cuanto cuesta
          en ejemplos concretos.
          Se parten en dos: una sola pieza es el escalon de entrada; ya
          combinados es donde aparece el ahorro. Seis tarjetas iguales
          escondian esa diferencia. */}
      <PackagesAct custom={custom} lang={lang} />

      {/* Garantia, cierre y puente al ecosistema en UN bloque. Por separado
          eran tres secciones a pantalla completa diciendo tres frases: la
          garantia es el argumento, el boton es la accion y el puente es para
          quien se equivoco de camino. Juntas ocupan lo que merecen. */}
      <motion.section
        className="paths__close"
        {...(reduce ? {} : {
          initial: 'hidden',
          whileInView: 'show',
          viewport: { once: true, amount: 0.25 },
        })}
      >
        {/* Envoltorio con variantes vacias: las variantes solo se propagan a
            traves de componentes motion, y sin esto los dos recuadros de
            dentro no se enterarian del turno. */}
        <motion.div className="paths__close-main" variants={reduce ? undefined : {}}>
          <motion.div className="paths__close-warranty" variants={reduce ? undefined : CLOSE.warranty}>
            <span className="paths__eyebrow">{custom.warranty.k}</span>
            <h2 className="paths__close-title">{custom.warranty.t}</h2>
            <p className="paths__close-desc">{custom.warranty.d}</p>
          </motion.div>
          <motion.div className="paths__close-act" variants={reduce ? undefined : CLOSE.act}>
            <h2 className="paths__close-title">{s.closing.title}</h2>
            <p className="paths__close-desc">{s.closing.lead}</p>
            <motion.a
              className="eco__cta"
              href={localizedPath('contact', lang)}
              {...(reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.97 } })}
            >
              {s.closing.cta}
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div className="paths__close-bridge" variants={reduce ? undefined : CLOSE.bridge}>
          <span className="paths__close-bridge-t">{custom.bridgeTitle}</span>
          <span className="paths__close-bridge-d">{custom.bridgeDesc}</span>
          <a className="paths__close-bridge-cta" href={localizedPath('ecosystem', lang)}>
            {s.fork.eco.go} &rarr;
          </a>
        </motion.div>
      </motion.section>
    </div>
  );
}
