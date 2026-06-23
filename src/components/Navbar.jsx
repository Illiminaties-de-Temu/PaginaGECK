import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Menu, X, Briefcase, Info, BookOpen, Mail, Layers, ArrowUpRight, Sun, Moon } from "lucide-react";
import { translations as allTranslations } from "../i18n/translations";

const navTranslations = {
  en: allTranslations.en.nav,
  es: allTranslations.es.nav,
  pt: allTranslations.pt.nav,
};

const languageOptions = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

export default function GeckNavbar() {
  const [language, setLanguage] = useState('es');

  useLayoutEffect(() => {
    const stored = localStorage.getItem('geck-language') || 'es';
    if (stored !== 'es') setLanguage(stored);
  }, []);

  // ── Tema (light/dark). El valor inicial ya lo fijó el script no-flash
  //    del <head> sobre <html data-theme>; aquí solo lo leemos. ──
  const [theme, setTheme] = useState('dark');

  useLayoutEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('geck-theme', next);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const lastScrollYRef = useRef(0);

  const t = navTranslations[language];
  const isMenuShown = menuOpen && !menuClosing;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setAtTop(current < 10);
      if (current < 10) setNavVisible(true);
      else if (current > lastScrollYRef.current && current > 100) setNavVisible(false);
      else if (current < lastScrollYRef.current) setNavVisible(true);
      lastScrollYRef.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => { setMenuOpen(false); setMenuClosing(false); }, 380);
  };

  const toggleMenu = () => { if (menuOpen) closeMenu(); else setMenuOpen(true); };

  const handleLanguageChange = (code) => {
    setLanguage(code);
    localStorage.setItem('geck-language', code);
    window.dispatchEvent(new CustomEvent('geck-language-change', { detail: { lang: code } }));
  };

  const handleNavLinkClick = () => { if (menuOpen) closeMenu(); };

  const navLinks = [
    { key: "portfolio", icon: Briefcase, href: "/portafolio" },
    { key: "services", icon: Layers, href: "/servicios" },
    { key: "about", icon: Info, href: "/nosotros" },
    { key: "blog", icon: BookOpen, href: "/blog" },
  ];

  return (
    <>
      <style>{`
        :root { --navy-deep: #061327; }
        * { box-sizing: border-box; }

        /* ── Pills (Contacto / Menú) ── */
        /* ── Logo en texto: Geck Codex ── */
        .nav-logo-text {
          display: flex; align-items: baseline; gap: 0.5rem;
          font-family: var(--font-display);
          font-weight: 700; font-size: 2.4rem; line-height: 1;
          letter-spacing: -0.02em;
        }
        .nav-logo-geck { color: var(--accent-text); }
        .nav-logo-codex { color: var(--accent-text); }
        .nav-logo-link { transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
        .nav-logo-link:hover { transform: translateY(-2px); }

        .nav-pill {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.5rem 0.6rem 0.5rem 1.9rem;
          border-radius: 999px;
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          font-weight: 700; font-size: 1.5rem;
          text-decoration: none; cursor: pointer;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1), background 0.45s ease;
          white-space: nowrap;
        }

        .nav-pill-contact {
          color: var(--gold);
          background: var(--navy-dark);
          border: 1px solid var(--border);
        }
        .nav-pill-contact:hover {
          transform: translateY(-3px);
        }

        .nav-pill-menu {
          color: var(--on-accent);
          background: var(--accent);
          border: 1px solid var(--border);
        }
        .nav-pill-menu:hover {
          transform: translateY(-3px);
        }

        /* ── Círculo que encierra el icono de cada píldora ── */
        .nav-pill-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3.1rem;
          height: 3.1rem;
          border-radius: 50%;
          flex-shrink: 0;
        }
        /* Contacto (navy): círculo dorado tenue */
        .nav-pill-contact .nav-pill-icon {
          background: rgba(195, 173, 133, 0.14);
          border: 1px solid rgba(195, 173, 133, 0.4);
          color: var(--gold);
        }
        /* Menú (dorado): círculo navy con icono dorado */
        .nav-pill-menu .nav-pill-icon {
          background: var(--navy-dark);
          color: var(--accent);
        }

        /* ── Carrusel vertical del texto del botón Menú ── */
        .menu-toggle-text {
          display: inline-block; overflow: hidden;
          height: 1.25em; line-height: 1.25em;
        }
        .menu-toggle-track {
          display: flex; flex-direction: column;
          transition: transform 0.6s cubic-bezier(0.34, 1.4, 0.5, 1);
        }
        .menu-toggle-track > span {
          height: 1.25em; line-height: 1.25em;
          display: block; text-align: center;
        }
        .menu-toggle-track[data-open="true"] { transform: translateY(-50%); }

        /* ── Diálogo lateral del menú ── */
        .menu-overlay {
          position: fixed; inset: 0; z-index: 58;
          background: rgba(2,6,20,0.35);
          backdrop-filter: blur(2px);
          animation: overlayIn 0.5s ease forwards;
        }
        .menu-overlay.closing { animation: overlayOut 0.5s ease forwards; }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlayOut { from { opacity: 1; } to { opacity: 0; } }

        .menu-dialog {
          position: fixed;
          top: 120px; right: 2rem;
          width: min(490px, calc(100vw - 3rem));
          max-height: calc(100vh - 150px);
          overflow-y: auto;
          z-index: 59;
          padding: 2.25rem;
          border-radius: 36px;
          background: var(--navy-dark);
          border: none;
          transform-origin: top right;
          animation: dialogIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .menu-dialog.closing { animation: dialogOut 0.5s cubic-bezier(0.55, 0, 0.55, 0.2) forwards; }
        @keyframes dialogIn {
          0%   { opacity: 0; transform: translateX(calc(100% + 2rem)) scale(0.94, 1); }
          60%  { opacity: 1; transform: translateX(-10px) scale(1.035, 0.96); }
          80%  { transform: translateX(4px) scale(0.99, 1.02); }
          100% { opacity: 1; transform: translateX(0) scale(1, 1); }
        }
        @keyframes dialogOut {
          0%   { opacity: 1; transform: translateX(0) scale(1, 1); }
          100% { opacity: 0; transform: translateX(calc(100% + 2rem)) scale(0.94, 1); }
        }

        .menu-label {
          color: rgba(255,255,255,0.45);
          font-size: 1.05rem; letter-spacing: 0.18em; text-transform: uppercase;
          margin: 0 0 1.25rem 0.35rem; font-weight: 600;
        }

        .menu-link {
          display: flex; align-items: center; gap: 1.35rem;
          padding: 1.25rem 1.5rem; border-radius: 24px;
          color: var(--white-soft); text-decoration: none;
          font-size: 1.55rem; font-weight: 600;
          border: none;
          transition: background 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-link svg { color: var(--gold); flex-shrink: 0; transition: transform 0.4s ease; }
        .menu-link .menu-link-arrow { margin-left: auto; opacity: 0; transform: translateX(-8px); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .menu-link:hover {
          background: var(--navy-light);
          transform: translateX(6px);
        }
        .menu-link:hover .menu-link-arrow { opacity: 1; transform: translateX(0); }

        .menu-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 1.85rem 0; }

        /* ── Selector de idioma: control segmentado navy ── */
        .menu-lang-group {
          display: flex; gap: 0.6rem;
          padding: 0.5rem;
          border-radius: 24px;
          background: var(--navy-deep);
        }
        .menu-lang-btn {
          flex: 1;
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
          padding: 1.05rem 0.6rem; border-radius: 18px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6); cursor: pointer;
          font-size: 1.2rem; font-weight: 600; letter-spacing: 0.05em;
          transition: background 0.4s cubic-bezier(0.22, 1, 0.36, 1), color 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-lang-btn .menu-lang-flag { font-size: 2rem; line-height: 1; }
        .menu-lang-btn:hover { color: var(--white-soft); transform: translateY(-2px); }
        .menu-lang-btn.active {
          background: var(--navy-light);
          color: var(--gold);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .nav-logo-text { font-size: 1.85rem; }
          .nav-pill { padding: 0.4rem 0.5rem 0.4rem 1.5rem; font-size: 1.2rem; }
          .nav-pill-icon { width: 2.7rem; height: 2.7rem; }
        }
        @media (max-width: 480px) {
          .nav-row { padding: 0.8rem 1rem !important; }
          .nav-pill-contact .nav-pill-text { display: none; }
          .nav-pill-contact { padding: 0.4rem; }
          .menu-dialog { top: 104px; right: 1rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .menu-overlay, .menu-overlay.closing,
          .menu-dialog, .menu-dialog.closing { animation: none !important; }
          .nav-pill, .menu-link { transition: none !important; }
        }
      `}</style>

      {/* ── Barra transparente: solo secciones flotantes, sin contenedor de barra ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
          pointerEvents: "none",
          transform: navVisible ? "translateY(0)" : "translateY(-130%)",
          transition: "transform 0.4s ease",
        }}
      >
        <div
          className="nav-row"
          style={{
            padding: "1.4rem 2.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            maxWidth: "2200px", margin: "0 auto",
          }}
        >
          {/* Sección Geck Codex — sin contenedor, parte de la página */}
          <a
            href="/"
            aria-label="Geck Codex"
            className="nav-logo-link"
            style={{
              display: "flex", alignItems: "center", textDecoration: "none",
              pointerEvents: "auto",
            }}
          >
            <span className="nav-logo-text">
              <span className="nav-logo-geck">Geck</span>
              <span className="nav-logo-codex">Codex</span>
            </span>
          </a>

          {/* Secciones Contacto + Menú — con contenedor visible y bordes redondeados */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", pointerEvents: "auto" }}>
            <a href="/contacto" className="nav-pill nav-pill-contact">
              <span className="nav-pill-text">{t.contact}</span>
              <span className="nav-pill-icon"><Mail size={20} /></span>
            </a>

            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isMenuShown ? t.close : t.menu}
              aria-expanded={menuOpen}
              className="nav-pill nav-pill-menu"
            >
              <span className="menu-toggle-text">
                <span className="menu-toggle-track" data-open={isMenuShown}>
                  <span>{t.menu}</span>
                  <span>{t.close}</span>
                </span>
              </span>
              <span className="nav-pill-icon">{isMenuShown ? <X size={22} /> : <Menu size={22} />}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Diálogo del menú (lado izquierdo) ── */}
      {menuOpen && (
        <>
          <div className={`menu-overlay ${menuClosing ? "closing" : ""}`} onClick={closeMenu} />
          <div className={`menu-dialog ${menuClosing ? "closing" : ""}`} role="dialog" aria-label={t.menu}>
            <p className="menu-label">{t.menu}</p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {navLinks.map(({ key, icon: Icon, href }) => (
                <a key={key} href={href} onClick={handleNavLinkClick} className="menu-link">
                  <Icon size={28} />
                  <span>{t[key]}</span>
                  <ArrowUpRight size={22} className="menu-link-arrow" />
                </a>
              ))}
            </nav>

            <div className="menu-divider" />

            <p className="menu-label">{t.language}</p>
            <div className="menu-lang-group">
              {languageOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => handleLanguageChange(opt.code)}
                  className={`menu-lang-btn ${language === opt.code ? "active" : ""}`}
                  aria-label={opt.label}
                >
                  <span className="menu-lang-flag">{opt.flag}</span>
                  <span>{opt.code.toUpperCase()}</span>
                </button>
              ))}
            </div>

            <div className="menu-divider" />

            <p className="menu-label">{t.theme}</p>
            <div className="menu-lang-group">
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`menu-lang-btn ${theme === 'light' ? "active" : ""}`}
                aria-label={t.themeLight}
                aria-pressed={theme === 'light'}
              >
                <Sun size={26} />
                <span>{t.themeLight}</span>
              </button>
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`menu-lang-btn ${theme === 'dark' ? "active" : ""}`}
                aria-label={t.themeDark}
                aria-pressed={theme === 'dark'}
              >
                <Moon size={26} />
                <span>{t.themeDark}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
