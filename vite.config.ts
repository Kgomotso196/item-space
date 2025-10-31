import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src/client',   // points to folder where index.html lives
  base: './',           // for relative paths in production
  build: {
    outDir: '../../dist', // so dist is at project root for Netlify
  },
});
