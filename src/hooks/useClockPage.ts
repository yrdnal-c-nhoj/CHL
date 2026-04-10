import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

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

  const preloadAsset = useCallback((url: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload asset: ${url}`);
        resolve(); // Resolve anyway to prevent hanging the UI
      };
    });
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
        const [year, month] = currentItem.date.split('-');
        const path = `../pages/20${year}/${year}-${month}/${currentItem.date}/Clock.tsx`;
        
        const importFn = clockModules[path];
        if (!importFn) {
          throw new Error(`Clock not found at path: ${path}`);
        }

        // 2. Dynamically import the module
        const module = (await importFn()) as ClockModule;
        
        // 3. Preload defined assets (images/gifs)
        if (module.assets && module.assets.length > 0) {
          await Promise.all(module.assets.map(preloadAsset));
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
  }, [currentItem, clockModules, preloadAsset]);

  return { ClockComponent, isReady, error, overlayVisible };
}