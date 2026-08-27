// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { alternatesForUrl } from './src/i18n/routes-map.js';

export default defineConfig({
  site: 'https://geckcodex.com', // <--- ¡ASEGÚRATE DE QUE ESTO ESTÉ AQUÍ!
  // Prefetch: precarga el HTML de los links internos al pasar el mouse, así el
  // cambio de página con ClientRouter se siente instantáneo.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    sitemap({
      // /blog es un placeholder con noindex: incluirlo en el sitemap manda a
      // Google una señal contradictoria (lo listas pero le prohíbes indexarlo).
      filter: (page) => !page.includes('/blog'),
      changefreq: 'monthly',
      lastmod: new Date(),
      // NO se usa la opción `i18n` del plugin: empareja las variantes por slug
      // idéntico, y aquí los slugs están traducidos (/servicios/ ↔ /en/services/).
      // Con ella, el sitemap agrupaba /en/portfolio/ con /pt/portfolio/ —que sí
      // coinciden— dejando fuera el español, y contradecía el hreflang del <head>.
      // Los alternates se construyen abajo desde el mismo mapa de rutas que usa
      // el layout, para que ambas señales digan exactamente lo mismo.
      serialize(item) {
        // Cada URL se acompaña de sus variantes de idioma. `alternatesForUrl`
        // devuelve null para las páginas que solo existen en español (legales),
        // y ahí no se emite ningún alternate: declarar un grupo de una sola
        // variante no aporta nada y arriesga que Google lo descarte.
        const links = alternatesForUrl(item.url);
        if (links) item = { ...item, links };

        // Las URLs van CON barra final porque es lo que sirve Netlify: pedir
        // /contacto devuelve un 301 hacia /contacto/. Un sitemap lleno de URLs
        // que redirigen desperdicia presupuesto de rastreo, y si el canonical
        // apunta a la forma que redirige, Google reparte señales entre dos URLs.
        // Los canonical de cada página usan esta misma forma.

        // La home y las páginas comerciales son las que reciben tráfico de Ads
        // y las que deben rastrearse primero.
        if (item.url === 'https://geckcodex.com/') return { ...item, priority: 1.0, changefreq: 'weekly' };
        if (/\/(servicios|contacto)\/?$/.test(item.url)) return { ...item, priority: 0.9 };
        if (/\/(portafolio|nosotros)\/?$/.test(item.url)) return { ...item, priority: 0.8 };
        if (/\/(privacidad|terminos)\/?$/.test(item.url)) return { ...item, priority: 0.3, changefreq: 'yearly' };
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});