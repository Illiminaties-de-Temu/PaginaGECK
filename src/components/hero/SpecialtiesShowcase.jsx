import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const SERVICE_MEDIA = [
  { id: 'ia',     link: '/servicios#ia',     videoDesktop: '/assets/video/ia.mp4',  videoMobile: '/assets/video/ia-cel.mp4',    poster: '/assets/image/ia-poster.webp' },
  { id: 'web',    link: '/servicios#web',    videoDesktop: '/assets/video/web.mp4', videoMobile: '/assets/video/web-movil.mp4', poster: '/assets/image/web-poster.webp' },
  { id: 'mobile', link: '/servicios#mobile', videoDesktop: '/assets/video/cel.mp4', videoMobile: '/assets/video/cel.mp4',       poster: '/assets/image/cel-poster.webp' },
];

export default function SpecialtiesShowcase() {
  const { t } = useLanguage();
  const SERVICES = SERVICE_MEDIA.map((m, i) => ({ ...m, ...t.specialties.services[i] }));
  const [isMobile, setIsMobile] = useState(false);
  const cardsRef = useRef([]);

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

  /* ── Achicar las tarjetas a medida que se apilan otras encima ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const cards = cardsRef.current;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card) continue;
        const next = cards[i + 1];
        if (!next) { card.style.transform = 'scale(1)'; card.style.opacity = '1'; continue; }
        const pinnedTop = parseFloat(getComputedStyle(card).top) || 0;
        const dist = next.getBoundingClientRect().top - pinnedTop;
        const h = card.offsetHeight || 1;
        const p = Math.max(0, Math.min(1, 1 - dist / h)); // 0 lejos · 1 cubierta
        card.style.transform = `scale(${(1 - p * 0.13).toFixed(4)})`;
        card.style.opacity = (1 - p * 0.2).toFixed(3);
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
  }, []);

  return (
    <>
      <section className="stk">
        <header className="stk__head">
          <span className="stk__label">{t.specialties.sectionLabel}</span>
        </header>

        {/* Lista de tarjetas que se apilan (sticky stack) */}
        <div className="stk__list">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="stk__card"
              style={{ top: `calc(var(--stk-top) + ${i} * var(--stk-step))`, zIndex: i + 1 }}
            >
              <span className="stk__num">0{i + 1} / 0{SERVICES.length}</span>

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
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={s.poster}
                  className="stk__video"
                >
                  <source src={isMobile ? s.videoMobile : s.videoDesktop} type="video/mp4" />
                </video>
                <div className="stk__media-veil" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .stk {
          --stk-top: clamp(88px, 13vh, 150px);
          --stk-step: 4rem;
          background: var(--background);
          padding: clamp(3rem, 8vh, 7rem) clamp(1.2rem, 4vw, 3rem) clamp(6rem, 14vh, 11rem);
        }

        .stk__head {
          max-width: 1200px;
          margin: 0 auto 2.5rem;
          text-align: center;
        }
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

        .stk__list {
          max-width: 1480px;
          margin: 0 auto;
        }

        /* ── TARJETA (se apila con sticky + se achica) ── */
        .stk__card {
          position: sticky;
          height: clamp(560px, 86vh, 880px);
          margin-bottom: clamp(3rem, 9vh, 7rem);
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          overflow: hidden;
          transform-origin: 50% 0;
          will-change: transform, opacity;
        }
        .stk__card:last-child { margin-bottom: 0; }

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
          font-size: clamp(2.1rem, 4vw, 3.6rem);
          font-weight: 900;
          line-height: 1.04;
          color: var(--text);
          margin: 0 0 1.3rem;
        }
        .stk__desc {
          font-size: clamp(1.05rem, 1.5vw, 1.35rem);
          color: var(--text-muted);
          line-height: 1.65;
          margin: 0 0 2.2rem;
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
          .stk {
            --stk-top: clamp(80px, 11vh, 110px);
            --stk-step: 2.2rem;
          }
          .stk__card {
            grid-template-columns: 1fr;
            grid-template-rows: 44% 1fr;
            height: clamp(560px, 86vh, 780px);
          }
          .stk__media { order: -1; }
          .stk__media-veil {
            background: linear-gradient(to bottom, rgba(0,0,0,0) 55%, var(--surface) 100%);
          }
          .stk__text { padding: 1.6rem 1.5rem 2rem; justify-content: flex-start; }
          .stk__title { font-size: clamp(1.6rem, 7vw, 2.2rem); }
          .stk__num { top: 1rem; right: 1.2rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .stk__btn, .stk__arrow { transition: none !important; }
        }
      `}</style>
    </>
  );
}
