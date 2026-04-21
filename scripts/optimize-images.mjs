/**
 * Convierte todas las imágenes del sitio a WebP con las dimensiones
 * correctas para cada contexto. Mantiene los originales intactos.
 *
 * Uso: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', 'public', 'assets', 'image');

// Configuracion por carpeta
const CONFIG = {
  portafolio: { width: 800,  quality: 84 },   // cards 16:9, max ~500px rendered → 800 retina
  servicios:  { width: 900,  quality: 87 },   // modals y cards grandes — calidad alta
  default:    { width: 1200, quality: 80 },   // otras imagenes
};

const SUPPORTED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

async function convertFile(filePath, outDir, opts) {
  const ext = extname(filePath).toLowerCase();
  if (!SUPPORTED.has(ext)) return;
  if (ext === '.webp') return; // ya está optimizado, saltar

  const name = basename(filePath, ext);
  const outPath = join(outDir, `${name}.webp`);

  // No sobreescribir si ya existe y es reciente
  try {
    const [src, dst] = await Promise.all([stat(filePath), stat(outPath)]);
    if (dst.mtimeMs > src.mtimeMs && !process.argv.includes('--force')) {
      console.log(`  skip  ${name}.webp (up to date)`);
      return;
    }
  } catch { /* outPath no existe → hay que crearlo */ }

  const info = await sharp(filePath)
    .resize({ width: opts.width, withoutEnlargement: true })
    .webp({ quality: opts.quality, effort: 5 })
    .toFile(outPath);

  const srcSize = (await stat(filePath)).size;
  const reduction = (((srcSize - info.size) / srcSize) * 100).toFixed(0);
  console.log(`  ✓  ${name}.webp  ${fmtKB(srcSize)} → ${fmtKB(info.size)}  (−${reduction}%)`);
}

async function processDir(dir) {
  let entries;
  try { entries = await readdir(dir); } catch { return; }

  const folder = basename(dir);
  const opts = CONFIG[folder] ?? CONFIG.default;

  console.log(`\n📁 ${folder}  (target: ${opts.width}px WebP q${opts.quality})`);

  await Promise.all(
    entries.map(file => convertFile(join(dir, file), dir, opts))
  );
}

function fmtKB(bytes) {
  return bytes >= 1_000_000
    ? `${(bytes / 1_048_576).toFixed(1)}MB`
    : `${Math.round(bytes / 1024)}KB`;
}

// Procesar carpetas
const folders = ['portafolio', 'servicios'];
for (const folder of folders) {
  await processDir(join(root, folder));
}
// Tambien la raiz de /image (logo, og-image, etc.)
await processDir(root);

console.log('\n✅ Listo. Actualiza las rutas en los componentes a .webp\n');
