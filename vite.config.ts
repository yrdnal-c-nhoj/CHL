import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import dts from 'vite-plugin-dts';

export default defineConfig({
  base: '/',

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
    dts({
      insertTypesEntry: true,
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
        manualChunks: {
          // Separate vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Separate Three.js and related libraries
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          // Separate UI libraries
          ui: ['styled-components', '@emotion/react', '@emotion/cache'],
          // Separate analytics
          analytics: ['react-ga4', 'react-helmet-async'],
        },
      },
      // Optimize dependencies
      external: [],
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
