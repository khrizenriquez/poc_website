import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/poc_website/',
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 1000 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      reporter: ['text', 'html', 'json-summary', 'json'],
      thresholds: { statements: 95, branches: 95, functions: 95, lines: 95 },
    },
  },
});
