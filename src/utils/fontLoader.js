import { useState, useLayoutEffect } from 'react';

/**
 * Loads a single font programmatically using the FontFace API.
 * Prevents FOUC (Flash of Unstyled Content).
 *
 * @param {string} fontFamily - The font family name
 * @param {string} fontUrl - The URL to the font file
 * @param {Object} options - Optional font face options
 * @returns {boolean} true when font is loaded (or failed but settled)
 */
export function useFontLoader(fontFamily, fontUrl, options = {}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (typeof document === 'undefined' || !('fonts' in document)) {
        if (isMounted) setIsLoaded(true);
        return;
      }

      try {
        const font = new FontFace(fontFamily, `url(${fontUrl})`, { 
          ...options,
          display: 'swap' // Always use swap to prevent FOUC
        });
        await font.load();
        document.fonts.add(font);
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [fontFamily, fontUrl, JSON.stringify(options)]);

  return isLoaded;
}

/**
 * Loads multiple fonts programmatically using the FontFace API.
 * Prevents FOUC (Flash of Unstyled Content) and cleans up component logic.
 *
 * @param {Array<{fontFamily: string, fontUrl: string, options?: Object}>} fonts
 * @returns {boolean} true when all fonts are loaded (or failed but settled)
 */
export function useMultipleFontLoader(fonts) {
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (typeof document === 'undefined' || !('fonts' in document)) {
        if (isMounted) setIsLoaded(true);
        return;
      }

      try {
        const promises = fonts.map(async (f) => {
          const font = new FontFace(
            f.fontFamily,
            `url(${f.fontUrl})`,
            { 
              ...f.options,
              display: 'swap' // Always use swap to prevent FOUC
            }
          );
          await font.load();
          document.fonts.add(font);
        });

        await Promise.all(promises);
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [fonts]);

  return isLoaded;
}
