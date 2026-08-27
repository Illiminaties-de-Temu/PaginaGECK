/**
 * Capa de tipos sobre `routes-map.js`.
 *
 * La definición vive en JavaScript plano porque `astro.config.mjs` la necesita
 * para construir los alternates del sitemap, y la config se carga antes de que
 * exista transpilación de TypeScript. Aquí se le ponen los tipos que usa el
 * resto del proyecto, sin duplicar el mapa.
 */

import * as map from './routes-map.js';

export const LOCALES = map.LOCALES as readonly ['es', 'en', 'pt'];
export type Locale = (typeof LOCALES)[number];

/** Páginas que existen en los tres idiomas. */
export type PageKey = 'home' | 'services' | 'portfolio' | 'about' | 'contact';

/** Páginas que existen solo en español (legales bajo ley mexicana). */
export type EsOnlyPageKey = 'privacy' | 'terms';

export const DEFAULT_LOCALE = map.DEFAULT_LOCALE as Locale;
export const PREFIXED_LOCALES = map.PREFIXED_LOCALES as Locale[];

export const LOCALE_META = map.LOCALE_META as Record<
  Locale,
  { htmlLang: string; ogLocale: string; name: string }
>;

export const SLUGS = map.SLUGS as Record<PageKey, Record<Locale, string>>;
export const ES_ONLY_SLUGS = map.ES_ONLY_SLUGS as Record<EsOnlyPageKey, string>;

export const localizedPath = map.localizedPath as (page: PageKey, locale: Locale) => string;

export const localizedUrl = map.localizedUrl as (
  page: PageKey,
  locale: Locale,
  siteUrl: string,
) => string;

export const alternatesFor = map.alternatesFor as (
  page: PageKey,
  siteUrl: string,
) => { hreflang: string; href: string }[];

export const resolvePath = map.resolvePath as (
  pathname: string,
) => { page: PageKey; locale: Locale } | null;
