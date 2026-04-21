import { useState, useEffect, useCallback, useMemo, useRef } from 'react';


/* ─── CATEGORY ICON COMPONENTS ─────────────────────────────── */
const CategoryIconDesarrollo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="40" height="26" rx="3" stroke="currentColor" strokeWidth="2.2" fill="none"/>
    <line x1="16" y1="40" x2="32" y2="40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="24" y1="34" x2="24" y2="40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <polyline points="13,19 9,23 13,27" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="35,19 39,23 35,27" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="16" x2="27" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CategoryIconMarketing = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 18H16L32 10V38L16 30H8V18Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
    <path d="M16 30L19 42" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M36 16C38.5 18 38.5 30 36 32" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M40 12C44 16 44 32 40 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="3 2"/>
    <circle cx="38" cy="8" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="38" y1="6" x2="38" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="38" y1="11" x2="38" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="36" y1="8" x2="35" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="41" y1="8" x2="40" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CategoryIconInversion = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="6,38 16,26 24,30 36,14 42,18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="36,8 42,8 42,14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="38" x2="6" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
    <line x1="6" y1="38" x2="44" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
    <circle cx="13" cy="10" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="13" y1="7.5" x2="13" y2="8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="13" y1="11.5" x2="13" y2="12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M11 9.5C11 9.5 11.5 8.5 13 8.5C14.5 8.5 15 9.2 15 10C15 10.8 14 11 13 11.5C12 12 11 12.5 11 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

/* ─── CATEGORIES DATA ────────────────────────────────────────── */
const categories = [
  {
    id: 0,
    name: "Desarrollo",
    description: "Construimos tu presencia digital",
    IconComponent: CategoryIconDesarrollo,
    gradient: "linear-gradient(135deg, #030C1D 0%, #0A1D35 60%, #0d2845 100%)",
    accentColor: "#D4AF37",
    glowColor: "rgba(212, 175, 55, 0.2)",
    borderActive: "rgba(88, 74, 28, 0.6)",
  },
  {
    id: 1,
    name: "Marketing & Diseño",
    description: "Te hacemos brillar",
    IconComponent: CategoryIconMarketing,
    gradient: "linear-gradient(135deg, #030C1D 0%, #0A1D35 60%, #0d2845 100%)",
    accentColor: "#D4AF37",
    glowColor: "rgba(212, 175, 55, 0.2)",
    borderActive: "rgba(88, 74, 28, 0.6)",
  },
  {
    id: 2,
    name: "Inversión",
    description: "Únete a nuestros proyectos",
    IconComponent: CategoryIconInversion,
    gradient: "linear-gradient(135deg, #030C1D 0%, #0A1D35 60%, #0d2845 100%)",
    accentColor: "#D4AF37",
    glowColor: "rgba(212, 175, 55, 0.2)",
    borderActive: "rgba(88, 74, 28, 0.6)",
  }
];

