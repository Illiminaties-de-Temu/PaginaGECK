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
    const root = document.documentElement;
    // Activa la transición de color global solo durante el cambio de tema.
    root.classList.add('theme-anim');
    setTheme(next);
    root.setAttribute('data-theme', next);
    localStorage.setItem('geck-theme', next);
    window.setTimeout(() => root.classList.remove('theme-anim'), 360);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [reveal, setReveal] = useState({ x: 0, y: 0, r: 0 });
  const [navVisible, setNavVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollYRef = useRef(0);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

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

  // Dispara el crecimiento del círculo en el frame siguiente al montaje
  useEffect(() => {
    if (!menuOpen) return;
    const id = requestAnimationFrame(() => setRevealOpen(true));
    return () => cancelAnimationFrame(id);
  }, [menuOpen]);

  const openMenu = () => {
    const rect = menuBtnRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const cy = rect ? rect.top + rect.height / 2 : 0;
    // Radio que alcanza la esquina más lejana (cubre todo el viewport)
    const r = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) * 1.05;
    setReveal({ x: cx, y: cy, r });
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setRevealOpen(false);
    setMenuClosing(true);
    setTimeout(() => { setMenuOpen(false); setMenuClosing(false); }, 650);
  };

  const toggleMenu = () => { if (menuOpen) closeMenu(); else openMenu(); };

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
    // En móvil el acceso a Contacto vive dentro del menú (no en la barra)
    ...(isMobile ? [{ key: "contact", icon: Mail, href: "/contacto" }] : []),
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

        .nav-actions { gap: 1.25rem; }

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

        /* ── Menú: reveal circular ── */
        .menu-reveal {
          position: fixed; inset: 0; z-index: 59;
          background: var(--navy-dark);
          display: flex; align-items: center; justify-content: center;
          clip-path: circle(0px at var(--cx) var(--cy));
          transition: clip-path 0.62s cubic-bezier(0.76, 0, 0.24, 1);
          overflow-y: auto;
        }
        .menu-reveal.is-open {
          clip-path: circle(var(--r) at var(--cx) var(--cy));
        }
        /* Halo dorado radial sutil centrado en el origen del círculo */
        .menu-reveal::before {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(circle at var(--cx) var(--cy),
            color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%);
          pointer-events: none;
        }

        .menu-reveal__inner {
          position: relative;
          width: min(820px, 90vw);
          padding: clamp(2rem, 6vh, 4rem) clamp(1.5rem, 5vw, 3rem);
        }

        /* ── Links grandes editoriales ── */
        .mr-links { display: flex; flex-direction: column; }
        .mr-link {
          display: flex; align-items: baseline; gap: clamp(1rem, 3vw, 2rem);
          padding: clamp(0.9rem, 2.2vh, 1.5rem) 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          color: var(--white-soft);
          opacity: 0; transform: translateY(26px);
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      color 0.3s ease, padding-left 0.3s ease;
        }
        .menu-reveal.is-open .mr-link {
          opacity: 1; transform: translateY(0);
          transition-delay: calc(0.22s + var(--i) * 0.07s);
        }
        .mr-link__num {
          font-family: var(--font-body);
          font-size: clamp(0.85rem, 1.4vw, 1rem); font-weight: 600;
          color: var(--accent); flex-shrink: 0; min-width: 2.4ch;
        }
        .mr-link__label {
          font-family: var(--font-display);
          font-size: clamp(2.1rem, 7vw, 4rem); font-weight: 700;
          line-height: 1; letter-spacing: -0.02em;
        }
        .mr-link__arrow {
          margin-left: auto; align-self: center;
          color: var(--accent);
          opacity: 0; transform: translate(-12px, 4px);
          transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mr-link:hover { color: var(--accent); padding-left: 1.25rem; }
        .mr-link:hover .mr-link__arrow { opacity: 1; transform: translate(0, 0); }

        /* ── Pie: idioma + tema ── */
        .mr-footer {
          display: flex; flex-wrap: wrap; gap: 2.5rem;
          margin-top: clamp(2rem, 5vh, 3.5rem);
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-reveal.is-open .mr-footer {
          opacity: 1; transform: translateY(0);
          transition-delay: calc(0.22s + 4 * 0.07s);
        }
        .mr-control { display: flex; flex-direction: column; gap: 0.85rem; }
        .mr-control__label {
          font-size: 0.78rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.45); font-weight: 600;
        }
        .mr-seg {
          display: inline-flex; gap: 0.3rem;
          padding: 0.35rem; border-radius: 999px;
          background: var(--navy-deep);
          border: 1px solid var(--border);
        }
        .mr-seg__btn {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 3rem; height: 2.6rem; padding: 0 1rem;
          border: none; border-radius: 999px;
          background: transparent; cursor: pointer;
          color: rgba(255,255,255,0.6);
          font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; letter-spacing: 0.05em;
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .mr-seg__btn:hover { color: var(--white-soft); transform: translateY(-1px); }
        .mr-seg__btn.active { background: var(--accent); color: var(--on-accent); }

        /* ── Responsive ── */
        /* En móvil/tablet Contacto pasa al menú → la barra deja solo logo + Menú */
        @media (max-width: 860px) {
          .nav-pill-contact { display: none; }
        }
        @media (max-width: 768px) {
          .nav-logo-text { font-size: 2.1rem; }
          .nav-pill { padding: 0.4rem 0.5rem 0.4rem 1.5rem; font-size: 1.2rem; }
          .nav-pill-icon { width: 2.7rem; height: 2.7rem; }
        }
        @media (max-width: 480px) {
          .nav-row { padding: 0.85rem 1.1rem !important; }
          .nav-logo-text { font-size: 2rem; }
          .mr-footer { gap: 1.5rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .menu-reveal { transition: none !important; }
          .menu-reveal .mr-link,
          .menu-reveal .mr-footer { transition: none !important; opacity: 1 !important; transform: none !important; }
          .nav-pill, .mr-link, .mr-seg__btn { transition: none !important; }
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
          <div className="nav-actions" style={{ display: "flex", alignItems: "center", pointerEvents: "auto" }}>
            <a href="/contacto" className="nav-pill nav-pill-contact">
              <span className="nav-pill-text">{t.contact}</span>
              <span className="nav-pill-icon"><Mail size={20} /></span>
            </a>

            <button
              ref={menuBtnRef}
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

      {/* ── Menú: reveal circular que crece desde el botón ── */}
      {menuOpen && (
        <div
          className={`menu-reveal ${revealOpen && !menuClosing ? "is-open" : ""}`}
          style={{ "--cx": `${reveal.x}px`, "--cy": `${reveal.y}px`, "--r": `${reveal.r}px` }}
          role="dialog"
          aria-modal="true"
          aria-label={t.menu}
        >
          <div className="menu-reveal__inner">
            <nav className="mr-links">
              {navLinks.map(({ key, href }, i) => (
                <a
                  key={key}
                  href={href}
                  onClick={handleNavLinkClick}
                  className="mr-link"
                  style={{ "--i": i }}
                >
                  <span className="mr-link__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mr-link__label">{t[key]}</span>
                  <ArrowUpRight className="mr-link__arrow" size={28} />
                </a>
              ))}
            </nav>

            <div className="mr-footer">
              <div className="mr-control">
                <span className="mr-control__label">{t.language}</span>
                <div className="mr-seg">
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => handleLanguageChange(opt.code)}
                      className={`mr-seg__btn ${language === opt.code ? "active" : ""}`}
                      aria-label={opt.label}
                    >
                      {opt.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mr-control">
                <span className="mr-control__label">{t.theme}</span>
                <div className="mr-seg">
                  <button
                    onClick={() => theme !== "light" && toggleTheme()}
                    className={`mr-seg__btn ${theme === "light" ? "active" : ""}`}
                    aria-label={t.themeLight}
                    aria-pressed={theme === "light"}
                  >
                    <Sun size={20} />
                  </button>
                  <button
                    onClick={() => theme !== "dark" && toggleTheme()}
                    className={`mr-seg__btn ${theme === "dark" ? "active" : ""}`}
                    aria-label={t.themeDark}
                    aria-pressed={theme === "dark"}
                  >
                    <Moon size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
