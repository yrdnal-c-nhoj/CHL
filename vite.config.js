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
    // Keep assets in a dedicated folder
    assetsDir: 'assets',

    // Disable inlining for fonts/images
    assetsInlineLimit: 0, 

    // Clean build folder
    outDir: 'dist',
    emptyOutDir: true,

    // Configure asset handling
    rollupOptions: {
      output: {
        // Better organization for different asset types
        assetFileNames: (assetInfo) => {
          // Put fonts in a dedicated fonts directory
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          // Put images in an images directory
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          // Default asset path
          return 'assets/[name]-[hash][extname]';
        },
        // Keep chunk files organized
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  // Ensure font files are properly handled
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.eot', '**/*.otf']
});
