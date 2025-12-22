import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use absolute base for production compatibility
  base: '/',

  plugins: [react()],

  css: {
    postcss: './postcss.config.js',
  },

  assetsInclude: ['**/*.otf', '**/*.ttf', '**/*.woff2'],

  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 0, // Ensures fonts are always separate files
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Keeps your assets organized in the dist folder
        assetFileNames: (assetInfo) => {
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});
