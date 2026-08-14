import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://magueystudio.mx',
  trailingSlash: 'never',
  build: { format: 'file' },

  integrations: [
    sitemap({
      // Las demos de /demo/ están bloqueadas en robots.txt: fuera del sitemap.
      // Las demos estáticas de public/ no entran aquí (el sitemap solo mapea
      // rutas de src/pages) y además llevan noindex en su propio HTML.
      filter: (page) => !page.includes('/demo/'),
    }),
  ],
});
