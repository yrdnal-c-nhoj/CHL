import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'scripts/**/*.{test,spec}.{js,ts}'],
    exclude: [...configDefaults.exclude, '.kilo/**'],
    restoreMocks: true,
    unstubGlobals: true,
    // Re-enable once tests are isolated from shared state (timers, globals, DOM).
    // fileParallelism: false,
  },
});
