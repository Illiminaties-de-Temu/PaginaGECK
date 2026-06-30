import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionTemplate, useReducedMotion, cubicBezier } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const SERVICE_MEDIA = [
  { id: 'ia',     link: '/servicios#ia',     videoDesktop: '/assets/video/ia.mp4',  videoMobile: '/assets/video/ia-cel.mp4',    poster: '/assets/image/ia-poster.webp' },
  { id: 'web',    link: '/servicios#web',    videoDesktop: '/assets/video/web.mp4', videoMobile: '/assets/video/web-movil.mp4', poster: '/assets/image/web-poster.webp' },
  { id: 'mobile', link: '/servicios#mobile', videoDesktop: '/assets/video/cel.mp4', videoMobile: '/assets/video/cel.mp4',       poster: '/assets/image/cel-poster.webp' },
];

/* Offset de empalme entre tarjetas, en vh (mismo valor en CSS: ver --peek) */
const PEEK = 5.5;

/* Curva de salida suave para la entrada de cada tarjeta */
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

/* ── Contenido interno de una tarjeta (igual para ambas variantes) ── */
function CardInner({ s, i, total, isMobile }) {
  return (
    <>
      <span className="stk__num">0{i + 1} / 0{total}</span>
      <div className="stk__text">
        <span className="stk__tag">{s.tag}</span>
        <h3 className="stk__title">{s.title}</h3>
        <p className="stk__desc">{s.description}</p>
        <a href={s.link} className="stk__btn">
          <span>{s.buttonText}</span>
          <span className="stk__arrow">→</span>
        </a>
      </div>
      <div className="stk__media">
        <video
          key={isMobile ? 'm' : 'd'}
          autoPlay loop muted playsInline preload="metadata"
          poster={s.poster}
          className="stk__video"
        >
          <source src={isMobile ? s.videoMobile : s.videoDesktop} type="video/mp4" />
        </video>
        <div className="stk__media-veil" />
      </div>
    </>
  );
}

/* ── Tarjeta controlada por el scroll: entra desde abajo y se acomoda en su
   posición de reposo (i * PEEK). Todas usan la MISMA ventana y el MISMO offset,
   así el empalme 1-2 y 2-3 es idéntico. ── */
function StackCard({ s, i, total, progress, isMobile }) {
  /* ventana de entrada escalonada y uniforme para cada tarjeta */
  const start = i === 0 ? 0 : 0.08 + i * 0.26;
  const end = start + 0.22;

  const restVh = i * PEEK;                 // posición final (empalme)
  const yNum = useTransform(progress, [start, end], [118, restVh], { ease: EASE_OUT });
  const y = useMotionTemplate`${yNum}vh`;
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.95, 1], { ease: EASE_OUT });

  return (
    <motion.article
      className="stk__card"
      style={{ translateY: y, opacity: i === 0 ? 1 : opacity, scale, zIndex: i + 1 }}
    >
      <CardInner s={s} i={i} total={total} isMobile={isMobile} />
    </motion.article>
  );
}

