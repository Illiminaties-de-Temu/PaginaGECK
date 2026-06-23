import { useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const STATS_VALUES = [
  { value: 20,  suffix: '+' },
  { value: 5,   suffix: '' },
  { value: 48,  suffix: ' hr' },
  { value: 100, suffix: '%' },
];

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function StatsSection() {
  const { t } = useLanguage();
  const STATS = STATS_VALUES.map((s, i) => ({ ...s, label: t.stats.items[i].label }));
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const numbersRef  = useRef([]);
  const dividerRef  = useRef(null);
  const animatedRef = useRef(false);
  const rafRef      = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const rect     = section.getBoundingClientRect();
        const vh       = window.innerHeight;
        const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));

        // Header fade
        if (headerRef.current) {
          const p = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
          headerRef.current.style.opacity   = p;
          headerRef.current.style.transform = `translateY(${(1 - p) * 20}px)`;
        }

        // Divisor
        if (dividerRef.current) {
          const p = Math.max(0, Math.min(1, (progress - 0.1) / 0.3));
          dividerRef.current.style.transform = `scaleX(${p})`;
          dividerRef.current.style.opacity   = p;
        }

        // Count-up — solo una vez
        if (progress > 0.2 && !animatedRef.current) {
          animatedRef.current = true;
          const start    = performance.now();
          const duration = 1800;

          const tick = (now) => {
            const elapsed = Math.min(1, (now - start) / duration);
            const eased   = easeOut(elapsed);

            numbersRef.current.forEach((el, i) => {
              if (!el) return;
              const stat = STATS[i];
              el.textContent = Math.round(eased * stat.value) + stat.suffix;
            });

            if (elapsed < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }

        // Numbers fade-in escalonado
        numbersRef.current.forEach((el, i) => {
          if (!el) return;
          const parent = el.closest('.st-item');
          if (!parent) return;
          const delay = i * 0.07;
          const p = Math.max(0, Math.min(1, (progress - 0.15 - delay) / 0.3));
          parent.style.opacity   = p;
          parent.style.transform = `translateY(${(1 - p) * 20}px)`;
        });

        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="st-section">

        <div ref={headerRef} className="st-header">
          <span className="st-header__tag">{t.stats.tag}</span>
          <div ref={dividerRef} className="st-header__line" />
        </div>

        <div className="st-grid">
          {STATS.map((stat, i) => (

            <div key={i} className="st-item">
              <span
                ref={el => numbersRef.current[i] = el}
                className="st-item__number"
              >
                0{stat.suffix}
              </span>
              <span className="st-item__label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="st-cta">
          <a href="/contacto" className="st-cta__link">
            {t.stats.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

      </section>

      <style>{`
        .st-section {
          background: var(--background);
          padding: 5rem 2rem;
          border-top: 1px solid var(--border);
        }

        /* ── Header ── */
        .st-header {
          text-align: center;
          margin-bottom: 3.5rem;
          opacity: 0;
          will-change: opacity, transform;
        }

        .st-header__tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        .st-header__line {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          margin: 0 auto;
          transform: scaleX(0);
          transform-origin: center;
          will-change: transform, opacity;
        }

        /* ── Grid ── */
        .st-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── Item ── */
        .st-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem 1rem;
          opacity: 0;
          will-change: opacity, transform;
          border-right: 1px solid rgba(195, 173, 133, 0.1);
        }

        .st-item:last-child {
          border-right: none;
        }

        .st-item__number {
          font-size: clamp(2.5rem, 5vw, 3.75rem);
          font-weight: 900;
          line-height: 1;
          color: var(--accent-text);
          letter-spacing: -0.02em;
        }

        .st-item__label {
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          text-align: center;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .st-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .st-item:nth-child(2) {
            border-right: none;
          }

          .st-item:nth-child(1),
          .st-item:nth-child(2) {
            border-bottom: 1px solid rgba(195, 173, 133, 0.1);
          }
        }

        /* ── CTA ── */
        .st-cta {
          text-align: center;
          margin-top: 3rem;
        }

        .st-cta__link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--accent-text);
          text-decoration: none;
          border-bottom: 1px solid var(--accent);
          padding-bottom: 2px;
          transition: border-color 0.2s ease, gap 0.2s ease;
        }

        .st-cta__link:hover {
          border-color: var(--accent);
          gap: 0.85rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .st-header,
          .st-item,
          .st-header__line {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
