/**
 * Centralized Font Loading Utility
 * 
 * This utility provides a consistent way to load fonts across all clock components,
 * reducing code duplication and providing better error handling and caching.
 */

import { useState, useEffect } from 'react';

// Cache for loaded fonts to prevent duplicate loading
const fontCache = new Map();
const loadingPromises = new Map();

/**
 * Load a font using the FontFace API
 * @param {string} fontFamily - The name of the font family
 * @param {string} fontUrl - URL to the font file
 * @param {Object} options - Additional options
 * @param {boolean} options.fallback - Whether to set ready state even if font fails to load
 * @param {number} options.timeout - Timeout in milliseconds before giving up
 * @returns {Promise<boolean>} - Promise that resolves to true if font loaded successfully or fallback was used
 */
export async function loadFont(fontFamily, fontUrl, options = {}) {
  const { fallback = true, timeout = 5000 } = options;
  
  // Check if font is already loaded
  if (fontCache.has(fontFamily)) {
    return fontCache.get(fontFamily);
  }
  
  // Check if font is currently being loaded
  if (loadingPromises.has(fontFamily)) {
    return loadingPromises.get(fontFamily);
  }
  
  const loadPromise = new Promise((resolve) => {
    const font = new FontFace(fontFamily, `url(${fontUrl})`);
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      console.warn(`Font loading timeout for ${fontFamily}`);
      if (fallback) {
        fontCache.set(fontFamily, true);
        resolve(true);
      } else {
        fontCache.set(fontFamily, false);
        resolve(false);
      }
    }, timeout);
    
    font
      .load()
      .then((loadedFont) => {
        clearTimeout(timeoutId);
        document.fonts.add(loadedFont);
        fontCache.set(fontFamily, true);
        console.log(`Font loaded successfully: ${fontFamily}`);
        resolve(true);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error(`Failed to load font ${fontFamily}:`, error);
        if (fallback) {
          fontCache.set(fontFamily, true);
          resolve(true);
        } else {
          fontCache.set(fontFamily, false);
          resolve(false);
        }
      });
  });
  
  loadingPromises.set(fontFamily, loadPromise);
  return loadPromise;
}

/**
 * React hook for loading fonts
 * @param {string} fontFamily - The name of the font family
 * @param {string} fontUrl - URL to the font file
 * @param {Object} options - Additional options
 * @returns {boolean} - Whether the font is ready (loaded or fallback used)
 */
export function useFontLoader(fontFamily, fontUrl, options = {}) {
  const [fontReady, setFontReady] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    loadFont(fontFamily, fontUrl, options)
      .then((ready) => {
        if (isMounted) {
          setFontReady(ready);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, [fontFamily, fontUrl]);
  
  return fontReady;
}

/**
 * Load multiple fonts in parallel
 * @param {Array} fonts - Array of font objects { fontFamily, fontUrl, options }
 * @returns {Promise<boolean>} - Promise that resolves when all fonts are loaded
 */
export async function loadMultipleFonts(fonts) {
  const promises = fonts.map(({ fontFamily, fontUrl, options }) => 
    loadFont(fontFamily, fontUrl, options)
  );
  
  try {
    const results = await Promise.all(promises);
    return results.every(result => result);
  } catch (error) {
    console.error('Error loading multiple fonts:', error);
    return false;
  }
}

/**
 * React hook for loading multiple fonts
 * @param {Array} fonts - Array of font objects { fontFamily, fontUrl, options }
 * @returns {boolean} - Whether all fonts are ready
 */
export function useMultipleFontLoader(fonts) {
  const [fontsReady, setFontsReady] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    loadMultipleFonts(fonts)
      .then((ready) => {
        if (isMounted) {
          setFontsReady(ready);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, [fonts]);
  
  return fontsReady;
}

/**
 * Check if a font is already loaded
 * @param {string} fontFamily - The name of the font family
 * @returns {boolean} - Whether the font is in cache
 */
export function isFontLoaded(fontFamily) {
  return fontCache.has(fontFamily) && fontCache.get(fontFamily) === true;
}

/**
 * Clear font cache (useful for testing or font updates)
 */
export function clearFontCache() {
  fontCache.clear();
  loadingPromises.clear();
}

// Export for use in non-React contexts
export default {
  loadFont,
  useFontLoader,
  loadMultipleFonts,
  useMultipleFontLoader,
  isFontLoaded,
  clearFontCache
};
