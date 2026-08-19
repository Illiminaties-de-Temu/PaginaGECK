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

/* WhatsApp: línea de la empresa y de un agente (ambas México) */
const WA_NUMBERS = { company: '+52 6271745436', agent: '+52 6144864571' };

/* Proyectos del portafolio relacionados con cada servicio (slug → casos).
 * Reutiliza imágenes reales del portafolio; enlazan a /portafolio.
 * Los servicios sin casos (redes-sociales, inversion) ocultan el bloque. */
const RELATED_PROJECTS = {
  web: [
    { title: 'Agend-In',   image: '/assets/image/portafolio/agendin.webp' },
    { title: 'LandingKit', image: '/assets/image/portafolio/landig.webp' },
    { title: 'Mi Caja POS', image: '/assets/image/portafolio/micaja.webp' },
  ],
  mobile: [
    { title: 'Capital Transport', image: '/assets/image/portafolio/capital transpor.webp' },
    { title: 'SpendWise', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&auto=format&fit=crop' },
  ],
  ia: [
    { title: 'SafePosture', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80&auto=format&fit=crop' },
    { title: 'EduAI',       image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80&auto=format&fit=crop' },
  ],
  ecommerce: [
    { title: 'Chuchulucos', image: '/assets/image/portafolio/chuchu.webp' },
    { title: 'Mi Caja POS', image: '/assets/image/portafolio/micaja.webp' },
  ],
  saas: [
    { title: 'GeckCRM', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop' },
  ],
  automatizacion: [
    { title: 'Agend-In', image: '/assets/image/portafolio/agendin.webp' },
    { title: 'Mando',    image: '/assets/image/portafolio/mando.webp' },
  ],
  custom: [
    { title: 'El Mezquite Control', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80&auto=format&fit=crop' },
    { title: 'GeckCRM',             image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop' },
  ],
  diseno: [
    { title: 'Chava Calderón', image: '/assets/image/portafolio/chava.webp' },
    { title: 'Chuchulucos',    image: '/assets/image/portafolio/chuchu.webp' },
  ],
};

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
          alt={`${service.name} — servicio de Geck Codex`}
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

  /* En móvil el carrusel pasa a ser horizontal (swipe nativo), así que el
   * tornillo controlado por scroll vertical se desactiva. */
  useScrew({
    enabled: !reduced && !isMobile,
    count: N,
    refs: cardRefs,
    trackRef,
    railRef,
    hudNum,
    hudTitle,
    hudCat,
    services,
  });

  /* ── Carrusel horizontal (solo móvil): índice activo según el scroll ── */
  const [activeSwipe, setActiveSwipe] = useState(0);
  const swipeRailRef = useRef(null);
  const swipeRaf = useRef(0);

  const handleSwipeScroll = useCallback(() => {
    if (swipeRaf.current) return;
    swipeRaf.current = requestAnimationFrame(() => {
      swipeRaf.current = 0;
      const rail = swipeRailRef.current;
      if (!rail) return;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < rail.children.length; i++) {
        const it = rail.children[i];
        const c = it.offsetLeft + it.offsetWidth / 2;
        const dist = Math.abs(c - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      }
      setActiveSwipe(best);
    });
  }, []);

  const scrollToSwipe = (i) => {
    const rail = swipeRailRef.current;
    if (!rail) return;
    const it = rail.children[i];
    if (!it) return;
    rail.scrollTo({ left: it.offsetLeft - (rail.clientWidth - it.offsetWidth) / 2, behavior: 'smooth' });
  };

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

  const openWhatsApp = (who, serviceName) => {
    const msg = t.services.modal.waMsg(serviceName);
    const num = WA_NUMBERS[who].replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  const relatedProjects = expandedServiceData
    ? (RELATED_PROJECTS[expandedServiceData.slug] || [])
    : [];

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
          {!reduced && !isMobile && (
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
        ) : isMobile ? (
          /* ── MÓVIL: carrusel horizontal con scroll-snap (swipe lateral) ── */
          <div className="svc-swipe">
            <div className="svc-swipe__rail" ref={swipeRailRef} onScroll={handleSwipeScroll}>
              {services.map((s) => (
                <div className="svc-swipe__item" key={s.id}>
                  <Card
                    service={s}
                    onOpen={handleCardClick}
                    seeDetails={t.services.seeDetails}
                    variant="swipe"
                  />
                </div>
              ))}
            </div>
            <div className="svc-swipe__dots" role="tablist">
              {services.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={`svc-swipe__dot${i === activeSwipe ? ' is-active' : ''}`}
                  onClick={() => scrollToSwipe(i)}
                  aria-label={s.name}
                  aria-selected={i === activeSwipe}
                />
              ))}
            </div>
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
              <button className="service-modal__close" onClick={closeExpanded} aria-label={t.services.modal.close}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {/* IZQUIERDA: imagen inmersiva a pantalla completa */}
              <div className="service-modal__media">
                <img src={expandedServiceData.image} alt={expandedServiceData.name} />
                <div className="service-modal__media-veil" />
                <div className="service-modal__media-cap">
                  <span className="service-modal__media-cat">{expandedServiceData.catLabel}</span>
                  <div className="service-modal__media-num">{String(expandedServiceData.id + 1).padStart(2, '0')}</div>
                </div>
              </div>

              {/* DERECHA: contenido scrolleable */}
              <div className="service-modal__content">
                <header className="service-modal__head">
                  <h2 className="service-modal__title">{expandedServiceData.name}</h2>
                  <p className="service-modal__tagline">{expandedServiceData.tagline}</p>
                </header>

                <p className="service-modal__description">{expandedServiceData.description}</p>

                <div className="service-modal__section">
                  <h3 className="service-modal__section-title">{t.services.modal.featuresTitle}</h3>
                  <div className="svc-feat">
                    {expandedServiceData.features.map((feature, index) => (
                      <div key={index} className="svc-feat__item">
                        <span className="svc-feat__n">{String(index + 1).padStart(2, '0')}</span>
                        <span className="svc-feat__t">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Proyectos relacionados del portafolio */}
                {relatedProjects.length > 0 && (
                  <div className="service-modal__section">
                    <h3 className="service-modal__section-title">{t.services.modal.relatedTitle}</h3>
                    <div className="service-modal__related-grid">
                      {relatedProjects.map((p, i) => (
                        <a key={i} href="/portafolio/" className="related-card">
                          <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                          <div className="related-card__veil" />
                          <span className="related-card__title">{p.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cómo trabajamos */}
                <div className="service-modal__section">
                  <h3 className="service-modal__section-title">{t.services.modal.processTitle}</h3>
                  <div className="svc-proc">
                    {t.services.modal.processSteps.map((s, i) => (
                      <div key={i} className="svc-proc__step">
                        <div className="svc-proc__dot">{String(i + 1).padStart(2, '0')}</div>
                        <div className="svc-proc__t">{s.title}</div>
                        <div className="svc-proc__d">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs: WhatsApp (empresa + agente) + formulario */}
                <div className="service-modal__cta-wrapper">
                  <div className="service-modal__cta-row">
                    <button
                      type="button"
                      className="service-modal__wa service-modal__wa--company"
                      onClick={() => openWhatsApp('company', expandedServiceData.name)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>{t.services.modal.waCompany}</span>
                    </button>
                    <button
                      type="button"
                      className="service-modal__wa"
                      onClick={() => openWhatsApp('agent', expandedServiceData.name)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>{t.services.modal.waAgent}</span>
                    </button>
                  </div>
                  <a href="/contacto/" className="service-modal__cta">
                    <span>{expandedServiceData.id === 9 ? t.services.modal.ctaInversion : t.services.modal.formCta}</span>
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

        /* ── MÓVIL: carrusel horizontal con swipe (scroll-snap) ────────── */
        .svc-swipe { position: relative; z-index: 1; padding: 0.5rem 0 1.5rem; }
        .svc-swipe__rail {
          display: flex;
          gap: 0.9rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 1rem 14%;
          scrollbar-width: none;
          overscroll-behavior-x: contain;
        }
        .svc-swipe__rail::-webkit-scrollbar { display: none; }
        .svc-swipe__item {
          flex: 0 0 72%;
          scroll-snap-align: center;
        }
        .svc-card--swipe { cursor: pointer; display: block; width: 100%; }
        .svc-card--swipe .svc-card__media { aspect-ratio: 3 / 4; height: auto; }
        .svc-card--swipe .svc-card__cap { opacity: 1; }

        .svc-swipe__dots {
          display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem;
          margin-top: 1.4rem; padding: 0 1.2rem;
        }
        .svc-swipe__dot {
          width: 8px; height: 8px; border-radius: 50%; padding: 0;
          border: none; background: var(--border-strong); cursor: pointer;
          transition: background .25s var(--svc-expo), width .25s var(--svc-expo), border-radius .25s var(--svc-expo);
        }
        .svc-swipe__dot.is-active { background: var(--gold); width: 22px; border-radius: 5px; }

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

        /* PANTALLA COMPLETA: el modal ocupa todo el viewport */
        .service-modal {
          position: fixed; inset: 0; z-index: 2001;
          width: 100%; max-width: none; max-height: none;
          background: var(--navy); border: none; border-radius: 0;
          overflow: hidden;
          display: grid; grid-template-columns: 44% 1fr;
          animation: modalIn var(--dur-modal) var(--ease-spring) both;
          will-change: transform, opacity;
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(1.5%); }
          to   { opacity: 1; transform: translateY(0); }
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

        /* ── COLUMNA IZQUIERDA: imagen inmersiva full-height ── */
        .service-modal__media {
          position: relative; height: 100%; overflow: hidden;
        }
        .service-modal__media img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          animation: heroIn var(--dur-modal) var(--ease-out) both;
        }

        @keyframes heroIn {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* velo: funde hacia la derecha con el contenido + oscurece abajo */
        .service-modal__media-veil {
          position: absolute; inset: 0;
          background:
            linear-gradient(to right, rgba(3,12,29,0) 58%, var(--navy) 100%),
            linear-gradient(to top, rgba(3,12,29,0.85) 0%, rgba(3,12,29,0) 50%);
        }
        .service-modal__media-cap { position: absolute; left: 3rem; bottom: 3rem; z-index: 2; }
        .service-modal__media-cat {
          display: inline-flex; align-items: center; gap: 0.7rem;
          color: var(--gold);
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.26em; text-transform: uppercase;
          margin-bottom: 0.8rem;
          animation: slideUp 0.4s var(--ease-out) 0.15s both;
        }
        .service-modal__media-cat::before { content: ''; width: 34px; height: 1px; background: var(--gold); }
        .service-modal__media-num {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: clamp(4.5rem, 8vw, 7rem); font-weight: 700; line-height: 0.8;
          color: rgba(244,228,188,0.10);
          animation: slideUp 0.5s var(--ease-out) 0.2s both;
        }

        /* ── COLUMNA DERECHA: contenido scrolleable ── */
        .service-modal__content {
          height: 100%; overflow-y: auto; scroll-behavior: smooth;
          padding: clamp(3rem, 6vh, 4.5rem) clamp(2.4rem, 4vw, 4.5rem) 3.5rem;
          scrollbar-width: thin; scrollbar-color: var(--gold-deep) transparent;
        }
        .service-modal__content::-webkit-scrollbar { width: 7px; }
        .service-modal__content::-webkit-scrollbar-thumb {
          background: var(--gold-deep); border-radius: 7px;
        }

        .service-modal__head { margin-bottom: 1.4rem; padding-right: 3rem; max-width: 64ch; }
        .service-modal__title {
          font-size: clamp(2.4rem, 4vw, 4rem); font-weight: 900;
          color: var(--gold-light); line-height: 1; margin: 0 0 0.7rem;
          letter-spacing: -0.02em;
          animation: slideUp 0.28s var(--ease-out) 0.08s both;
        }
        .service-modal__tagline {
          color: var(--gold); font-size: clamp(0.9rem, 1.1vw, 1.05rem); margin: 0;
          letter-spacing: 0.08em;
          animation: slideUp 0.28s var(--ease-out) 0.12s both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut { to { opacity: 0; } }

        .service-modal__description {
          font-size: clamp(1rem, 1.2vw, 1.1rem); color: rgba(244,228,188,0.78);
          line-height: 1.8; margin: 0 0 0.5rem; max-width: 62ch;
          animation: slideUp 0.28s var(--ease-out) 0.1s both;
        }

        /* features como lista editorial numerada (sin cajas) */
        .svc-feat { display: grid; grid-template-columns: 1fr 1fr; gap: 0 2.6rem; }
        .svc-feat__item {
          display: flex; gap: 1.1rem; align-items: flex-start;
          padding: 1.1rem 0; border-bottom: 1px solid var(--gold-border);
        }
        .svc-feat__n {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: 1.05rem; font-weight: 700; color: var(--gold); min-width: 2ch;
        }
        .svc-feat__t { font-size: 0.96rem; line-height: 1.5; color: var(--gold-light); }

        /* ── SECCIONES EXTRA DEL MODAL (relacionados / proceso) ── */
        .service-modal__section {
          margin-top: 2.2rem;
          animation: slideUp 0.28s var(--ease-out) 0.16s both;
        }
        .modal-container.closing .service-modal__section { animation: fadeOut var(--dur-close) ease both; }
        .service-modal__section-title {
          color: var(--gold); font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 1.2rem;
        }

        /* proyectos relacionados */
        .service-modal__related-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem;
        }
        .related-card {
          position: relative; display: block; aspect-ratio: 4 / 3;
          border-radius: 12px; overflow: hidden; text-decoration: none;
          border: 1px solid var(--gold-border);
          transition: border-color var(--dur-fast) ease, transform var(--dur-fast) ease;
        }
        .related-card img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.35s var(--svc-expo);
        }
        .related-card__veil {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(3,12,29,0.92) 0%, rgba(3,12,29,0.1) 65%, transparent 100%);
        }
        .related-card__title {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 0.5rem 0.6rem; color: var(--gold-light);
          font-size: 0.72rem; font-weight: 700; line-height: 1.2;
        }
        .related-card:hover { border-color: var(--gold); transform: translateY(-3px); }
        .related-card:hover img { transform: scale(1.07); }

        /* cómo trabajamos: pasos con dot numerado y conector (sin cajas) */
        .svc-proc { display: flex; gap: 0; }
        .svc-proc__step { flex: 1; position: relative; padding: 0 1rem; }
        .svc-proc__step:first-child { padding-left: 0; }
        .svc-proc__step:not(:last-child)::after {
          content: ''; position: absolute; top: 14px; left: 60%; right: -40%;
          height: 1px; background: var(--gold-border);
        }
        .svc-proc__dot {
          position: relative; z-index: 1;
          width: 30px; height: 30px; border-radius: 50%;
          border: 1px solid var(--gold); color: var(--gold); background: var(--navy);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: 0.78rem; font-weight: 700; margin-bottom: 0.9rem;
        }
        .svc-proc__t { font-size: 0.88rem; font-weight: 700; color: var(--gold-light); margin-bottom: 0.25rem; }
        .svc-proc__d { font-size: 0.76rem; line-height: 1.5; color: rgba(244,228,188,0.6); }

        /* ── CTA ── */
        .service-modal__cta-wrapper {
          margin-top: 2.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.2s both;
        }
        .service-modal__cta-row { display: flex; gap: 0.8rem; margin-bottom: 0.8rem; }
        .service-modal__wa {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.55rem;
          padding: 0.95rem 1rem; border-radius: 50px; cursor: pointer;
          font-family: inherit; font-weight: 800; font-size: 0.86rem;
          border: 1px solid var(--gold); background: transparent; color: var(--gold-light);
          transition: background var(--dur-fast) ease, transform var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
        }
        .service-modal__wa svg { flex-shrink: 0; }
        .service-modal__wa:hover { background: rgba(195,173,133,0.12); transform: translateY(-2px); }
        .service-modal__wa--company {
          background: linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%);
          color: var(--carbon); border-color: transparent;
          box-shadow: 0 4px 20px rgba(88,74,28,0.4);
        }
        .service-modal__wa--company:hover {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
          box-shadow: 0 8px 30px rgba(195,173,133,0.35);
        }

        .modal-container.closing .service-modal__cta-wrapper {
          animation: fadeOut var(--dur-close) ease both;
        }

        .service-modal__cta {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          background: transparent;
          color: var(--gold-light); padding: 1rem 2rem; border-radius: 50px;
          font-weight: 800; font-size: 0.9rem;
          border: 1px solid var(--gold-border); cursor: pointer; width: 100%;
          transition: transform var(--dur-fast) ease, border-color var(--dur-fast) ease, background var(--dur-normal) ease;
          position: relative; overflow: hidden;
          text-decoration: none;
        }

        .service-modal__cta:hover {
          transform: translateY(-2px);
          border-color: var(--gold);
          background: rgba(195,173,133,0.08);
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
          /* pantalla completa también en móvil, una sola columna scrolleable */
          border-radius: 0;
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
          overflow-y: auto;
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

        .modal-container.is-mobile .service-modal__media { height: 240px; }
        .modal-container.is-mobile .service-modal__media-veil {
          background: linear-gradient(to top, var(--navy) 2%, rgba(3,12,29,0.35) 45%, rgba(3,12,29,0) 75%);
        }
        .modal-container.is-mobile .service-modal__media-cap { left: 1.4rem; right: 1.4rem; bottom: 1.3rem; }
        /* el watermark gigante se encima con la foto en pantallas chicas → fuera */
        .modal-container.is-mobile .service-modal__media-num { display: none; }
        .modal-container.is-mobile .service-modal__media-cat { font-size: 0.66rem; margin-bottom: 0; }
        .modal-container.is-mobile .service-modal__content {
          height: auto; overflow: visible; padding: 1.6rem 1.3rem 2.4rem;
        }
        .modal-container.is-mobile .service-modal__head { padding-right: 2.5rem; max-width: none; margin-bottom: 1.2rem; }
        .modal-container.is-mobile .service-modal__title { font-size: 1.85rem; }
        .modal-container.is-mobile .service-modal__description { font-size: 0.95rem; line-height: 1.7; }
        .modal-container.is-mobile .service-modal__section { margin-top: 1.9rem; }
        .modal-container.is-mobile .svc-feat { grid-template-columns: 1fr; gap: 0; }
        .modal-container.is-mobile .svc-feat__item { padding: 0.95rem 0; }
        /* proyectos relacionados: fila deslizable con miniaturas legibles */
        .modal-container.is-mobile .service-modal__related-grid {
          display: flex; grid-template-columns: none; gap: 0.7rem;
          overflow-x: auto; scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
          margin: 0 -1.3rem; padding: 0 1.3rem 0.3rem;
        }
        .modal-container.is-mobile .service-modal__related-grid::-webkit-scrollbar { display: none; }
        .modal-container.is-mobile .related-card { flex: 0 0 46%; scroll-snap-align: start; }
        .modal-container.is-mobile .related-card__title { font-size: 0.78rem; padding: 0.55rem 0.65rem; }
        .modal-container.is-mobile .svc-proc { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 1rem; }
        .modal-container.is-mobile .svc-proc__step { padding: 0; }
        .modal-container.is-mobile .svc-proc__step::after { display: none; }
        .modal-container.is-mobile .service-modal__cta { font-size: 0.9rem; padding: 1rem 1.5rem; }
        .modal-container.is-mobile .service-modal__close { top: 1rem; right: 1rem; }
        .modal-container.is-mobile .service-modal__cta-wrapper { margin-top: 2rem; }
        .modal-container.is-mobile .service-modal__cta-row { flex-direction: column; }

        /* ─── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 1024px) {
          .svc-helix__hud { max-width: 180px; left: clamp(0.8rem, 3vw, 2rem); }
        }
        @media (max-width: 900px) {
          /* en ventanas estrechas el split colapsa a una columna (sigue fullscreen) */
          .service-modal { grid-template-columns: 1fr; grid-template-rows: auto 1fr; overflow-y: auto; }
          .service-modal__media { height: 240px; }
          .service-modal__content { height: auto; overflow: visible; padding: 2rem; }
          .service-modal__head { padding-right: 2.5rem; }
          .svc-feat { grid-template-columns: 1fr; gap: 0; }
          .svc-proc { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem 1rem; }
          .svc-proc__step { padding: 0; }
          .svc-proc__step::after { display: none; }
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
