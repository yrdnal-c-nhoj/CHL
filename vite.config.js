import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',

  plugins: [react()],

  css: {
    postcss: './postcss.config.js',
  },

  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 0, // Ensures all assets are always separate files
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Keeps your assets organized in the dist folder
        assetFileNames: (assetInfo) => {
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (/\.(gif)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});
