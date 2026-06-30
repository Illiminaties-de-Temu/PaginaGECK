import { useState, useMemo, useEffect } from "react";
import { Github, Instagram, Facebook, ArrowUp } from "lucide-react";

function TikTokIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.78a4.85 4.85 0 01-1-.09z"/>
    </svg>
  );
}

// --- DISPERSIÓN DE TEXTO (mismo patrón que el logo del Navbar) ---
function DisperseFooterText({ text, isHovered }) {
  const scatterMap = useMemo(() => {
    return text.split("").map(() => ({
      x: (Math.random() - 0.5) * 25,
      y: (Math.random() - 0.5) * 25,
      r: (Math.random() - 0.5) * 45,
    }));
  }, [text]);

  return (
    <span style={{ display: "inline-block" }}>
      {text.split("").map((letter, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: isHovered
              ? `translate(${scatterMap[index].x}px, ${scatterMap[index].y}px) rotate(${scatterMap[index].r}deg)`
              : "translate(0,0) rotate(0deg)",
            opacity: isHovered ? 0.5 : 1,
            color: isHovered ? "var(--accent-text)" : "inherit"
          }}
        >
          {letter === " " ? " " : letter}
        </span>
      ))}
    </span>
  );
}

export default function GeckFooter() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [atBottom, setAtBottom] = useState(false);
  const currentYear = new Date().getFullYear();

  // Mostrar el footer solo al llegar al fondo de la página
  useEffect(() => {
    const onScroll = () => {
      const reached = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      setAtBottom(reached);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { Icon: Github,    name: 'github',    label: 'GitHub',    url: '#' },
    { Icon: Instagram, name: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/geckcodex?igsh=MTV5YWY5Nnh4OWQ2Mw==' },
    { Icon: Facebook,  name: 'facebook',  label: 'Facebook',  url: 'https://www.facebook.com/share/1Dt3nBrVgm/' },
    { Icon: TikTokIcon, name: 'tiktok',   label: 'TikTok',    url: '#' },
  ];

  return (
    <footer className="geck-footer">
      <div className={`footer-card ${atBottom ? 'show' : ''}`}>
      <div className="footer-inner">

        {/* REDES SOCIALES — control segmentado navy (mismo estilo que el selector de idioma del nav) */}
        <div className="footer-social-group">
          {socialLinks.map(({ Icon, name, label, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onMouseEnter={() => setHoveredIcon(name)}
              onMouseLeave={() => setHoveredIcon(null)}
              className={`footer-social-btn ${hoveredIcon === name ? 'active' : ''}`}
            >
              <Icon size={24} />
              <span className={`footer-tooltip ${hoveredIcon === name ? 'show' : ''}`}>{label}</span>
            </a>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <div
            onMouseEnter={() => setHoveredIcon('copy')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{ cursor: 'default', fontWeight: 500, letterSpacing: '1px' }}
          >
            <DisperseFooterText
              text={`© ${currentYear} Geck Codex`}
              isHovered={hoveredIcon === 'copy'}
            />
          </div>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => setHoveredIcon('top')}
            onMouseLeave={() => setHoveredIcon(null)}
            className="footer-up-btn"
          >
            UP <ArrowUp size={18} style={{ animation: hoveredIcon === 'top' ? 'footerBounce 0.8s infinite' : 'none' }} />
          </button>
        </div>
      </div>
      </div>

      <style>{`
        :root { --navy-deep: #061327; }

        .geck-footer {
          position: relative;
          background: transparent;
          padding: 48px 2rem 40px;
          margin-top: auto;
        }

        /* Sin contenedor: los elementos flotan (como el nav).
           Oculto hasta llegar al fondo: aparece deslizándose desde arriba */
        .footer-card {
          max-width: 1280px;
          margin: 0 auto;
          background: transparent;
          opacity: 0;
          transform: translateY(-70px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .footer-card.show {
          opacity: 1;
          transform: translateY(0);
        }

        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center; gap: 40px;
        }

        /* ── Grupo de redes (track navy) ── */
        .footer-social-group {
          display: flex; gap: 0.9rem;
          padding: 0.7rem;
          border-radius: 999px;
          background: var(--navy-deep);
        }
        .footer-social-btn {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 58px; height: 58px;
          border-radius: 50%;
          color: var(--gold);
          background: transparent;
          border: none; text-decoration: none;
          transition: background 0.45s cubic-bezier(0.22,1,0.36,1), color 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease;
        }
        .footer-social-btn:hover, .footer-social-btn.active {
          background: var(--navy-light);
          color: var(--gold);
          transform: translateY(-5px) scale(1.06);
        }

        .footer-tooltip {
          position: absolute; bottom: 125%;
          padding: 7px 14px;
          background: var(--navy-light);
          color: var(--white-soft);
          font-size: 0.78rem; font-weight: 600;
          border-radius: 10px;
          white-space: nowrap; pointer-events: none;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .footer-tooltip.show { opacity: 1; transform: translateY(0); }

        /* ── Bottom bar ── */
        .footer-bottom {
          width: 100%;
          display: flex; justify-content: space-between; align-items: center;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .footer-up-btn {
          display: flex; align-items: center; gap: 0.7rem;
          padding: 0.85rem 1.6rem;
          border-radius: 999px;
          background: var(--navy-light);
          color: var(--gold);
          border: none; cursor: pointer;
          font-size: 0.9rem; font-weight: 700; letter-spacing: 0.05em;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .footer-up-btn:hover {
          transform: translateY(-3px);
        }

        @keyframes footerBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @media (max-width: 600px) {
          .footer-bottom { flex-direction: column; gap: 1.25rem; text-align: center; }
          .footer-social-btn { width: 50px; height: 50px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-social-btn, .footer-up-btn, .footer-tooltip, .footer-card { transition: none !important; }
          .footer-up-btn svg { animation: none !important; }
        }
      `}</style>
    </footer>
  );
}
