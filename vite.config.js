import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const base = '/poc_website/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 1000 },
  test: {
    environment: 'jsdom',
    // Vitest resets Vite's server base; DOM tests must use the deployed asset prefix.
    env: { BASE_URL: base },
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
