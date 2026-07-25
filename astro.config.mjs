import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://magueystudio.mx',
  trailingSlash: 'never',
  build: { format: 'file' },

});
