import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Menu, X, Briefcase, Info, BookOpen, Globe, Mail, Layers } from "lucide-react";
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

function DisperseText({ text, isHovered }) {
  const letters = text.split("");
  const offsetsRef = useRef(null);
  if (!offsetsRef.current) {
    offsetsRef.current = letters.map(() => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      r: (Math.random() - 0.5) * 45,
    }));
  }
  const offsets = offsetsRef.current;
  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            transform: isHovered
              ? `translate(${offsets[index].x}px, ${offsets[index].y}px) rotate(${offsets[index].r}deg) scale(0.8)`
              : "translate(0, 0) rotate(0deg) scale(1)",
            opacity: isHovered ? 0.3 : 1,
          }}
        >
          {letter === " " ? " " : letter}
        </span>
      ))}
    </span>
  );
}

function MagneticLink({ href, icon: Icon, text }) {
  const [hover, setHover] = useState(false);
  const [disperseHover, setDisperseHover] = useState(false);
  const linkRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    linkRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (linkRef.current) linkRef.current.style.transform = "translate(0, 0)";
    setHover(false);
    setTimeout(() => setDisperseHover(false), 100);
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setHover(true); setTimeout(() => setDisperseHover(true), 50); }}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        color: "var(--white-soft)", fontSize: "1.25rem",
        transition: "color 0.3s ease", padding: "0.5rem 0",
        textDecoration: "none", cursor: "pointer",
        willChange: "transform",
      }}
    >
      <Icon size={18} style={{ transition: "all 0.3s ease", color: hover ? "var(--gold)" : "inherit" }} />
      <DisperseText text={text} isHovered={disperseHover} />
    </a>
  );
}

function AnimatedLogo({ text }) {
  const [isHovered, setIsHovered] = useState(false);
  const [disperseActive, setDisperseActive] = useState(false);
  const letters = text.split("");
  const offsetsRef = useRef(null);
  if (!offsetsRef.current) {
    offsetsRef.current = letters.map(() => ({
      x: (Math.random() - 0.5) * 25,
      y: (Math.random() - 0.5) * 25,
      r: (Math.random() - 0.5) * 50,
    }));
  }
  const offsets = offsetsRef.current;

  return (
    <span
      onMouseEnter={() => { setIsHovered(true); setTimeout(() => setDisperseActive(true), 50); }}
      onMouseLeave={() => { setDisperseActive(false); setTimeout(() => setIsHovered(false), 100); }}
      style={{ display: "inline-block", position: "relative", cursor: "pointer" }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            transitionDelay: `${index * 0.03}s`,
            transform: disperseActive
              ? `translate(${offsets[index].x}px, ${offsets[index].y}px) rotate(${offsets[index].r}deg) scale(0.7)`
              : "translate(0, 0) rotate(0deg) scale(1)",
            opacity: disperseActive ? 0.4 : 1,
            background: "linear-gradient(135deg, var(--white), var(--gold))",
            backgroundClip: "text", WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
          }}
        >
          {letter === " " ? " " : letter}
        </span>
      ))}
    </span>
  );
}

function AnimatedWaves() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => { canvas.width = window.innerWidth; canvas.height = 70; };
    setCanvasSize();

    class Wave {
      constructor(y, amplitude, frequency, speed, color) {
        this.y = y; this.amplitude = amplitude; this.frequency = frequency;
        this.speed = speed; this.color = color; this.phase = Math.random() * Math.PI * 2;
      }
      draw(time) {
        ctx.beginPath(); ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = this.y + Math.sin((x * this.frequency) + (time * this.speed) + this.phase) * this.amplitude;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height); ctx.lineTo(0, canvas.height);
        ctx.fillStyle = this.color; ctx.fill();
      }
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width; this.y = canvas.height + 20;
        this.size = Math.random() * 2 + 1; this.speedY = Math.random() * 0.3 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2; this.opacity = Math.random() * 0.4 + 0.2;
      }
      update() { this.y -= this.speedY; this.x += this.speedX; if (this.y < -20) this.reset(); }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.shadowBlur = 10; ctx.shadowColor = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    }

    const waves = [
      new Wave(50, 8, 0.01, 0.0005, 'rgba(2, 6, 20, 0.3)'),
      new Wave(55, 6, 0.015, 0.0008, 'rgba(2, 6, 20, 0.25)'),
      new Wave(60, 5, 0.02, 0.001, 'rgba(2, 6, 20, 0.2)')
    ];
    const particles = Array.from({ length: 30 }, () => new Particle());
    let animationTime = 0; let animationId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waves.forEach(wave => wave.draw(animationTime));
      particles.forEach(p => { p.update(); p.draw(); });
      animationTime += 0.016;
      animationId = requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', setCanvasSize);
    return () => { window.removeEventListener('resize', setCanvasSize); if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none', zIndex: 1 }} />
  );
}

