import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build directo a public/saas para servirse en magueystudio.mx/saas
export default defineConfig({
  plugins: [react()],
  base: '/saas/',
  build: {
    outDir: '../public/saas',
    emptyOutDir: true,
  },
});
