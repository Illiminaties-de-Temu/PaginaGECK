import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence, cubicBezier, motion,
  useReducedMotion, useSpring, useTransform,
} from 'framer-motion';
import { PIECES, packageFor } from '../../data/packages.js';
import { localizedPath } from '../../i18n/routes';

/* Selector de piezas del desarrollo a medida.
 *
 * Sustituye a las tarjetas sueltas. Con el selector, el combinado y la pieza
 * suelta dejan de ser dos listas y pasan a ser estados del mismo control:
 * enciendes Web y sale Presencia Digital, enciendes Web y Chatbot y sale
 * Negocio Conectado, enciendes Tienda y sale E-commerce Starter.
 *
 * El interruptor Enterprise va aparte de las cuatro pastillas porque no es
 * una pieza: no agrega nada a lo encendido, sube de nivel lo que ya hay
 * —arquitectura dedicada, roles complejos, integracion con lo que la empresa
 * ya corre—. Puesto en fila con Web o App se habria leido como una quinta
 * pieza que se suma, que es justo lo que no es.
 *
 * Que solo se vea un precio a la vez no es casualidad. Presencia ($5,000 a
 * $8,000) mas Atencion ($15,000) da entre $20,000 y $23,000, y Negocio
 * Conectado cuesta $19,500: el ahorro es real, pero depende de por donde caiga
 * la web dentro de su rango. Puestos uno junto a otro, el visitante hace la
 * resta con el numero mas bajo y el "ahorras $3,500" se le queda corto.
 */

const EASE = cubicBezier(0.22, 1, 0.36, 1);

/* Un numero que rueda de su valor anterior al nuevo.
 *
 * Es el count-up de StatsSection, pero disparado por el toggle en vez de por
 * el scroll: al encender una pieza el precio SUBE a la vista, que es
 * justamente lo que hay que entender de este selector.
 *
 * En el primer render se planta en su valor. Si contara desde cero al cargar,
 * el numero servido en el HTML daria un salto visible al hidratar.
 */
function Rolling({ value }) {
  const spring = useSpring(value, { stiffness: 130, damping: 26, mass: 0.5 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString('en-US'));
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; spring.jump(value); return; }
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{text}</motion.span>;
}

/* Parte "$20,000 - $25,000" en trozos y anima solo los numeros. El indice
   como key mantiene viva la misma instancia entre paquetes, para que ruede
   desde el precio anterior en vez de renacer en cero. */
function Price({ text, reduce }) {
  const parts = useMemo(() => text.split(/([\d][\d,]*)/), [text]);
  if (reduce) return <>{text}</>;
  return parts.map((p, i) =>
    /^[\d][\d,]*$/.test(p)
      ? <Rolling key={i} value={Number(p.replace(/,/g, ''))} />
      : <span key={i}>{p}</span>,
  );
}

export default function PackagePicker({ custom, lang, story = null }) {
  const [sel, setSel] = useState(['web']);
  const [tier, setTier] = useState(false);
  const reduce = useReducedMotion();

  /* Apagar la ultima pieza no se permite. Quien llega buscando una web le da
     clic a "Web" —que ya viene encendida— y se quedaria con el panel en
     blanco: el gesto mas natural devolvia lo unico inservible. */
  const toggle = (id) =>
    setSel((s) => {
      if (!s.includes(id)) return [...s, id];
      return s.length > 1 ? s.filter((x) => x !== id) : s;
    });

  const pk = packageFor(sel, tier);
  const d = pk ? custom.packages[pk.id] : null;
  /* Dos estados: un paquete armado, o una combinacion sin precio de
     referencia (App + Chatbot, la unica de las siete que no lo tiene). */
  const copy = d || custom.pickNone;

  /* Con relato, la entrada la gobierna el scroll desde PackagesAct y aqui no
     se anima nada por cuenta propia: dos animaciones peleando por la misma
     opacidad dejan el elemento parpadeando. */
  const rise = (reduce || story)
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.4 },
        transition: { duration: 0.6, ease: EASE },
      };

  return (
    <div className="pkgp">
      <motion.p className="pkgp__hint" {...rise}>{custom.pickHint}</motion.p>

      <div className="pkgp__switches" role="group" aria-label={custom.pickHint}>
        {PIECES.map((id, i) => {
          const on = sel.includes(id);
          return (
            <motion.button
              type="button"
              key={id}
              className={`pkgp__sw${on ? ' is-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(id)}
              style={story ? story.pills[i] : undefined}
              {...(reduce || story ? {} : {
                initial: { opacity: 0, y: 18 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.4 },
                transition: { duration: 0.5, ease: EASE, delay: 0.08 * i },
              })}
              {...(reduce ? {} : { whileTap: { scale: 0.96 } })}
            >
              {custom.pieces[id]}
            </motion.button>
          );
        })}

        {/* El nivel, detras de un separador: mismo control, otra cosa. */}
        <motion.button
          type="button"
          className={`pkgp__sw pkgp__sw--tier${tier ? ' is-on' : ''}`}
          aria-pressed={tier}
          onClick={() => setTier((v) => !v)}
          style={story ? story.pills[PIECES.length] : undefined}
          {...(reduce || story ? {} : {
            initial: { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.4 },
            transition: { duration: 0.5, ease: EASE, delay: 0.08 * PIECES.length },
          })}
          {...(reduce ? {} : { whileTap: { scale: 0.96 } })}
        >
          {custom.tier}
        </motion.button>
      </div>

      {/* Solo cuando esta encendido: explicar un interruptor apagado que
          nadie toco es ruido en una fila que ya tiene cinco cosas. */}
      <AnimatePresence initial={false}>
        {tier && (
          <motion.p
            className="pkgp__tier-hint"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
          >
            {custom.tierHint}
          </motion.p>
        )}
      </AnimatePresence>

      {/* El panel se anuncia solo: quien navega con lector de pantalla oye el
          paquete que acaba de salir sin tener que ir a buscarlo. */}
      <motion.div
        className="pkgp__panel"
        aria-live="polite"
        style={story ? story.panel : undefined}
      >
        <div className="pkgp__body">
          {/* El texto se releva entero —no palabra por palabra— para que se
              lea que cambiaste de paquete, no que se edito una frase. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pk ? pk.id : 'none'}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.32, ease: EASE }}
            >
              <h3 className="pkgp__name">{copy.name}</h3>
              <p className="pkgp__desc">{copy.d}</p>
              {d && <p className="pkgp__limit">{d.limit}</p>}
            </motion.div>
          </AnimatePresence>

          <motion.a
            className="eco__cta pkgp__cta"
            href={localizedPath('contact', lang)}
            {...(reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.97 } })}
          >
            {custom.pickCta}
          </motion.a>
        </div>

        {pk && (
          <div className="pkgp__money">
            {/* El tachado y el ahorro entran y salen; el precio se queda y
                rueda. Asi el numero grande nunca parpadea. */}
            <AnimatePresence initial={false}>
              {pk.was && (
                <motion.s
                  className="pkgp__was"
                  key={`was-${pk.id}`}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                >
                  {custom.was} {pk.was}
                </motion.s>
              )}
            </AnimatePresence>
            {pk.from && <span className="pkgp__from">{custom.from}</span>}
            <p className="pkgp__price"><Price text={pk.price} reduce={reduce} /></p>
            <AnimatePresence initial={false}>
              {pk.save && (
                <motion.span
                  className="pkgp__save"
                  key={`save-${pk.id}`}
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.34, ease: EASE, delay: 0.06 }}
                >
                  {custom.save} {pk.save}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
