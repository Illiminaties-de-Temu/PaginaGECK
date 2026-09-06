/**
 * Fuente unica de verdad del portafolio.
 *
 * Vive aqui y no dentro de un componente porque la lista la consumen tres
 * lugares con necesidades distintas: la pagina de portafolio (grid + detalle),
 * el carrusel de la home (una seleccion) y el JSON-LD de `Portfolio.astro`.
 * Cuando cada uno tenia su copia, divergieron: el mismo proyecto aparecia con
 * dos nombres y dos ids segun la seccion.
 *
 * Los textos (tagline, descripcion) NO viven aqui: se resuelven por `id` contra
 * `src/i18n/translations.js`, que es lo que se traduce a los tres idiomas.
 *
 * Campos opcionales por proyecto:
 *   image      captura/logo principal — portada de la ficha y fondo del detalle
 *   cardImage  imagen SOLO para la tarjeta, cuando la portada no se lee a ese tamano
 *   gallery    capturas del producto por dentro. El pie de cada una se traduce
 *              en `projects[id].shots`, en el MISMO orden que este array. Sin
 *              `gallery`, la ficha cae a la imagen unica y no dibuja controles.
 *   link       demo publica. Solo la mitad del portafolio la tiene: en el resto
 *              la galeria es lo unico que ensena el producto por dentro.
 */

