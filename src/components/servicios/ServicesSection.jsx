import { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

/* ─── SERVICIOS (lista plana, una sola hélice) ──────────────────────────
 * cat = índice de categoría (0 Desarrollo · 1 Marketing · 2 Inversión)
 * El badge de categoría se resuelve desde t.services.categories[cat].name */
const SERVICES_STATIC = [
  { id: 0, slug: 'web',            cat: 0, image: '/assets/image/servicios/webser.webp'     },
  { id: 1, slug: 'mobile',         cat: 0, image: '/assets/image/servicios/celser.webp'     },
  { id: 2, slug: 'ia',             cat: 0, image: '/assets/image/servicios/iaser.webp'      },
  { id: 3, slug: 'ecommerce',      cat: 0, image: '/assets/image/servicios/ecomersser.webp' },
  { id: 4, slug: 'saas',           cat: 0, image: '/assets/image/servicios/saasser.webp'    },
  { id: 5, slug: 'automatizacion', cat: 0, image: '/assets/image/servicios/autoserv.webp'   },
  { id: 6, slug: 'custom',         cat: 0, image: '/assets/image/servicios/medidaser.webp'  },
  { id: 7, slug: 'diseno',         cat: 1, image: '/assets/image/servicios/ui-ux.webp'      },
  { id: 8, slug: 'redes-sociales', cat: 1, image: '/assets/image/servicios/social.webp'     },
  { id: 9, slug: 'inversion',      cat: 2, image: '/assets/image/servicios/inversion.webp'  },
];

/* ─── CONFIG DEL CARRUSEL CURVO (cover-flow horizontal) ──────────────────
 * Las tarjetas se colocan sobre un arco y avanzan de IZQUIERDA a DERECHA
 * conforme se hace scroll. La del centro queda al frente; las laterales
 * se inclinan (rotateY) y retroceden (z), creando la curva.
 * spacing = separación horizontal en px entre tarjeta y tarjeta (muy espaciado)
 * angle   = inclinación en grados por tarjeta de distancia al centro
 * radius  = profundidad del arco en px (qué tanto retroceden las laterales)
 * window  = cuántas tarjetas a cada lado del foco se dibujan
 * minScale= escala de la tarjeta más alejada
 * blur    = desenfoque por unidad de distancia (0 = sin blur)
 * focus   = radio (en nº de tarjetas) de la zona nítida alrededor del centro */
const CONF = {
  desktop: { angle: 34, spacing: 380, radius: 560, window: 2.8, minScale: 0.6,  blur: 6, focus: 0.6 },
  mobile:  { angle: 30, spacing: 210, radius: 320, window: 2.2, minScale: 0.7,  blur: 0, focus: 0.55 },
};
const SCROLL_PER_CARD = 44; // vh de scroll que avanza el carrusel por servicio

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/* ─── CARD (tarjeta de la hélice / fallback) ────────────────────────────
 * forwardRef: el contenedor padre muta su transform en cada frame de scroll. */
const Card = forwardRef(function Card({ service, onOpen, seeDetails, variant }, ref) {
  return (
    <article
      ref={ref}
      className={`svc-card svc-card--${variant}`}
      onClick={() => onOpen(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(service); } }}
    >
      <div className="svc-card__media">
        <img
          src={service.image}
          alt={service.name}
          className="svc-card__img"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
        <div className="svc-card__veil" />

        <div className="svc-card__top">
          <span className="svc-card__tag">{service.catLabel}</span>
        </div>

        <div className="svc-card__cap">
          <h3 className="svc-card__name">{service.name}</h3>
          <p className="svc-card__desc">{service.tagline}</p>
          <span className="svc-card__cta" aria-hidden="true">
            {seeDetails}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
});

/* ─── HÉLICE: hook imperativo (sin re-render por frame) ──────────────────
 * Un solo listener de scroll + rAF posiciona las N tarjetas en el cilindro.
 * Se muta el DOM directamente (transform/opacity/zIndex) para no re-renderizar
 * React en cada frame. Cumple el patrón de parallax barato del proyecto.     */
function useScrew({ enabled, count, refs, trackRef, railRef, hudNum, hudTitle, hudCat, services }) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    let raf = 0;
    let activeIdx = -1;

    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const vh = window.innerHeight;
      const rect = track.getBoundingClientRect();
      const total = rect.height - vh;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      const head = p * (count - 1);
      const conf = window.innerWidth < 768 ? CONF.mobile : CONF.desktop;

      for (let i = 0; i < count; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const d = i - head;
        if (Math.abs(d) > conf.window + 0.6) {
          if (el.style.visibility !== 'hidden') {
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
          }
          continue;
        }
        const deg = clamp(d * conf.angle, -82, 82);
        const rad = (deg * Math.PI) / 180;
        const x = d * conf.spacing;                 // avance horizontal (izq → der)
        const z = (Math.cos(rad) - 1) * conf.radius; // arco: centro 0, laterales atrás
        const depth = Math.cos(rad);                 // 1 al frente · →0 a los lados
        const scale = conf.minScale + (1 - conf.minScale) * depth;
        const edge = clamp(1 - (Math.abs(d) - (conf.window - 1)), 0, 1);
        const opacity = clamp(0.12 + 0.88 * depth, 0, 1) * edge;

        el.style.visibility = 'visible';
        el.style.transform =
          `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${deg.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(200 - Math.abs(d) * 10));
        // profundidad de campo: zona nítida de ±focus alrededor del centro,
        // luego el blur entra (y sale) de forma gradual al alejarse
        const dof = Math.min(Math.max(Math.abs(d) - conf.focus, 0) * conf.blur, 11);
        el.style.filter = conf.blur ? `blur(${dof.toFixed(1)}px)` : 'none';
        el.style.pointerEvents = depth > 0.25 ? 'auto' : 'none';
        el.classList.toggle('is-active', Math.abs(d) < 0.5);
      }

      if (railRef.current) railRef.current.style.transform = `scaleX(${p.toFixed(4)})`;

      const active = clamp(Math.round(head), 0, count - 1);
      if (active !== activeIdx) {
        activeIdx = active;
        const svc = services[active];
        if (hudNum.current) hudNum.current.textContent = String(active + 1).padStart(2, '0');
        if (hudTitle.current) hudTitle.current.textContent = svc.name;
        if (hudCat.current) hudCat.current.textContent = svc.catLabel;
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, count, refs, trackRef, railRef, hudNum, hudTitle, hudCat, services]);
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function ImprovedServices() {
  const { t } = useLanguage();
  const services = SERVICES_STATIC.map((s) => ({
    ...s,
    ...t.services.items[s.slug],
    catLabel: t.services.categories[s.cat].name,
  }));
  const N = services.length;

  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false); // reduced-motion → fallback grid

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const trackRef = useRef(null);
  const railRef = useRef(null);
  const cardRefs = useRef([]);
  const hudNum = useRef(null);
  const hudTitle = useRef(null);
  const hudCat = useRef(null);

  useScrew({
    enabled: !reduced,
    count: N,
    refs: cardRefs,
    trackRef,
    railRef,
    hudNum,
    hudTitle,
    hudCat,
    services,
  });

  const expandedServiceData = expandedServiceId === null
    ? null
    : services.find((s) => s.id === expandedServiceId);

  const closeExpanded = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setExpandedServiceId(null);
      setIsClosing(false);
      window.history.pushState(null, '', window.location.pathname);
      document.body.style.overflow = 'unset';
    }, 280);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') closeExpanded(); };
    if (expandedServiceId !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [expandedServiceId, closeExpanded]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const svc = SERVICES_STATIC.find((s) => s.slug === hash);
        if (svc) setExpandedServiceId(svc.id);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCardClick = (service) => {
    setExpandedServiceId(service.id);
    window.history.pushState(null, '', `#${service.slug}`);
  };

  const first = services[0];

  return (
    <>
      <section className="svc-helix">
        {/* Fondo sticky compartido — gradientes baratos */}
        <div className="svc-helix__bg" aria-hidden="true">
          <div className="svc-helix__orb svc-helix__orb--a" />
          <div className="svc-helix__orb svc-helix__orb--b" />
        </div>

        {/* Intro — scrollea y desaparece antes del tornillo */}
        <header className="svc-helix__intro">
          <span className="svc-helix__pretitle">{t.services.pretitle}</span>
          <h1 className="svc-helix__h1">{t.services.title}</h1>
          <p className="svc-helix__lead">{t.services.subtitle}</p>
          {!reduced && (
            <span className="svc-helix__hint">
              {t.services.scrollHint}
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="1" y="1" width="12" height="20" rx="6" />
                <circle className="svc-helix__hint-dot" cx="7" cy="6" r="1.6" fill="currentColor" stroke="none" />
              </svg>
            </span>
          )}
        </header>

        {reduced ? (
          /* ── FALLBACK estático: grid accesible, sin movimiento ── */
          <div className="svc-helix__grid">
            {services.map((s) => (
              <Card
                key={s.id}
                service={s}
                onOpen={handleCardClick}
                seeDetails={t.services.seeDetails}
                variant="static"
              />
            ))}
          </div>
        ) : (
          /* ── TORNILLO: track alto + stage sticky con perspectiva ── */
          <div
            className="svc-helix__track"
            ref={trackRef}
            style={{ height: `${(N - 1) * SCROLL_PER_CARD + 110}vh` }}
          >
            <div className="svc-helix__stage">
              {/* eje / rosca central */}
              <div className="svc-helix__axis" aria-hidden="true" />

              {/* halo de foco — resalta la tarjeta del centro */}
              <div className="svc-helix__focus" aria-hidden="true" />

              {/* HUD: número de servicio + categoría + título */}
              <div className="svc-helix__hud" aria-hidden="true">
                <div className="svc-helix__count">
                  <span className="svc-helix__count-num" ref={hudNum}>01</span>
                  <span className="svc-helix__count-sep">/</span>
                  <span className="svc-helix__count-tot">{String(N).padStart(2, '0')}</span>
                </div>
                <span className="svc-helix__hud-cat" ref={hudCat}>{first.catLabel}</span>
                <span className="svc-helix__hud-title" ref={hudTitle}>{first.name}</span>
              </div>

              {/* riel de progreso */}
              <div className="svc-helix__rail" aria-hidden="true">
                <div className="svc-helix__rail-fill" ref={railRef} />
              </div>

              {/* tarjetas de la hélice */}
              <div className="svc-helix__cyl">
                {services.map((s, i) => (
                  <Card
                    key={s.id}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    service={s}
                    onOpen={handleCardClick}
                    seeDetails={t.services.seeDetails}
                    variant="helix"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL / BOTTOM SHEET ─── */}
        {expandedServiceData && (
          <div className={`modal-container ${isClosing ? 'closing' : ''} ${isMobile ? 'is-mobile' : ''}`}>
            <div className="modal-overlay" onClick={closeExpanded} />
            <div className="service-modal" role="dialog" aria-modal="true">
              {/* drag handle only on mobile */}
              {isMobile && <div className="service-modal__handle" />}
              <button className="service-modal__close" onClick={closeExpanded} aria-label={t.services.modal.close}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="service-modal__hero">
                <img src={expandedServiceData.image} alt={expandedServiceData.name} />
                <div className="service-modal__hero-overlay"></div>
                <div className="service-modal__hero-content">
                  <h2>{expandedServiceData.name}</h2>
                  <p>{expandedServiceData.tagline}</p>
                </div>
              </div>
              <div className="service-modal__body">
                <div className="service-modal__description">
                  <p>{expandedServiceData.description}</p>
                </div>
                <div className="service-modal__features">
                  <h3 className="service-modal__features-title">{t.services.modal.featuresTitle}</h3>
                  <div className="service-modal__features-grid">
                    {expandedServiceData.features.map((feature, index) => (
                      <div key={index} className="feature-card" style={{ animationDelay: `${0.15 + (index * 0.05)}s` }}>
                        <div className="feature-card__icon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.6 4L7.5 13.1L3.4 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="service-modal__cta-wrapper">
                  <a href="/contacto" className="service-modal__cta">
                    <span>{expandedServiceData.id === 9 ? t.services.modal.ctaInversion : t.services.modal.cta}</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <style>{`
        /* ─── VARIABLES ──────────────────────────────────────── */
        :root {
          --carbon:      #222220;
          --carbon-dark: #1a1a18;
          --navy:        #030C1D;
          --gold-deep:   #584A1C;
          --gold:        var(--accent);
          --gold-light:  #F4E4BC;
          --gold-border: rgba(88, 74, 28, 0.35);

          --dur-fast:    160ms;
          --dur-normal:  240ms;
          --dur-modal:   300ms;
          --dur-close:   220ms;
          --ease-out:    cubic-bezier(0.2, 0, 0, 1);
          --ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1);
          --svc-expo:    cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* ─── SECCIÓN ────────────────────────────────────────── */
        .svc-helix {
          position: relative;
          background: var(--background);
          color: var(--text);
          font-family: var(--font-body);
        }

        /* ── FONDO STICKY ──────────────────────────────────────────────── */
        .svc-helix__bg {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          margin-bottom: -100vh;
        }
        .svc-helix__orb { position: absolute; border-radius: 50%; }
        .svc-helix__orb--a {
          width: 80vw; height: 60vw; top: -15%; left: 50%; transform: translateX(-50%);
          background: radial-gradient(ellipse at center, rgba(195,173,133,0.06) 0%, transparent 60%);
        }
        .svc-helix__orb--b {
          width: 55vw; height: 55vw; bottom: 5%; right: -15%;
          background: radial-gradient(circle at center, rgba(195,173,133,0.035) 0%, transparent 65%);
        }

        /* ── INTRO ─────────────────────────────────────────────────────── */
        .svc-helix__intro {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 1040px;
          margin: 0 auto;
          padding: 7rem 1.4rem 2rem;
        }
        .svc-helix__pretitle {
          display: inline-block;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--accent-text);
          padding: 0.35rem 1.2rem; border: 1px solid var(--gold-border);
          border-radius: 100px; margin-bottom: 1.5rem; background: rgba(88,74,28,0.08);
        }
        .svc-helix__h1 {
          font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 900; line-height: 1.06;
          color: var(--text);
          margin: 0 0 1rem;
        }
        .svc-helix__lead { font-size: 1rem; color: var(--text-muted); margin: 0; }
        .svc-helix__hint {
          display: inline-flex; align-items: center; gap: 0.55rem;
          margin-top: 2.2rem; font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted);
        }
        .svc-helix__hint svg { color: var(--gold); }
        .svc-helix__hint-dot { animation: svc-scroll 1.8s var(--svc-expo) infinite; }
        @keyframes svc-scroll {
          0% { opacity: 0; transform: translateY(0); }
          30% { opacity: 1; }
          70% { opacity: 1; transform: translateY(7px); }
          100% { opacity: 0; transform: translateY(7px); }
        }

        /* ── TRACK + STAGE STICKY ──────────────────────────────────────── */
        .svc-helix__track {
          position: relative;
          z-index: 1;
        }
        .svc-helix__stage {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          perspective: 1200px;
          perspective-origin: 50% 50%;
        }

        /* eje central del arco (línea horizontal) */
        .svc-helix__axis {
          position: absolute;
          left: 0; right: 0; top: 50%;
          height: 1px;
          transform: translateY(-50%);
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(195,173,133,0.18) 22%,
            rgba(195,173,133,0.18) 78%,
            transparent 100%
          );
          z-index: 0;
        }

        /* halo de foco difuminado en el centro (donde está la rosca) */
        .svc-helix__focus {
          position: absolute;
          top: 50%; left: 50%;
          width: clamp(360px, 36vw, 560px);
          height: clamp(440px, 60vh, 640px);
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            rgba(195,173,133,0.22) 0%,
            rgba(195,173,133,0.1) 38%,
            transparent 72%
          );
          filter: blur(38px);
        }

        /* cilindro = capa con conservación 3D */
        .svc-helix__cyl {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          z-index: 1;
        }

        /* ── TARJETA (modo hélice) ─────────────────────────────────────── */
        .svc-card--helix {
          --cw: 300px;
          --ch: 384px;
          position: absolute;
          top: 50%;
          left: 50%;
          width: var(--cw);
          height: var(--ch);
          margin-left: calc(var(--cw) / -2);
          margin-top: calc(var(--ch) / -2);
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform, opacity;
          visibility: hidden;
          cursor: pointer;
        }
        .svc-card--helix .svc-card__media {
          transition: box-shadow .35s var(--svc-expo);
          box-shadow: 0 18px 50px rgba(0,0,0,0.5);
        }
        .svc-card--helix.is-active .svc-card__media {
          box-shadow: 0 34px 80px rgba(0,0,0,0.62), 0 0 60px rgba(195,173,133,0.2);
        }
        .svc-card--helix .svc-card__cap { opacity: 0; transition: opacity .35s var(--svc-expo); }
        .svc-card--helix.is-active .svc-card__cap { opacity: 1; }

        /* ── TARJETA (visual común) ────────────────────────────────────── */
        .svc-card__media {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 18px;
          background: #1b1a17;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .svc-card__img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
        }
        .svc-card__veil {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.35) 42%, rgba(8,7,5,0) 70%);
          z-index: 1;
        }
        .svc-card__top {
          position: absolute; top: 0.9rem; left: 0.9rem; right: 0.9rem;
          display: flex; align-items: center; justify-content: space-between;
          z-index: 2;
        }
        .svc-card__tag {
          display: inline-flex; align-items: center;
          padding: 0.22rem 0.6rem; border-radius: 7px;
          border: 1px solid rgba(195,173,133,0.4); background: rgba(8,7,5,0.55);
          color: var(--gold);
          font-size: 0.56rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .svc-card__cap {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 1.1rem 1.15rem 1.15rem;
          z-index: 2;
        }
        .svc-card__name {
          font-size: 1.18rem; font-weight: 800; color: #fff;
          margin: 0 0 0.32rem; line-height: 1.18;
        }
        .svc-card__desc {
          font-size: 0.78rem; line-height: 1.5; color: rgba(244,228,188,0.62);
          margin: 0 0 0.7rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .svc-card__cta {
          display: inline-flex; align-items: center; gap: 0.36rem;
          color: var(--gold); font-size: 0.72rem; font-weight: 700;
        }

        /* ── HUD ───────────────────────────────────────────────────────── */
        .svc-helix__hud {
          position: absolute;
          top: 50%; left: clamp(1.2rem, 5vw, 4.5rem);
          transform: translateY(-50%);
          z-index: 5;
          max-width: 240px;
          pointer-events: none;
        }
        .svc-helix__count {
          display: flex; align-items: baseline; gap: 0.3rem;
          font-weight: 900; line-height: 1; margin-bottom: 0.9rem;
        }
        .svc-helix__count-num {
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          color: var(--accent-text);
        }
        .svc-helix__count-sep { font-size: 1.4rem; color: var(--text-muted); }
        .svc-helix__count-tot { font-size: 1.4rem; color: var(--text-muted); }
        .svc-helix__hud-cat {
          display: inline-flex; align-items: center;
          padding: 0.2rem 0.6rem; border-radius: 7px; border: 1px solid rgba(195,173,133,0.4);
          color: var(--gold);
          font-size: 0.56rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 0.7rem;
        }
        .svc-helix__hud-title {
          display: block;
          font-size: clamp(1.2rem, 2vw, 1.6rem); font-weight: 800;
          color: var(--text); line-height: 1.15;
        }

        /* ── RIEL DE PROGRESO (horizontal, abajo) ──────────────────────── */
        .svc-helix__rail {
          position: absolute;
          left: 50%; bottom: clamp(1.6rem, 5vh, 3rem);
          transform: translateX(-50%);
          height: 3px; width: clamp(180px, 32vw, 420px); border-radius: 3px;
          background: var(--border-strong);
          overflow: hidden; z-index: 5;
        }
        .svc-helix__rail-fill {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          transform-origin: left; transform: scaleX(0);
          background: linear-gradient(to right, var(--gold-light), var(--gold));
          border-radius: 3px;
        }

        /* ── FALLBACK GRID (reduced-motion) ────────────────────────────── */
        .svc-helix__grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.4rem;
          max-width: 1240px;
          margin: 0 auto;
          padding: 2rem 1.4rem 7rem;
        }
        .svc-card--static { cursor: pointer; }
        .svc-card--static .svc-card__media {
          aspect-ratio: 4 / 5; height: auto;
          transition: transform .3s var(--svc-expo), box-shadow .3s var(--svc-expo);
        }
        .svc-card--static .svc-card__cap { opacity: 1; }
        .svc-card--static:hover .svc-card__media {
          transform: translateY(-5px);
          box-shadow: 0 22px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(195,173,133,0.35);
        }

        /* ─── MODAL ──────────────────────────────────────────── */
        .modal-container {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }

        .modal-overlay {
          position: absolute; inset: 0;
          background: rgba(26, 26, 24, 0.92);
          backdrop-filter: blur(14px);
          cursor: zoom-out;
          animation: overlayIn var(--dur-modal) var(--ease-out) both;
        }

        @keyframes overlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(14px); }
        }

        .modal-container.closing .modal-overlay {
          animation: overlayOut var(--dur-close) ease both;
        }

        @keyframes overlayOut {
          from { opacity: 1; backdrop-filter: blur(14px); }
          to   { opacity: 0; backdrop-filter: blur(0px); }
        }

        .service-modal {
          position: relative; width: 100%; max-width: 850px;
          background: var(--navy); border-radius: 28px; z-index: 2001;
          border: 1px solid var(--gold-border);
          max-height: 90vh; overflow-y: auto; scroll-behavior: smooth;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(88,74,28,0.2), inset 0 1px 0 rgba(195,173,133,0.08);
          animation: modalIn var(--dur-modal) var(--ease-spring) both;
          will-change: transform, opacity;
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        .modal-container.closing .service-modal {
          animation: modalOut var(--dur-close) var(--ease-out) both;
        }

        @keyframes modalOut {
          from { opacity: 1; transform: scale(1)    translateY(0); }
          to   { opacity: 0; transform: scale(0.97) translateY(16px); }
        }

        .service-modal__close {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: rgba(34,34,32,0.7); border: 1px solid var(--gold-border);
          color: var(--gold); border-radius: 50%;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          transition: background var(--dur-fast) ease, color var(--dur-fast) ease, border-color var(--dur-fast) ease;
        }

        .service-modal__close svg {
          transition: transform var(--dur-normal) var(--ease-spring);
        }

        .service-modal__close:hover {
          background: var(--gold-deep); color: var(--gold-light); border-color: var(--gold);
        }
        .service-modal__close:hover svg { transform: rotate(90deg); }

        .service-modal__hero { height: 320px; position: relative; overflow: hidden; }

        .service-modal__hero img {
          width: 100%; height: 100%; object-fit: cover;
          animation: heroIn var(--dur-modal) var(--ease-out) both;
        }

        @keyframes heroIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }

        .modal-container.closing .service-modal__hero img {
          animation: heroOut var(--dur-close) ease both;
        }
        @keyframes heroOut {
          to { opacity: 0; transform: scale(1.03); }
        }

        .service-modal__hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, var(--navy) 0%, rgba(3,12,29,0.6) 55%, transparent 100%);
        }

        .service-modal__hero-content { position: absolute; bottom: 2rem; left: 2.5rem; right: 2.5rem; }

        .service-modal__hero-content h2 {
          font-size: 2.5rem; color: var(--gold-light); margin: 0;
          animation: slideUp 0.28s var(--ease-out) 0.08s both;
        }

        .service-modal__hero-content p {
          color: var(--gold); font-size: 0.85rem;
          letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.12s both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-container.closing .service-modal__hero-content h2,
        .modal-container.closing .service-modal__hero-content p {
          animation: fadeOut var(--dur-close) ease both;
        }
        @keyframes fadeOut { to { opacity: 0; } }

        .service-modal__body { padding: 2.5rem; }

        .service-modal__description {
          font-size: 1.1rem; color: rgba(244,228,188,0.75);
          line-height: 1.7; margin-bottom: 2.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.1s both;
        }

        .modal-container.closing .service-modal__description {
          animation: fadeOut var(--dur-close) ease both;
        }

        .service-modal__features-title {
          color: var(--gold); font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.13s both;
        }

        .modal-container.closing .service-modal__features-title {
          animation: fadeOut var(--dur-close) ease both;
        }

        .service-modal__features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;
        }

        .feature-card {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(34,34,32,0.5);
          border: 1px solid var(--gold-border);
          padding: 1.2rem; border-radius: 14px;
          animation: featureIn 0.25s var(--ease-out) backwards;
          transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease, transform var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
        }

        @keyframes featureIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-container.closing .feature-card {
          animation: fadeOut var(--dur-close) ease both;
        }

        .feature-card:hover {
          background: rgba(34,34,32,0.8); border-color: var(--gold-deep);
          transform: translateX(6px);
          box-shadow: -4px 0 12px rgba(195,173,133,0.15);
        }

        .feature-card__icon { color: var(--gold); flex-shrink: 0; }

        .feature-card__icon svg path {
          stroke-dasharray: 50; stroke-dashoffset: 50;
          animation: drawCheck 0.4s ease forwards;
          animation-delay: inherit;
        }

        @keyframes drawCheck { to { stroke-dashoffset: 0; } }

        .feature-card span { color: rgba(244,228,188,0.85); font-size: 0.9rem; }

        /* ── CTA ── */
        .service-modal__cta-wrapper {
          margin-top: 2.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.2s both;
        }

        .modal-container.closing .service-modal__cta-wrapper {
          animation: fadeOut var(--dur-close) ease both;
        }

        .service-modal__cta {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          background: linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%);
          color: var(--carbon); padding: 1.1rem 2rem; border-radius: 50px;
          font-weight: 800; font-size: 0.95rem;
          border: none; cursor: pointer; width: 100%;
          transition: transform var(--dur-fast) ease, box-shadow var(--dur-fast) ease, background var(--dur-normal) ease;
          box-shadow: 0 4px 20px rgba(88,74,28,0.4);
          position: relative; overflow: hidden;
          text-decoration: none;
        }

        .service-modal__cta::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.5s ease;
        }

        .service-modal__cta:hover::after { left: 100%; }
        .service-modal__cta:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 30px rgba(195,173,133,0.35);
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
        }

        .service-modal__cta svg {
          transition: transform var(--dur-normal) var(--ease-spring);
        }
        .service-modal__cta:hover svg { transform: translateX(4px); }

        /* ── MOBILE — bottom sheet modal ────────────────────── */
        .modal-container.is-mobile {
          align-items: flex-end;
          padding: 0;
        }

        .modal-container.is-mobile .modal-overlay {
          background: rgba(3,12,29,0.7);
          backdrop-filter: blur(8px);
        }

        .modal-container.is-mobile .service-modal {
          width: 100%;
          max-width: 100%;
          max-height: 92vh;
          border-radius: 24px 24px 0 0;
          animation: sheetUp var(--dur-modal) var(--ease-spring) both;
        }

        @keyframes sheetUp {
          from { transform: translateY(100%); opacity: 0.6; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .modal-container.is-mobile.closing .service-modal {
          animation: sheetDown var(--dur-close) var(--ease-out) both;
        }

        @keyframes sheetDown {
          from { transform: translateY(0);    opacity: 1; }
          to   { transform: translateY(100%); opacity: 0; }
        }

        .service-modal__handle {
          width: 40px; height: 4px;
          background: rgba(244,228,188,0.2);
          border-radius: 2px;
          margin: 12px auto 0;
          flex-shrink: 0;
        }

        .modal-container.is-mobile .service-modal__hero { height: 200px; }
        .modal-container.is-mobile .service-modal__hero-content h2 { font-size: 1.6rem; }
        .modal-container.is-mobile .service-modal__body { padding: 1.5rem; }
        .modal-container.is-mobile .service-modal__description { font-size: 0.95rem; margin-bottom: 1.5rem; }
        .modal-container.is-mobile .service-modal__features-grid { grid-template-columns: 1fr; gap: 0.75rem; }
        .modal-container.is-mobile .feature-card { padding: 1rem; }
        .modal-container.is-mobile .service-modal__cta { font-size: 0.9rem; padding: 1rem 1.5rem; }
        .modal-container.is-mobile .service-modal__close { top: 1rem; right: 1rem; }

        /* ─── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 1024px) {
          .svc-helix__hud { max-width: 180px; left: clamp(0.8rem, 3vw, 2rem); }
        }
        @media (max-width: 900px) {
          .service-modal__hero { height: 200px; }
          .service-modal__hero-content h2 { font-size: 1.8rem; }
        }
        @media (max-width: 768px) {
          .svc-helix__intro { padding: 5rem 1rem 1.5rem; }
          .svc-card--helix { --cw: 210px; --ch: 270px; }
          .svc-card--helix .svc-card__cap { opacity: 1; }
          .svc-card__name { font-size: 1rem; }
          .svc-helix__hud {
            top: auto; bottom: 1.4rem; left: 50%;
            transform: translateX(-50%); text-align: center; max-width: 86vw;
          }
          .svc-helix__count { justify-content: center; margin-bottom: 0.5rem; }
          .svc-helix__count-num { font-size: 2.4rem; }
          .svc-helix__hud-title { font-size: 1.1rem; }
          .svc-helix__hud-cat { margin-left: auto; margin-right: auto; }
          .svc-helix__rail { width: 60vw; bottom: 7rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
