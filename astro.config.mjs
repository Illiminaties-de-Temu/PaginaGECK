// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
      serialize(item) {
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