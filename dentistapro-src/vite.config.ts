import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build directo a public/dentistapro para servirse en magueystudio.mx/dentistapro
export default defineConfig({
  plugins: [react()],
  base: '/dentistapro/',
  build: {
    outDir: '../public/dentistapro',
    emptyOutDir: true,
  },
});
