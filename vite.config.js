import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 🔹 1. Set base to match deployment path
  // If deploying at root domain, leave '/'
  // If deploying to a subfolder, e.g., '/25-12-18/', set that
  base: '/', // <-- change to './' or '/subfolder/' if needed

  plugins: [react()],

  css: {
    postcss: './postcss.config.js',
  },

  // 🔹 2. Ensure Vite recognizes .ttf, images, etc.
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.jpeg', '**/*.jpg', '**/*.webp'],

  // 🔹 3. Server headers (dev only)
  server: {
    // Temporarily remove headers if blocking assets
    // headers: {
    //   'Cross-Origin-Embedder-Policy': 'credentialless',
    //   'Cross-Origin-Opener-Policy': 'same-origin',
    // },
  },

  build: {
    // 🔹 4. Keep assets in a dedicated folder
    assetsDir: 'assets',

    // 🔹 5. Disable inlining for fonts/images
    assetsInlineLimit: 0, 

    // 🔹 6. Clean build folder
    outDir: 'dist',
    emptyOutDir: true,

    // 🔹 7. Optional: control chunking
    rollupOptions: {
      output: {
        // keep asset filenames predictable
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
