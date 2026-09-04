import { useState } from 'react';
import { localizedPath } from '../../i18n/routes';

/* La bifurcacion del hub: ecosistema o a medida, cara a cara.
 *
 * Antes eran dos tarjetas independientes, una junto a otra, cada una con su
 * lista de datos. Se leian por separado y decidir obligaba a ir y volver
 * comparando de memoria: "el de la izquierda decia dias, y este... semanas?".
 * Aqui las dos columnas comparten las filas, asi que el precio esta a la
 * altura del precio y el arranque a la del arranque: la diferencia se ve sin
 * buscarla.
 *
 * Al pasar por una columna, esa se ensancha y la otra le cede sitio: no es
 * un realce decorativo, el camino que miras ocupa mas pagina que el que no.
 * Y la columna entera es el enlace —de la cabecera al pie— porque cuando ya
 * se agrando bajo el cursor, hacerle clic es el gesto que sigue; obligar a
 * apuntarle a un "Armar el mio" de dos palabras seria pedir punteria para
 * algo que ya estaba decidido.
 *
 * En movil no hay hover: las columnas se apilan como dos tarjetas y cada
 * celda muestra su propia etiqueta (la columna de etiquetas se oculta y la
 * repone el ::before del CSS con data-k). Ahi no se ensancha nada, solo se
 * toca la tarjeta que se quiere.
 */

/* El orden de las filas es el de la decision: cuanto cuesta, cuando lo
   tengo, que decido yo, que me pregunto, y como se ve en concreto. */
const ROWS = ['price', 'start', 'decide', 'ask', 'example'];

export default function ForkCompare({ fork, lang }) {
  const [focus, setFocus] = useState(null);

  const cols = [
    { id: 'eco', d: fork.eco, href: localizedPath('ecosystem', lang) },
    { id: 'custom', d: fork.custom, href: localizedPath('custom', lang) },
  ];

  /* El reparto de ancho lo decide el grid de fuera y no cada columna: son
     hermanas repartiendose el mismo espacio, y eso solo lo puede arbitrar el
     padre. Las columnas se limitan a decir si estan arriba o apartadas. */
  return (
    <div className="svcx" onMouseLeave={() => setFocus(null)}>
      <p className="svcx__hint">{fork.compareHint}</p>

      <div className={`svcx__grid${focus ? ` on-${focus}` : ''}`}>
        <div className="svcx__labels" aria-hidden="true">
          <div className="svcx__lbl svcx__lbl--head" />
          {ROWS.map((r) => (
            <div className="svcx__lbl" key={r}>{fork.labels[r]}</div>
          ))}
          <div className="svcx__lbl svcx__lbl--foot" />
        </div>

        {/* La columna es el enlace. Por eso el pie lleva un span y no otra
            <a>: un enlace dentro de otro no es HTML valido, y el navegador
            lo desarma por su cuenta. */}
        {cols.map(({ id, d, href }) => {
          const state = focus && focus !== id ? ' is-dim' : (focus === id ? ' is-up' : '');
          return (
            <a
              className={`svcx__col svcx__col--${id}${state}`}
              href={href}
              key={id}
              onMouseEnter={() => setFocus(id)}
              onFocus={() => setFocus(id)}
              onBlur={() => setFocus(null)}
            >
              {/* div y no span: aqui dentro va un <h2>, que un span no puede
                  contener. Las demas celdas siguen siendo span. */}
              <div className="svcx__cell svcx__cell--head">
                <span className="svcx__k">{d.k}</span>
                {/* Encabezado de verdad, no un span con estilo: son los dos
                    caminos de la pagina y asi los lee un rastreador. Un <h2>
                    dentro de un <a> es HTML valido. */}
                <h2 className="svcx__t">{d.title}</h2>
                <span className="svcx__d">{d.desc}</span>
              </div>

              {ROWS.map((r) => (
                <span className="svcx__cell" data-k={fork.labels[r]} key={r}>
                  <span className="svcx__v">{d[r]}</span>
                </span>
              ))}

              <span className="svcx__cell svcx__cell--foot">
                <span className="svcx__go">{d.go} &rarr;</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
