import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  plugins: [
    react({
      tsDecorators: true,
    }),
    // Consolidate compression plugins into a single instance
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],

  css: {
    postcss: './postcss.config.js',
  },

  esbuild: {
    // Only drop logs and debuggers, but keep warn/error so your 
    // consoleFilters.ts can still report critical issues in production.
    drop: ['debugger'],
    pure: ['console.log', 'console.info', 'console.debug'],
  },

  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // Inline small assets under 4KB
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild', // Use esbuild for significantly faster minification
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: (id) => {

          if (id.includes('three')) return 'three';

          // More specific matching for core framework to avoid catching
          // every library that has "react" in the name
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'framework';
          }

          if (id.includes('gsap')) return 'animation';
          if (id.includes('framer-motion')) return 'animation';
          // Let Vite handle chunking for other node_modules to avoid a monolithic vendor chunk.
          // This is more efficient for dynamic imports.
          if (id.includes('node_modules')) return 'vendor';
        },
      },
      onwarn: (warning, warn) => {
        // Suppress circular dependency warnings for now
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          console.warn('Circular dependency detected:', warning.message);
          return;
        }
        warn(warning);
      },
    },
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  // Optimize development server
  server: {
    port: 5173,
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
