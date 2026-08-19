/**
 * Genera la imagen de vista previa social (Open Graph / Twitter Card).
 *
 * Salida: public/assets/image/og-image.jpg  (1200×630, el tamaño que piden
 * Facebook, WhatsApp, LinkedIn, X y Slack) y su gemela .webp.
 *
 * Uso: node scripts/generate-og-image.mjs
 *
 * ── Sobre las fuentes ──────────────────────────────────────────────
 * El sitio carga Space Grotesk e Inter desde Google Fonts, pero el
 * renderizador de SVG de sharp solo ve las fuentes instaladas en el
 * sistema: sin esto, los títulos caen al monoespaciado de respaldo.
 * Por eso el script descarga los .ttf a una caché local, arma un
 * fontconfig temporal y se vuelve a lanzar a sí mismo con
 * FONTCONFIG_FILE ya puesto: fontconfig lee esa variable del entorno
 * del proceso al cargar la librería nativa, y asignarla desde JS
 * después de arrancar llega tarde.
 */

import { mkdir, writeFile, access } from 'fs/promises';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');
const outDir = join(root, 'public', 'assets', 'image');

/* ── 1. Fuentes de marca ─────────────────────────────────────────── */

const cacheDir = join(root, 'node_modules', '.cache', 'og-fonts');
const FONTS = {
  'SpaceGrotesk.ttf': 'https://github.com/google/fonts/raw/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf',
  'Inter.ttf': 'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf',
};

if (!process.env.OG_FONTS_READY) {
  await mkdir(cacheDir, { recursive: true });
  await mkdir(join(cacheDir, 'fc'), { recursive: true });

  for (const [file, url] of Object.entries(FONTS)) {
    const dest = join(cacheDir, file);
    try {
      await access(dest);
    } catch {
      console.log(`descargando ${file}…`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`No se pudo descargar ${file}: ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
  }

  // Solo se declaran los directorios que existen: un <dir> inexistente hace
  // que fontconfig descarte la configuración entera y vuelva al respaldo.
  const p = (s) => s.replace(/\\/g, '/');
  const dirs = [cacheDir, 'C:/Windows/Fonts', '/usr/share/fonts', '/Library/Fonts', '/System/Library/Fonts']
    .filter((d) => existsSync(d))
    .map((d) => `  <dir>${p(d)}</dir>`)
    .join('\n');

  const confPath = join(cacheDir, 'fonts.conf');
  await writeFile(
    confPath,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
${dirs}
  <cachedir>${p(join(cacheDir, 'fc'))}</cachedir>
</fontconfig>`,
  );

  const r = spawnSync(process.execPath, [__filename], {
    stdio: 'inherit',
    env: { ...process.env, FONTCONFIG_FILE: confPath, OG_FONTS_READY: '1' },
  });
  process.exit(r.status ?? 1);
}

const sharp = (await import('sharp')).default;

/* ── 2. Contenido ────────────────────────────────────────────────── */

// La ubicación va explícita: la vista previa es de las pocas superficies
// donde la señal local viaja fuera del sitio (WhatsApp, grupos, DMs).
const EYEBROW = 'PARRAL · CHIHUAHUA · MÉXICO';
const TITLE = 'Geck Codex';
const TAGLINE = 'Tecnología de primer nivel, para todos.';
const CHIPS = ['Desarrollo Web', 'Apps Móviles', 'Inteligencia Artificial'];
const DOMAIN = 'geckcodex.com';

const C = {
  navyDark: '#0B1D33',
  navyMid: '#0b1f49',
  gold: '#D4AF37',
  goldLight: '#F4E4BC',
};

/* ── 3. Composición ──────────────────────────────────────────────── */

const W = 1200;
const H = 630;
const COL = 525; // inicio de la columna de texto
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Sin medición real de texto: el ancho de las píldoras se estima por el
// número de caracteres. Inter a 22px promedia ~0.55em de avance.
const chipWidth = (text) => Math.round(text.length * 22 * 0.55) + 40;

const chips = CHIPS.map((text, i) => {
  const y = 322 + i * 56;
  return `
    <rect x="${COL}" y="${y}" width="${chipWidth(text)}" height="44" rx="8"
          fill="rgba(212,175,55,0.10)" stroke="${C.gold}" stroke-opacity="0.55" stroke-width="1.5"/>
    <text x="${COL + 20}" y="${y + 29}" font-family="Inter" font-size="22" font-weight="500"
          fill="${C.goldLight}">${esc(text)}</text>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.navyMid}"/>
      <stop offset="55%" stop-color="${C.navyDark}"/>
      <stop offset="100%" stop-color="#071426"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${C.gold}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="240" cy="315" r="290" fill="url(#glow)"/>

  <!-- filetes dorados superior e inferior -->
  <rect x="0" y="0" width="${W}" height="4" fill="${C.gold}"/>
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="${C.gold}"/>

  <!-- separador entre logo y texto -->
  <rect x="476" y="70" width="1.5" height="490" fill="${C.gold}" opacity="0.30"/>

  <text x="${COL}" y="128" font-family="Inter" font-size="18" font-weight="600"
        letter-spacing="3.2" fill="${C.gold}" opacity="0.95">${esc(EYEBROW)}</text>

  <text x="${COL}" y="212" font-family="Space Grotesk" font-size="72" font-weight="700"
        fill="${C.gold}">${esc(TITLE)}</text>
  <rect x="${COL}" y="232" width="186" height="3" fill="${C.gold}" opacity="0.85"/>

  <text x="${COL}" y="288" font-family="Inter" font-size="26" font-weight="400"
        fill="${C.goldLight}">${esc(TAGLINE)}</text>

  ${chips}

  <text x="${COL}" y="558" font-family="Inter" font-size="22" font-weight="500"
        fill="${C.goldLight}" opacity="0.72">${esc(DOMAIN)}</text>
</svg>`;

const logo = await sharp(join(outDir, 'logo new sin fondo.png'))
  .resize(300, 282, { fit: 'inside' })
  .toBuffer();

const base = sharp(Buffer.from(svg)).composite([{ input: logo, left: 90, top: 174 }]);

await base.clone().jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(join(outDir, 'og-image.jpg'));
await base.clone().webp({ quality: 90 }).toFile(join(outDir, 'og-image.webp'));

console.log('✓ og-image.jpg y og-image.webp regenerados en public/assets/image/');
