/**
 * Paquetes de referencia de desarrollo a medida.
 *
 * Salen de la "Propuesta de Soluciones Digitales" y estan en la pagina para
 * que quien llega se haga una idea de QUE se puede construir y cuanto cuesta
 * aproximadamente. No son productos de catalogo: cada uno se construye para
 * el cliente. Por eso no viven en `ecosystem.js` — ninguno toca el Menu, el
 * POS, Nuki, el CRM ni Agend-In; todos son combinaciones de Web, App,
 * Chatbot y Tienda, que se hacen a medida.
 *
 * `price` es texto y no numero a proposito: hay rangos ("$20,000 - $25,000")
 * y hay "desde". Y `was` no es un descuento calculado: es lo que costarian
 * las piezas cotizadas por separado, que es un dato comercial, no una resta
 * de precios de catalogo.
 *
 * Los textos (nombre, descripcion, limite) se traducen en
 * `services.custom.packages` de `src/i18n/translations.js`.
 *
 * `pieces` es lo que enciende cada paquete en el selector de la pagina. Las
 * ocho combinaciones de aqui NO son las quince posibles: las que faltan
 * (App+Chatbot, Tienda+App, Tienda con todo...) a proposito no tienen precio
 * armado y la pagina dice que se cotizan.
 */
export const PACKAGES = [
  { id: 'presencia',   pieces: ['web'],               price: '$5,000 - $8,000' },
  { id: 'atencion',    pieces: ['bot'],               price: '$15,000' },
  { id: 'appmvp',      pieces: ['app'],               price: '$20,000 - $25,000' },
  { id: 'ecomStarter', pieces: ['shop'],              price: '$15,000 - $18,000' },
  { id: 'conectado',   pieces: ['web', 'bot'],        price: '$19,500', was: '$23,000', save: '$3,500' },
  { id: 'expansion',   pieces: ['web', 'app'],        price: '$48,000', was: '$55,000', save: '$7,000' },
  { id: 'ecomPro',     pieces: ['web', 'shop'],       price: '$35,000 - $45,000' },
  { id: 't360',        pieces: ['web', 'app', 'bot'], price: '$75,000', was: '$87,000', save: '$12,000' },
];

/**
 * El escalon Enterprise no es una pieza mas: es el mismo trabajo hecho con
 * arquitectura dedicada, roles complejos e integracion con lo que ya corre
 * en la empresa. Por eso en el selector es un interruptor aparte y no una
 * cuarta pastilla junto a Web o App — encenderlo no agrega una pieza, cambia
 * el nivel de todo lo encendido.
 *
 * Solo hay dos destinos: con tienda es la pasarela propia, y sin tienda es
 * el software corporativo a medida. Ambos se venden despues de un discovery,
 * asi que el precio es un "desde" y no una cifra cerrada.
 */
export const ENTERPRISE = {
  shop: { id: 'ecomEnter',  price: '$85,000',             from: true, tier: true },
  base: { id: 'enterprise', price: '$85,000 - $100,000',  from: true, tier: true },
};

/** Las piezas que se encienden, en el orden en que se muestran. */
export const PIECES = ['web', 'app', 'bot', 'shop'];

/** Clave estable para una seleccion: ordenada por PIECES para que {app,web}
 *  y {web,app} caigan en el mismo paquete. */
export const keyOf = (sel) => PIECES.filter((x) => sel.includes(x)).join('+');

const BY_KEY = Object.fromEntries(PACKAGES.map((p) => [keyOf(p.pieces), p]));

/** Devuelve el paquete de una seleccion, o null.
 *
 *  En Enterprise siempre hay respuesta: el escalon existe para cualquier
 *  combinacion, porque ahi lo que se cotiza es la arquitectura y no las
 *  piezas. En el escalon normal, en cambio, hay combinaciones sin paquete
 *  armado —App + Chatbot, o Tienda + App— y esta bien: en vez de inventarles
 *  un precio, la pagina dice que esa combinacion se cotiza.
 */
export const packageFor = (sel, enterprise = false) => {
  if (enterprise) return sel.includes('shop') ? ENTERPRISE.shop : ENTERPRISE.base;
  return BY_KEY[keyOf(sel)] || null;
};
