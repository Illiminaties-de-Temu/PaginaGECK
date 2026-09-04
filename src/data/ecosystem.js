/**
 * Modulos del ecosistema y como se conectan entre si.
 *
 * Aqui SOLO viven los productos propios: los que ya existen, se dan de alta y
 * se hablan entre si. Web, App y Chatbot NO estan, aunque antes si: se
 * construyen para cada cliente —una landing, un arbol de decisiones, cinco
 * pantallas— y eso es desarrollo a medida, no producto de catalogo. Viven en
 * `src/data/packages.js`, dentro de /servicios/a-medida/.
 *
 * Los NOMBRES y las frases de cada conexion NO viven aqui: se resuelven por
 * `id` contra `services.eco` en `src/i18n/translations.js`, que es lo que se
 * traduce a los tres idiomas.
 *
 * PRECIO: cada modulo son $300 al mes y no hay pago de alta. Se decidio asi
 * el 3 de septiembre de 2026, sustituyendo al modelo anterior de
 * implementacion (de $4,000 a $12,000 segun el modulo) mas mensualidad.
 *
 * Que sean todos iguales no es pereza de tabla: es lo que permite que el
 * precio se entienda sin leerlo —tres modulos son $900— y que encender uno
 * mas no obligue a rehacer la cuenta. El dia que un modulo valga distinto,
 * `sub` esta por modulo y solo hay que cambiarle el numero.
 */

/** Lo que cuesta cada modulo al mes. */
export const MONTHLY = 300;

/**
 * `x` e `y` son la posicion en el diagrama (viewBox 760x330). Se guardan como
 * dato y no como calculo porque la disposicion esta pensada para que los
 * cables se crucen lo menos posible; recolocar un modulo es mover su par.
 */
export const MODULES = [
  { id: 'menu', x: 20,  y: 20,  sub: MONTHLY, img: '/assets/image/portafolio/menudigital.webp' },
  { id: 'crm',  x: 297, y: 20,  sub: MONTHLY },
  { id: 'cita', x: 575, y: 20,  sub: MONTHLY, img: '/assets/image/portafolio/agendin.webp' },
  { id: 'pos',  x: 20,  y: 250, sub: MONTHLY, img: '/assets/image/portafolio/mi-caja.webp' },
  { id: 'nuki', x: 297, y: 250, sub: MONTHLY, img: '/assets/image/portafolio/nuki-1.webp' },
  { id: 'nfc',  x: 575, y: 250, sub: 0, soon: true },
];

/**
 * `confirmed: true` = el usuario confirmo que esa conexion existe por diseno.
 * `false` = la supongo yo y esta pendiente de confirmar; se marca en pantalla.
 *
 * Ninguna esta implementada con un cliente real todavia, asi que el lenguaje
 * publico es "se dejan conectados", nunca "clientes con el ecosistema".
 */
export const LINKS = [
  { a: 'pos',  b: 'menu', confirmed: true  },
  { a: 'pos',  b: 'nuki', confirmed: true  },
  { a: 'menu', b: 'nuki', confirmed: true  },
  { a: 'crm',  b: 'nuki', confirmed: false },
  { a: 'crm',  b: 'cita', confirmed: false },
  { a: 'nfc',  b: 'crm',  confirmed: false },
];

/**
 * Configuraciones por rubro. NO llevan precio cerrado: son atajos que
 * encienden varios modulos de golpe, y el total sigue siendo la suma de las
 * piezas. El dia que un rubro tenga precio propio deja de ser un atajo y
 * pasa a modelarse como los paquetes de `packages.js`.
 */
export const PRESETS = [
  { id: 'restaurante', mods: ['menu', 'pos', 'nuki'] },
  { id: 'retail',      mods: ['pos', 'nuki'] },
  { id: 'citas',       mods: ['cita', 'crm'] },
  { id: 'fidelidad',   mods: ['nuki', 'crm'] },
];

/** Clave de una conexion, en el orden en que esta declarada. */
export const linkKey = (l) => `${l.a}-${l.b}`;
