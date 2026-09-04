/**
 * Verifica que los títulos y descripciones de `src/i18n/seo-meta.ts` caigan en
 * el rango que Google muestra sin truncar. Correr al tocar las metas:
 *   node scripts/check-seo-meta.mjs
 *
 * Los límites reales de Google son en píxeles, no en caracteres; estos rangos
 * son la aproximación habitual y dejan margen para el ancho variable.
 */

import { readFileSync } from 'node:fs';

const TITLE = { min: 40, max: 62 };
const DESC = { min: 140, max: 165 };

// seo-meta.ts es TypeScript: en vez de compilarlo, se extraen los literales con
// una expresión regular. Basta para contar longitudes y evita añadir tsx como
// dependencia solo para esto.
//
// Los saltos de línea se normalizan porque en Windows el archivo llega con
// CRLF, y el retorno de carro sobrante impide que el `$` de cada expresión
// cierre la línea: sin esto el recorrido no encuentra ni una sola meta.
const src = readFileSync(new URL('../src/i18n/seo-meta.ts', import.meta.url), 'utf8').replace(
  /\r\n/g,
  '\n',
);

// Recorre el archivo de arriba abajo recordando en qué página e idioma va, para
// poder nombrar el problema con precisión. El valor puede estar en la misma
// línea que la clave o en la siguiente, según cómo lo haya partido el formateo.
const PAGE = /^ {2}(\w+): \{$/;
const LOCALE = /^ {4}(es|en|pt): \{$/;
// El espacio va dentro del grupo opcional: cuando el valor pasa a la línea
// siguiente, la línea de la clave termina justo en los dos puntos.
const FIELD = /^ {6}(title|description):(?: '(.*)',)?$/;
const VALUE = /^ {8}'(.*)',$/;

const problems = [];
let checked = 0;
let page = null;
let locale = null;
let pending = null;

for (const line of src.split('\n')) {
  if (pending) {
    const value = line.match(VALUE);
    if (value) check(page, locale, pending, value[1]);
    pending = null;
    continue;
  }

  const pageMatch = line.match(PAGE);
  if (pageMatch) { page = pageMatch[1]; continue; }

  const localeMatch = line.match(LOCALE);
  if (localeMatch) { locale = localeMatch[1]; continue; }

  const field = line.match(FIELD);
  if (!field) continue;
  if (field[2] === undefined) pending = field[1];
  else check(page, locale, field[1], field[2]);
}

function check(page, locale, field, raw) {
  // Un escape de comilla simple es un carácter, no dos.
  const value = raw.replace(/\\'/g, "'");
  const { min, max } = field === 'title' ? TITLE : DESC;
  checked++;
  if (value.length < min || value.length > max) {
    problems.push(
      `${page}.${locale}.${field}: ${value.length} caracteres (rango ${min}-${max})\n    ${value}`,
    );
  }
}

// Un checker que no encuentra nada pasaría siempre: si el formato del archivo
// cambia y el recorrido deja de reconocerlo, esto lo convierte en un fallo.
// Se deriva del mapa de rutas en vez de fijarlo a mano: al anadir una pagina
// el numero cambia solo, y el checker sigue detectando que el formato del
// archivo dejo de reconocerse (que es para lo que existe).
const { SLUGS, LOCALES } = await import('../src/i18n/routes-map.js');
const EXPECTED = Object.keys(SLUGS).length * LOCALES.length * 2;
if (checked !== EXPECTED) {
  console.error(
    `✗ Se revisaron ${checked} metas y se esperaban ${EXPECTED}.\n` +
      '  El formato de seo-meta.ts cambió y las expresiones de este script ya no lo reconocen.',
  );
  process.exit(1);
}

if (problems.length) {
  console.error(`✗ ${problems.length} de ${checked} meta(s) fuera de rango:\n`);
  for (const problem of problems) console.error('  ' + problem + '\n');
  process.exit(1);
}
console.log(`✓ ${checked} metas de seo-meta.ts en rango.`);
