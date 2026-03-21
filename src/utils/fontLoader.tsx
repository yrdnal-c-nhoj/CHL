import React, { useState, useEffect } from 'react';
import type { FontConfig } from '../types/clock';

// Global cache to prevent re-loading fonts
const loadedFonts = new Set<string>();
const fontPromises = new Map<string, Promise<void>>();

/**
 * Legacy hook for loading a single font.
 * prefer useSuspenseFontLoader for new components.
 */
export const useFontLoader = (fontName: string, fontUrl: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loadedFonts.has(fontName)) {
      setLoaded(true);
      return;
    }

    const font = new FontFace(fontName, `url(${fontUrl})`);
    font.load().then((f) => {
      document.fonts.add(f);
      loadedFonts.add(fontName);
      setLoaded(true);
    }).catch((err) => {
      console.error(`Failed to load font ${fontName}:`, err);
    });
  }, [fontName, fontUrl]);

  return loaded;
};

/**
 * Legacy hook for loading multiple fonts.
 */
export const useMultipleFontLoader = (fonts: FontConfig[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      const promises = fonts.map(async (config) => {
        if (loadedFonts.has(config.fontFamily)) return;
        try {
          const font = new FontFace(config.fontFamily, `url(${config.fontUrl})`, config.options);
          const f = await font.load();
          document.fonts.add(f);
          loadedFonts.add(config.fontFamily);
        } catch (err) {
          console.warn(`Failed to load font ${config.fontFamily}`, err);
        }
      });
      await Promise.all(promises);
      setLoaded(true);
    };

    loadFonts();
  }, [fonts]);

  return loaded;
};

/**
 * Modern Suspense-based font loader.
 * Throws a promise if fonts are not yet loaded, suspending the component.
 */
export const useSuspenseFontLoader = (fonts: FontConfig[]) => {
  // Check if all fonts are already loaded
  if (fonts.every(f => loadedFonts.has(f.fontFamily))) return;

  // Filter for fonts that need loading and aren't already pending
  const needed = fonts.filter(f => !loadedFonts.has(f.fontFamily));
  
  const promises = needed.map(config => {
    if (!fontPromises.has(config.fontFamily)) {
      const promise = (async () => {
        try {
          const font = new FontFace(config.fontFamily, `url(${config.fontUrl})`, config.options);
          const f = await font.load();
          document.fonts.add(f);
          loadedFonts.add(config.fontFamily);
        } catch (err) {
          console.warn(`Failed to load font ${config.fontFamily}`, err);
          // Mark as loaded to prevent infinite suspense loops even on error
          loadedFonts.add(config.fontFamily);
        }
      })();
      fontPromises.set(config.fontFamily, promise);
    }
    return fontPromises.get(config.fontFamily);
  });

  // Throw the combined promise to suspend React
  if (promises.length > 0) {
    throw Promise.all(promises);
  }
};

export const ClockLoadingFallback = () => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'monospace',
    color: '#666',
    fontSize: '1.2rem'
  }}>
    Loading Clock...
  </div>
);

export const styleManager = {
  inject: (id: string, css: string) => {
    if (typeof document === 'undefined' || document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  },
  remove: (id: string) => {
    if (typeof document === 'undefined') return;
    const style = document.getElementById(id);
    if (style) style.remove();
  }
};