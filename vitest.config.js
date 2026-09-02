/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react({
    tsDecorators: true,
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '.kilo/**',
    ],
  },
});
