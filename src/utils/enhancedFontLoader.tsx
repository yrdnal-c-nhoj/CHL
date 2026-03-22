import React, { useLayoutEffect, Suspense, lazy, useState } from 'react';
import type { FontConfig } from '@/types/clock';

/**
 * Enhanced Font Loading System
 * 
 * Solves FOUC and Style Leaks by:
 * 1. Using the native `FontFace` API instead of <style> tags.
 * 2. Implementing Reference Counting to add/remove fonts on mount/unmount.
 * 3. Utilizing React Suspense to block rendering until fonts are ready.
 */

// --- Cache & State Management ---

// Caches the Promise of the font load to prevent double-fetching
const resourceCache = new Map<string, { read: () => FontFace }>();

// Tracks how many active components are using a specific FontFace instance
// ensuring we don't remove a font if another component still needs it.
const refCounts = new Map<FontFace, number>();

// Helper to generate a unique key for the cache
const getCacheKey = (family: string, url: string, options: any) => 
  `${family}-${url}-${JSON.stringify(options)}`;

/**
 * Low-level resource loader compatible with React Suspense
 */
function getFontResource(fontFamily: string, fontUrl: string, options: FontFaceDescriptors = {}) {
  const key = getCacheKey(fontFamily, fontUrl, options);

  if (!resourceCache.has(key)) {
    let status = 'pending';
    let result: FontFace;
    let error: any;

    // 'block' is crucial for preventing FOUC (hides text instead of swapping)
    const fontFace = new FontFace(fontFamily, `url(${fontUrl})`, { 
      display: 'block', 
      ...options 
    });

    const promise = fontFace.load().then(
      (loadedFace) => {
        status = 'success';
        result = loadedFace;
      },
      (err) => {
        status = 'error';
        error = err;
        console.error(`Failed to load font: ${fontFamily}`, err);
      }
    );

    resourceCache.set(key, {
      read() {
        if (status === 'pending') throw promise;
        if (status === 'error') throw error;
        return result;
      }
    });
  }

  return resourceCache.get(key)!;
}

/**
 * Main Hook: Loads fonts via Suspense and manages their lifecycle in the document.
 */
export function useSuspenseFontLoader(fontConfigs: FontConfig[]): boolean {
  // 1. Trigger Load / Suspend
  // This will throw a Promise if any font is not yet ready, pausing rendering.
  const faces = fontConfigs.map(config => 
    getFontResource(config.fontFamily, config.fontUrl, config.options).read()
  );

  // 2. Lifecycle Management
  // Add fonts to the document when mounted, remove when unmounted.
  useLayoutEffect(() => {
    faces.forEach(face => {
      const count = refCounts.get(face) || 0;
      if (count === 0) {
        document.fonts.add(face);
      }
      refCounts.set(face, count + 1);
    });

    return () => {
      faces.forEach(face => {
        const count = refCounts.get(face) || 0;
        const nextCount = Math.max(0, count - 1);
        refCounts.set(face, nextCount);
        
        if (nextCount === 0) {
          document.fonts.delete(face);
        }
      });
    };
  }, [faces]);

  return true; // Compatibility return for legacy checks
}

// Legacy compatibility layer
export const useMultipleFontLoader = useSuspenseFontLoader;
export const useEnhancedFontLoader = (fontFamily: string, fontUrl: string, options?: any) => 
  useSuspenseFontLoader([{ fontFamily, fontUrl, options }]);

// --- Global Style Injection (for Keyframes/CSS Variables) ---

const styleRegistry = new Map<string, boolean>();

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