export default function GeckNavbar() {
  const [language, setLanguage] = useState('es');

  useLayoutEffect(() => {
    const stored = localStorage.getItem('geck-language') || 'es';
    if (stored !== 'es') setLanguage(stored);
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const langMenuRef = useRef(null);
  const navRef = useRef(null);

  const t = navTranslations[language];

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < 10) setNavVisible(true);
      else if (current > lastScrollYRef.current && current > 100) setNavVisible(false);
      else if (current < lastScrollYRef.current) setNavVisible(true);
      lastScrollYRef.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) setLangMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    localStorage.setItem('geck-language', code);
    window.dispatchEvent(new CustomEvent('geck-language-change', { detail: { lang: code } }));
    setLangMenuOpen(false);
    if (mobileMenuOpen) closeMobileMenu();
  };

  const closeMobileMenu = () => {
    setMobileMenuClosing(true);
    setTimeout(() => { setMobileMenuOpen(false); setMobileMenuClosing(false); }, 400);
  };

  const handleNavLinkClick = () => { if (mobileMenuOpen) closeMobileMenu(); };
  const toggleMobileMenu = () => { if (mobileMenuOpen) closeMobileMenu(); else setMobileMenuOpen(true); };

  const navLinks = [
    { key: "portfolio", icon: Briefcase, href: "/portafolio" },
    { key: "services", icon: Layers, href: "/servicios" },
    { key: "about", icon: Info, href: "/nosotros" },
    { key: "blog", icon: BookOpen, href: "/blog" },
  ];

  return (
    <>
      <style>{`
        :root { --gold: #D4AF37; --navy-dark: #0A1D35; --white: #FFFFFF; --white-soft: #F8FAFC; }
        * { box-sizing: border-box; }
        .nav-desktop { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 1100px) and (min-width: 769px) {
          .nav-links-center { gap: 2rem !important; }
          .nav-links-center a { font-size: 1rem !important; }
        }
        @media (max-width: 900px) and (min-width: 769px) {
          .nav-links-center { gap: 1.4rem !important; }
          .nav-links-center a { font-size: 0.9rem !important; }
          .contact-button { padding: 0.6rem 1rem !important; font-size: 0.85rem !important; }
          .nav-logo-img { width: 56px !important; height: 56px !important; }
          .nav-logo-text { font-size: 1.6rem !important; }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
          .logo-text-mobile { display: block !important; position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; white-space: nowrap !important; }
          .logo-text-desktop { display: none !important; }
          .nav-container { padding: 0 1rem !important; position: relative !important; }
        }
        .mobile-menu { position: fixed; top: 76px; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(2,6,20,0.45) 0%, rgba(2,6,20,0.3) 100%); backdrop-filter: blur(60px) saturate(200%); z-index: 55; animation: slideDownFade 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes slideDownFade { 0% { opacity: 0; transform: translateY(-50px); } 100% { opacity: 1; transform: translateY(0); } }
        .mobile-menu-closing { animation: slideUpFade 0.4s forwards; }
        @keyframes slideUpFade { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-50px); } }
        .nav-pulse-line { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold) 20%, #041934 50%, var(--gold) 80%, transparent); animation: pulseLine 4s infinite; z-index: 3; }
        @keyframes pulseLine { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        .contact-button { position: relative; overflow: hidden; backdrop-filter: blur(25px); background: linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.08)); border: 2px solid var(--gold); animation: contactPulse 2s infinite; text-decoration: none; }
        @keyframes contactPulse { 0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.4); } 50% { box-shadow: 0 0 35px rgba(212,175,55,0.6); } }
        .blur-button-navy { backdrop-filter: blur(25px); background: rgba(2,6,20,0.2); border: 1px solid rgba(212,175,55,0.25); transition: all 0.3s; }
        .mobile-nav-link { backdrop-filter: blur(20px); background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.15); transition: all 0.3s; }
        .mobile-lang-btn.active { background: rgba(212,175,55,0.25) !important; border: 1px solid var(--gold) !important; }
        .mobile-contact-link { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1.25rem; border-radius: 15px; background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08)); border: 2px solid var(--gold); color: var(--gold); font-size: 1.5rem; font-weight: bold; text-decoration: none; }
      `}</style>

      <nav
        ref={navRef}
        style={{
          background: "linear-gradient(135deg, rgba(2,6,20,0.40) 0%, rgba(2,6,20,0.40) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
          position: "sticky", top: 0, zIndex: 50, height: "76px",
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.4s",
        }}
      >
        <AnimatedWaves />
        <div className="nav-pulse-line" />

        <div className="nav-container" style={{ padding: "0 2rem", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2, maxWidth: "2200px", margin: "0 auto" }}>

          <a href="/" className="logo-container" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", zIndex: 3 }}>
            <img src="/assets/image/logo.webp" alt="Geck Codex" className="nav-logo-img" style={{ width: "72px", height: "72px", objectFit: "contain" }} />
            <span className="logo-text logo-text-desktop nav-logo-text" style={{ fontSize: "2rem", fontWeight: "bold" }}>
              <AnimatedLogo text="Geck Codex" />
            </span>
          </a>

          <span className="logo-text logo-text-mobile" style={{ fontSize: "2rem", fontWeight: "bold", display: "none" }}>
            <AnimatedLogo text="Geck Codex" />
          </span>

          <div className="nav-desktop nav-links-center" style={{ gap: "3.5rem", position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center" }}>
            {navLinks.map(({ key, icon, href }) => (
              <MagneticLink key={key} href={href} icon={icon} text={t[key]} />
            ))}
          </div>

          <div className="nav-desktop" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {/* ← LINK en lugar de button con openDrawer */}
            <a href="/contacto" className="contact-button" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gold)", padding: "0.75rem 1.5rem", borderRadius: "10px", fontWeight: 700, cursor: "pointer", transition: "0.3s" }}>
              <Mail size={18} /> {t.contact}
            </a>

            <div ref={langMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="blur-button-navy"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer" }}
              >
                <Globe size={18} style={{ color: "var(--gold)" }} />
                <span>{languageOptions.find(l => l.code === language).flag}</span>
              </button>

              {langMenuOpen && (
                <div style={{ position: "absolute", top: "120%", right: 0, background: "rgba(10,29,53,0.95)", backdropFilter: "blur(20px)", borderRadius: "12px", padding: "0.5rem", border: "1px solid rgba(212,175,55,0.3)", display: "flex", flexDirection: "column", gap: "4px", minWidth: "140px", zIndex: 100 }}>
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => handleLanguageChange(opt.code)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem 1rem", background: language === opt.code ? "rgba(212,175,55,0.2)" : "transparent", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", transition: "0.2s" }}
                    >
                      <span>{opt.flag}</span> {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu} style={{ background: "none", border: "none", color: "white", cursor: "pointer", zIndex: 60 }}>
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className={`mobile-menu ${mobileMenuClosing ? "mobile-menu-closing" : ""}`}
          style={{ overflowY: "auto" }}
        >
          <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "2rem", paddingBottom: "3rem" }}>
            {navLinks.map(({ key, icon: Icon, href }) => (
              <a key={key} href={href} onClick={handleNavLinkClick} className="mobile-nav-link" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", borderRadius: "15px", color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "600" }}>
                <Icon size={24} style={{ color: "var(--gold)" }} /> {t[key]}
              </a>
            ))}
            <a href="/contacto" className="mobile-contact-link">
              <Mail size={24} /> {t.contact}
            </a>
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{t.language}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => handleLanguageChange(opt.code)}
                    className={`mobile-lang-btn ${language === opt.code ? "active" : ""}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.9rem 1.25rem", borderRadius: "12px",
                      background: language === opt.code ? "rgba(212,175,55,0.18)" : "rgba(2,6,20,0.4)",
                      border: language === opt.code ? "1px solid var(--gold)" : "1px solid rgba(212,175,55,0.2)",
                      color: "white", cursor: "pointer", fontSize: "1rem", fontWeight: language === opt.code ? "700" : "400",
                      width: "100%", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{opt.flag}</span>
                    <span>{opt.label}</span>
                    {language === opt.code && (
                      <svg style={{ marginLeft: "auto", color: "var(--gold)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}