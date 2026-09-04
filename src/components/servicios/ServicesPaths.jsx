/* Lo que sirve a los DOS caminos, en la pagina de servicios.
 *
 * El ecosistema y el desarrollo a medida se mudaron a paginas propias
 * (/servicios/ecosistema/ y /servicios/a-medida/): decidian cosas distintas y
 * meterlos en la misma pagina obligaba a recorrer la que no te interesa.
 *
 * Aqui queda lo que aplica vengas del camino que vengas: el mantenimiento,
 * las dudas de contratacion y el cierre.
 */
import HiringFaq from './HiringFaq.jsx';

export default function ServicesPaths({ t, contactHref }) {
  const { plans, hiring, closing } = t;

  return (
    <div className="paths">
      {/* ── Mantenimiento ── */}
      <section className="paths__sec" id="mantenimiento">
        <header className="paths__head">
          <span className="paths__eyebrow">{plans.eyebrow}</span>
          <h2 className="paths__title">{plans.title}</h2>
          <p className="paths__lead">{plans.lead}</p>
        </header>
        <div className="paths__plans">
          {plans.items.map((p) => (
            <article className="paths__card paths__plan" key={p.name}>
              <span className="paths__plan-name">{p.name}</span>
              <span className="paths__plan-price">{p.price}</span>
              <span className="paths__plan-per">{plans.per}</span>
              <ul className="paths__plan-feats">
                {p.feats.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── Dudas de contratacion ── */}
      <section className="paths__sec" id="contratar">
        <HiringFaq hiring={hiring} />
      </section>

      {/* ── Cierre ── */}
      <section className="paths__final">
        <h2 className="paths__title">{closing.title}</h2>
        <p className="paths__lead">{closing.lead}</p>
        <a className="eco__cta" href={contactHref}>{closing.cta}</a>
      </section>
    </div>
  );
}
