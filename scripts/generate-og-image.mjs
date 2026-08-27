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
const TITLE_1 = 'Software que hace';
const TITLE_2A = 'crecer tu ';
const TITLE_2B = 'negocio';           // la palabra-acento, la única en champagne
const SUB_1 = 'Desarrollo web, apps móviles, e-commerce';
const SUB_2 = 'e inteligencia artificial a la medida.';
const BRAND = 'GECK CODEX';
const DOMAIN = 'geckcodex.com';
const METRICS = [
  ['+16', 'PROYECTOS'],
  ['100%', 'A LA MEDIDA'],
  ['24/7', 'SOPORTE'],
];

// Tokens vivos de src/styles/global.css. El oro es acento FUNCIONAL: va en la
// palabra-acento del titular, los datos y la URL — nunca en el título entero.
const C = {
  navy: '#0D1625',
  gold: '#C3AD85',
  goldLight: '#D8C6A4',
  bronze: '#957952',
  ivory: '#F5F1E8',
};

/* ── 3. Composición ──────────────────────────────────────────────── */

const W = 1200;
const H = 630;
const PANEL = 424;          // ancho del bloque champagne de la izquierda
const COL = PANEL + 58;     // inicio de la columna de texto
const RIGHT = W - 58;       // margen derecho de la columna
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Sin medición real de texto: las columnas de métricas se colocan a mano en
// vez de fluir, para que no se encimen si cambia una cifra.
const metrics = METRICS.map(([k, v], i) => {
  const x = COL + i * 132;
  return `
    <text x="${x}" y="472" font-family="Space Grotesk" font-size="27" font-weight="700"
          fill="${C.gold}">${esc(k)}</text>
    <text x="${x}" y="500" font-family="Inter" font-size="14" font-weight="500"
          letter-spacing="1.1" fill="${C.ivory}" opacity="0.5">${esc(v)}</text>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="panel" x1="0" y1="0" x2="0.55" y2="1">
      <stop offset="0%" stop-color="${C.goldLight}"/>
      <stop offset="46%" stop-color="${C.gold}"/>
      <stop offset="100%" stop-color="${C.bronze}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${C.gold}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${C.navy}"/>
  <circle cx="${W}" cy="0" r="520" fill="url(#glow)"/>
  <rect width="${PANEL}" height="${H}" fill="url(#panel)"/>

  <!-- marca dentro del panel; el logo se compone encima como bitmap -->
  <text x="${PANEL / 2}" y="446" text-anchor="middle" font-family="Space Grotesk"
        font-size="26" font-weight="700" letter-spacing="3.1" fill="${C.navy}">${esc(BRAND)}</text>

  <text x="${COL}" y="148" font-family="Inter" font-size="15" font-weight="500"
        letter-spacing="3.9" fill="${C.ivory}" opacity="0.52">${esc(EYEBROW)}</text>

  <text x="${COL}" y="212" font-family="Space Grotesk" font-size="54" font-weight="700"
        fill="${C.ivory}">${esc(TITLE_1)}</text>
  <text x="${COL}" y="271" font-family="Space Grotesk" font-size="54" font-weight="700"
        fill="${C.ivory}">${esc(TITLE_2A)}<tspan fill="${C.gold}">${esc(TITLE_2B)}</tspan></text>

  <text x="${COL}" y="335" font-family="Inter" font-size="22" font-weight="400"
        fill="${C.ivory}" opacity="0.66">${esc(SUB_1)}</text>
  <text x="${COL}" y="368" font-family="Inter" font-size="22" font-weight="400"
        fill="${C.ivory}" opacity="0.66">${esc(SUB_2)}</text>

  <rect x="${COL}" y="418" width="${RIGHT - COL}" height="1" fill="${C.gold}" opacity="0.24"/>

  ${metrics}

  <text x="${RIGHT}" y="592" text-anchor="end" font-family="Inter" font-size="19"
        font-weight="600" fill="${C.gold}">${esc(DOMAIN)}</text>
</svg>`;

const LOGO = 194;
const logo = await sharp(join(outDir, 'logo new sin fondo.png'))
  .resize(LOGO, LOGO, { fit: 'inside' })
  .toBuffer();

const base = sharp(Buffer.from(svg)).composite([
  { input: logo, left: Math.round((PANEL - LOGO) / 2), top: 196 },
]);

await base.clone().jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(join(outDir, 'og-image.jpg'));
await base.clone().webp({ quality: 90 }).toFile(join(outDir, 'og-image.webp'));

console.log('✓ og-image.jpg y og-image.webp regenerados en public/assets/image/');
