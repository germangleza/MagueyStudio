import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build directo a public/saas2 para servirse en magueystudio.mx/saas2
export default defineConfig({
  plugins: [react()],
  base: '/saas2/',
  build: {
    outDir: '../public/saas2',
    emptyOutDir: true,
  },
});