/* ─── SERVICES DATA ──────────────────────────────────────────── */
const services = {
  0: [
    { 
      id: 0, 
      slug: "web",            
      name: "Desarrollo Web",          
      tagline: "Tu Negocio en Internet, Pero Bien Hecho",  
      description: "Desarrollamos soluciones web completas adaptadas a las necesidades reales de tu negocio. Desde plataformas corporativas hasta sistemas complejos, construimos productos digitales escalables, seguros y optimizados para un crecimiento sostenible. Utilizamos las tecnologías que mejor se ajusten a cada proyecto, garantizando rendimiento, estabilidad y una correcta evolución a largo plazo.", 
      features: [
        "Responsive design para móvil, tablet y desktop", 
        "Optimización SEO para aparecer en Google", 
        "Velocidad de carga ultrarrápida (Core Web Vitals)", 
        "Integración con Google Analytics y CRM"
      ], 
      image: "/assets/image/servicios/webser.webp",     
      size: "large"    
    },

    { 
      id: 1, 
      slug: "mobile",         
      name: "Apps Móviles",            
      tagline: "Apps que la Gente Usa Todos los Días",     
      description: "Desarrollamos aplicaciones móviles con Flutter para iOS y Android desde una sola base de código, reduciendo costos y acelerando el lanzamiento. Creamos apps rápidas, escalables y diseñadas para crecer junto con tu negocio.",               
      features: [
        "Desarrollo multiplataforma con Flutter", 
        "Notificaciones push para mantener engagement", 
        "Diseño intuitivo siguiendo guidelines", 
        "Publicación en App Store y Google Play"
      ],             
      image: "/assets/image/servicios/celser.webp",     
      size: "large"    
    },

    { 
      id: 2, 
      slug: "ia",             
      name: "Inteligencia Artificial", 
      tagline: "IA Aplicada a Resultados Reales",                    
      description: "Implementamos soluciones de Inteligencia Artificial orientadas a mejorar, analizar y eficientizar procesos dentro de tu negocio. Desde automatización inteligente y análisis predictivo hasta modelos que optimizan operaciones y reducen costos, integramos IA de forma estratégica para que tu empresa tome decisiones más precisas y opere con mayor eficiencia.",                         
      features: [
        "Automatización inteligente de procesos", 
        "Modelos predictivos y análisis avanzado de datos", 
        "Optimización operativa y reducción de costos", 
        "Integración con sistemas y plataformas existentes"
      ],                                    
      image: "/assets/image/servicios/iaser.webp",      
      size: "large"    
    },

    { 
      id: 3, 
      slug: "ecommerce",      
      name: "E-commerce",              
      tagline: "Tienda Online que Vende de Verdad",        
      description: "Montamos tu tienda online completa con Shopify, WooCommerce o custom. Carrito, pagos con tarjeta, envíos, inventario - todo integrado.",                                              
      features: [
        "Catálogo con filtros y búsqueda", 
        "Pagos (Stripe, MercadoPago, PayPal)", 
        "Integración con envíos y tracking", 
        "Panel de administración"
      ],                                              
      image: "/assets/image/servicios/ecomersser.webp", 
      size: "medium"   
    },

    { 
      id: 4, 
      slug: "saas",           
      name: "SaaS & Plataformas",      
      tagline: "Plataformas que Cobran Solas",             
      description: "Creamos plataformas tipo Netflix o Spotify: tus clientes pagan mensual, el sistema cobra automático y tú ves crecer los ingresos.",                                               
      features: [
        "Suscripciones recurrentes automáticas", 
        "Multi-tenant: miles de usuarios", 
        "Dashboard con métricas en tiempo real", 
        "API REST para integraciones"
      ],                                   
      image: "/assets/image/servicios/saasser.webp",     
      size: "medium"   
    },

    { 
      id: 5, 
      slug: "automatizacion", 
      name: "Automatización",          
      tagline: "Deja que el Software Haga el Trabajo",     
      description: "Automatizamos procesos que te quitan horas. Conectamos tus sistemas para que trabajen solos. Menos trabajo manual = menos errores.",                                                
      features: [
        "Workflows (Zapier, Make o n8n)", 
        "Integración entre sistemas (APIs)", 
        "Bots de tareas repetitivas (RPA)", 
        "Ahorro de tiempo real"
      ],                                                    
      image: "/assets/image/servicios/autoserv.webp",   
      size: "small"    
    },

    { 
      id: 6, 
      slug: "custom",         
      name: "Software a Medida",       
      tagline: "Software Hecho Para Tu Negocio",           
      description: "Desarrollamos sistemas empresariales personalizados 100% a tu medida. ERP, CRM, gestión de inventario, facturación - lo que necesites.",                                          
      features: [
        "Análisis de procesos y necesidades", 
        "Desarrollo custom desde cero", 
        "Dashboards y reportes con KPIs", 
        "Mantenimiento y soporte continuo"
      ],                                           
      image: "/assets/image/servicios/medidaser.webp",  
      size: "small"    
    },
  ],

  1: [
    { 
      id: 7, 
      slug: "diseno",         
      name: "Diseño UI/UX",            
      tagline: "Diseño que Vende y Enamora",               
      description: "Diseñamos interfaces que la gente entiende al instante y quiere usar. Combinamos diseño bonito con usabilidad real.",                                                               
      features: [
        "Research y testing con usuarios", 
        "Diseño system escalable", 
        "Prototipos interactivos", 
        "Implementación pixel-perfect"
      ],                                                               
      image: "/assets/image/servicios/ui-ux.webp",     
      size: "large"    
    },

    { 
      id: 8, 
      slug: "redes-sociales", 
      name: "Social Media",            
      tagline: "Redes Sociales que Generan Negocio",       
      description: "Gestionamos tus redes con estrategia. Creamos contenido que tu audiencia quiere ver y compartir.",                                                                               
      features: [
        "Estrategia de contenido", 
        "Calendario editorial y producción", 
        "Community management", 
        "Reportes mensuales de métricas"
      ],                                                             
      image: "/assets/image/servicios/social.webp",     
      size: "large"    
    },
  ],

  2: [
    { 
      id: 9, 
      slug: "inversion",      
      name: "Venture Studio",          
      tagline: "Invierte en Productos Tech Reales",        
      description: "Creamos nuestros propios productos digitales y buscamos inversionistas inteligentes para escalarlos. Productos con tracción real.",                                               
      features: [
        "Usuarios reales y validación", 
        "Modelos de negocio probados", 
        "Proyecciones financieras claras", 
        "Reportes de crecimiento"
      ],                                                          
      image: "/assets/image/servicios/inversion.webp",   
      size: "featured" 
    },
  ]
};
/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function ImprovedServices() {
 
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const expandedServiceData = useMemo(() => {
    if (expandedServiceId === null) return null;
    return Object.values(services).flat().find(s => s.id === expandedServiceId);
  }, [expandedServiceId]);

  const closeExpanded = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setExpandedServiceId(null);
      setIsClosing(false);
      window.history.pushState(null, '', window.location.pathname);
      document.body.style.overflow = 'unset';
    }, 280);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') closeExpanded(); };
    if (expandedServiceId !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [expandedServiceId, closeExpanded]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        let foundService = null;
        let foundCategory = 0;
        for (const catId in services) {
          const service = services[catId].find(s => s.slug === hash);
          if (service) { foundService = service; foundCategory = parseInt(catId); break; }
        }
        if (foundService) { setActiveCategory(foundCategory); setExpandedServiceId(foundService.id); }
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCardClick = (service) => {
    setExpandedServiceId(service.id);
    window.history.pushState(null, '', `#${service.slug}`);
  };




  const getGridClass = (size) => {
    const sizes = { large: 'service-card--large', medium: 'service-card--medium', small: 'service-card--small', featured: 'service-card--featured' };
    return sizes[size] || 'service-card--medium';
  };

  return (
    <>
      <section className="improved-services">
        <div className="improved-services__hero">
          <span className="improved-services__pretitle">Nuestros Servicios</span>
          <h1 className="improved-services__title">Lo Que Hacemos por Tu Negocio</h1>
          <p className="improved-services__subtitle">Sin tecnicismos raros. Solo soluciones que funcionan.</p>
        </div>

        {/* ─── CATEGORY BUTTONS — desktop cards / mobile tabs ─── */}
        {isMobile ? (
          <div className="mobile-tabs">
            {categories.map((category) => {
              const { IconComponent, accentColor } = category;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => { setActiveCategory(category.id); setExpandedServiceId(null); window.history.pushState(null, '', window.location.pathname); }}
                  className={`mobile-tab ${isActive ? 'active' : ''}`}
                >
                  <span className="mobile-tab__icon" style={{ color: isActive ? accentColor : 'rgba(244,228,188,0.45)' }}>
                    <IconComponent />
                  </span>
                  <span className="mobile-tab__label" style={{ color: isActive ? accentColor : 'rgba(244,228,188,0.6)' }}>
                    {category.name}
                  </span>
                  {isActive && <span className="mobile-tab__bar" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="improved-services__categories">
            {categories.map((category) => {
              const { IconComponent, gradient, accentColor, glowColor, borderActive } = category;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => { setActiveCategory(category.id); setExpandedServiceId(null); window.history.pushState(null, '', window.location.pathname); }}
                  className={`category-card ${isActive ? 'active' : ''}`}
                  aria-pressed={isActive}
                  style={{
                    '--cat-accent': accentColor,
                    '--cat-glow': glowColor,
                    '--cat-border-active': borderActive,
                    '--cat-gradient': gradient,
                  }}
                >
                  <div className="category-card__bg" style={{ background: gradient }} />
                  {isActive && <div className="category-card__glow-blob" style={{ background: glowColor }} />}
                  <div className="category-card__icon-wrap" style={{ color: isActive ? accentColor : 'rgba(244,228,188,0.55)' }}>
                    <IconComponent />
                  </div>
                  <div className="category-card__content">
                    <h3 className="category-card__name" style={{ color: isActive ? accentColor : 'var(--gold-light)' }}>
                      {category.name}
                    </h3>
                    <p className="category-card__description">{category.description}</p>
                  </div>
                  <div className="category-card__line" style={{ background: isActive ? accentColor : 'var(--gold-border)' }} />
                </button>
              );
            })}
          </div>
        )}

        {/* ─── SERVICE GRID — desktop grid / mobile carousel ─── */}
        {isMobile ? (
          <div className="mobile-carousel" ref={carouselRef} key={activeCategory}>
            {services[activeCategory].map((service, index) => (
              <div
                key={service.id}
                className="mobile-card"
                onClick={() => handleCardClick(service)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="mobile-card__bg">
                  <img src={service.image} alt="" className="mobile-card__image" loading="lazy" />
                  <div className="mobile-card__overlay" />
                </div>
                <div className="mobile-card__content">
                  <p className="mobile-card__tagline">{service.tagline}</p>
                  <h3 className="mobile-card__name">{service.name}</h3>
                  <span className="mobile-card__cta">Ver detalles →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="improved-services__grid" key={activeCategory}>
            {services[activeCategory].map((service, index) => (
              <div
                key={service.id}
                className={`service-card ${getGridClass(service.size)} ${expandedServiceId !== null && expandedServiceId !== service.id ? 'dimmed' : ''}`}
                onClick={() => handleCardClick(service)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="service-card__bg">
                  <img src={service.image} alt="" className="service-card__image" loading="lazy" />
                  <div className="service-card__overlay"></div>
                </div>
                <div className="service-card__content">
                  <div className="service-card__header">
                    <h3 className="service-card__name">{service.name}</h3>
                    <p className="service-card__tagline">{service.tagline}</p>
                  </div>
                  <div className="service-card__hint">
                    <span>+</span>
                    <span>Ver detalles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── MODAL / BOTTOM SHEET ─── */}
        {expandedServiceData && (
          <div className={`modal-container ${isClosing ? 'closing' : ''} ${isMobile ? 'is-mobile' : ''}`}>
            <div className="modal-overlay" onClick={closeExpanded} />
            <div className="service-modal" role="dialog" aria-modal="true">
              {/* drag handle only on mobile */}
              {isMobile && <div className="service-modal__handle" />}
              <button className="service-modal__close" onClick={closeExpanded} aria-label="Cerrar modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="service-modal__hero">
                <img src={expandedServiceData.image} alt={expandedServiceData.name} />
                <div className="service-modal__hero-overlay"></div>
                <div className="service-modal__hero-content">
                  <h2>{expandedServiceData.name}</h2>
                  <p>{expandedServiceData.tagline}</p>
                </div>
              </div>
              <div className="service-modal__body">
                <div className="service-modal__description">
                  <p>{expandedServiceData.description}</p>
                </div>
                <div className="service-modal__features">
                  <h3 className="service-modal__features-title">¿Qué Incluye?</h3>
                  <div className="service-modal__features-grid">
                    {expandedServiceData.features.map((feature, index) => (
                      <div key={index} className="feature-card" style={{ animationDelay: `${0.15 + (index * 0.05)}s` }}>
                        <div className="feature-card__icon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.6 4L7.5 13.1L3.4 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="service-modal__cta-wrapper">
                  {/* ← CAMBIO CLAVE: button con onClick en lugar de <a href> */}
                  <a href="/contacto" className="service-modal__cta">
                    <span>{expandedServiceData.id === 9 ? "Quiero Invertir" : "Hablemos de Tu Proyecto"}</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        /* ─── VARIABLES ──────────────────────────────────────── */
        :root {
          --carbon:      #222220;
          --carbon-dark: #1a1a18;
          --navy:        #030C1D;
          --navy-mid:    rgba(3, 12, 29, 0.6);
          --navy-soft:   rgba(3, 12, 29, 0.35);
          --gold-deep:   #584A1C;
          --gold:        #D4AF37;
          --gold-light:  #F4E4BC;
          --gold-glow:   rgba(212, 175, 55, 0.15);
          --gold-border: rgba(88, 74, 28, 0.35);

          --dur-fast:    160ms;
          --dur-normal:  240ms;
          --dur-modal:   300ms;
          --dur-close:   220ms;
          --ease-out:    cubic-bezier(0.2, 0, 0, 1);
          --ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1);
        }

        /* ─── SECCIÓN ────────────────────────────────────────── */
        .improved-services {
          background: var(--carbon);
          min-height: 100vh;
          padding: 4rem 2rem 6rem;
          color: white;
          font-family: 'Inter', -apple-system, sans-serif;
          position: relative;
        }

        .improved-services::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 12, 29, 0.5) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 100% 100%, rgba(3, 12, 29, 0.3) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .improved-services > * { position: relative; z-index: 1; }

        /* ─── HERO ───────────────────────────────────────────── */
        .improved-services__hero {
          text-align: center; max-width: 900px; margin: 0 auto 5rem;
        }
        .improved-services__pretitle {
          display: inline-block; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold);
          padding: 0.45rem 1.4rem;
          border: 1px solid var(--gold-border);
          border-radius: 50px;
          background: rgba(88, 74, 28, 0.1);
          margin-bottom: 1.5rem;
          animation: badgePulse 3s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88, 74, 28, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(88, 74, 28, 0); }
        }

        .improved-services__title {
          font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; line-height: 1.1;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-deep) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }
        .improved-services__subtitle {
          font-size: 1.2rem; color: rgba(244, 228, 188, 0.6);
        }

        /* ─── CATEGORÍAS ─────────────────────────────────────── */
        .improved-services__categories {
          max-width: 1200px; margin: 0 auto 4rem;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;
        }

        /* ─── CATEGORY CARD ──────────────────────────────────── */
        .category-card {
          position: relative;
          padding: 2rem 2rem 2.5rem;
          border-radius: 20px;
          cursor: pointer;
          overflow: hidden;
          transition:
            transform var(--dur-normal) var(--ease-out),
            border-color var(--dur-normal) ease,
            box-shadow var(--dur-normal) ease;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
          color: inherit;
          border: 1px solid rgba(255,255,255,0.06);
          background: var(--carbon-dark);
          min-height: 180px;
        }

        .category-card__bg {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity var(--dur-normal) ease;
          border-radius: 20px;
        }

        .category-card:hover .category-card__bg,
        .category-card.active .category-card__bg {
          opacity: 1;
        }

        .category-card__glow-blob {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          top: -60px;
          right: -60px;
          filter: blur(60px);
          opacity: 0.4;
          pointer-events: none;
          animation: blobPulse 3s ease-in-out infinite;
        }

        @keyframes blobPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.55; }
        }

        .category-card__icon-wrap {
          position: relative;
          z-index: 2;
          transition: transform var(--dur-normal) var(--ease-spring), color var(--dur-normal) ease, filter var(--dur-normal) ease;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-card:hover .category-card__icon-wrap {
          transform: scale(1.15) translateY(-4px);
        }

        .category-card.active .category-card__icon-wrap {
          transform: scale(1.1) translateY(-2px);
          filter: drop-shadow(0 0 12px var(--cat-glow, rgba(255,255,255,0.2)));
        }

        .category-card__line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 0%;
          transition: width var(--dur-normal) var(--ease-out), background var(--dur-fast) ease;
          border-radius: 0 0 20px 20px;
        }

        .category-card:hover .category-card__line,
        .category-card.active .category-card__line {
          width: 100%;
        }

        .category-card__content {
          position: relative;
          z-index: 2;
        }

        .category-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: rgba(255,255,255,0.12);
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.5),
            0 0 30px var(--cat-glow, rgba(255,255,255,0.1));
        }

        .category-card.active {
          transform: translateY(-5px);
          border-color: var(--cat-border-active, rgba(212,175,55,0.5));
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px var(--cat-border-active, rgba(212,175,55,0.3)),
            0 0 40px var(--cat-glow, rgba(212,175,55,0.1));
        }

        .category-card__name {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          transition: color var(--dur-fast) ease;
        }

        .category-card__description {
          font-size: 0.875rem;
          color: rgba(244, 228, 188, 0.5);
          margin: 0;
          line-height: 1.5;
        }

        .category-card:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }

        /* ─── GRID SERVICIOS ─────────────────────────────────── */
        .improved-services__grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem; grid-auto-rows: 280px;
        }

        .service-card {
          position: relative; border-radius: 24px; overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(3, 12, 29, 0.8);
          background: var(--navy);
          transition:
            transform var(--dur-normal) var(--ease-out),
            border-color var(--dur-normal) ease,
            box-shadow var(--dur-normal) ease,
            opacity var(--dur-normal) ease,
            filter var(--dur-normal) ease;
          animation: cardFadeIn 0.35s var(--ease-out) backwards;
        }

        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .service-card--large    { grid-column: span 6; grid-row: span 2; }
        .service-card--medium   { grid-column: span 4; grid-row: span 1; }
        .service-card--small    { grid-column: span 4; grid-row: span 1; }
        .service-card--featured { grid-column: span 12; grid-row: span 2; }
        .service-card.dimmed    { opacity: 0.35; filter: blur(2px); transform: scale(0.98); }

        .service-card::after {
          content: '';
          position: absolute; inset: 0;
          border: 2px solid var(--gold);
          border-radius: 24px;
          opacity: 0;
          transition: opacity var(--dur-normal) ease;
          pointer-events: none;
        }

        .service-card:hover {
          border-color: var(--gold-deep);
          box-shadow: 0 16px 48px rgba(3, 12, 29, 0.7), 0 0 0 1px var(--gold-border);
          transform: translateY(-4px);
        }

        .service-card:hover::after { opacity: 1; }

        .service-card__bg { position: absolute; inset: 0; }
        .service-card__image {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s var(--ease-out);
        }
        .service-card:hover .service-card__image { transform: scale(1.06); }

        .service-card__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(3,12,29,0.25) 0%, rgba(3,12,29,0.75) 55%, rgba(3,12,29,0.97) 100%);
        }

        .service-card__content {
          position: relative; padding: 2rem; height: 100%;
          display: flex; flex-direction: column; justify-content: flex-end; z-index: 2;
        }

        .service-card__name {
          font-size: 1.45rem; font-weight: 700; color: var(--gold-light); margin: 0;
          transition: transform var(--dur-normal) var(--ease-out);
        }

        .service-card:hover .service-card__name { transform: translateX(-4px); }

        .service-card__tagline {
          font-size: 0.75rem; color: var(--gold);
          text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.4rem;
        }

        .service-card__hint {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 1rem; font-size: 0.85rem;
          color: var(--gold-light); opacity: 0;
          transform: translateY(10px);
          transition: opacity var(--dur-normal) ease, transform var(--dur-normal) var(--ease-spring);
        }

        .service-card:hover .service-card__hint { opacity: 1; transform: translateY(0); }

        /* ─── MODAL ──────────────────────────────────────────── */
        .modal-container {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }

        .modal-overlay {
          position: absolute; inset: 0;
          background: rgba(26, 26, 24, 0.92);
          backdrop-filter: blur(14px);
          cursor: zoom-out;
          animation: overlayIn var(--dur-modal) var(--ease-out) both;
        }

        @keyframes overlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(14px); }
        }

        .modal-container.closing .modal-overlay {
          animation: overlayOut var(--dur-close) ease both;
        }

        @keyframes overlayOut {
          from { opacity: 1; backdrop-filter: blur(14px); }
          to   { opacity: 0; backdrop-filter: blur(0px); }
        }

        .service-modal {
          position: relative; width: 100%; max-width: 850px;
          background: var(--navy); border-radius: 28px; z-index: 2001;
          border: 1px solid var(--gold-border);
          max-height: 90vh; overflow-y: auto; scroll-behavior: smooth;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(88,74,28,0.2), inset 0 1px 0 rgba(212,175,55,0.08);
          animation: modalIn var(--dur-modal) var(--ease-spring) both;
          will-change: transform, opacity;
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        .modal-container.closing .service-modal {
          animation: modalOut var(--dur-close) var(--ease-out) both;
        }

        @keyframes modalOut {
          from { opacity: 1; transform: scale(1)    translateY(0); }
          to   { opacity: 0; transform: scale(0.97) translateY(16px); }
        }

        .service-modal__close {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: rgba(34,34,32,0.7); border: 1px solid var(--gold-border);
          color: var(--gold); border-radius: 50%;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          transition: background var(--dur-fast) ease, color var(--dur-fast) ease, border-color var(--dur-fast) ease;
        }

        .service-modal__close svg {
          transition: transform var(--dur-normal) var(--ease-spring);
        }

        .service-modal__close:hover {
          background: var(--gold-deep); color: var(--gold-light); border-color: var(--gold);
        }
        .service-modal__close:hover svg { transform: rotate(90deg); }

        .service-modal__hero { height: 320px; position: relative; overflow: hidden; }

        .service-modal__hero img {
          width: 100%; height: 100%; object-fit: cover;
          animation: heroIn var(--dur-modal) var(--ease-out) both;
        }

        @keyframes heroIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }

        .modal-container.closing .service-modal__hero img {
          animation: heroOut var(--dur-close) ease both;
        }
        @keyframes heroOut {
          to { opacity: 0; transform: scale(1.03); }
        }

        .service-modal__hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, var(--navy) 0%, rgba(3,12,29,0.6) 55%, transparent 100%);
        }

        .service-modal__hero-content { position: absolute; bottom: 2rem; left: 2.5rem; right: 2.5rem; }

        .service-modal__hero-content h2 {
          font-size: 2.5rem; color: var(--gold-light); margin: 0;
          animation: slideUp 0.28s var(--ease-out) 0.08s both;
        }

        .service-modal__hero-content p {
          color: var(--gold); font-size: 0.85rem;
          letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.12s both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-container.closing .service-modal__hero-content h2,
        .modal-container.closing .service-modal__hero-content p {
          animation: fadeOut var(--dur-close) ease both;
        }
        @keyframes fadeOut { to { opacity: 0; } }

        .service-modal__body { padding: 2.5rem; }

        .service-modal__description {
          font-size: 1.1rem; color: rgba(244,228,188,0.75);
          line-height: 1.7; margin-bottom: 2.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.1s both;
        }

        .modal-container.closing .service-modal__description {
          animation: fadeOut var(--dur-close) ease both;
        }

        .service-modal__features-title {
          color: var(--gold); font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.13s both;
        }

        .modal-container.closing .service-modal__features-title {
          animation: fadeOut var(--dur-close) ease both;
        }

        .service-modal__features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;
        }

        .feature-card {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(34,34,32,0.5);
          border: 1px solid var(--gold-border);
          padding: 1.2rem; border-radius: 14px;
          animation: featureIn 0.25s var(--ease-out) backwards;
          transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease, transform var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
        }

        @keyframes featureIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .modal-container.closing .feature-card {
          animation: fadeOut var(--dur-close) ease both;
        }

        .feature-card:hover {
          background: rgba(34,34,32,0.8); border-color: var(--gold-deep);
          transform: translateX(6px);
          box-shadow: -4px 0 12px rgba(212,175,55,0.15);
        }

        .feature-card__icon { color: var(--gold); flex-shrink: 0; }

        .feature-card__icon svg path {
          stroke-dasharray: 50; stroke-dashoffset: 50;
          animation: drawCheck 0.4s ease forwards;
          animation-delay: inherit;
        }

        @keyframes drawCheck { to { stroke-dashoffset: 0; } }

        .feature-card span { color: rgba(244,228,188,0.85); font-size: 0.9rem; }

        /* ── CTA ── */
        .service-modal__cta-wrapper {
          margin-top: 2.5rem;
          animation: slideUp 0.28s var(--ease-out) 0.2s both;
        }

        .modal-container.closing .service-modal__cta-wrapper {
          animation: fadeOut var(--dur-close) ease both;
        }

        /* ← ESTILOS ACTUALIZADOS PARA BUTTON (antes era <a>) */
        .service-modal__cta {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          background: linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%);
          color: var(--carbon); padding: 1.1rem 2rem; border-radius: 50px;
          font-weight: 800; font-size: 0.95rem;
          border: none; cursor: pointer; width: 100%;
          transition: transform var(--dur-fast) ease, box-shadow var(--dur-fast) ease, background var(--dur-normal) ease;
          box-shadow: 0 4px 20px rgba(88,74,28,0.4);
          position: relative; overflow: hidden;
          text-decoration: none;
        }

        .service-modal__cta::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.5s ease;
        }

        .service-modal__cta:hover::after { left: 100%; }
        .service-modal__cta:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 30px rgba(212,175,55,0.35);
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
        }

        .service-modal__cta svg {
          transition: transform var(--dur-normal) var(--ease-spring);
        }
        .service-modal__cta:hover svg { transform: translateX(4px); }

        /* ─── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 900px) {
          .service-card--large, .service-card--medium, .service-card--small { grid-column: span 12; grid-row: span 1; }
          .improved-services__title { font-size: 2.5rem; }
          .service-modal__hero { height: 200px; }
          .service-modal__hero-content h2 { font-size: 1.8rem; }
          .category-card__icon-wrap svg { width: 40px; height: 40px; }
        }

        /* ─── MOBILE — tabs ──────────────────────────────────── */
        .mobile-tabs {
          display: flex;
          align-items: stretch;
          gap: 0;
          margin: 0 -2rem 2rem;
          padding: 0 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .mobile-tabs::-webkit-scrollbar { display: none; }

        .mobile-tab {
          flex: 1;
          min-width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.9rem 0.5rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: opacity var(--dur-fast) ease;
        }

        .mobile-tab__icon { display: flex; align-items: center; justify-content: center; }
        .mobile-tab__icon svg { width: 28px; height: 28px; }

        .mobile-tab__label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-align: center;
          line-height: 1.2;
          transition: color var(--dur-fast) ease;
        }

        .mobile-tab__bar {
          position: absolute;
          bottom: -1px;
          left: 10%;
          width: 80%;
          height: 2px;
          background: var(--gold);
          border-radius: 2px 2px 0 0;
          animation: tabBarIn 0.2s var(--ease-out) both;
        }

        @keyframes tabBarIn {
          from { width: 0; left: 50%; }
          to   { width: 80%; left: 10%; }
        }

        /* ─── MOBILE — carousel ──────────────────────────────── */
        .mobile-carousel {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 0.5rem 2rem 2rem;
          margin: 0 -2rem;
        }
        .mobile-carousel::-webkit-scrollbar { display: none; }

        .mobile-card {
          flex: 0 0 78vw;
          max-width: 320px;
          height: 240px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          scroll-snap-align: start;
          cursor: pointer;
          border: 1px solid rgba(3,12,29,0.8);
          animation: cardFadeIn 0.35s var(--ease-out) backwards;
          transition: transform var(--dur-fast) ease, box-shadow var(--dur-fast) ease;
        }

        .mobile-card:active { transform: scale(0.97); }

        .mobile-card__bg { position: absolute; inset: 0; }
        .mobile-card__image { width: 100%; height: 100%; object-fit: cover; }
        .mobile-card__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(3,12,29,0.97) 0%, rgba(3,12,29,0.5) 50%, transparent 100%);
        }

        .mobile-card__content {
          position: absolute; inset: 0;
          padding: 1.5rem;
          display: flex; flex-direction: column; justify-content: flex-end;
          z-index: 2;
        }

        .mobile-card__tagline {
          font-size: 0.65rem;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 0.35rem;
        }

        .mobile-card__name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--gold-light);
          margin: 0 0 0.75rem;
          line-height: 1.2;
        }

        .mobile-card__cta {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gold);
          letter-spacing: 0.05em;
        }

        /* ─── MOBILE — bottom sheet modal ────────────────────── */
        .modal-container.is-mobile {
          align-items: flex-end;
          padding: 0;
        }

        .modal-container.is-mobile .modal-overlay {
          background: rgba(3,12,29,0.7);
          backdrop-filter: blur(8px);
        }

        .modal-container.is-mobile .service-modal {
          width: 100%;
          max-width: 100%;
          max-height: 92vh;
          border-radius: 24px 24px 0 0;
          animation: sheetUp var(--dur-modal) var(--ease-spring) both;
        }

        @keyframes sheetUp {
          from { transform: translateY(100%); opacity: 0.6; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .modal-container.is-mobile.closing .service-modal {
          animation: sheetDown var(--dur-close) var(--ease-out) both;
        }

        @keyframes sheetDown {
          from { transform: translateY(0);    opacity: 1; }
          to   { transform: translateY(100%); opacity: 0; }
        }

        .service-modal__handle {
          width: 40px; height: 4px;
          background: rgba(244,228,188,0.2);
          border-radius: 2px;
          margin: 12px auto 0;
          flex-shrink: 0;
        }

        .modal-container.is-mobile .service-modal__hero { height: 200px; }
        .modal-container.is-mobile .service-modal__hero-content h2 { font-size: 1.6rem; }
        .modal-container.is-mobile .service-modal__body { padding: 1.5rem; }
        .modal-container.is-mobile .service-modal__description { font-size: 0.95rem; margin-bottom: 1.5rem; }
        .modal-container.is-mobile .service-modal__features-grid { grid-template-columns: 1fr; gap: 0.75rem; }
        .modal-container.is-mobile .feature-card { padding: 1rem; }
        .modal-container.is-mobile .service-modal__cta { font-size: 0.9rem; padding: 1rem 1.5rem; }
        .modal-container.is-mobile .service-modal__close { top: 1rem; right: 1rem; }

        /* hero section mobile */
        @media (max-width: 768px) {
          .improved-services {
            padding: 3rem 1.5rem 4rem;
          }
          .improved-services__hero {
            margin-bottom: 0;
          }
          .improved-services__title {
            font-size: clamp(1.8rem, 8vw, 2.4rem);
          }
          .improved-services__subtitle {
            font-size: 1rem;
          }
          .improved-services__pretitle {
            font-size: 0.7rem;
            letter-spacing: 0.2em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}