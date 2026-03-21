import React, { useState, useLayoutEffect, Suspense, lazy } from 'react';
import type { FontConfig } from '@/types/clock';

/**
 * Enhanced Font Loading System with React Suspense
 * 
 * This utility centralizes font loading and style injection patterns
 * found across clock components, replacing manual style injections
 * with a standardized, Suspense-based approach.
 */

// Global registry to track loaded fonts and prevent duplicates
const fontRegistry = new Map<string, Promise<boolean>>();
const styleRegistry = new Map<string, boolean>();

/**
 * Creates and injects a @font-face style dynamically
 * Prevents FOUC and manages style cleanup
 */
function createFontFace(fontFamily: string, fontUrl: string, options: FontFaceDescriptors = {}): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    // Check if font is already loaded
    if (fontRegistry.has(fontFamily)) {
      fontRegistry.get(fontFamily)?.then(resolve);
      return;
    }

    const fontPromise = new Promise<boolean>((fontResolve) => {
      try {
        const font = new FontFace(fontFamily, `url(${fontUrl})`, {
          style: 'normal',
          weight: 'normal',
          stretch: 'normal',
          display: 'swap',
          ...options,
        });

        font.load().then(() => {
          // Create unique style element for this font
          const styleId = `font-${fontFamily.replace(/[^a-zA-Z0-9]/g, '')}`;
          
          // Remove existing style if present
          const existingStyle = document.getElementById(styleId);
          if (existingStyle) {
            existingStyle.remove();
          }

          // Create and inject new style
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            @font-face {
              font-family: '${fontFamily}';
              src: url('${fontUrl}');
              font-style: normal;
              font-weight: normal;
              font-stretch: normal;
              font-display: swap;
              ${Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(';\n              ')}
            }
          `;
          
          document.head.appendChild(style);
          fontResolve(true);
        }).catch((error) => {
          console.warn(`Failed to load font ${fontFamily}:`, error);
          fontResolve(false);
        });
      } catch (error) {
        console.warn(`Error creating font face ${fontFamily}:`, error);
        fontResolve(false);
      }
    });

    fontRegistry.set(fontFamily, fontPromise);
    fontPromise.then(resolve);
  });
}

/**
 * Enhanced Font Loader Hook with Suspense Support
 * 
 * @param {string} fontFamily - The font family name
 * @param {string} fontUrl - The URL to font file
 * @param {Object} options - Optional font face options
 * @returns {boolean} Loading state
 */
export function useEnhancedFontLoader(
  fontFamily: string,
  fontUrl: string,
  options: FontFaceDescriptors = {}
): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;

    createFontFace(fontFamily, fontUrl, options).then((loaded) => {
      if (isMounted) {
        setIsLoaded(loaded);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fontFamily, fontUrl]);

  return isLoaded;
}

/**
 * Creates a lazy-loaded clock component with Suspense boundary
 * 
 * @param {string} componentPath - Path to the clock component
 * @param {string} fontFamily - Font family required for this component
 * @param {string} fontUrl - URL to the font file
 * @param {Object} fontOptions - Font loading options
 * @returns {React.ComponentType} Lazy component with font loading
 */
export function createLazyClock(
  componentPath: string,
  fontFamily: string,
  fontUrl: string,
  fontOptions: FontFaceDescriptors = {}
) {
  // Preload the font before component loads
  const fontPromise = createFontFace(fontFamily, fontUrl, fontOptions);

  // Create lazy component
  const LazyClock = lazy(() =>
    fontPromise.then(() => {
      // Dynamic import of the clock component
      return import(componentPath) as Promise<{ default: React.ComponentType }>;
    })
  );

  // Return component wrapped in Suspense
  return function LazyClockWithFont(props: React.ComponentProps<typeof LazyClock>) {
    return (
      <Suspense 
        fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '1.2rem',
            color: '#666'
          }}>
            Loading clock...
          </div>
        }
      >
        <LazyClock {...props} />
      </Suspense>
    );
  };
}

/**
 * Global style injector for common patterns found in clocks
 * Replaces manual style.createElement('style') patterns
 */
export function useGlobalStyles(styles: string, id?: string): void {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    const styleId = id || `global-style-${Date.now()}`;
    
    // Check if style already exists
    if (styleRegistry.has(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = styles;
    document.head.appendChild(style);
    
    styleRegistry.set(styleId, true);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
        styleRegistry.delete(styleId);
      }
    };
  }, [styles, id]);
}

/**
 * Creates CSS keyframes dynamically
 * Common pattern in animated clocks
 */
export function useKeyframes(
  name: string,
  keyframes: Record<string, string>
): string {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    const animationId = `keyframes-${name}`;
    
    if (styleRegistry.has(animationId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = animationId;
    style.textContent = `
      @keyframes ${name} {
        ${Object.entries(keyframes)
          .map(([key, value]) => `  ${key} { ${value} }`)
          .join('\n        ')}
      }
    `;
    document.head.appendChild(style);
    styleRegistry.set(animationId, true);
  }, [name, JSON.stringify(keyframes)]);
}

/**
 * Legacy compatibility - maintains original useFontLoader API
 */
export { useFontLoader } from './fontLoader';

/**
 * Font loading utilities for common clock patterns
 */
export const ClockFontUtils = {
  /**
   * Creates a font face for clock components
   */
  createClockFont: (fontFamily: string, fontUrl: string, options?: FontFaceDescriptors) => 
    createFontFace(fontFamily, fontUrl, options),
  
  /**
   * Checks if a font is already loaded
   */
  isFontLoaded: (fontFamily: string): boolean => 
    fontRegistry.has(fontFamily),
  
  /**
   * Gets loading status of a font
   */
  getFontStatus: (fontFamily: string): 'loading' | 'loaded' | 'error' | 'unknown' => {
    if (fontRegistry.has(fontFamily)) return 'loaded';
    return 'unknown';
  }
};

export default {
  useEnhancedFontLoader,
  createLazyClock,
  useGlobalStyles,
  useKeyframes,
  ClockFontUtils
};