export const PROJECTS_STATIC = [
  { id: 22, cat: 'landing',  title: 'Handlove',               tech: ['Astro', 'Tailwind CSS'],                                            link: 'https://handloves.mx/',                   gradient: 'linear-gradient(145deg, #030C1D 0%, #0D1625 45%, #F4E4BC 100%)', image: '/assets/image/portafolio/handlove.webp', cardFit: 'contain',
    gallery: ['/assets/image/portafolio/handloves-2.webp', '/assets/image/portafolio/handloves-m-1.webp', '/assets/image/portafolio/handloves-3.webp'] },
  { id: 19, cat: 'mobile',   title: 'Ganova App',             tech: ['Flutter', 'Firebase', 'SQLite'],                                                                                     gradient: 'linear-gradient(145deg, #0B1D33 0%, #0c1e3c 45%, #D4AF37 100%)', image: '/assets/image/portafolio/ganova.webp',
    gallery: ['/assets/image/portafolio/ganova-1.webp', '/assets/image/portafolio/ganova-2.webp', '/assets/image/portafolio/ganova-3.webp'] },
  { id: 24, cat: 'software', title: 'Bot de Atención al Cliente', tech: ['Python', 'FastAPI', 'PostgreSQL', 'WhatsApp API'], gradient: 'linear-gradient(145deg, #1e1e1c 0%, #0B1D33 50%, #B8941F 100%)', image: '/assets/image/portafolio/nomda.webp' },
  { id: 21, cat: 'software', title: 'Bot Calificador de Leads', tech: ['Python', 'FastAPI', 'PostgreSQL', 'WhatsApp API'],                                                                  gradient: 'linear-gradient(145deg, #222220 0%, #0B1D33 50%, #D4AF37 100%)', image: '/assets/image/portafolio/seguiar_resized.webp', cardFit: 'contain' },
  { id: 6,  cat: 'landing',  title: 'Mi Caja POS',           tech: ['Astro', 'React', 'Tailwind CSS'],                                   link: 'https://mi-caja.geckcodex.com/',            gradient: 'linear-gradient(145deg, #1c1917 0%, #92400e 45%, #d97706 100%)', image: '/assets/image/portafolio/micaja.webp', cardImage: '/assets/image/portafolio/mi-caja.webp',
    gallery: ['/assets/image/portafolio/micaja-movil-1.webp', '/assets/image/portafolio/micaja-movil-2.webp', '/assets/image/portafolio/micaja-movil-3.webp'] },
  { id: 25, cat: 'webapp',   title: 'Mi Caja Restaurante',   tech: ['React', 'Node.js', 'PostgreSQL', 'Flutter'],                                                                          gradient: 'linear-gradient(145deg, #0c1e3c 0%, #14532d 45%, #0B1D33 100%)', image: '/assets/image/portafolio/micaja-res.webp', cardFit: 'contain', cardBg: '#D4D4CC',
    gallery: ['/assets/image/portafolio/micaja-res-1.webp', '/assets/image/portafolio/micaja-res-3.webp', '/assets/image/portafolio/micaja-res-2.webp'] },
  { id: 17, cat: 'mobile',   title: 'Nuki',                   tech: ['Flutter', 'Firebase'],                                                                    gradient: 'linear-gradient(145deg, #030C1D 0%, #0B1D33 45%, #B8941F 100%)', image: '/assets/image/portafolio/nuki.webp', cardFit: 'contain', cardBg: '#FFFFFF',
    gallery: ['/assets/image/portafolio/nuki-1.webp', '/assets/image/portafolio/nuki-2.webp', '/assets/image/portafolio/nuki-3.webp'] },
  { id: 18, cat: 'webapp',   title: 'Tablá',                  tech: ['Astro', 'React', 'Tailwind CSS'],                                                                                    gradient: 'linear-gradient(145deg, #1e1e1c 0%, #222220 40%, #D4AF37 100%)', image: '/assets/image/portafolio/tabla.webp', cardFit: 'contain', cardBg: '#D4D4CC', link: 'https://laschikis.vercel.app/?tema=fonda' },
  { id: 3,  cat: 'landing',  title: 'LandingKit',            tech: ['Astro', 'React', 'Tailwind CSS'],                                   link: 'https://landig-plantilla.geckcodex.com/',   gradient: 'linear-gradient(145deg, #2e1065 0%, #7c3aed 45%, #c026d3 100%)', image: '/assets/image/portafolio/landig.webp', cardFit: 'contain', cardBg: '#D4D4CC',
    gallery: ['/assets/image/portafolio/landig-2.webp', '/assets/image/portafolio/landig-3.webp', '/assets/image/portafolio/landig-m-1.webp'] },
  { id: 23, cat: 'landing',  title: 'Plantilla Inmobiliaria', tech: ['Astro', 'React', 'Tailwind CSS'],                                                                                    gradient: 'linear-gradient(145deg, #0c1e3c 0%, #0B1D33 45%, #B8941F 100%)', image: '/assets/image/portafolio/inmovil.webp', cardImage: '/assets/image/portafolio/landig.webp', link: 'https://inmobil.netlify.app/', cardFit: 'contain', cardBg: '#E7E7E3',
    gallery: ['/assets/image/portafolio/inmo-1.webp', '/assets/image/portafolio/inmo-2.webp', '/assets/image/portafolio/inmo-3.webp'] },
  { id: 1,  cat: 'landing',  title: 'Chuchulucos',          tech: ['Astro', 'Tailwind CSS', 'Framer Motion'],                           link: 'https://chuchulucos.geckcodex.com/',        gradient: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 40%, #db2777 100%)', image: '/assets/image/portafolio/chuchu.webp', cardImage: '/assets/image/portafolio/chuchulucos.webp', cardFit: 'contain', cardBg: '#161616',
    gallery: ['/assets/image/portafolio/chuchu-1.webp', '/assets/image/portafolio/chuchu-2.webp', '/assets/image/portafolio/chuchu-3.webp'] },
  { id: 2,  cat: 'landing',  title: 'Agend-In',              tech: ['Astro', 'React', 'Node.js', 'Tailwind CSS'],                        link: 'https://agend-in.geckcodex.com/',           gradient: 'linear-gradient(145deg, #1e1b4b 0%, #4f46e5 45%, #0ea5e9 100%)', image: '/assets/image/portafolio/agendin.webp', cardImage: '/assets/image/portafolio/agendin-card.webp' },
  { id: 7,  cat: 'mobile',   title: 'Capital Transport',     tech: ['React Native', 'Node.js', 'Firebase', 'Google Maps API'],                                                              gradient: 'linear-gradient(145deg, #0c1a3d 0%, #1d4ed8 45%, #0ea5e9 100%)', image: '/assets/image/portafolio/capital transpor.webp' },
  { id: 9,  cat: 'webapp',   title: 'Coronado Gym',          tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],                                                                     gradient: 'linear-gradient(145deg, #0a2e1a 0%, #15803d 45%, #0d9488 100%)', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&q=80&auto=format&fit=crop' },
  { id: 11, cat: 'webapp',   title: 'Generador de Gafetes',  tech: ['React', 'Node.js', 'PostgreSQL', 'PDF-lib', 'QR Generator'],                                                         gradient: 'linear-gradient(145deg, #1c1917 0%, #064e3b 45%, #0f766e 100%)', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=80&auto=format&fit=crop' },
  { id: 26, cat: 'mobile',   title: 'My Ticket',             tech: ['Flutter', 'Firebase', 'SQLite', 'OCR'],                                                                               gradient: 'linear-gradient(145deg, #0d0d0b 0%, #1e1e1c 45%, #65a30d 100%)',
    gallery: ['/assets/image/portafolio/mytiket-m-2.webp', '/assets/image/portafolio/mytiket-m-1.webp', '/assets/image/portafolio/mytiket-m-3.webp'] },
];

/* Seleccion que se muestra en el carrusel de la home. Solo ids: el titulo, la
 * imagen y la categoria salen de la tabla de arriba. */
export const HOME_PROJECT_IDS = [1, 2, 3, 6, 7, 9];

export const projectById = (id) => PROJECTS_STATIC.find((p) => p.id === id);
