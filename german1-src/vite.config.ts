import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build directo a public/german1 para servirse en magueystudio.mx/german1
export default defineConfig({
  plugins: [react()],
  base: '/german1/',
  build: {
    outDir: '../public/german1',
    emptyOutDir: true,
  },
});
