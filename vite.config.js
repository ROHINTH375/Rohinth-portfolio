import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client',
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
  server: {
    port: 5173,
    // In development, forward /api calls to the Express server.
    proxy: { '/api': 'http://localhost:5000' },
  },
});
