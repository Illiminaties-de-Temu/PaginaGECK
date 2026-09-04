import { useEffect, useRef } from 'react';

/* Catalogo de servicios con foco.
 *
 * Una tarjeta nitida en el centro y las demas fuera de foco, como la helice
 * pero en vertical. Va en el SCROLL NORMAL, no clavada: la version sticky se
 * probo y anadia casi cinco pantallas de altura muerta para ensenar siete
 * tarjetas, que es justo por lo que se retiro la helice original.
 *
 * Lo pesado lo hacen `opacity` y `transform`, que el navegador compone en la
 * GPU sin repintar. El `filter: blur()` se anade encima solo en escritorio y
 * con tope, porque repinta en cada fotograma y es lo mas caro que hay.
 */
export default function ServiceFocus({ services, cats }) {
  const cardsRef = useRef([]);
  const innersRef = useRef([]);
  const hudNum = useRef(null);
  const hudName = useRef(null);
  const hudBar = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = cardsRef.current.filter(Boolean);
    const inners = innersRef.current.filter(Boolean);
    if (!cards.length) return;

    let blur = window.innerWidth > 820;
    let mids = [];
    let raf = 0;
    let active = -1;

    /* Las posiciones se cachean: leer el layout de cada tarjeta en cada
     * fotograma obliga al navegador a recalcular la pagina 60 veces por
     * segundo, que es como se hunde una animacion de scroll. */
    const measure = () => {
      blur = window.innerWidth > 820;
      mids = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
    };

    const frame = () => {
      raf = 0;
      const center = window.scrollY + window.innerHeight / 2;
      let best = 0;
      let bestD = Infinity;

      for (let i = 0; i < inners.length; i++) {
        const d = Math.abs(mids[i] - center) / window.innerHeight;
        if (d < bestD) { bestD = d; best = i; }
        const t = Math.min(d, 1.6);
        const el = inners[i];
        el.style.opacity = (1 - t * 0.72).toFixed(3);
        el.style.transform = `scale(${(1 - t * 0.055).toFixed(3)})`;
        el.style.filter = blur && t > 0.12
          ? `blur(${Math.min((t - 0.12) * 9, 6).toFixed(1)}px)`
          : '';
      }

      if (best !== active) {
        active = best;
        const n = String(best + 1).padStart(2, '0');
        if (hudNum.current) hudNum.current.textContent = n;
        if (hudName.current) hudName.current.textContent = services[best].name;
        if (hudBar.current) {
          hudBar.current.style.width = `${((best + 1) / cards.length) * 100}%`;
        }
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { measure(); onScroll(); };

    measure();
    frame();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      inners.forEach((el) => {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.filter = '';
      });
    };
  }, [services]);

  const total = String(services.length).padStart(2, '0');

  return (
    <>
      {/* Marcador: es lo que hacia el HUD de la helice — saber en cual estas
          y cuantos quedan sin tener que contarlos. */}
      <div className="svcf__hud" aria-hidden="true">
        <span className="svcf__hud-n">
          <b ref={hudNum}>01</b><i>/ {total}</i>
        </span>
        <span className="svcf__hud-t" ref={hudName}>{services[0]?.name}</span>
        <span className="svcf__hud-bar"><span ref={hudBar} /></span>
      </div>

      <div className="paths__svcs">
        {services.map((x, i) => (
          <article
            className="paths__svc"
            key={x.slug}
            id={x.slug}
            ref={(el) => { cardsRef.current[i] = el; }}
          >
            <div
              className="paths__svc-in"
              ref={(el) => { innersRef.current[i] = el; }}
            >
              <div className="paths__svc-shot">
                <img src={x.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="paths__svc-body">
                <span className="paths__svc-n">
                  {String(i + 1).padStart(2, '0')}
                  <i>/ {total}</i>
                </span>
                <span className="paths__k">{cats[x.cat].name}</span>
                <h3 className="paths__svc-title">{x.name}</h3>
                <p className="paths__cat-tagline">{x.tagline}</p>
                <p className="paths__card-desc">{x.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
