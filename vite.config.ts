import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve el sitio en /<nombre-del-repo>/. En desarrollo usamos la raíz.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Tu-Guia-Inteligente-buenaventura/' : '/',
  plugins: [react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
}));
