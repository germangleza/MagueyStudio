import { defineConfig } from 'astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://magueystudio.mx',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
});
