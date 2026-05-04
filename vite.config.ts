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

  esbuild: {
    drop: ['console', 'debugger'],
  },

  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // Inline small assets under 4KB
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps for production
    minify: 'terser', // Use Terser for more robust minification
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            // Split clock utilities into separate chunk
            if (id.includes('@/utils/')) return 'utils';
            // Split clock pages into smaller chunks
            if (id.includes('@/pages/')) return 'clocks';
            return;
          }
          
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
          return 'vendor';
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
      '@/utils/clockUtils',
    ],
    exclude: ['@types/three'], // Exclude type definitions
  },
});
