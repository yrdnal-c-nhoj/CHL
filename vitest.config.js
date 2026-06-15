/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react({
    tsDecorators: true,
  })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
});
