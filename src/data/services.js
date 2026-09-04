/**
 * Los siete servicios que se construyen a medida.
 *
 * Vive aqui y no dentro del componente porque lo consumen dos sitios: la
 * pagina de a medida (catalogo en HTML estatico) y el modal de detalle.
 * Los textos NO estan aqui: se resuelven por `slug` contra `services.items`
 * en `src/i18n/translations.js`, que es lo que se traduce a los tres idiomas.
 *
 * `slug` es ademas el id del ancla: la home enlaza a #web, #ia y #mobile.
 * Cambiarlo rompe esos enlaces.
 */
export const SERVICES_STATIC = [
  { id: 0, slug: 'web',            cat: 0, image: '/assets/image/servicios/webser.webp'     },
  { id: 1, slug: 'mobile',         cat: 0, image: '/assets/image/servicios/celser.webp'     },
  { id: 2, slug: 'ia',             cat: 0, image: '/assets/image/servicios/iaser.webp'      },
  { id: 3, slug: 'ecommerce',      cat: 0, image: '/assets/image/servicios/ecomersser.webp' },
  { id: 4, slug: 'saas',           cat: 0, image: '/assets/image/servicios/saasser.webp'    },
  { id: 5, slug: 'automatizacion', cat: 0, image: '/assets/image/servicios/autoserv.webp'   },
  { id: 6, slug: 'custom',         cat: 0, image: '/assets/image/servicios/medidaser.webp'  },
];
