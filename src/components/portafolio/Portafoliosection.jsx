import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';
import { PROJECTS_STATIC } from '../../data/projects.js';

/* Acentos de categoría dentro de la paleta oro/bronce (sin arcoíris),
 * consistentes con el ProjectCarousel de la home. */
const CAT_COLORS = {
  landing:  { accent: '#C3AD85', chip: '#E0CFA9', border: 'rgba(195,173,133,0.35)' },
  mobile:   { accent: '#D9C49A', chip: '#E8D9B4', border: 'rgba(217,196,154,0.35)' },
  webapp:   { accent: '#957952', chip: '#D2B98C', border: 'rgba(149,121,82,0.35)'  },
  software: { accent: '#B5A079', chip: '#D8C6A0', border: 'rgba(181,160,121,0.35)' },
};


/* ─── CONFIG DE LA HÉLICE (el "tornillo") ───────────────────────────────
 * angle   = grados de giro entre tarjeta y tarjeta (paso angular de la rosca)
 * radius  = radio del cilindro en px (qué tanto se abren las tarjetas a los lados)
 * pitch   = avance vertical en px entre tarjeta y tarjeta (paso de la rosca)
 * window  = cuántas tarjetas a cada lado del foco se dibujan
 * minScale= escala de la tarjeta más al fondo
 * blur    = desenfoque por unidad de distancia al centro (0 = sin blur)
 * focus   = radio (en nº de tarjetas) de la zona nítida alrededor del centro:
 *           dentro de ±focus la tarjeta NO se difumina (más fácil de observar) */
