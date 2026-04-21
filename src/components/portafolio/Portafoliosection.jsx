import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CAT_META = {
  landing:  { label: 'Landing Page',   accent: '#e879f9', border: 'rgba(232,121,249,0.35)' },
  mobile:   { label: 'App Móvil',      accent: '#60a5fa', border: 'rgba(96,165,250,0.35)'  },
  webapp:   { label: 'Plataforma Web', accent: '#34d399', border: 'rgba(52,211,153,0.35)'  },
  software: { label: 'Software & IA',  accent: '#a78bfa', border: 'rgba(167,139,250,0.35)' },
};

const FILTERS = [
  { id: 'all',      label: 'Todos' },
  { id: 'landing',  label: 'Landing Pages' },
  { id: 'mobile',   label: 'Apps Móviles' },
  { id: 'webapp',   label: 'Plataformas Web' },
  { id: 'software', label: 'Software & IA' },
];

const PROJECTS = [
  {
    id: 1, cat: 'landing',
    title: 'Chuchulucos',
    tagline: 'Botanas Artesanales Picosas',
    desc: 'Landing de alta conversión para la marca Chuchulucos, especializada en botanas y alimentos picosos artesanales. Diseño vibrante, propuesta de valor clara y CTAs optimizados para incrementar pedidos.',
    tech: ['Astro', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://chuchulucos.geckcodex.com/',
    gradient: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 40%, #db2777 100%)',
    image: '/assets/image/portafolio/chuchu.webp',
  },
  {
    id: 2, cat: 'landing',
    title: 'Agend-In',
    tagline: 'Citas Automáticas vía WhatsApp',
    desc: 'Automatización completa de citas vía WhatsApp y Telegram. Gestión de clientes, historial de agendas y personalidad del asistente virtual completamente personalizable según tu marca.',
    tech: ['Astro', 'React', 'Node.js', 'Tailwind CSS'],
    link: 'https://agend-in.geckcodex.com/',
    gradient: 'linear-gradient(145deg, #1e1b4b 0%, #4f46e5 45%, #0ea5e9 100%)',
    image: '/assets/image/portafolio/agendin.webp',
  },
  {
    id: 3, cat: 'landing',
    title: 'LandingKit',
    tagline: 'Plantilla Pro para Landings',
    desc: 'Plantilla profesional para crear landings de alta conversión. Diseño moderno, rápido y completamente personalizable con secciones pre-construidas listas para usar.',
    tech: ['Astro', 'React', 'Tailwind CSS'],
    link: 'https://landig-plantilla.geckcodex.com/',
    gradient: 'linear-gradient(145deg, #2e1065 0%, #7c3aed 45%, #c026d3 100%)',
    image: '/assets/image/portafolio/landig.webp',
  },
  {
    id: 4, cat: 'landing',
    title: 'Chava Calderón',
    tagline: 'Figura de Autoridad en Parral',
    desc: 'Presencia digital para figura de autoridad en Hidalgo de Parral. Muestra el día a día, logros y propuestas ciudadanas, construyendo conexión genuina con la comunidad.',
    tech: ['Astro', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://chavacalderon.mx/',
    gradient: 'linear-gradient(145deg, #1a0636 0%, #6d28d9 45%, #9d174d 100%)',
    image: '/assets/image/portafolio/chava.webp',
  },
  {
    id: 5, cat: 'landing',
    title: 'Mando',
    tagline: 'Tu Negocio en WhatsApp',
    desc: 'Landing para Mando: bot que conecta WhatsApp o Telegram con la base de datos del negocio para consultas en lenguaje natural sobre métricas, inventario, ventas y más.',
    tech: ['Astro', 'React', 'Tailwind CSS'],
    gradient: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 45%, #312e81 100%)',
    image: '/assets/image/portafolio/mando.webp',
  },
  {
    id: 6, cat: 'landing',
    title: 'Mi Caja POS',
    tagline: 'POS Bueno, Bonito y Barato',
    desc: 'Landing para Mi Caja, punto de venta moderno y accesible diseñado para restaurantes, carnicerías, abarrotes y fondas. Demuestra cómo digitalizar ventas sin complicaciones ni costos excesivos.',
    tech: ['Astro', 'React', 'Tailwind CSS'],
    link: 'https://mi-caja.geckcodex.com/',
    gradient: 'linear-gradient(145deg, #1c1917 0%, #92400e 45%, #d97706 100%)',
    image: '/assets/image/portafolio/micaja.webp',
  },
  {
    id: 7, cat: 'mobile',
    title: 'capital Transport',
    tagline: 'Gestión de Flotilla a la Medida',
    desc: 'Aplicación móvil desarrollada a la medida para la gestión integral de flotillas vehiculares. Rastreo en tiempo real, control de documentos, estados de unidades y comunicación directa con operadores.',
    tech: ['React Native', 'Node.js', 'Firebase', 'Google Maps API'],
    gradient: 'linear-gradient(145deg, #0c1a3d 0%, #1d4ed8 45%, #0ea5e9 100%)',
    image: '/assets/image/portafolio/capital transpor.webp',
  },
  {
    id: 8, cat: 'mobile',
    title: 'SpendWise',
    tagline: 'Control de Gastos Personales',
    desc: 'Aplicación en fase beta para el control detallado de gastos personales. Categoriza egresos, establece presupuestos, visualiza tendencias y recibe alertas cuando se acerca al límite mensual.',
    tech: ['React Native', 'Expo', 'SQLite', 'Chart.js'],
    gradient: 'linear-gradient(145deg, #0e2a5c 0%, #2563eb 45%, #06b6d4 100%)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 9, cat: 'webapp',
    title: 'Coronado Gym',
    tagline: 'Gestión Completa de Gimnasio',
    desc: 'Plataforma web a la medida para la gestión completa de un gimnasio. Administración de usuarios, asignación de rutinas personalizadas, seguimiento de progreso y control de membresías.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    gradient: 'linear-gradient(145deg, #0a2e1a 0%, #15803d 45%, #0d9488 100%)',
    image: '/assets/image/portafolio/coronado-gym.webp',
  },
  
  {
    id: 11, cat: 'webapp',
    title: 'Generador de Gafetes',
    tagline: 'Gafetes Gubernamentales en Segundos',
    desc: 'Aplicación web para la elaboración de gafetes gubernamentales. Reduce drásticamente el tiempo de producción de credenciales que antes se creaban a mano, con plantillas, base de datos de empleados y generación de PDF automatizada.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'PDF-lib', 'QR Generator'],
    gradient: 'linear-gradient(145deg, #1c1917 0%, #064e3b 45%, #0f766e 100%)',
    image: '/assets/image/portafolio/generador-gafetes.webp',
  },
  {
    id: 12, cat: 'software',
    title: 'SafePosture',
    tagline: 'Seguridad Ergonómica Industrial',
    desc: 'Sistema de visión artificial para monitoreo ergonómico en áreas de carga y manufactura en el sur de Chihuahua. Detecta posturas riesgosas en tiempo real, genera alertas preventivas y reduce accidentes laborales.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'React'],
    gradient: 'linear-gradient(145deg, #1e0a3c 0%, #6d28d9 45%, #4338ca 100%)',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 13, cat: 'software',
    title: 'El mezquite control',
    tagline: 'Gestión Inteligente de Rancho',
    desc: 'Plataforma web para el control integral de un rancho ganadero. Centraliza registro de animales, seguimiento de salud, alimentación y métricas productivas para aumentar la rentabilidad del rancho.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
    gradient: 'linear-gradient(145deg, #0f172a 0%, #5b21b6 45%, #4f46e5 100%)',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 14, cat: 'software',
    title: 'velt',
    tagline: 'Anti-Somnolencia para Camiones',
    desc: 'Software de visión por computadora para flotilla de camiones. Monitorea al conductor en tiempo real y emite alertas sonoras y visuales ante señales de fatiga o microsueños al volante.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'WebSockets'],
    gradient: 'linear-gradient(145deg, #1a0533 0%, #7c3aed 45%, #6d28d9 100%)',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 15, cat: 'software',
    title: 'EduAI',
    tagline: 'Machine Learning para Escuelas',
    desc: 'Suite de herramientas didácticas con Machine Learning para escuelas públicas. Adapta el contenido a las necesidades individuales de cada alumno y apoya a docentes con análisis de rendimiento.',
    tech: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL'],
    gradient: 'linear-gradient(145deg, #09090b 0%, #5b21b6 45%, #4338ca 100%)',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 16, cat: 'software',
    title: 'GeckCRM',
    tagline: 'CRM para Negocios Locales',
    desc: 'Sistema de gestión de relaciones con clientes de Geck Codex. Pipeline de ventas, seguimiento de actividades, gestión de clientes y reportes personalizados para llevar el control total del negocio.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    gradient: 'linear-gradient(145deg, #170d2e 0%, #7c3aed 45%, #2563eb 100%)',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80&auto=format&fit=crop',
  },
];

/* ─── DETAIL OVERLAY ── (igual que antes, sin cambios) ─────────────── */
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

function Detail({ project, onClose }) {
  const meta = CAT_META[project.cat];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

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
      <div
        className="gc-detail__bg"
        style={project.image
          ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center top' }
          : { background: project.gradient }
        }
      />
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
            <span className="gc-bento__label">Descripción</span>
            <p className="gc-bento__body">{project.desc}</p>
          </div>
          <div className="gc-bento__cell gc-bento__cell--tech">
            <span className="gc-bento__label">Stack técnico</span>
            <div className="gc-bento__chips">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="gc-bento__chip"
                  style={{ color: meta.accent, borderColor: meta.accent + '55', background: meta.accent + '14' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="gc-detail__cta"
          >
            Ver proyecto en vivo
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ) : (
          <a href="/contacto" className="gc-detail__cta">
            Hablemos de tu proyecto
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 10H16M16 10L10 4M16 10L10 16" />
            </svg>
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── CARD ──────────────────────────────────────────────────────────── */
function Card({ project, index, onOpen }) {
  const meta = CAT_META[project.cat];
  return (
    <motion.article
      className="gc-card"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -48px 0px' }}
      transition={{
        duration: 0.58,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 2) * 0.07,
      }}
      onClick={() => onOpen(project)}
    >
      <div
        className="gc-card__frame"
        style={project.image ? undefined : { background: project.gradient }}
      >
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="gc-card__img"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        )}
        <div className="gc-card__veil" />

        <div className="gc-card__top">
          <span
            className="gc-card__tag"
            style={{ color: meta.accent, background: meta.accent + '1a', borderColor: meta.accent + '50' }}
          >
            {meta.label}
          </span>
          {project.link && <span className="gc-card__live" aria-hidden="true" />}
        </div>

        <div className="gc-card__info">
          <h3 className="gc-card__name">{project.title}</h3>
          <p className="gc-card__sub">{project.tagline}</p>
          <span className="gc-card__cta" aria-hidden="true">
            Ver más
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── MAIN ──────────────────────────────────────────────────────────── */
export default function PortfolioSection() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === filter);

  const onFilter = useCallback((id) => {
    setFilter(id);
    setSelected(null);
  }, []);

  return (
    <>
      <section className="gc-section">

        {/* ── FONDO STICKY — se queda fijo mientras el contenido scrollea ── */}
        <div className="gc-bg" aria-hidden="true">
          <div className="gc-bg__orb gc-bg__orb--a" />
          <div className="gc-bg__orb gc-bg__orb--b" />
        </div>

        {/* ── CONTENIDO — scrollea sobre el fondo ── */}
        <div className="gc-content">
          <div className="gc-wrap">

            <header className="gc-header">
              <span className="gc-pretitle">Nuestro Portafolio</span>
              <h1 className="gc-h1">Proyectos que Hablan<br />por Nosotros</h1>
              <p className="gc-lead">Ideas convertidas en productos digitales reales.</p>
            </header>

            {/* Filtros sticky — se pegan debajo del navbar al scrollear */}
            <div className="gc-filters-bar">
              <nav className="gc-filters" role="tablist" aria-label="Filtros de portafolio">
                {FILTERS.map(f => (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={filter === f.id}
                    className={`gc-filter${filter === f.id ? ' is-active' : ''}`}
                    onClick={() => onFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Grid — cross-fade al cambiar filtro, entrance por scroll */}
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                className="gc-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.22 } }}
                exit={{ opacity: 0, transition: { duration: 0.14 } }}
              >
                {list.map((p, i) => (
                  <Card key={p.id} project={p} index={i} onOpen={setSelected} />
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <Detail key={selected.id} project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      <style>{`
        /* ── VARS ─────────────────────────────────────────────────────── */
        :root {
          --gc-bg:   #12110F;
          --gc-gold: #D4AF37;
          --gc-gl:   #F4E4BC;
          --gc-gd:   #584A1C;
          --gc-gb:   rgba(88,74,28,0.3);
          --expo:    cubic-bezier(0.22,1,0.36,1);
        }

        /* ── SECTION ─────────────────────────────────────────────────── */
        .gc-section {
          position: relative;
          background: var(--gc-bg);
          color: #fff;
        }

        /* ── STICKY BACKGROUND ───────────────────────────────────────── */
        /*
         * Truco: margin-bottom: -100vh cancela la altura del sticky en el
         * flujo, así el contenido empieza en la misma posición visual.
         * El fondo se queda pegado mientras el contenido scrollea encima.
         */
        .gc-bg {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          margin-bottom: -100vh;
        }

        /* Orbs — gradientes CSS puros, cero costo en scroll */
        .gc-bg__orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .gc-bg__orb--a {
          width: 80vw;
          height: 60vw;
          background: radial-gradient(ellipse at center, rgba(212,175,55,0.055) 0%, transparent 60%);
          top: -15%;
          left: 50%;
          transform: translateX(-50%);
        }
        .gc-bg__orb--b {
          width: 55vw;
          height: 55vw;
          background: radial-gradient(circle at center, rgba(212,175,55,0.03) 0%, transparent 65%);
          bottom: 5%;
          right: -15%;
        }

        /* ── CONTENT LAYER ───────────────────────────────────────────── */
        .gc-content {
          position: relative;
          z-index: 1;
          padding: 6rem 2rem 8rem;
        }
        .gc-wrap {
          max-width: 1040px;
          margin: 0 auto;
        }

        /* ── HEADER ──────────────────────────────────────────────────── */
        .gc-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .gc-pretitle {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gc-gold);
          padding: 0.35rem 1.2rem;
          border: 1px solid var(--gc-gb);
          border-radius: 100px;
          margin-bottom: 1.5rem;
          background: rgba(88,74,28,0.08);
        }
        .gc-h1 {
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 900;
          line-height: 1.06;
          background: linear-gradient(135deg, var(--gc-gl) 0%, var(--gc-gold) 55%, var(--gc-gd) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 1rem;
        }
        .gc-lead {
          font-size: 1rem;
          color: rgba(244,228,188,0.42);
          margin: 0;
        }

        /* ── FILTROS STICKY ──────────────────────────────────────────── */
        /*
         * Se pegan justo debajo del navbar (72px).
         * Sin backdrop-filter: la opacidad sólida es suficiente y
         * evita capas de compositing que traban el scroll en mobile.
         */
        .gc-filters-bar {
          position: sticky;
          top: 72px;
          z-index: 20;
          padding: 0.8rem 0;
          margin-bottom: 2.4rem;
          background: linear-gradient(
            to bottom,
            rgba(18,17,15,0.98) 0%,
            rgba(18,17,15,0.92) 70%,
            rgba(18,17,15,0) 100%
          );
        }
        .gc-filters {
          display: flex;
          gap: 0.45rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .gc-filter {
          padding: 0.4rem 1.1rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(244,228,188,0.36);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
          white-space: nowrap;
        }
        .gc-filter:hover {
          border-color: var(--gc-gb);
          color: var(--gc-gl);
          background: rgba(88,74,28,0.1);
        }
        .gc-filter.is-active {
          border-color: var(--gc-gd);
          color: var(--gc-gold);
          background: rgba(88,74,28,0.16);
          box-shadow: 0 0 0 1px var(--gc-gb);
        }

        /* ── GRID ────────────────────────────────────────────────────── */
        .gc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        /* ── CARD ────────────────────────────────────────────────────── */
        .gc-card {
          cursor: pointer;
        }
        .gc-card__frame {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.5);
          /* Solo transform y opacity — GPU composited, sin layout */
          transition:
            border-color .3s ease,
            box-shadow    .3s ease,
            transform     .36s var(--expo);
          will-change: transform;
        }
        .gc-card__frame:hover {
          border-color: rgba(212,175,55,0.5);
          box-shadow:
            0 24px 60px rgba(0,0,0,0.65),
            0 0 0 1px rgba(212,175,55,0.16);
          transform: translateY(-6px) scale(1.01);
        }
        .gc-card__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          z-index: 0;
          display: block;
        }
        .gc-card__veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0)    0%,
            rgba(0,0,0,0.06) 40%,
            rgba(0,0,0,0.80) 100%
          );
          z-index: 1;
        }
        .gc-card__top {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }
        .gc-card__tag {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.68rem;
          border-radius: 100px;
          border: 1px solid;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          /* backdrop-filter solo en badges pequeños — bajo costo */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .gc-card__live {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.6);
          animation: gc-pulse 2.2s ease infinite;
          flex-shrink: 0;
        }
        @keyframes gc-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .gc-card__info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem 1.3rem 1.25rem;
          z-index: 2;
        }
        .gc-card__name {
          font-size: clamp(0.95rem, 2vw, 1.25rem);
          font-weight: 800;
          color: var(--gc-gl);
          margin: 0 0 0.25rem;
          line-height: 1.15;
          transition: transform .28s var(--expo);
        }
        .gc-card__frame:hover .gc-card__name {
          transform: translateY(-2px);
        }
        .gc-card__sub {
          font-size: 0.66rem;
          color: rgba(244,228,188,0.42);
          margin: 0 0 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .gc-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.38rem;
          padding: 0.42rem 0.95rem;
          border-radius: 100px;
          border: 1px solid rgba(212,175,55,0.26);
          background: rgba(212,175,55,0.07);
          color: var(--gc-gold);
          font-size: 0.72rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity .24s ease, transform .24s var(--expo);
          pointer-events: none;
        }
        .gc-card__frame:hover .gc-card__cta {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── DETAIL OVERLAY ──────────────────────────────────────────── */
        .gc-detail {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow-y: auto;
        }
        .gc-detail__bg {
          position: fixed;
          inset: -5%;
          width: 110%;
          height: 110%;
          filter: blur(18px) brightness(0.35) saturate(1.2);
          transform: scale(1.05);
          will-change: filter;
        }
        .gc-detail__scrim {
          position: fixed;
          inset: 0;
          background: rgba(4,3,1,0.55);
        }
        .gc-detail__x {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: rgba(255,255,255,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background .18s, color .18s;
        }
        .gc-detail__x:hover {
          background: rgba(0,0,0,0.65);
          color: #fff;
        }
        .gc-detail__wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 760px;
        }
        .gc-detail__head {
          text-align: center;
          margin-bottom: 1.6rem;
        }
        .gc-detail__badge {
          display: inline-flex;
          align-items: center;
          padding: 0.24rem 0.88rem;
          border-radius: 100px;
          border: 1px solid;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .gc-detail__title {
          font-size: clamp(2.2rem, 6vw, 3.4rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 0.5rem;
          text-shadow: 0 2px 24px rgba(0,0,0,0.6);
          line-height: 1.05;
        }
        .gc-detail__tagline {
          font-size: 0.76rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.13em;
          margin: 0;
        }
        .gc-bento {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }
        .gc-bento__cell {
          background: rgba(0,0,0,0.36);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.3rem 1.35rem;
        }
        .gc-bento__label {
          display: block;
          font-size: 0.58rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.65rem;
        }
        .gc-bento__body {
          font-size: 0.86rem;
          line-height: 1.74;
          color: rgba(255,255,255,0.82);
          margin: 0;
        }
        .gc-bento__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.36rem;
        }
        .gc-bento__chip {
          padding: 0.24rem 0.65rem;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.66rem;
          font-weight: 600;
        }
        .gc-detail__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.52rem;
          width: 100%;
          padding: 1rem 2rem;
          border-radius: 100px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(212,175,55,0.38);
          color: var(--gc-gold);
          font-weight: 800;
          font-size: 0.88rem;
          text-decoration: none;
          transition: background .2s, border-color .2s, box-shadow .2s, transform .2s var(--expo);
          box-shadow: 0 4px 20px rgba(212,175,55,0.08);
        }
        .gc-detail__cta:hover {
          background: rgba(212,175,55,0.13);
          border-color: rgba(212,175,55,0.65);
          box-shadow: 0 8px 30px rgba(212,175,55,0.22);
          transform: scale(1.014);
        }

        /* ── RESPONSIVE ──────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .gc-grid { grid-template-columns: 1fr; }
          .gc-card__frame { aspect-ratio: 16 / 9; }
        }
        @media (max-width: 768px) {
          .gc-content { padding: 4rem 1rem 5rem; }
          .gc-filters-bar { top: 60px; }
          .gc-filters { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 0.2rem; scrollbar-width: none; }
          .gc-filters::-webkit-scrollbar { display: none; }
          .gc-card__cta { opacity: 1; transform: none; }
          .gc-bento { grid-template-columns: 1fr; }
          .gc-detail { padding: 0.75rem; align-items: flex-end; }
          .gc-detail__title { font-size: 1.9rem; }
          .gc-detail__wrap { max-width: 100%; }
        }
        @media (max-width: 480px) {
          .gc-card__frame { aspect-ratio: 4 / 3; }
          .gc-card__info { padding: 0.9rem 0.85rem 0.85rem; }
          .gc-card__name { font-size: 0.92rem; }
          .gc-card__sub { display: none; }
        }

        /* ── REDUCED MOTION ──────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .gc-card__frame,
          .gc-card__name,
          .gc-card__cta,
          .gc-detail,
          .gc-detail__wrap,
          .gc-detail__cta {
            transition: none !important;
            animation: none !important;
          }
          .gc-card__frame:hover { transform: none !important; }
          .gc-card__cta { opacity: 1 !important; transform: none !important; }
          .gc-card__live { animation: none !important; opacity: 1; }
        }
      `}</style>
    </>
  );
}