export default function SpecialtiesShowcase() {
  const { t } = useLanguage();
  const SERVICES = SERVICE_MEDIA.map((m, i) => ({ ...m, ...t.specialties.services[i] }));
  const [isMobile, setIsMobile] = useState(false);
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /* Suaviza el progreso del scroll → el ascenso deja de sentirse "trabado" */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });

  /* ── Detectar mobile (debounced) ── */
  useEffect(() => {
    let timer;
    const check = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsMobile(window.innerWidth <= 767), 150);
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => { window.removeEventListener('resize', check); clearTimeout(timer); };
  }, []);

  /* ── Pausa los videos cuando la sección no está en pantalla ──
     3 videos decodificando a la vez es caro (sobre todo en móvil). Solo
     reproducen mientras la sección es visible. ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        el.querySelectorAll('video').forEach((v) => {
          if (e.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); }
          else v.pause();
        });
      },
      { rootMargin: '150px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ── Variante estática (reduced-motion): lista simple, sin empalme ── */
  if (reduce) {
    return (
      <>
        <section className="stk stk--static">
          <header className="stk__head">
            <span className="stk__label">{t.specialties.sectionLabel}</span>
          </header>
          <div className="stk__static-list">
            {SERVICES.map((s, i) => (
              <article key={s.id} className="stk__card stk__card--static">
                <CardInner s={s} i={i} total={SERVICES.length} isMobile={isMobile} />
              </article>
            ))}
          </div>
        </section>
        <style>{styles}</style>
      </>
    );
  }

  return (
    <>
      <section ref={sectionRef} className="stk">
        <div className="stk__stage">
          <header className="stk__head">
            <span className="stk__label">{t.specialties.sectionLabel}</span>
          </header>
          <div className="stk__deck">
            {SERVICES.map((s, i) => (
              <StackCard
                key={s.id}
                s={s}
                i={i}
                total={SERVICES.length}
                progress={smoothProgress}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </section>
      <style>{styles}</style>
    </>
  );
}

const styles = `
  .stk {
    --peek: ${PEEK}vh;
    --card-h: clamp(440px, 64vh, 660px);
    background: var(--background);
    height: 320vh;             /* recorrido de scroll para ensamblar el mazo */
    position: relative;
  }

  /* Escenario fijo: se queda en pantalla mientras se arma el mazo */
  .stk__stage {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(1.2rem, 3vh, 2.4rem);
    padding: clamp(1.5rem, 4vh, 3rem) clamp(1.2rem, 4vw, 3rem);
    overflow: hidden;
  }

  .stk__head { text-align: center; }
  .stk__label {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--accent-text);
    padding: 0.4rem 1.2rem;
    border: 1px solid var(--border-strong);
    border-radius: 100px;
  }

  /* Contenedor del mazo: alto = tarjeta + el empalme de las otras dos */
  .stk__deck {
    position: relative;
    width: 100%;
    max-width: 1480px;
    height: calc(var(--card-h) + 2 * var(--peek));
  }

  /* ── TARJETA ── */
  .stk__card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--card-h);
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 -18px 50px rgba(0, 0, 0, 0.35);
    will-change: transform, opacity;
  }

  .stk__num {
    position: absolute;
    top: 1.5rem;
    right: 1.7rem;
    z-index: 4;
    font-family: 'Courier New', ui-monospace, monospace;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }

  .stk__text {
    padding: clamp(1.9rem, 4vw, 3.8rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .stk__tag {
    align-self: flex-start;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent-text);
    border: 1px solid var(--border-strong);
    padding: 0.34rem 0.95rem;
    border-radius: 999px;
    margin-bottom: 1.4rem;
  }
  .stk__title {
    font-size: clamp(1.9rem, 3.6vw, 3.3rem);
    font-weight: 900;
    line-height: 1.04;
    color: var(--text);
    margin: 0 0 1.2rem;
  }
  .stk__desc {
    font-size: clamp(1rem, 1.4vw, 1.3rem);
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0 0 2rem;
    max-width: 520px;
  }
  .stk__btn {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1.9rem;
    border-radius: 11px;
    border: 1.5px solid var(--accent);
    color: var(--accent-text);
    font-weight: 700;
    font-size: 0.92rem;
    text-decoration: none;
    transition: gap 0.25s ease, background 0.25s ease, transform 0.25s ease;
  }
  .stk__btn:hover {
    gap: 0.95rem;
    background: rgba(195, 173, 133, 0.1);
    transform: translateY(-2px);
  }
  .stk__arrow { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .stk__btn:hover .stk__arrow { transform: translateX(4px); }

  .stk__media { position: relative; overflow: hidden; }
  .stk__video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .stk__media-veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, var(--surface) 0%, rgba(0,0,0,0) 28%);
  }

  /* ── MOBILE ── */
  @media (max-width: 767px) {
    .stk { --card-h: clamp(500px, 74vh, 700px); }
    /* El video manda: ocupa más que el texto (antes era 44% video / resto texto). */
    .stk__card {
      grid-template-columns: 1fr;
      grid-template-rows: 58% 1fr;
    }
    .stk__media { order: -1; }
    /* Sin difuminado en móvil: el video se muestra limpio, sin veil. */
    .stk__media-veil { background: transparent; }
    .stk__text { padding: 1.4rem 1.5rem 1.8rem; justify-content: flex-start; }
    .stk__title { font-size: clamp(1.6rem, 7vw, 2.2rem); }
    .stk__num { top: 1rem; right: 1.2rem; }
  }

  /* ── Variante estática (reduced-motion) ── */
  .stk--static {
    height: auto;
    padding: clamp(3rem, 8vh, 7rem) clamp(1.2rem, 4vw, 3rem) clamp(6rem, 14vh, 11rem);
  }
  .stk--static .stk__head { margin: 0 auto 2.5rem; }
  .stk__static-list {
    max-width: 1480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: clamp(2rem, 5vh, 3.5rem);
  }
  .stk__card--static {
    position: relative;
    height: var(--card-h);
  }

  @media (prefers-reduced-motion: reduce) {
    .stk__btn, .stk__arrow { transition: none !important; }
  }
`;
