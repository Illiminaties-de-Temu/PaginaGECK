import { translations } from '../i18n/translations';
import { LOCALES, DEFAULT_LOCALE } from '../i18n/routes';

/**
 * Idioma y textos de la página actual.
 *
 * La fuente de verdad es la URL (`/servicios/`, `/en/services/`, `/pt/servicos/`),
 * no localStorage. Cada página se genera en build ya traducida y el componente
 * recibe su idioma por prop desde el `.astro` que lo monta.
 *
 * Antes el idioma vivía en estado de React y se cambiaba con un evento: eso
 * dejaba las tres versiones bajo una sola URL, así que Google solo podía indexar
 * el español y el contenido en inglés y portugués era invisible para el buscador.
 *
 * @param {string} [lang] Idioma de la página, inyectado desde Astro.
 */
export function useLanguage(lang) {
  // Un idioma desconocido (o ausente, si algún componente se monta sin la prop)
  // cae al español en lugar de romper el render con `translations[undefined]`.
  const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
  return { lang: locale, t: translations[locale] };
}
