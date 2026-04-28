import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  plugins: [
    react({
      // Optimize JSX
      jsxRuntime: 'automatic',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],

  css: {
    postcss: './postcss.config.js',
  },

  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // Inline small assets under 4KB
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
      },
    },
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('react')) return 'vendor';
            // Remove explicit 'analytics' chunk if react-ga4 is not installed
            return 'libs';
          }
        },
      },
    },
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // Optimize development server
  server: {
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    exclude: ['@types/three'], // Exclude type definitions
  },
});
