import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const CAT_COLORS = {
  landing:  { accent: '#e879f9', border: 'rgba(232,121,249,0.35)' },
  mobile:   { accent: '#60a5fa', border: 'rgba(96,165,250,0.35)'  },
  webapp:   { accent: '#34d399', border: 'rgba(52,211,153,0.35)'  },
  software: { accent: '#a78bfa', border: 'rgba(167,139,250,0.35)' },
};

const PROJECTS_STATIC = [
  { id: 1,  cat: 'landing',  title: 'Chuchulucos',          tech: ['Astro', 'Tailwind CSS', 'Framer Motion'],                           link: 'https://chuchulucos.geckcodex.com/',        gradient: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 40%, #db2777 100%)', image: '/assets/image/portafolio/chuchu.webp' },
  { id: 2,  cat: 'landing',  title: 'Agend-In',              tech: ['Astro', 'React', 'Node.js', 'Tailwind CSS'],                        link: 'https://agend-in.geckcodex.com/',           gradient: 'linear-gradient(145deg, #1e1b4b 0%, #4f46e5 45%, #0ea5e9 100%)', image: '/assets/image/portafolio/agendin.webp' },
  { id: 3,  cat: 'landing',  title: 'LandingKit',            tech: ['Astro', 'React', 'Tailwind CSS'],                                   link: 'https://landig-plantilla.geckcodex.com/',   gradient: 'linear-gradient(145deg, #2e1065 0%, #7c3aed 45%, #c026d3 100%)', image: '/assets/image/portafolio/landig.webp' },
  { id: 4,  cat: 'landing',  title: 'Chava Calderón',        tech: ['Astro', 'Tailwind CSS', 'Framer Motion'],                           link: 'https://chavacalderon.mx/',                 gradient: 'linear-gradient(145deg, #1a0636 0%, #6d28d9 45%, #9d174d 100%)', image: '/assets/image/portafolio/chava.webp' },
  { id: 5,  cat: 'landing',  title: 'Mando',                 tech: ['Astro', 'React', 'Tailwind CSS'],                                                                                      gradient: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 45%, #312e81 100%)', image: '/assets/image/portafolio/mando.webp' },
  { id: 6,  cat: 'landing',  title: 'Mi Caja POS',           tech: ['Astro', 'React', 'Tailwind CSS'],                                   link: 'https://mi-caja.geckcodex.com/',            gradient: 'linear-gradient(145deg, #1c1917 0%, #92400e 45%, #d97706 100%)', image: '/assets/image/portafolio/micaja.webp' },
  { id: 7,  cat: 'mobile',   title: 'capital Transport',     tech: ['React Native', 'Node.js', 'Firebase', 'Google Maps API'],                                                              gradient: 'linear-gradient(145deg, #0c1a3d 0%, #1d4ed8 45%, #0ea5e9 100%)', image: '/assets/image/portafolio/capital transpor.webp' },
  { id: 8,  cat: 'mobile',   title: 'SpendWise',             tech: ['React Native', 'Expo', 'SQLite', 'Chart.js'],                                                                         gradient: 'linear-gradient(145deg, #0e2a5c 0%, #2563eb 45%, #06b6d4 100%)', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80&auto=format&fit=crop' },
  { id: 9,  cat: 'webapp',   title: 'Coronado Gym',          tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],                                                                     gradient: 'linear-gradient(145deg, #0a2e1a 0%, #15803d 45%, #0d9488 100%)', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&q=80&auto=format&fit=crop' },
  { id: 11, cat: 'webapp',   title: 'Generador de Gafetes',  tech: ['React', 'Node.js', 'PostgreSQL', 'PDF-lib', 'QR Generator'],                                                         gradient: 'linear-gradient(145deg, #1c1917 0%, #064e3b 45%, #0f766e 100%)', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=80&auto=format&fit=crop' },
  { id: 12, cat: 'software', title: 'SafePosture',           tech: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'React'],                                                               gradient: 'linear-gradient(145deg, #1e0a3c 0%, #6d28d9 45%, #4338ca 100%)', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=640&q=80&auto=format&fit=crop' },
  { id: 13, cat: 'software', title: 'El mezquite control',   tech: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],                                                                         gradient: 'linear-gradient(145deg, #0f172a 0%, #5b21b6 45%, #4f46e5 100%)', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=640&q=80&auto=format&fit=crop' },
  { id: 14, cat: 'software', title: 'velt',                  tech: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'WebSockets'],                                                         gradient: 'linear-gradient(145deg, #1a0533 0%, #7c3aed 45%, #6d28d9 100%)', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=640&q=80&auto=format&fit=crop' },
  { id: 15, cat: 'software', title: 'EduAI',                 tech: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL'],                                                            gradient: 'linear-gradient(145deg, #09090b 0%, #5b21b6 45%, #4338ca 100%)', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=640&q=80&auto=format&fit=crop' },
  { id: 16, cat: 'software', title: 'GeckCRM',               tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],                                                                    gradient: 'linear-gradient(145deg, #170d2e 0%, #7c3aed 45%, #2563eb 100%)', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80&auto=format&fit=crop' },
];

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
  mobile:  { angle: 38, radius: 170, pitch: 212, window: 2.2, minScale: 0.62, blur: 0, focus: 0.55 },
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

function Detail({ project, onClose, catMeta, strings }) {
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

  const bgStyle = (project.image && !imgFailed)
    ? { backgroundImage: `url("${project.image}")`, backgroundSize: 'cover', backgroundPosition: 'center top' }
    : { background: project.gradient };

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
      <div className="gc-detail__bg" style={bgStyle} />
      <div className="gc-detail__scrim" />

      <button className="gc-detail__x" onClick={onClose} aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>

      <motion.div
        className="gc-detail__wrap"
        variants={contentVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="gc-detail__head">
          <span
            className="gc-detail__badge"
            style={{ color: meta.accent, background: meta.accent + '22', borderColor: meta.accent + '55' }}
          >
            {meta.label}
          </span>
          <h2 className="gc-detail__title">{project.title}</h2>
          <p className="gc-detail__tagline">{project.tagline}</p>
        </header>

        <div className="gc-bento">
          <div className="gc-bento__cell gc-bento__cell--desc">
            <span className="gc-bento__label">{strings.detail.desc}</span>
            <p className="gc-bento__body">{project.desc}</p>
          </div>
          <div className="gc-bento__cell gc-bento__cell--tech">
            <span className="gc-bento__label">{strings.detail.stack}</span>
            <div className="gc-bento__chips">
              {project.tech.map((tch, i) => (
                <span
                  key={i}
                  className="gc-bento__chip"
                  style={{ color: meta.accent, borderColor: meta.accent + '55', background: meta.accent + '14' }}
                >
                  {tch}
                </span>
              ))}
            </div>
          </div>
        </div>

        {project.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="gc-detail__cta">
            {strings.viewLive}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ) : (
          <a href="/contacto" className="gc-detail__cta">
            {strings.contact}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 10H16M16 10L10 4M16 10L10 16" />
            </svg>
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── CARD (tarjeta de la hélice / fallback) ────────────────────────────
 * forwardRef: el contenedor padre muta su transform en cada frame de scroll. */
const Card = forwardRef(function Card({ project, meta, onOpen, viewMore, variant }, ref) {
  return (
    <article
      ref={ref}
      className={`scard scard--${variant}`}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(project); } }}
    >
      <div
        className="scard__media"
        style={project.image ? undefined : { background: project.gradient }}
      >
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="scard__img"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        )}
        <div className="scard__veil" />

        <div className="scard__top">
          <span className="scard__tag" style={{ color: meta.accent, borderColor: meta.accent + '66' }}>
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
function useScrew({ enabled, count, refs, trackRef, railRef, hudNum, hudTitle, hudCat, projects, catMeta }) {
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
  }, [enabled, count, refs, trackRef, railRef, hudNum, hudTitle, hudCat, projects, catMeta]);
}

/* ─── MAIN ──────────────────────────────────────────────────────────────── */
export default function PortfolioSection() {
  const { t } = useLanguage();
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
  });

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
            <div className="screw__stage">
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
          <Detail key={selected.id} project={selected} onClose={() => setSelected(null)} catMeta={catMeta} strings={t.portfolio} />
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

        /* ── TARJETA (visual común) ────────────────────────────────────── */
        .scard__media {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 18px;
          background: #1b1a17;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .scard__img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
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
          border: 1px solid; background: rgba(8,7,5,0.55);
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
          padding: 1.5rem; overflow-y: auto;
        }
        .gc-detail__bg {
          position: fixed; inset: -5%; width: 110%; height: 110%;
          filter: blur(18px) brightness(0.35) saturate(1.2); transform: scale(1.05); will-change: filter;
        }
        .gc-detail__scrim { position: fixed; inset: 0; background: rgba(4,3,1,0.55); }
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
        .gc-detail__wrap { position: relative; z-index: 2; width: 100%; max-width: 760px; }
        .gc-detail__head { text-align: center; margin-bottom: 1.6rem; }
        .gc-detail__badge {
          display: inline-flex; align-items: center;
          padding: 0.24rem 0.88rem; border-radius: 100px; border: 1px solid;
          font-size: 0.6rem; font-weight: 800; letter-spacing: 0.09em; text-transform: uppercase;
          margin-bottom: 1rem; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        }
        .gc-detail__title {
          font-size: clamp(2.2rem, 6vw, 3.4rem); font-weight: 900; color: #fff;
          margin: 0 0 0.5rem; text-shadow: 0 2px 24px rgba(0,0,0,0.6); line-height: 1.05;
        }
        .gc-detail__tagline {
          font-size: 0.76rem; color: rgba(255,255,255,0.5);
          text-transform: uppercase; letter-spacing: 0.13em; margin: 0;
        }
        .gc-bento { display: grid; grid-template-columns: 3fr 2fr; gap: 0.8rem; margin-bottom: 1rem; }
        .gc-bento__cell {
          background: rgba(0,0,0,0.36);
          backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.3rem 1.35rem;
        }
        .gc-bento__label {
          display: block; font-size: 0.58rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.13em; color: rgba(255,255,255,0.35); margin-bottom: 0.65rem;
        }
        .gc-bento__body { font-size: 0.86rem; line-height: 1.74; color: rgba(255,255,255,0.82); margin: 0; }
        .gc-bento__chips { display: flex; flex-wrap: wrap; gap: 0.36rem; }
        .gc-bento__chip { padding: 0.24rem 0.65rem; border-radius: 8px; border: 1px solid; font-size: 0.66rem; font-weight: 600; }
        .gc-detail__cta {
          display: flex; align-items: center; justify-content: center; gap: 0.52rem;
          width: 100%; padding: 1rem 2rem; border-radius: 100px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(195,173,133,0.38); color: var(--sc-gold);
          font-weight: 800; font-size: 0.88rem; text-decoration: none;
          transition: background .2s, border-color .2s, box-shadow .2s, transform .2s var(--expo);
          box-shadow: 0 4px 20px rgba(195,173,133,0.08);
        }
        .gc-detail__cta:hover {
          background: rgba(195,173,133,0.13); border-color: rgba(195,173,133,0.65);
          box-shadow: 0 8px 30px rgba(195,173,133,0.22); transform: scale(1.014);
        }

        /* ── RESPONSIVE ────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .screw__hud { max-width: 180px; left: clamp(0.8rem, 3vw, 2rem); }
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
          .gc-bento { grid-template-columns: 1fr; }
          .gc-detail { padding: 0.75rem; align-items: flex-end; }
          .gc-detail__title { font-size: 1.9rem; }
          .gc-detail__wrap { max-width: 100%; }
        }

        /* ── REDUCED MOTION ────────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .scard--static .scard__media,
          .gc-detail, .gc-detail__wrap, .gc-detail__cta { transition: none !important; }
          .scard__live, .screw__hint-dot { animation: none !important; opacity: 1; }
        }
      `}</style>
    </>
  );
}
