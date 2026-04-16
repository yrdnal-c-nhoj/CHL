import React, { useLayoutEffect, useMemo } from 'react';
import type { FontConfig } from '../types/clock';

// --- Global Cache & State ---

// Caches the Promise of the font load to prevent double-fetching
const resourceCache = new Map<string, { read: () => FontFace }>();

// Tracks how many active components are using a specific FontFace instance
const refCounts = new Map<FontFace, number>();

// Helper to generate a unique key for the cache based on font properties
const getCacheKey = (
  family: string,
  url: string,
  options?: FontFaceDescriptors,
) => `${family}-${url}-${JSON.stringify(options || {})}`;

/**
 * Low-level resource loader compatible with React Suspense.
 * Returns a resource object with a .read() method that:
 * - Throws a Promise if pending (suspends React)
 * - Throws an Error if failed
 * - Returns the FontFace if loaded
 */
function getFontResource(
  family: string,
  url: string,
  options: FontFaceDescriptors = {},
) {
  const key = getCacheKey(family, url, options);

  if (!resourceCache.has(key)) {
    let status = 'pending';
    let result: FontFace;
    let error: any;

    // display: 'block' is crucial for preventing FOUC (hides text until font is ready)
    const fontFace = new FontFace(family, `url(${url})`, {
      display: 'block',
      ...options,
    });

    const promise = fontFace.load().then(
      (loaded) => {
        status = 'success';
        result = loaded;
      },
      (err) => {
        status = 'error';
        error = err;
        console.warn(`Failed to load font ${family}:`, err);
      },
    );

    resourceCache.set(key, {
      read() {
        if (status === 'pending') throw promise;
        // Don't throw on error - let component render with fallback fonts
        // The CSS font-family stack (e.g., 'Hanalei, cursive') handles degradation
        return result;
      },
    });
  }

  return resourceCache.get(key)!;
}

/**
 * Main Hook: Loads fonts via Suspense and manages their lifecycle.
 * Prevents leaks by removing fonts when the component unmounts.
 * Prevents FOUC by suspending until fonts are ready.
 */
export function useSuspenseFontLoader(fontConfigs: FontConfig[]): boolean {
  // 1. Generate a stable cache key string for the dependency array.
  const cacheKey = fontConfigs
    .map((c) => getCacheKey(c.fontFamily, c.fontUrl, c.options))
    .join('|');

  // 2. Trigger Load / Suspend (Memoized to prevent flickering)
  const faces = useMemo(() => {
    return fontConfigs.map((config) =>
      getFontResource(config.fontFamily, config.fontUrl, config.options).read(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  // 3. Lifecycle Management (Reference Counting)
  useLayoutEffect(() => {
    // Mount
    faces.forEach((face) => {
      if (!face) return; // Skip if font failed to load
      const current = refCounts.get(face) || 0;
      if (current === 0) {
        document.fonts.add(face);
      }
      refCounts.set(face, current + 1);
    });

    // Unmount
    return () => {
      faces.forEach((face) => {
        if (!face) return; // Skip if font failed to load
        const current = refCounts.get(face) || 0;
        const next = Math.max(0, current - 1);
        refCounts.set(face, next);

        if (next === 0) {
          document.fonts.delete(face);
        }
      });
    };
  }, [faces]);

  return true;
}

// --- Legacy Compatibility ---
export const useMultipleFontLoader = useSuspenseFontLoader;

export const useFontLoader = (fontFamily: string, fontUrl: string) => {
  useSuspenseFontLoader([{ fontFamily, fontUrl }]);
  return true;
};

// --- Fallback Component ---
export const ClockLoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      color: '#888',
      fontFamily: 'monospace',
      fontSize: '1.2rem',
    }}
  >
    Loading...
  </div>
);
