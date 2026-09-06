/**
 * Regenera en alta las capturas que se abren en el visor del portafolio.
 *
 * `optimize-images.mjs` deja todo el portafolio a 800px, que es el ancho al que
 * se pinta una tarjeta del grid. En el visor de la ficha esa misma imagen ocupa
 * media pantalla, y en un mockup de telefono el celular es solo ~28% del ancho:
 * la pantalla del producto acababa a ~220px reales y el texto se deshacia.
 *
 * Este script recorre los arrays `gallery` de src/data/projects.js y rehace solo
 * esas imagenes desde su original (.png/.jpg/.jpeg) a 1600px. Pesan ~4x mas,
 * pero se cargan solo al abrir la ficha, no en la rejilla.
 *
 * Uso: node scripts/optimize-gallery.mjs
 */

import sharp from 'sharp';
import { readFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const WIDTH = 1600;
const QUALITY = 90;
const SOURCE_EXTS = ['.png', '.jpg', '.jpeg'];

const src = await readFile(join(root, 'src', 'data', 'projects.js'), 'utf8');

// Las rutas de galeria son literales en el archivo de datos: se leen con una
// expresion en vez de importar el modulo para no arrastrar el resto del bundle.
const paths = new Set();
for (const block of src.matchAll(/gallery:\s*\[([^\]]+)\]/g)) {
  for (const m of block[1].matchAll(/'([^']+\.webp)'/g)) paths.add(m[1]);
}

if (!paths.size) {
  console.log('No se encontro ninguna galeria en src/data/projects.js');
  process.exit(0);
}

let done = 0, missing = 0;

for (const webPath of [...paths].sort()) {
  const outPath = join(root, 'public', webPath);
  const base = outPath.replace(/\.webp$/, '');

  // El original conserva la resolucion de captura; el .webp de 800px ya perdio
  // el detalle, asi que reescalarlo desde ahi no recuperaria nada.
  let input = null;
  for (const ext of SOURCE_EXTS) {
    try { await stat(base + ext); input = base + ext; break; } catch { /* siguiente */ }
  }

  if (!input) {
    console.log(`  --    ${webPath}  (sin original, se queda como esta)`);
    missing++;
    continue;
  }

  const { width } = await sharp(input).metadata();
  const before = (await stat(outPath).catch(() => ({ size: 0 }))).size;

  await sharp(input)
    .resize({ width: Math.min(WIDTH, width), withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath + '.tmp');

  const { size: after } = await stat(outPath + '.tmp');
  const { rename } = await import('fs/promises');
  await rename(outPath + '.tmp', outPath);

  const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
  console.log(`  ok    ${webPath.split('/').pop().padEnd(22)} ${kb(before)} -> ${kb(after)}  (${Math.min(WIDTH, width)}px)`);
  done++;
}

console.log(`\nListo. ${done} capturas regeneradas a ${WIDTH}px q${QUALITY}${missing ? `, ${missing} sin original` : ''}.`);
