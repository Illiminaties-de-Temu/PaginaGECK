/* ══════════════════════════════════════════════════════════════════
   seo.ts — Fuente única de verdad para datos estructurados (JSON-LD)

   Todo el Schema.org del sitio sale de aquí. La razón de centralizarlo:
   los motores de respuesta con IA (ChatGPT Search, Perplexity, AI Overviews,
   Claude) resuelven mejor una entidad cuando el NAP —nombre, dirección,
   teléfono— es idéntico byte a byte en todas las páginas. Si el dato de
   contacto cambia, se cambia SOLO aquí.
   ══════════════════════════════════════════════════════════════════ */

export const SITE_URL = 'https://geckcodex.com';

/** NAP y datos de negocio. Reutilizables también en componentes visibles. */
export const BUSINESS = {
  name: 'Geck Codex',
  legalName: 'Geck Codex',
  email: 'ventas@geckcodex.com',
  phone: '+52-627-174-5436',
  phoneDisplay: '+52 627 174 5436',
  whatsapp: 'https://wa.me/526271745436',
  // Sin `street`: el negocio opera como area de servicio (SAB) en Google
  // Business Profile, donde la direccion queda oculta. Declarar una calle
  // en el schema que el perfil no confirma es una inconsistencia de NAP.
  city: 'Hidalgo del Parral',
  region: 'Chihuahua',
  regionCode: 'MX-CHH',
  postalCode: '33800',
  country: 'MX',
  latitude: 26.9319,
  longitude: -105.6664,
  instagram: 'https://www.instagram.com/geckcodex/',
  github: 'https://github.com/Geck-Codex',
  facebook: 'https://www.facebook.com/share/1Dt3nBrVgm/',
} as const;

/** Perfiles externos que confirman la identidad de la entidad (sameAs). */
const SAME_AS = [BUSINESS.instagram, BUSINESS.facebook, BUSINESS.github];

/* ─────────────────────────────────────────────────────────────────
   Entidad principal — ProfessionalService es un subtipo de
   LocalBusiness: da elegibilidad a resultados locales (GEO) sin
   perder la semántica de Organization.
   ───────────────────────────────────────────────────────────────── */
export const ORGANIZATION_SCHEMA: Record<string, unknown> = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  alternateName: ['GeckCodex', 'Geck Codex Parral'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: `${SITE_URL}/assets/image/logo.png`,
    width: 512,
    height: 512,
    caption: BUSINESS.name,
  },
  image: `${SITE_URL}/assets/image/og-image.jpg`,
  description:
    'Agencia mexicana de desarrollo tecnológico en Hidalgo del Parral, Chihuahua. Desarrollamos sitios web, aplicaciones móviles, soluciones de inteligencia artificial, e-commerce, plataformas SaaS y software a la medida para empresas de México y Estados Unidos.',
  slogan: 'Tecnología de primer nivel, para todos.',
  email: BUSINESS.email,
  telephone: BUSINESS.phone,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      contactType: 'sales',
      areaServed: ['MX', 'US'],
      availableLanguage: ['Spanish', 'English', 'Portuguese'],
    },
    {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phone,
      contactType: 'customer support',
      areaServed: ['MX', 'US'],
      availableLanguage: ['Spanish', 'English'],
    },
  ],
  areaServed: [
    { '@type': 'Country', name: 'México' },
    { '@type': 'Country', name: 'Estados Unidos' },
    {
      '@type': 'State',
      name: 'Chihuahua',
      containedInPlace: { '@type': 'Country', name: 'México' },
    },
    {
      '@type': 'City',
      name: 'Hidalgo del Parral',
      alternateName: 'Parral',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      // Chihuahua capital. El estado y la ciudad se llaman igual, así que sin
      // containedInPlace los motores no distinguen a cuál de los dos se refiere.
      '@type': 'City',
      name: 'Chihuahua',
      alternateName: 'Chihuahua Capital',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      '@type': 'City',
      name: 'Ciudad Juárez',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
  ],
  // Radio de servicio presencial; el trabajo remoto queda cubierto por areaServed.
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    geoRadius: 500000,
  },
  sameAs: SAME_AS,
  knowsLanguage: ['es-MX', 'en-US', 'pt-BR'],
  knowsAbout: [
    'Desarrollo Web',
    'Diseño de páginas web',
    'Aplicaciones Móviles',
    'Flutter',
    'React',
    'Inteligencia Artificial',
    'Visión por Computadora',
    'Automatización de procesos',
    'E-commerce',
    'SaaS',
    'Software a la medida',
    'CRM',
    'Diseño UI/UX',
    'Marketing Digital',
    'SEO',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Geck Codex',
    itemListElement: [
      'Desarrollo Web',
      'Apps Móviles',
      'Inteligencia Artificial',
      'E-commerce',
      'SaaS y Plataformas',
      'Automatización de procesos',
      'Software a Medida',
      'Diseño UI/UX',
      'Social Media y Marketing Digital',
      'Venture Studio',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, provider: { '@id': `${SITE_URL}/#organization` } },
    })),
  },
};

export const WEBSITE_SCHEMA: Record<string, unknown> = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BUSINESS.name,
  description:
    'Sitio oficial de Geck Codex: desarrollo web, apps móviles, inteligencia artificial y software a la medida desde Parral, Chihuahua.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: ['es-MX', 'en', 'pt'],
};

/* ─────────────────────────────────────────────────────────────────
   Helpers de schema por página
   ───────────────────────────────────────────────────────────────── */

export function breadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Inicio', url: SITE_URL + '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage — el formato que los motores generativos citan con más frecuencia,
 * porque cada par pregunta/respuesta es una unidad extraíble por sí sola.
 */
export function faqSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export interface ServiceItem {
  name: string;
  description: string;
  /** Término del catálogo al que pertenece (Desarrollo, Marketing, Inversión). */
  category?: string;
}

export function serviceListSchema(services: ServiceItem[]): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    name: 'Servicios de Geck Codex',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        ...(s.category ? { serviceType: s.category } : {}),
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: [
          { '@type': 'Country', name: 'México' },
          { '@type': 'Country', name: 'Estados Unidos' },
        ],
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${SITE_URL}/contacto/`,
          servicePhone: { '@type': 'ContactPoint', telephone: BUSINESS.phone },
        },
      },
    })),
  };
}

export interface PortfolioItem {
  name: string;
  description: string;
  url?: string;
  image?: string;
}

export function portfolioSchema(items: PortfolioItem[]): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    name: 'Portafolio de proyectos de Geck Codex',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.name,
        description: p.description,
        creator: { '@id': `${SITE_URL}/#organization` },
        ...(p.url ? { url: p.url } : {}),
        ...(p.image ? { image: p.image } : {}),
      },
    })),
  };
}

/** Página de contacto — ayuda a que el NAP se asocie a la URL correcta. */
export function contactPageSchema(): Record<string, unknown> {
  return {
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contacto/#webpage`,
    url: `${SITE_URL}/contacto/`,
    name: 'Contacto | Geck Codex',
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: { '@id': `${SITE_URL}/#organization` },
  };
}
