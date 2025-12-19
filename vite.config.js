import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 1. Explicitly set base to root for absolute path resolution
  base: '/',
  
  plugins: [react()],
  
  css: {
    postcss: './postcss.config.js',
  },

  // 2. Ensure Vite recognizes .ttf as a static asset during build
  assetsInclude: ['**/*.ttf', '**/*.jpeg', '**/*.jpg'],

  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  build: {
    // 3. Keep assets in a dedicated folder
    assetsDir: 'assets',
    
    // 4. Disable inlining for fonts. 
    // This forces Vite to provide a real URL instead of a Base64 string,
    // which fixes many "Failed to decode" errors.
    assetsInlineLimit: 0, 

    // 5. Optimization for clean builds
    outDir: 'dist',
    emptyOutDir: true,
  },
});