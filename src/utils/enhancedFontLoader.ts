import { useEffect, useMemo, useState } from 'react';
import { useMultiFontLoader } from './assetLoader';

// Re-export base font loader functions
export { ClockLoadingFallback, useSuspenseFontLoader } from './fontLoader';

/**
 * Enhanced font loader with loading state tracking (non-suspense)
 */
export function useEnhancedFontLoader(
  fontFamily: string,
  fontUrl: string,
): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fontFace = new FontFace(fontFamily, `url(${fontUrl})`, {
      display: 'block',
    });

    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setLoaded(true);
      })
      .catch((err) => {
        console.warn(`Failed to load font ${fontFamily}:`, err);
        setLoaded(true); // Still mark as loaded to avoid blocking
      });

    return () => {
      document.fonts.delete(fontFace);
    };
  }, [fontFamily, fontUrl]);

  return loaded;
}

/**
 * Inject global CSS styles with a unique identifier
 */
export function useGlobalStyles(css: string, id: string): void {
  useEffect(() => {
    // Check if styles already exist
    let styleEl = document.getElementById(id) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = id;
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    return () => {
      // Optional cleanup - only remove if no other components are using it
      // For now, keep styles to avoid flickering between route changes
    };
  }, [css, id]);
}

/**
 * Generate unique keyframes with a prefix
 */
export function useKeyframes(name: string, keyframes: string): string {
  const uniqueName = useMemo(() => {
    const prefix = name.replace(/[^a-zA-Z0-9]/g, '');
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }, [name]);

  useEffect(() => {
    const css = `@keyframes ${uniqueName} { ${keyframes} }`;
    const styleId = `kf-${uniqueName}`;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    return () => {
      // Cleanup on unmount
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [uniqueName, keyframes]);

  return uniqueName;
}

/**
 * Legacy font loader alias
 */
export const useMultipleFontLoader = useMultiFontLoader;
export const useFontLoader = useEnhancedFontLoader;
