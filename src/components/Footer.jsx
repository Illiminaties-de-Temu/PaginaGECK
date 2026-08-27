import { useState, useMemo, useEffect, useRef } from "react";
import { Github, Instagram, Facebook, ArrowUp } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { localizedPath } from '../i18n/routes';

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

export default function GeckFooter({ lang }) {
  const { t } = useLanguage(lang);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [atBottom, setAtBottom] = useState(false);
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Mostrar el footer cuando entra en vista. Usamos IntersectionObserver en
  // lugar de calcular scrollHeight: en móvil las barras dinámicas del navegador
  // cambian innerHeight y el cálculo manual a veces no se cumplía → el footer
  // nunca aparecía.
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const reveal = () => setAtBottom(true);

    // El footer está SIEMPRE al fondo de la página: cualquier asomo significa
    // que el usuario ya llegó. Por eso revelamos en cuanto intersecta (sin
    // umbral): el footer puede ser más alto que el viewport y exigir 0.85 (o
    // incluso 0.25) hacía que en la home —altísima— nunca se cumpliera.
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) reveal(); },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);

    // Respaldo 1: al tocar el fondo real del documento.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) reveal();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Respaldo 2: si al montar el footer ya está (parcialmente) en pantalla
    // —con client:visible se hidrata justo al entrar al viewport, así que esto
    // dispara el reveal de inmediato—, revélalo.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) reveal();

    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { Icon: Github,    name: 'github',    label: 'GitHub',    url: 'https://github.com/Geck-Codex' },
    { Icon: Instagram, name: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/geckcodex?igsh=MTV5YWY5Nnh4OWQ2Mw==' },
    { Icon: Facebook,  name: 'facebook',  label: 'Facebook',  url: 'https://www.facebook.com/share/1Dt3nBrVgm/' },
    // TikTok retirado: apuntaba a '#'. Un perfil enlazado a ningún lado resta
    // confianza y no suma al sameAs del schema. Restaurar cuando exista la URL.
  ];

  return (
    <footer className="geck-footer" ref={footerRef}>
      <div className={`footer-card ${atBottom ? 'show' : ''}`}>
      <div className="footer-inner">

        {/* ══════════════════════════════════════════════════════════
            NAVEGACIÓN + NAP
            Los enlaces internos del footer reparten autoridad hacia las
            páginas comerciales, y el bloque de contacto repite el NAP
            (nombre, dirección, teléfono) exactamente igual que el JSON-LD:
            esa coincidencia literal es lo que consolida la entidad en la
            búsqueda local y en los motores con IA.
        ══════════════════════════════════════════════════════════ */}
        <div className="footer-nav">
          <div className="footer-col footer-col--brand">
            <p className="footer-brand">Geck Codex</p>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>

          <nav className="footer-col" aria-label={t.footer.navTitle}>
            <p className="footer-col__title">{t.footer.navTitle}</p>
            <ul className="footer-list">
              <li><a href={localizedPath("home", lang)}>{t.nav.home}</a></li>
              <li><a href={localizedPath("services", lang)}>{t.nav.services}</a></li>
              <li><a href={localizedPath("portfolio", lang)}>{t.nav.portfolio}</a></li>
              <li><a href={localizedPath("about", lang)}>{t.nav.about}</a></li>
              <li><a href={localizedPath("contact", lang)}>{t.nav.contact}</a></li>
            </ul>
          </nav>


          <div className="footer-col">
            <p className="footer-col__title">{t.footer.contactTitle}</p>
            <ul className="footer-list">
              <li>
                <a href="https://wa.me/526271745436" target="_blank" rel="noopener noreferrer">
                  +52 627 174 5436
                </a>
              </li>
              <li><a href="mailto:ventas@geckcodex.com">ventas@geckcodex.com</a></li>
              <li>
                <address className="footer-address">
                  Hidalgo del Parral, Chihuahua, México
                </address>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-col__title">{t.footer.legalTitle}</p>
            <ul className="footer-list">
              <li><a href="/privacidad/">{t.footer.privacy}</a></li>
              <li><a href="/terminos/">{t.footer.terms}</a></li>
            </ul>
          </div>
        </div>

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

        /* ── Navegación + NAP ── */
        .footer-nav {
          width: 100%;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1.3fr 1fr;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--border);
          text-align: left;
        }

        .footer-brand {
          font-family: var(--font-display, inherit);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text);
          margin: 0 0 0.6rem;
        }

        .footer-tagline {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin: 0;
          max-width: 32ch;
        }

        .footer-col__title {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 700;
          color: var(--accent-text);
          margin: 0 0 1rem;
        }

        .footer-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-list a,
        .footer-address {
          font-size: 0.88rem;
          line-height: 1.5;
          color: var(--text-muted);
          font-style: normal;
          transition: color 0.3s ease;
        }

        .footer-list a:hover { color: var(--accent-text); }

        @media (max-width: 860px) {
          .footer-nav {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem 1.5rem;
          }
          .footer-col--brand { grid-column: 1 / -1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-list a { transition: none; }
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
