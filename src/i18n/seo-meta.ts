/**
 * Título y descripción de buscador por página e idioma.
 *
 * Vive aparte de `translations.js` porque no es texto de pantalla: son metas
 * con límites duros (title ~60 caracteres, description ~160) que Google trunca
 * sin avisar. `scripts/check-seo-meta.mjs` verifica esos límites en cada build.
 *
 * `ogTitle`/`ogDescription` son opcionales y solo para la tarjeta que se ve al
 * compartir el enlace: ahí no hay algoritmo que convencer, solo una persona.
 */

import type { Locale, PageKey } from './routes';

export interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Nombre en las migas de pan. La home no lleva. */
  breadcrumb?: string;
  /**
   * H1 de la home. Vive aquí y no en `translations.js` porque no se pinta como
   * texto de interfaz: va oculto (`sr-only`) en el HTML estático, ya que el hero
   * visible es un rotador animado que no existe hasta que React se hidrata.
   * El resto de páginas llevan su H1 dentro del componente, ya traducido.
   */
  h1?: string;
}

export const PAGE_META: Record<PageKey, Record<Locale, PageMeta>> = {
  home: {
    es: {
      title: 'Desarrollo Web, Apps Móviles e IA en México | Geck Codex',
      description:
        'Agencia de desarrollo de software en Parral, Chihuahua. Sitios web, apps móviles, IA y e-commerce a la medida. Cotización sin costo y respuesta en 24 h.',
      ogTitle: 'Desarrollo web, apps e IA — Parral y Chihuahua',
      ogDescription:
        'Software a la medida para empresas de México y Estados Unidos. Cotización sin costo y respuesta en menos de 24 horas.',
      h1: 'Geck Codex — Desarrollo web, apps móviles e inteligencia artificial en Parral, Chihuahua, México',
    },
    en: {
      title: 'Web Development, Mobile Apps & AI in Mexico | Geck Codex',
      description:
        'Software development agency in Parral, Chihuahua. Custom websites, mobile apps, AI and e-commerce. Free quote and a reply in under 24 hours.',
      ogTitle: 'Web development, apps and AI — Parral, Mexico',
      ogDescription:
        'Custom software for companies in Mexico and the United States. Free quote and a reply in under 24 hours.',
      h1: 'Geck Codex — Web development, mobile apps and artificial intelligence in Parral, Chihuahua, Mexico',
    },
    pt: {
      title: 'Desenvolvimento Web, Apps e IA no México | Geck Codex',
      description:
        'Agência de desenvolvimento de software em Parral, Chihuahua. Sites, aplicativos móveis, IA e e-commerce sob medida. Orçamento grátis e resposta em 24 h.',
      ogTitle: 'Desenvolvimento web, apps e IA — Parral, México',
      ogDescription:
        'Software sob medida para empresas do México e dos Estados Unidos. Orçamento sem custo e resposta em menos de 24 horas.',
      h1: 'Geck Codex — Desenvolvimento web, aplicativos móveis e inteligência artificial em Parral, Chihuahua, México',
    },
  },

  services: {
    es: {
      title: 'Servicios de Desarrollo Web, Apps e IA en México | Geck Codex',
      description:
        'Desarrollo web, apps móviles, inteligencia artificial, e-commerce, SaaS, automatización y marketing digital. Cotización sin costo para tu negocio en México.',
      breadcrumb: 'Servicios',
    },
    en: {
      title: 'Web Development, Mobile App and AI Services | Geck Codex',
      description:
        'Web development, mobile apps, artificial intelligence, e-commerce, SaaS, automation and digital marketing. Free quote for your business in Mexico.',
      breadcrumb: 'Services',
    },
    pt: {
      title: 'Serviços de Desenvolvimento Web, Apps e IA | Geck Codex',
      description:
        'Desenvolvimento web, aplicativos móveis, inteligência artificial, e-commerce, SaaS, automação e marketing digital. Orçamento grátis para o seu negócio.',
      breadcrumb: 'Serviços',
    },
  },

  ecosystem: {
    es: {
      title: 'Ecosistema Geck Codex | Menú Digital, POS, Lealtad y CRM',
      description:
        'Menú digital, punto de venta, programa de lealtad, CRM y chatbot. Cada módulo cuesta $300 MXN al mes, sin pago de implementación, y juntos se conectan entre sí.',
      breadcrumb: 'Ecosistema',
    },
    en: {
      title: 'Geck Codex Ecosystem | Digital Menu, POS, Loyalty and CRM',
      description:
        'Digital menu, point of sale, loyalty program, CRM and chatbot. Each module costs $300 MXN a month, with no setup fee, and together they connect.',
      breadcrumb: 'Ecosystem',
    },
    pt: {
      title: 'Ecossistema Geck Codex | Cardápio, PDV, Fidelidade e CRM',
      description:
        'Cardápio digital, ponto de venda, programa de fidelidade, CRM e chatbot. Cada módulo custa $300 MXN por mês, sem taxa de implementação, e juntos se conectam.',
      breadcrumb: 'Ecossistema',
    },
  },
  custom: {
    es: {
      title: 'Software a Medida: ERP, CRM y Apps | Geck Codex México',
      description:
        'Desarrollo de software a la medida de tu operación: ERP, CRM, apps móviles, automatización e IA. Desde $5,000 MXN, con garantía de por vida en el código.',
      breadcrumb: 'A medida',
    },
    en: {
      title: 'Custom Software: ERP, CRM and Mobile Apps | Geck Codex',
      description:
        'Custom software built around your operation: ERP, CRM, mobile apps, automation and AI. From $5,000 MXN, with a lifetime warranty on the code we write.',
      breadcrumb: 'Custom built',
    },
    pt: {
      title: 'Software Sob Medida: ERP, CRM e Apps | Geck Codex',
      description:
        'Software sob medida para a sua operação: ERP, CRM, apps mobile, automação e IA. A partir de $5,000 MXN, com garantia vitalícia sobre o nosso código.',
      breadcrumb: 'Sob medida',
    },
  },
  portfolio: {
    es: {
      title: 'Portafolio: Proyectos de Apps, Web e IA | Geck Codex',
      description:
        'Proyectos reales de Geck Codex: apps móviles, sistemas de visión artificial, plataformas web, e-commerce y landings de alta conversión para clientes en México.',
      breadcrumb: 'Portafolio',
    },
    en: {
      title: 'Portfolio: App, Web and AI Projects | Geck Codex',
      description:
        'Real projects by Geck Codex: mobile apps, computer vision systems, web platforms, e-commerce and high-conversion landing pages for clients in Mexico.',
      breadcrumb: 'Portfolio',
    },
    pt: {
      title: 'Portfólio: Projetos de Apps, Web e IA | Geck Codex',
      description:
        'Projetos reais da Geck Codex: aplicativos móveis, sistemas de visão computacional, plataformas web, e-commerce e landing pages de alta conversão.',
      breadcrumb: 'Portfólio',
    },
  },

  about: {
    es: {
      title: 'Nosotros: Equipo Tecnológico en Parral, Chihuahua | Geck Codex',
      description:
        'Conoce al equipo de Geck Codex: desarrolladores mexicanos expertos en React, Node.js, Python, Flutter e IA, con sede en Hidalgo del Parral, Chihuahua.',
      breadcrumb: 'Nosotros',
    },
    en: {
      title: 'About Us: Tech Team in Parral, Chihuahua | Geck Codex',
      description:
        'Meet the team behind Geck Codex: Mexican developers specializing in React, Node.js, Python, Flutter and AI, based in Hidalgo del Parral, Chihuahua.',
      breadcrumb: 'About',
    },
    pt: {
      title: 'Sobre Nós: Equipe de Tecnologia no México | Geck Codex',
      description:
        'Conheça a equipe da Geck Codex: desenvolvedores mexicanos especializados em React, Node.js, Python, Flutter e IA, com sede em Hidalgo del Parral.',
      breadcrumb: 'Sobre nós',
    },
  },

  contact: {
    es: {
      title: 'Contacto: Cotiza tu Proyecto Digital | Geck Codex',
      description:
        'Contáctanos por WhatsApp, correo o Instagram. Respuesta en menos de 24 horas y consultoría inicial sin costo para tu proyecto web, app o de inteligencia artificial.',
      ogTitle: 'Cotiza tu proyecto — respuesta en menos de 24 h',
      ogDescription:
        'Escríbenos por WhatsApp, correo o formulario. Consultoría inicial sin costo para tu proyecto web, app o de inteligencia artificial.',
      breadcrumb: 'Contacto',
    },
    en: {
      title: 'Contact: Get a Quote for Your Project | Geck Codex',
      description:
        'Reach us on WhatsApp, email or Instagram. Get a reply in under 24 hours and a free initial consultation for your web, mobile app or AI project.',
      ogTitle: 'Get a quote — reply in under 24 hours',
      ogDescription:
        'Message us on WhatsApp, by email or through the form. Free initial consultation for your web, mobile app or AI project.',
      breadcrumb: 'Contact',
    },
    pt: {
      title: 'Contato: Solicite um Orçamento | Geck Codex',
      description:
        'Fale conosco por WhatsApp, e-mail ou Instagram. Resposta em menos de 24 horas e consultoria inicial gratuita para o seu projeto web, app ou de IA.',
      ogTitle: 'Solicite um orçamento — resposta em 24 h',
      ogDescription:
        'Fale conosco por WhatsApp, e-mail ou pelo formulário. Consultoria inicial gratuita para o seu projeto web, app ou de IA.',
      breadcrumb: 'Contato',
    },
  },

  /* Las legales llevan meta propia pero no se optimizan para buscar: nadie
     llega a un aviso de privacidad desde Google. El title y la description
     existen para que la pestaña y la vista previa sean legibles, y porque
     Google Ads revisa estas dos páginas a mano antes de aprobar una campaña. */
  privacy: {
    es: {
      title: 'Aviso de Privacidad y Datos Personales | Geck Codex',
      description:
        'Aviso de privacidad de Geck Codex: qué datos personales recabamos en este sitio, para qué los usamos, con quién se comparten y cómo ejercer tus derechos ARCO.',
      breadcrumb: 'Aviso de Privacidad',
    },
    en: {
      title: 'Privacy Notice and Personal Data | Geck Codex',
      description:
        'Geck Codex privacy notice: what personal data we collect on this site, what we use it for, who it is shared with, and how to exercise your data rights.',
      breadcrumb: 'Privacy Notice',
    },
    pt: {
      title: 'Aviso de Privacidade e Dados Pessoais | Geck Codex',
      description:
        'Aviso de privacidade da Geck Codex: quais dados pessoais coletamos neste site, para que os usamos, com quem são compartilhados e como exercer seus direitos.',
      breadcrumb: 'Aviso de Privacidade',
    },
  },

  terms: {
    es: {
      title: 'Términos y Condiciones de Uso | Geck Codex',
      description:
        'Términos y condiciones de uso de geckcodex.com y de la contratación de servicios de desarrollo de software: cotizaciones, propiedad intelectual y ley aplicable.',
      breadcrumb: 'Términos y Condiciones',
    },
    en: {
      title: 'Terms and Conditions of Use | Geck Codex',
      description:
        'Terms and conditions for using geckcodex.com and for hiring software development services: quotes, intellectual property, liability and governing law.',
      breadcrumb: 'Terms and Conditions',
    },
    pt: {
      title: 'Termos e Condições de Uso do Site | Geck Codex',
      description:
        'Termos e condições de uso do geckcodex.com e da contratação de serviços de desenvolvimento de software: orçamentos, propriedade intelectual e lei aplicável.',
      breadcrumb: 'Termos e Condições',
    },
  },
};
