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
 */

export const PROJECTS_STATIC = [
  { id: 1,  cat: 'landing',  title: 'Chuchulucos',          tech: ['Astro', 'Tailwind CSS', 'Framer Motion'],                           link: 'https://chuchulucos.geckcodex.com/',        gradient: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 40%, #db2777 100%)', image: '/assets/image/portafolio/chuchu.webp', cardImage: '/assets/image/portafolio/chuchulucos.png', cardFit: 'contain', cardBg: '#141414' },
  { id: 2,  cat: 'landing',  title: 'Agend-In',              tech: ['Astro', 'React', 'Node.js', 'Tailwind CSS'],                        link: 'https://agend-in.geckcodex.com/',           gradient: 'linear-gradient(145deg, #1e1b4b 0%, #4f46e5 45%, #0ea5e9 100%)', image: '/assets/image/portafolio/agendin.webp', cardImage: '/assets/image/portafolio/agendin.jpeg' },
  { id: 3,  cat: 'landing',  title: 'LandingKit',            tech: ['Astro', 'React', 'Tailwind CSS'],                                   link: 'https://landig-plantilla.geckcodex.com/',   gradient: 'linear-gradient(145deg, #2e1065 0%, #7c3aed 45%, #c026d3 100%)', image: '/assets/image/portafolio/landig.webp', cardFit: 'contain', imgPos: 'center 38%' },
  { id: 6,  cat: 'landing',  title: 'Mi Caja POS',           tech: ['Astro', 'React', 'Tailwind CSS'],                                   link: 'https://mi-caja.geckcodex.com/',            gradient: 'linear-gradient(145deg, #1c1917 0%, #92400e 45%, #d97706 100%)', image: '/assets/image/portafolio/micaja.webp', cardImage: '/assets/image/portafolio/mi%20caja.png' },
  { id: 7,  cat: 'mobile',   title: 'Capital Transport',     tech: ['React Native', 'Node.js', 'Firebase', 'Google Maps API'],                                                              gradient: 'linear-gradient(145deg, #0c1a3d 0%, #1d4ed8 45%, #0ea5e9 100%)', image: '/assets/image/portafolio/capital transpor.webp' },
  { id: 9,  cat: 'webapp',   title: 'Coronado Gym',          tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],                                                                     gradient: 'linear-gradient(145deg, #0a2e1a 0%, #15803d 45%, #0d9488 100%)', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&q=80&auto=format&fit=crop' },
  { id: 11, cat: 'webapp',   title: 'Generador de Gafetes',  tech: ['React', 'Node.js', 'PostgreSQL', 'PDF-lib', 'QR Generator'],                                                         gradient: 'linear-gradient(145deg, #1c1917 0%, #064e3b 45%, #0f766e 100%)', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=80&auto=format&fit=crop' },
  { id: 17, cat: 'webapp',   title: 'Nuki',                   tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],                                                                    gradient: 'linear-gradient(145deg, #030C1D 0%, #0B1D33 45%, #B8941F 100%)', image: '/assets/image/portafolio/nuki2.png', cardFit: 'contain', cardBg: '#FFFFFF' },
  { id: 18, cat: 'webapp',   title: 'Menús Digitales',        tech: ['Astro', 'React', 'Tailwind CSS'],                                                                                    gradient: 'linear-gradient(145deg, #1e1e1c 0%, #222220 40%, #D4AF37 100%)', image: '/assets/image/portafolio/menudigital.png', link: 'https://laschikis.vercel.app/?tema=fonda' },
  { id: 19, cat: 'mobile',   title: 'Ganova App',             tech: ['Flutter', 'Firebase', 'SQLite'],                                                                                     gradient: 'linear-gradient(145deg, #0B1D33 0%, #0c1e3c 45%, #D4AF37 100%)', image: '/assets/image/portafolio/ganova.png' },
  { id: 21, cat: 'software', title: 'Bot Calificador de Leads', tech: ['Python', 'FastAPI', 'PostgreSQL', 'WhatsApp API'],                                                                  gradient: 'linear-gradient(145deg, #222220 0%, #0B1D33 50%, #D4AF37 100%)', image: '/assets/image/portafolio/seguiar_resized.png', cardFit: 'contain' },
  { id: 22, cat: 'landing',  title: 'Handlove',               tech: ['Astro', 'Tailwind CSS'],                                            link: 'https://handloves.mx/',                   gradient: 'linear-gradient(145deg, #030C1D 0%, #0D1625 45%, #F4E4BC 100%)', image: '/assets/image/portafolio/handlove.png', cardFit: 'contain' },
  { id: 23, cat: 'landing',  title: 'Plantilla Inmobiliaria', tech: ['Astro', 'React', 'Tailwind CSS'],                                                                                    gradient: 'linear-gradient(145deg, #0c1e3c 0%, #0B1D33 45%, #B8941F 100%)', image: '/assets/image/portafolio/inmovil.png', link: 'https://inmobil.netlify.app/', cardFit: 'contain', imgPos: 'center 38%' },
  { id: 24, cat: 'software', title: 'Bot de Atención al Cliente', tech: ['Python', 'FastAPI', 'PostgreSQL', 'WhatsApp API'], gradient: 'linear-gradient(145deg, #1e1e1c 0%, #0B1D33 50%, #B8941F 100%)', image: '/assets/image/portafolio/nomda.jpg' },
];

/* Seleccion que se muestra en el carrusel de la home. Solo ids: el titulo, la
 * imagen y la categoria salen de la tabla de arriba. */
export const HOME_PROJECT_IDS = [1, 2, 3, 6, 7, 9];

export const projectById = (id) => PROJECTS_STATIC.find((p) => p.id === id);
