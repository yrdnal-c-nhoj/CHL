import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { AssetConfig } from '../utils/assetLoader';
import { preloadAssets } from '../utils/assetLoader';

interface ClockModule {
  default: React.ComponentType;
  assets?: string[];
}


// Safety timeout to prevent infinite black screen
const LOADING_TIMEOUT = 10000; // 10 seconds

/**
 * State-of-the-art dynamic clock loader.
 * Handles dynamic imports, asset preloading, and overlay synchronization.
 */

export function useClockPage(currentItem: { date: string } | null) {

  const [ClockComponent, setClockComponent] = useState<React.ComponentType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReadyRef = useRef(isReady);
  
  // Keep ref in sync with state to avoid stale closure in timeout
  isReadyRef.current = isReady;

  // Register all clock components via Vite glob (memoized to prevent re-renders)
  const clockModules = useMemo(() => import.meta.glob('../pages/**/Clock.tsx'), []);

  const preloadClockAssets = useCallback(async (assetUrls: string[]): Promise<void> => {
    const assets: AssetConfig[] = assetUrls.map((src) => ({ src }));

    // Fail open: missing/broken assets should not prevent the clock from mounting.
    try {
      await Promise.allSettled(preloadAssets(assets));
    } catch {
      // preloadAssets is already Promise-based; this catch is defensive.
    }
  }, []);


  useEffect(() => {
    if (!currentItem) {
      // Reset state when no item is selected
      setIsReady(false);
      setOverlayVisible(false);
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const loadClock = async () => {
      setIsReady(false);
      setOverlayVisible(true);
      setError(null);

      // Safety timeout: force overlay to hide if loading takes too long
      timeoutRef.current = setTimeout(() => {
        console.warn('[useClockPage] Loading timeout reached, forcing overlay hide');
        setOverlayVisible(false);
        if (!isReadyRef.current) {
          setError('Clock loading timed out');
        }
      }, LOADING_TIMEOUT);

      try {
        // 1. Resolve the module path
        // clockModules keys come from Vite's glob and can have varying path prefixes.
        // We match only by the suffix that must always be present.
        const match = Object.entries(clockModules).find(([p]) => p.endsWith(`/${currentItem.date}/Clock.tsx`));

        if (!match) {
          throw new Error(
            `Clock lookup failed for date: ${currentItem.date}. ` +
              `Expected a module ending with /${currentItem.date}/Clock.tsx. ` +
              `Check that the folder structure under src/pages matches the date.`,
          );
        }

        const [path, importFn] = match;

        // 2. Dynamically import the module
        const module = (await importFn().catch((err) => {
          console.error(`[useClockPage] Failed to import module at ${path}:`, err);
          throw new Error(`Module execution failed. This usually means an internal import (image/font) is broken or there is a syntax error in Clock.tsx.`);
        })) as ClockModule;
        
        // 3. Preload defined assets (images + video + audio)
        if (module.assets && module.assets.length > 0) {
          await preloadClockAssets(module.assets);
        }


        // 4. Update component state
        setClockComponent(() => module.default);
        
        // 5. Short delay for React to mount before fading overlay
        requestAnimationFrame(() => {
          setIsReady(true);
          // Fade out overlay after a tiny buffer to ensure layout is stable
          setTimeout(() => setOverlayVisible(false), 50);
        });

      } catch (err) {
        console.error('Error loading clock page:', err);
        setError(err instanceof Error ? err.message : 'Unknown loading error');
        setOverlayVisible(false);
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    loadClock();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentItem, clockModules, preloadClockAssets]);


  return { ClockComponent, isReady, error, overlayVisible };
}