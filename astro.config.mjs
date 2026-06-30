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
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});