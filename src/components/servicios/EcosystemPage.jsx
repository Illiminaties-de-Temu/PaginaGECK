import EcosystemPicker from './EcosystemPicker.jsx';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';
import '../../styles/servicios-paths.css';

/* Pagina del ecosistema: combos cerrados y selector libre.
 *
 * Es pagina propia y no una seccion de /servicios porque decide otra cosa que
 * "a medida" —aqui se elige entre productos que ya existen— y porque asi tiene
 * URL, title y descripcion propios: /servicios/ecosistema/ le dice a Google de
 * que trata sin que tenga que leerla. */
export default function EcosystemPage({ lang }) {
  const { t } = useLanguage(lang);
  const s = t.services;

  return (
    <div className="paths paths--wide">
      <section className="paths__sec paths__sec--first">
        <header className="paths__head">
          <span className="paths__eyebrow">{s.eco.eyebrow}</span>
          <h1 className="paths__title">{s.eco.title}</h1>
          <p className="paths__lead">{s.eco.lead}</p>
        </header>
        <EcosystemPicker t={s} contactHref={localizedPath('contact', lang)} />
      </section>

      {/* Puente al otro camino. Antes esto se decia DOS veces: aqui y en una
          linea suelta debajo del selector, que ademas quedaba escondida. Se
          queda una sola, con el texto que era mas concreto de los dos. */}
      <section className="paths__bridge">
        <span className="paths__k">{s.fork.custom.k}</span>
        <h2 className="paths__bridge-title">{s.eco.moreTitle}</h2>
        <p className="paths__card-desc">{s.eco.moreDesc}</p>
        <a className="eco__cta eco__cta--ghost" href={localizedPath('custom', lang)}>
          {s.eco.moreCta} &rarr;
        </a>
      </section>
    </div>
  );
}
