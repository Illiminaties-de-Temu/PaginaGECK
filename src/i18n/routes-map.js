/**
 * Mapa de rutas por idioma — definición sin tipos.
 *
 * Vive en JavaScript plano y no en `.ts` porque `astro.config.mjs` necesita
 * importarlo para construir los alternates del sitemap, y la config se carga
 * antes de que exista cualquier transpilación de TypeScript. `routes.ts` lo
 * reexporta con tipos para el resto del proyecto: una sola fuente de verdad para
 * el canonical, el hreflang del <head>, los enlaces internos y el sitemap.
 *
 * La extensión es `.js` y NO `.mjs` a propósito: el package.json ya declara
 * `"type": "module"`, así que ambas son ESM, pero en dev Vite trata los `.mjs`
 * de src fuera de su pipeline normal y acaba sirviendo una segunda copia del
 * runtime de JSX. El síntoma es `TypeError: jsxDEV is not a function` en el
 * primer componente que lo importe —el Navbar—, y solo ocurre en `astro dev`:
 * el build de producción lo resuelve bien y pasa limpio.
 *
 * El español vive en la raíz sin prefijo (`/servicios/`) porque esas URLs ya
 * están indexadas: moverlas a `/es/` obligaría a redirigir todo el sitio y a
 * reconstruir la autoridad desde cero. Inglés y portugués van con prefijo.
 *
 * Los slugs se traducen: la palabra clave en la URL es señal de ranking en cada
 * mercado, y `/en/services/` compite en inglés mucho mejor que `/en/servicios/`.
 */

export const LOCALES = ['es', 'en', 'pt'];

export const DEFAULT_LOCALE = 'es';

/** Idiomas con prefijo en la URL. El default va en la raíz. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** `lang` de <html> y `og:locale`, que usan formatos distintos. */
export const LOCALE_META = {
  es: { htmlLang: 'es-MX', ogLocale: 'es_MX', name: 'Español' },
  en: { htmlLang: 'en', ogLocale: 'en_US', name: 'English' },
  pt: { htmlLang: 'pt-BR', ogLocale: 'pt_BR', name: 'Português' },
};

/**
 * Slug de cada página por idioma, sin barras. La home es cadena vacía.
 * Cambiar un slug de aquí cambia la URL publicada: si ya estaba indexada,
 * hay que dejar una redirección 301 desde la anterior.
 */
export const SLUGS = {
  home: { es: '', en: '', pt: '' },
  services: { es: 'servicios', en: 'services', pt: 'servicos' },
  // Los dos caminos de servicios, cada uno con pagina propia. Van anidados
  // bajo el slug de servicios porque son parte de el, y porque una URL como
  // /servicios/ecosistema/ le dice a Google de que trata sin leer la pagina.
  ecosystem: { es: 'servicios/ecosistema', en: 'services/ecosystem', pt: 'servicos/ecossistema' },
  custom:    { es: 'servicios/a-medida',   en: 'services/custom-built', pt: 'servicos/sob-medida' },
  portfolio: { es: 'portafolio', en: 'portfolio', pt: 'portfolio' },
  about: { es: 'nosotros', en: 'about', pt: 'sobre-nos' },
  contact: { es: 'contacto', en: 'contact', pt: 'contato' },
};

/** Las legales solo tienen forma en español. */
export const ES_ONLY_SLUGS = {
  privacy: 'privacidad',
  terms: 'terminos',
};

/**
 * Ruta absoluta desde la raíz del sitio, siempre con barra final: es la forma
 * que sirve Netlify, y canonical, sitemap y enlaces internos deben coincidir
 * con ella o Google reparte señales entre dos URLs.
 */
export function localizedPath(page, locale) {
  const slug = SLUGS[page][locale];
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return slug ? `${prefix}/${slug}/` : `${prefix}/`;
}

/** Igual que `localizedPath`, pero absoluta para canonical, hreflang y JSON-LD. */
export function localizedUrl(page, locale, siteUrl) {
  return `${siteUrl}${localizedPath(page, locale)}`;
}

/**
 * Todas las variantes de una página, para emitir hreflang recíproco.
 * `x-default` apunta al español: es el mercado principal y la versión que
 * mejor sirve a un visitante cuyo idioma no coincide con ninguna variante.
 */
export function alternatesFor(page, siteUrl) {
  const alts = LOCALES.map((locale) => ({
    hreflang: LOCALE_META[locale].htmlLang,
    href: localizedUrl(page, locale, siteUrl),
  }));
  return [...alts, { hreflang: 'x-default', href: localizedUrl(page, DEFAULT_LOCALE, siteUrl) }];
}

/**
 * Invierte `SLUGS`: dada una ruta ya construida, devuelve qué página es y en
 * qué idioma. Lo usa el Navbar para saber a dónde mandar al usuario cuando
 * cambia de idioma sin perder la página en la que está.
 */
export function resolvePath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const maybeLocale = parts[0];
  const isPrefixed = maybeLocale !== undefined && PREFIXED_LOCALES.includes(maybeLocale);

  const locale = isPrefixed ? maybeLocale : DEFAULT_LOCALE;
  // Se unen TODOS los segmentos, no solo el primero: hay slugs anidados
  // ("servicios/ecosistema") y cortar por el primero devolvia la pagina padre.
  const slug = (isPrefixed ? parts.slice(1) : parts).join('/');

  const page = Object.keys(SLUGS).find((key) => SLUGS[key][locale] === slug);
  return page ? { page, locale } : null;
}

/** Paginas hijas de otra, para migas de pan. */
export const PARENT = {
  ecosystem: 'services',
  custom: 'services',
}

/**
 * Alternates de una URL absoluta, en el formato que espera `@astrojs/sitemap`
 * (`{ lang, url }`). Devuelve null si la URL no corresponde a una página
 * multiidioma —las legales y el blog— para no emitir un grupo de una sola
 * variante.
 *
 * No se usa la opción `i18n` del plugin porque empareja por slug idéntico, y
 * aquí los slugs están traducidos: agrupaba `/en/portfolio/` con
 * `/pt/portfolio/` dejando fuera el español.
 */
export function alternatesForUrl(url, siteUrl = 'https://geckcodex.com') {
  const resolved = resolvePath(new URL(url).pathname);
  if (!resolved) return null;
  return LOCALES.map((locale) => ({
    lang: LOCALE_META[locale].htmlLang,
    url: localizedUrl(resolved.page, locale, siteUrl),
  }));
}