const CONF = {
  desktop: { angle: 46, radius: 430, pitch: 268, window: 2.6, minScale: 0.5,  blur: 7, focus: 0.62 },
  /* Móvil afinado para parecerse a desktop: radio amplio (separa las tarjetas
   * en vez de encimarlas) + blur de profundidad para destacar la central. */
  mobile:  { angle: 44, radius: 300, pitch: 230, window: 2.0, minScale: 0.56, blur: 5, focus: 0.58 },
};
const SCROLL_PER_CARD = 44; // vh de scroll que avanza el tornillo por proyecto

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/* ─── DETAIL OVERLAY ── (sin cambios respecto a la versión anterior) ──── */
const detailVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:   { opacity: 0, transition: { duration: 0.2,  ease: 'easeIn'  } },
};
const contentVariants = {
  hidden: { y: 28, opacity: 0 },
  show:   { y: 0, opacity: 1, transition: { delay: 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit:   { y: 14, opacity: 0, transition: { duration: 0.16 } },
};

/* ─── GALERIA DE LA FICHA ───────────────────────────────────────────────
 * Carrusel de capturas del producto por dentro. La caja tiene `aspect-ratio`
 * fijo, asi que reserva su alto antes de que llegue el primer byte: cambiar de
 * captura no puede mover nada de sitio. Se descarga la visible y se precarga
 * solo la siguiente — hojear no espera a la red y nadie paga por capturas que
 * no llego a mirar.
 *
 * Se prefirio a un video: pesa una decima parte, el visitante controla el
 * ritmo, y no mete un decodificador a trabajar dentro de un modal que ya
 * tiene un fondo desenfocado detras. */
function Gallery({ shots, captions, title, strings, stageBg, fit }) {
  const n = shots.length;
  const [[i, dir], setAt] = useState([0, 0]);
  const reduce = useReducedMotion();
  const touchX = useRef(0);

  const go = (d) => setAt(([p]) => [(p + d + n) % n, d]);

  /* Avance automatico. Se detiene con el raton encima —para poder leer el pie
     sin que la captura cambie a media frase— y con la pestana en segundo
     plano, que si no seguiria repintando a espaldas del usuario. `i` esta en
     las dependencias a proposito: al navegar a mano el turno vuelve a empezar
     de cero en vez de saltar al instante siguiente. */
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (n < 2 || reduce || paused) return;
    const id = setInterval(() => setAt(([p]) => [(p + 1) % n, 1]), 4200);
    return () => clearInterval(id);
  }, [n, reduce, paused, i]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Precarga solo la siguiente: hojear no espera a la red, y nadie descarga
  // capturas que no llego a mirar.
  useEffect(() => {
    if (n < 2) return;
    const img = new Image();
    img.src = shots[(i + 1) % n];
  }, [i, n, shots]);

  useEffect(() => {
    if (n < 2) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setAt(([p]) => [(p + 1) % n, 1]);
      else if (e.key === 'ArrowLeft') setAt(([p]) => [(p - 1 + n) % n, -1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [n]);

  /* Con `custom` en AnimatePresence, la captura que se va recibe la direccion
     NUEVA: una entra por un lado mientras la otra sale por el contrario. */
  const slide = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter:  (d) => ({ opacity: 0, x: d * 42 }),
        center: { opacity: 1, x: 0 },
        exit:   (d) => ({ opacity: 0, x: d * -42 }),
      };

  return (
    <div
      className="gc-gal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX; }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (n > 1 && Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* La captura no ocupa la tarjeta entera: vive en su franja y el velo la
          funde con el fondo. Asi el texto nunca se monta sobre el producto y
          el mockup no se recorta por arriba y por abajo. */}
      <div className="gc-gal__stage" style={{ background: stageBg }}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.img
            key={i}
            src={shots[i]}
            alt={captions[i] ? `${title} — ${captions[i]}` : title}
            className="gc-gal__img"
            style={{ objectFit: fit }}
            draggable="false"
            decoding="async"
            variants={slide}
            custom={dir}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </div>
      <div className="gc-gal__veil" aria-hidden="true" />

      {/* Alto reservado: el pie se pinta siempre que haya pies, para que al
          cambiar de captura no se muevan las miniaturas de debajo. */}
      {captions.length > 0 && (
        <p className="gc-gal__cap">{captions[i] || ''}</p>
      )}

      {/* Miniaturas en vez de puntos: se ve cuantas capturas hay Y que hay en
          cada una antes de pincharla. */}
      {n > 1 && (
        <div className="gc-gal__thumbs" aria-label={strings.detail.gallery}>
          {shots.map((src, k) => (
            <button
              key={k}
              type="button"
              aria-current={k === i}
              aria-label={strings.detail.shotOf(k + 1, n)}
              className={`gc-gal__thumb${k === i ? ' is-on' : ''}`}
              onClick={() => setAt([k, k > i ? 1 : -1])}
            >
              <img src={src} alt="" loading="lazy" decoding="async" draggable="false" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ project, onClose, catMeta, strings, lang }) {
  const meta = catMeta[project.cat];
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
    if (!project.image) return;
    const img = new Image();
    img.onerror = () => setImgFailed(true);
    img.src = project.image;
  }, [project.image]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  /* Capturas del panel izquierdo. Cuando el proyecto no tiene `gallery` se usa
     su imagen de portada: antes ocupaba el fondo difuminado de la ficha y
     repetirla no habria anadido nada, pero con fondo solido queda libre. Asi
     las catorce fichas tienen la misma forma en vez de partirse en dos
     formatos segun quien tenga capturas. */
  const shots = project.gallery || (project.image && !imgFailed ? [project.image] : []);

  /* Los mockups de una galeria son capturas 3:2 con el producto centrado: en
     el panel entran a `cover` y se ven a tamano completo. La portada suelta de
     los proyectos sin galeria suele ser un logo o una captura apaisada, que
     recortada quedaria irreconocible — esa va contenida sobre su propio color. */
  const hasGallery = Boolean(project.gallery);
  /* Siempre `cover`: la captura llena su caja y llega hasta los bordes de la
     pantalla. Con `contain` quedaban franjas vacias y ahi se dibujaba el
     recuadro de la imagen contra el fondo, por mucho que se afinara el color.
     Lo que cambia entre mockups no es el encuadre sino el ANCHO de la caja. */
  const fit = hasGallery ? 'cover' : 'contain';
  /* Los mockups de galeria ya traen su propio fondo oscuro. Darle color al
     telon dibujaba una costura vertical donde empieza el panel: dejandolo
     transparente se ve el fondo del modal y la union desaparece. La portada
     suelta si necesita telon — se apoya en el gradiente del proyecto. */
  const stageBg = hasGallery ? 'transparent' : (project.cardBg || project.gradient);

  return (
    <motion.div
      className="gc-detail"
      variants={detailVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label={`Proyecto: ${project.title}`}
      onClick={onClose}
    >
      <div className="gc-detail__scrim" />

      <button className="gc-detail__x" onClick={onClose} aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>

      <motion.div
        className={`gc-detail__wrap${shots.length ? '' : ' gc-detail__wrap--solo'}`}
        variants={contentVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {shots.length > 0 && (
          <Gallery
            shots={shots}
            captions={project.shots || []}
            title={project.title}
            strings={strings}
            stageBg={stageBg}
            fit={fit}
          />
        )}

        {/* El contenido flota sobre la capa, apoyado en el velo lateral. */}
        <div className="gc-detail__content">
          <span className="gc-detail__num" aria-hidden="true">{String(project.id).padStart(2, '0')}</span>
          <p className="gc-detail__kicker" style={{ color: meta.accent }}>
            <i style={{ background: meta.accent }} />
            {meta.label}
          </p>
          <h2 className="gc-detail__title">{project.title}</h2>
          <p className="gc-detail__tagline">{project.tagline}</p>
          <p className="gc-detail__text">{project.desc}</p>

          <div className="gc-detail__chips">
            {project.tech.map((tch, i) => (
              <span key={i} className="gc-detail__chip">{tch}</span>
            ))}
          </div>

          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="gc-detail__cta">
              {strings.viewLive}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          ) : (
            <a href={localizedPath("contact", lang)} className="gc-detail__cta">
              {strings.contact}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 10H16M16 10L10 4M16 10L10 16" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── CARD (tarjeta de la hélice / fallback) ────────────────────────────
 * forwardRef: el contenedor padre muta su transform en cada frame de scroll. */
// Por encima de esta proporción la imagen es una captura de web apaisada: en una
// tarjeta vertical (0.78:1) `cover` se comería dos tercios del ancho, así que se
// encuadra por arriba —donde está el encabezado del sitio— y se funde con el fondo.
const WIDE_RATIO = 1.6;

const Card = forwardRef(function Card({ project, meta, onOpen, viewMore, variant }, ref) {
  // La tarjeta puede mostrar el logo de la marca y reservar la captura del
  // sitio para el detalle: a ese tamaño un logo se reconoce y una captura no.
  const cardSrc = project.cardImage || project.image;

  // La proporción se mide de la imagen ya cargada en vez de fijarla por
  // categoría: hay landings con captura apaisada y otras con logo cuadrado.
  const [isWide, setIsWide] = useState(false);
  const onImgLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) setIsWide(w / h >= WIDE_RATIO);
  };

  // Una captura apaisada siempre se encuadra por arriba. `cardFit` sigue
  // aplicando al resto —logos cuadrados con `contain` sobre fondo blanco— y al
  // modal de detalle, que lo lee por su cuenta: por eso no se toca el array.
  const fit = isWide ? 'top' : (project.cardFit || 'cover');
  const isTop = fit === 'top';

  const picture = cardSrc && (
    <img
      src={cardSrc}
      alt={`${project.title} — proyecto desarrollado por Geck Codex`}
      className="scard__img"
      style={isTop ? undefined : { objectFit: fit, objectPosition: project.imgPos || undefined }}
      onLoad={onImgLoad}
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );

  return (
    <article
      ref={ref}
      className={`scard scard--${variant}`}
      onClick={(e) => { e.stopPropagation(); onOpen(project); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onOpen(project); } }}
    >
      <div
        className={`scard__media${isTop ? ' scard__media--top' : ''}`}
        style={
          cardSrc
            ? (project.cardBg ? { '--pf-card-bg': project.cardBg } : undefined)
            : { background: project.gradient }
        }
      >
        {isTop ? <div className="scard__shot">{picture}</div> : picture}
        <div className="scard__veil" />

        <div className="scard__top">
          <span className="scard__tag" style={{ color: meta.chip, borderColor: meta.chip + '55' }}>
            {meta.label}
          </span>
          {project.link && <span className="scard__live" aria-hidden="true" />}
        </div>

        <div className="scard__cap">
          <h3 className="scard__name">{project.title}</h3>
          <p className="scard__desc">{project.tagline || project.desc}</p>
          <span className="scard__cta" aria-hidden="true">
            {viewMore}
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
function useScrew({ enabled, count, refs, trackRef, railRef, hudNum, hudTitle, hudCat, projects, catMeta, activeRef }) {
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
        const deg = d * conf.angle;
        const rad = (deg * Math.PI) / 180;
        const x = conf.radius * Math.sin(rad);
        const y = d * conf.pitch;
        const depth = Math.cos(rad);            // 1 al frente · -1 al fondo
        const dn = (depth + 1) / 2;             // 0..1
        const scale = conf.minScale + (1 - conf.minScale) * dn;
        const edge = clamp(1 - (Math.abs(d) - (conf.window - 1)), 0, 1);
        const opacity = clamp(0.12 + 0.88 * dn, 0, 1) * edge;

        el.style.visibility = 'visible';
        el.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateY(${deg.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(100 + depth * 100));
        // profundidad de campo: zona nítida de ±focus alrededor del centro,
        // luego el blur entra (y sale) de forma gradual al alejarse
        const dof = Math.min(Math.max(Math.abs(d) - conf.focus, 0) * conf.blur, 11);
        el.style.filter = conf.blur ? `blur(${dof.toFixed(1)}px)` : 'none';
        el.style.pointerEvents = depth > 0.25 ? 'auto' : 'none';
        el.classList.toggle('is-active', Math.abs(d) < 0.5);
      }

      if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(4)})`;

      const active = clamp(Math.round(head), 0, count - 1);
      if (activeRef) activeRef.current = active;
      if (active !== activeIdx) {
        activeIdx = active;
        const proj = projects[active];
        if (hudNum.current) hudNum.current.textContent = String(active + 1).padStart(2, '0');
        if (hudTitle.current) hudTitle.current.textContent = proj.title;
        if (hudCat.current) {
          const m = catMeta[proj.cat];
          hudCat.current.textContent = m.label;
          hudCat.current.style.color = m.accent;
          hudCat.current.style.borderColor = m.accent + '55';
        }
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
  }, [enabled, count, refs, trackRef, railRef, hudNum, hudTitle, hudCat, projects, catMeta, activeRef]);
}

/* ─── MAIN ──────────────────────────────────────────────────────────────── */
export default function PortfolioSection({ lang }) {
  const { t } = useLanguage(lang);
  const catMeta = Object.fromEntries(
    Object.entries(CAT_COLORS).map(([key, colors]) => [key, { ...colors, label: t.portfolio.catLabels[key] }])
  );
  const PROJECTS = PROJECTS_STATIC.map((p) => ({ ...p, ...(t.portfolio.projects[p.id] || {}) }));
  const N = PROJECTS.length;

  const [selected, setSelected] = useState(null);
  const [reduced, setReduced] = useState(false); // reduced-motion → fallback grid

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
  const activeRef = useRef(0); // índice del proyecto centrado (lo actualiza useScrew)

  useScrew({
    enabled: !reduced,
    count: N,
    refs: cardRefs,
    trackRef,
    railRef,
    hudNum,
    hudTitle,
    hudCat,
    projects: PROJECTS,
    catMeta,
    activeRef,
  });

  /* Abre el proyecto actualmente centrado. Se usa al hacer click en cualquier
   * zona del escenario: como las tarjetas giran y rara vez quedan quietas en el
   * centro, atinarles el click es difícil — así siempre se puede abrir el foco. */
  const openActive = () => setSelected(PROJECTS[activeRef.current] || PROJECTS[0]);

  const first = PROJECTS[0];

  return (
    <>
      <section className="screw">
        {/* Fondo sticky compartido — gradientes baratos */}
        <div className="screw__bg" aria-hidden="true">
          <div className="screw__orb screw__orb--a" />
          <div className="screw__orb screw__orb--b" />
        </div>

        {/* Intro — scrollea y desaparece antes del tornillo */}
        <header className="screw__intro">
          <span className="screw__pretitle">{t.portfolio.pretitle}</span>
          <h1 className="screw__h1">
            {t.portfolio.title.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p className="screw__lead">{t.portfolio.subtitle}</p>
          {!reduced && (
            <span className="screw__hint">
              {t.portfolio.scrollHint}
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="1" y="1" width="12" height="20" rx="6" />
                <circle className="screw__hint-dot" cx="7" cy="6" r="1.6" fill="currentColor" stroke="none" />
              </svg>
            </span>
          )}
        </header>

        {reduced ? (
          /* ── FALLBACK estático: grid accesible, sin movimiento ── */
          <div className="screw__grid">
            {PROJECTS.map((p) => (
              <Card
                key={p.id}
                project={p}
                meta={catMeta[p.cat]}
                onOpen={setSelected}
                viewMore={t.portfolio.viewMore}
                variant="static"
              />
            ))}
          </div>
        ) : (
          /* ── TORNILLO: track alto + stage sticky con perspectiva ── */
          <div
            className="screw__track"
            ref={trackRef}
            style={{ height: `${(N - 1) * SCROLL_PER_CARD + 110}vh` }}
          >
            <div
              className="screw__stage"
              onClick={openActive}
              role="button"
              tabIndex={0}
              aria-label={t.portfolio.viewMore}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openActive(); } }}
            >
              {/* eje / rosca central */}
              <div className="screw__axis" aria-hidden="true" />

              {/* halo de foco — resalta la tarjeta del centro */}
              <div className="screw__focus" aria-hidden="true" />

              {/* HUD: número de proyecto + categoría + título */}
              <div className="screw__hud" aria-hidden="true">
                <div className="screw__count">
                  <span className="screw__count-num" ref={hudNum}>01</span>
                  <span className="screw__count-sep">/</span>
                  <span className="screw__count-tot">{String(N).padStart(2, '0')}</span>
                </div>
                <span className="screw__hud-cat" ref={hudCat} style={{ color: catMeta[first.cat].accent, borderColor: catMeta[first.cat].accent + '55' }}>
                  {catMeta[first.cat].label}
                </span>
                <span className="screw__hud-title" ref={hudTitle}>{first.title}</span>
              </div>

              {/* riel de progreso */}
              <div className="screw__rail" aria-hidden="true">
                <div className="screw__rail-fill" ref={railRef} />
              </div>

              {/* tarjetas de la hélice */}
              <div className="screw__cyl">
                {PROJECTS.map((p, i) => (
                  <Card
                    key={p.id}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    project={p}
                    meta={catMeta[p.cat]}
                    onOpen={setSelected}
                    viewMore={t.portfolio.viewMore}
                    variant="helix"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {selected && (
          <Detail key={selected.id} project={selected} onClose={() => setSelected(null)} catMeta={catMeta} strings={t.portfolio} lang={lang} />
        )}
      </AnimatePresence>

      <style>{`
        :root {
          --sc-bg:   #12110F;
          --sc-gold: var(--accent);
          --sc-gl:   #F4E4BC;
          --sc-gd:   #584A1C;
          --sc-gb:   rgba(88,74,28,0.3);
          --expo:    cubic-bezier(0.22,1,0.36,1);
        }

        .screw {
          position: relative;
          background: var(--background);
          color: var(--text);
        }

        /* ── FONDO STICKY ──────────────────────────────────────────────── */
        .screw__bg {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          margin-bottom: -100vh;
        }
        .screw__orb { position: absolute; border-radius: 50%; }
        .screw__orb--a {
          width: 80vw; height: 60vw; top: -15%; left: 50%; transform: translateX(-50%);
          background: radial-gradient(ellipse at center, rgba(195,173,133,0.06) 0%, transparent 60%);
        }
        .screw__orb--b {
          width: 55vw; height: 55vw; bottom: 5%; right: -15%;
          background: radial-gradient(circle at center, rgba(195,173,133,0.035) 0%, transparent 65%);
        }

        /* ── INTRO ─────────────────────────────────────────────────────── */
        .screw__intro {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 1040px;
          margin: 0 auto;
          padding: 7rem 1.4rem 2rem;
        }
        .screw__pretitle {
          display: inline-block;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--accent-text);
          padding: 0.35rem 1.2rem; border: 1px solid var(--sc-gb);
          border-radius: 100px; margin-bottom: 1.5rem; background: rgba(88,74,28,0.08);
        }
        .screw__h1 {
          font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 900; line-height: 1.06;
          color: var(--text);
          margin: 0 0 1rem;
        }
        .screw__lead { font-size: 1rem; color: var(--text-muted); margin: 0; }
        .screw__hint {
          display: inline-flex; align-items: center; gap: 0.55rem;
          margin-top: 2.2rem; font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted);
        }
        .screw__hint svg { color: var(--sc-gold); }
        .screw__hint-dot { animation: sc-scroll 1.8s var(--expo) infinite; }
        @keyframes sc-scroll {
          0% { opacity: 0; transform: translateY(0); }
          30% { opacity: 1; }
          70% { opacity: 1; transform: translateY(7px); }
          100% { opacity: 0; transform: translateY(7px); }
        }

        /* ── TRACK + STAGE STICKY ──────────────────────────────────────── */
        .screw__track {
          position: relative;
          z-index: 1;
        }
        .screw__stage {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          perspective: 1200px;
          perspective-origin: 50% 50%;
          cursor: pointer; /* todo el escenario abre el proyecto centrado */
        }

        /* eje central de la rosca */
        .screw__axis {
          position: absolute;
          top: 0; bottom: 0; left: 50%;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(195,173,133,0.18) 22%,
            rgba(195,173,133,0.18) 78%,
            transparent 100%
          );
          z-index: 0;
        }

        /* halo de foco difuminado en el centro (donde está la rosca) */
        .screw__focus {
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
        .screw__cyl {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          z-index: 1;
        }

        /* ── TARJETA (modo hélice) ─────────────────────────────────────── */
        .scard--helix {
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
        .scard--helix .scard__media {
          transition: box-shadow .35s var(--expo);
          box-shadow: 0 18px 50px rgba(0,0,0,0.5);
        }
        .scard--helix.is-active .scard__media {
          box-shadow: 0 34px 80px rgba(0,0,0,0.62), 0 0 60px rgba(195,173,133,0.2);
        }
        .scard--helix .scard__cap { opacity: 0; transition: opacity .35s var(--expo); }
        .scard--helix.is-active .scard__cap { opacity: 1; }

        /* ── TARJETA (visual común) ──────────────────────────────────────
         * El fondo de la tarjeta va INVERTIDO respecto al tema: en modo
         * oscuro es blanco y en modo claro es la misma tinta del modo
         * oscuro. Asi la rejilla del portafolio siempre contrasta contra la
         * pagina y los logos con transparencia se leen en ambos modos. */
        :root { --pf-card-bg: #1F1F1E; }
        :root[data-theme="dark"] { --pf-card-bg: #FFFFFF; }

        .scard__media {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 18px;
          background: var(--pf-card-bg);
          border: 1px solid var(--border, rgba(255,255,255,0.07));
        }
        .scard__img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
        }
        /* ── encuadre por arriba (capturas de web apaisadas) ─────────── */
        .scard__media--top { background: var(--pf-card-bg); }
        /* La franja no fija su altura: la toma de la imagen, que se pinta a
           ancho completo y proporción real. Así se ve el encabezado entero del
           sitio —sin recortar los lados— y el degradado lo cose con el fondo. */
        .scard__shot {
          position: absolute; top: 0; left: 0; right: 0;
          overflow: hidden;
          z-index: 0;
        }
        .scard__shot .scard__img {
          position: relative; inset: auto;
          width: 100%; height: auto;
          object-fit: fill;
        }
        .scard__shot::after {
          content: '';
          position: absolute; inset: 0;
          pointer-events: none;
          background: linear-gradient(to bottom, transparent 42%, var(--pf-card-bg) 100%);
        }

        .scard__veil {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.35) 42%, rgba(8,7,5,0) 70%);
          z-index: 1;
        }
        .scard__top {
          position: absolute; top: 0.9rem; left: 0.9rem; right: 0.9rem;
          display: flex; align-items: center; justify-content: space-between;
          z-index: 2;
        }
        .scard__tag {
          display: inline-flex; align-items: center;
          padding: 0.22rem 0.6rem; border-radius: 7px;
          border: 1px solid; background: rgba(8,7,5,0.86);
          font-size: 0.56rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .scard__live {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.6);
          animation: sc-pulse 2.2s ease infinite; flex-shrink: 0;
        }
        @keyframes sc-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .scard__cap {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 1.1rem 1.15rem 1.15rem;
          z-index: 2;
        }
        .scard__name {
          font-size: 1.18rem; font-weight: 800; color: #fff;
          margin: 0 0 0.32rem; line-height: 1.18;
        }
        .scard__desc {
          font-size: 0.78rem; line-height: 1.5; color: rgba(244,228,188,0.62);
          margin: 0 0 0.7rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .scard__cta {
          display: inline-flex; align-items: center; gap: 0.36rem;
          color: var(--sc-gold); font-size: 0.72rem; font-weight: 700;
        }

        /* ── HUD ───────────────────────────────────────────────────────── */
        .screw__hud {
          position: absolute;
          top: 50%; left: clamp(1.2rem, 5vw, 4.5rem);
          transform: translateY(-50%);
          z-index: 5;
          max-width: 240px;
          pointer-events: none;
        }
        .screw__count {
          display: flex; align-items: baseline; gap: 0.3rem;
          font-weight: 900; line-height: 1; margin-bottom: 0.9rem;
        }
        .screw__count-num {
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          color: var(--accent-text);
        }
        .screw__count-sep { font-size: 1.4rem; color: var(--text-muted); }
        .screw__count-tot { font-size: 1.4rem; color: var(--text-muted); }
        .screw__hud-cat {
          display: inline-flex; align-items: center;
          padding: 0.2rem 0.6rem; border-radius: 7px; border: 1px solid;
          font-size: 0.56rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 0.7rem;
        }
        .screw__hud-title {
          display: block;
          font-size: clamp(1.2rem, 2vw, 1.6rem); font-weight: 800;
          color: var(--text); line-height: 1.15;
        }

        /* ── RIEL DE PROGRESO ──────────────────────────────────────────── */
        .screw__rail {
          position: absolute;
          top: 50%; right: clamp(1rem, 3vw, 2.4rem);
          transform: translateY(-50%);
          width: 3px; height: 38vh; border-radius: 3px;
          background: var(--border-strong);
          overflow: hidden; z-index: 5;
        }
        .screw__rail-fill {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          transform-origin: top; transform: scaleY(0);
          background: linear-gradient(to bottom, var(--sc-gl), var(--sc-gold));
          border-radius: 3px;
        }

        /* ── FALLBACK GRID (reduced-motion) ────────────────────────────── */
        .screw__grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.4rem;
          max-width: 1240px;
          margin: 0 auto;
          padding: 2rem 1.4rem 7rem;
        }
        .scard--static { cursor: pointer; }
        .scard--static .scard__media {
          aspect-ratio: 4 / 5; height: auto;
          transition: transform .3s var(--expo), box-shadow .3s var(--expo);
        }
        .scard--static:hover .scard__media {
          transform: translateY(-5px);
          box-shadow: 0 22px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(195,173,133,0.35);
        }

        /* ── DETAIL OVERLAY ────────────────────────────────────────────── */
        .gc-detail {
          position: fixed; inset: 0; z-index: 3000;
          display: flex; align-items: center; justify-content: center;
          padding: 0; overflow-y: auto; overflow-x: hidden;
          --pf-ground: #1F1F1E;
          --pf-text: #F1EDE4;
          --pf-muted: rgba(241,237,228,0.68);
          --pf-dim: rgba(241,237,228,0.34);
        }
        .gc-detail__scrim { position: fixed; inset: 0; background: rgba(4,6,10,0.86); }
        .gc-detail__x {
          position: fixed; top: 1.5rem; right: 1.5rem; z-index: 10;
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.14); background: rgba(0,0,0,0.4);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          color: rgba(255,255,255,0.72);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .18s, color .18s;
        }
        .gc-detail__x:hover { background: rgba(0,0,0,0.65); color: #fff; }

        /* Una sola superficie: la captura se funde en el fondo por la
           izquierda y el texto se apoya en esa penumbra. Sin paneles ni
           costuras — de ahi que no sea una rejilla de dos columnas. */
        .gc-detail__wrap {
          position: relative; z-index: 2; width: 100%; max-width: none;
          height: 100dvh; overflow: hidden;
          background: var(--pf-ground);
        }
        /* Sin captura no hay nada que llenar la pantalla: vuelve a ser tarjeta. */
        .gc-detail__wrap--solo {
          max-width: 560px; height: auto; margin: auto;
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }

        /* ── Capa de la captura ── */
        .gc-gal { position: absolute; inset: 0; z-index: 0; touch-action: pan-y; }
        /* La captura vive en la franja derecha, no en toda la tarjeta: asi
           entra a cover sin recortar el producto por arriba y por abajo. */
        .gc-gal__stage { position: absolute; top: 0; right: 0; bottom: 0; left: 34%; overflow: hidden; }

        .gc-gal__img { position: absolute; inset: 0; width: 100%; height: 100%; user-select: none; }
        /* El velo funde esa franja con el fondo y sostiene el texto. */
        .gc-gal__veil {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(100deg,
            var(--pf-ground) 0%, rgba(31,31,30,0.98) 26%, rgba(31,31,30,0.86) 38%,
            rgba(31,31,30,0.55) 50%, rgba(31,31,30,0.22) 62%,
            rgba(31,31,30,0.06) 74%, rgba(31,31,30,0) 86%);
        }
        /* Pie sobre la captura: como el mockup tiene zonas claras, el texto
           suelto se perdia encima. Va en una etiqueta con fondo propio. */
        .gc-gal__cap {
          position: absolute; right: clamp(1.6rem, 4vw, 4rem); bottom: 7rem; z-index: 4;
          margin: 0; max-width: 34ch; text-align: right;
          padding: 0.5rem 0.8rem; border-radius: 9px;
          background: rgba(6,8,12,0.72);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          font-size: 0.75rem; line-height: 1.5; color: var(--pf-text);
        }
        .gc-gal__thumbs {
          position: absolute; right: clamp(1.6rem, 4vw, 4rem); bottom: clamp(1.5rem, 3vw, 3rem);
          z-index: 4; display: flex; gap: 0.5rem;
        }
        .gc-gal__thumb {
          width: 92px; height: 62px; padding: 0; border-radius: 9px; overflow: hidden; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.22); background: none; opacity: 0.5;
          transition: opacity .2s, border-color .2s, transform .2s;
        }
        .gc-gal__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .gc-gal__thumb:hover { opacity: 0.85; transform: translateY(-2px); }
        .gc-gal__thumb.is-on { opacity: 1; border-color: var(--sc-gold); box-shadow: 0 0 0 2px rgba(212,175,55,0.35); }

        /* ── Contenido ── */
        .gc-detail__content {
          position: relative; z-index: 3; height: 100%; width: 53%; min-width: 0;
          display: flex; flex-direction: column; justify-content: center; gap: 1.05rem;
          /* El margen crece con la pantalla: en un monitor ancho, el texto
             pegado al borde izquierdo se lee como un error de maquetacion. */
          padding: clamp(1.8rem, 3.4vw, 3.2rem) clamp(1.8rem, 3.4vw, 3.2rem)
                   clamp(1.8rem, 3.4vw, 3.2rem) clamp(2rem, 7vw, 8rem);
          overflow-y: auto; overscroll-behavior: contain;
        }
        .gc-detail__num {
          position: absolute; top: clamp(1.8rem, 3.4vw, 3.2rem); left: clamp(2rem, 7vw, 8rem);
          font-size: 0.66rem; font-weight: 700; letter-spacing: 0.14em;
          color: var(--pf-dim); font-variant-numeric: tabular-nums;
        }
        .gc-detail__kicker {
          display: flex; align-items: center; gap: 0.6rem; margin: 0;
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
        }
        .gc-detail__kicker i { display: block; width: 26px; height: 2px; flex: none; }
        .gc-detail__title {
          font-size: clamp(2.3rem, 4.4vw, 3.8rem); font-weight: 700; color: var(--pf-text);
          margin: 0; line-height: 0.96; letter-spacing: -0.035em;
        }
        .gc-detail__tagline {
          margin: 0; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; color: var(--pf-dim);
        }
        .gc-detail__text {
          margin: 0.35rem 0 0; font-size: 0.9rem; line-height: 1.78;
          color: var(--pf-muted); max-width: 44ch; overflow-wrap: break-word;
        }
        .gc-detail__chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .gc-detail__chip {
          padding: 0.28rem 0.7rem; border-radius: 7px; font-size: 0.66rem; font-weight: 600;
          color: var(--pf-muted); border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.05);
        }
        .gc-detail__cta {
          align-self: flex-start; margin-top: 0.6rem;
          display: inline-flex; align-items: center; gap: 0.55rem;
          padding: 0.95rem 1.9rem; border-radius: 100px;
          background: var(--sc-gold); color: #12140F;
          font-weight: 800; font-size: 0.85rem; text-decoration: none;
          transition: filter .2s, transform .2s;
        }
        .gc-detail__cta:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* ── RESPONSIVE ────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .screw__hud { max-width: 180px; left: clamp(0.8rem, 3vw, 2rem); }
          /* Apilado. La capa deja de estar superpuesta y pasa a ser una
             columna: si el pie y las miniaturas siguieran en flujo dentro de
             una capa absoluta, se dibujarian ENCIMA de la captura. */
          .gc-detail { padding: 1.5rem; }
          .gc-detail__wrap {
            max-width: 560px; height: auto; max-height: 88vh;
            display: flex; flex-direction: column; overflow-y: auto;
            border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          }
          .gc-gal {
            position: relative; inset: auto; flex: none;
            display: flex; flex-direction: column; gap: 0.75rem;
            padding: 0 0 0.2rem;
          }
          .gc-gal__stage { position: relative; inset: auto; left: 0; height: 52vh; min-height: 320px; flex: none; }
          /* El velo se limita al alto de la captura y funde hacia abajo, que
             es por donde ahora sigue el contenido. */
          .gc-gal__veil {
            top: 0; bottom: auto; height: 52vh; min-height: 320px;
            background: linear-gradient(to bottom,
              rgba(31,31,30,0) 38%, rgba(31,31,30,0.25) 58%, rgba(31,31,30,0.62) 76%,
              rgba(31,31,30,0.9) 92%, var(--pf-ground) 100%);
          }
          .gc-gal__cap {
            position: static; margin: 0 1.3rem; max-width: none; text-align: left;
            padding: 0; background: none; backdrop-filter: none; -webkit-backdrop-filter: none;
            font-size: 0.78rem; color: var(--pf-muted);
          }
          .gc-gal__thumbs { position: static; margin: 0 1.3rem; }
          .gc-gal__thumb { width: 72px; height: 48px; }
          .gc-detail__content {
            width: 100%; height: auto; justify-content: flex-start; overflow: visible;
            padding-top: 1.1rem;
          }
          .gc-detail__num { display: none; }
          .gc-detail__text { max-width: none; }
        }
        @media (max-width: 768px) {
          .screw__intro { padding: 5rem 1rem 1.5rem; }
          .scard--helix { --cw: 210px; --ch: 270px; }
          .scard--helix .scard__cap { opacity: 1; }
          .scard__name { font-size: 1rem; }
          .screw__hud {
            top: auto; bottom: 1.4rem; left: 50%;
            transform: translateX(-50%); text-align: center; max-width: 86vw;
          }
          .screw__count { justify-content: center; margin-bottom: 0.5rem; }
          .screw__count-num { font-size: 2.4rem; }
          .screw__hud-title { font-size: 1.1rem; }
          .screw__rail { height: 30vh; right: 0.7rem; }
          .gc-detail { padding: 0.9rem 0.7rem; align-items: flex-start; }
          .gc-detail__wrap { max-width: 100%; max-height: 94vh; border-radius: 16px; box-shadow: none; }
          .gc-detail__x { top: 0.9rem; right: 0.9rem; width: 36px; height: 36px; }
          /* En el telefono la captura es lo primero y ocupa media pantalla:
             el texto viene despues, al desplazar. */
          .gc-gal__stage, .gc-gal__veil { height: 50vh; min-height: 300px; }
          .gc-gal { gap: 0.6rem; }
          .gc-gal__thumb { width: 64px; height: 44px; }
          .gc-detail__content { padding: 1rem 1.3rem 1.6rem; gap: 0.85rem; }
          .gc-detail__title { font-size: clamp(2rem, 9vw, 2.6rem); }
          .gc-detail__cta { width: 100%; justify-content: center; }
        }

        /* ── REDUCED MOTION ────────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .scard--static .scard__media,
          .gc-detail, .gc-detail__wrap, .gc-detail__cta,
          .gc-gal__thumb { transition: none !important; }
          .scard__live, .screw__hint-dot { animation: none !important; opacity: 1; }
        }
      `}</style>
    </>
  );
}
