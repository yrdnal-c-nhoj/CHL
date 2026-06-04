import { useCallback, useEffect, useRef, useState } from 'react';
import type { AssetConfig } from '../utils/assetLoader';
import { preloadAssets } from '../utils/assetLoader';

interface ClockModule {
  default: React.ComponentType;
  // Many clocks export assets as `string[]`.
  // Some legacy clocks (or future ones) may export `assets` as already-structured configs.
  assets?: unknown;
}

// Register all clock components via Vite glob outside the hook.
// This ensures the registry is static and correctly mapped by the build tool.
const CLOCK_MODULES = import.meta.glob('../pages/**/Clock.tsx') as Record<string, () => Promise<ClockModule>>;

// Build a static lookup map once for O(1) access
const CLOCK_LOOKUP = Object.entries(CLOCK_MODULES).reduce((acc, [path, importFn]) => {
  const dateMatch = path.match(/\/(\d{2}-\d{2}-\d{2})\//i);
  if (dateMatch) acc[dateMatch[1]] = importFn;
  return acc;
}, {} as Record<string, () => Promise<ClockModule>>);

// Safety timeout to prevent infinite black screen
const LOADING_TIMEOUT = 10000; // 10 seconds

/**
 * State-of-the-art dynamic clock loader.
 * Handles dynamic imports, asset preloading, and overlay synchronization.
 */

// NOTE: Some clocks export `assets` as `string[]`, others may export as `AssetConfig[]`.
// Production crashes like "Clock execution failed (...): assetPathString is not defined" usually happen
// when the preload layer expects `{ src: string }` but receives a plain string.
export function useClockPage(currentItem: { date: string } | null) {

  const [ClockComponent, setClockComponent] =
    useState<React.ComponentType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReadyRef = useRef(isReady);

  // Keep ref in sync with state to avoid stale closure in timeout
  isReadyRef.current = isReady;

  const preloadClockAssets = useCallback(
    async (assetUrls: string[]): Promise<void> => {
      if (!assetUrls?.length) return;

      // Use a completely unique name for the mapping function parameter
      // to avoid any potential minifier collision with global 'src' identifiers
      const configurations: AssetConfig[] = assetUrls.map((assetPathString) => ({ src: assetPathString }));
      
      // Create a timeout for asset preloading to prevent infinite hangs on broken resources
      const assetTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Asset preloading timed out')), 5000)
      );

      // Fail open: missing/broken assets should not prevent the clock from mounting.
      try {
        await Promise.race([
          preloadAssets(configurations),
          assetTimeout
        ]);
      } catch (e) {
        console.warn(`[useClockPage] Preload interrupted for ${currentItem?.date}:`, e);
        // preloadAssets is already Promise-based; this catch is defensive.
      }
    },
    [],
  );

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
        console.warn(
          '[useClockPage] Loading timeout reached, forcing overlay hide',
        );
        setOverlayVisible(false);
        if (!isReadyRef.current) {
          setError('Clock loading timed out');
        }
      }, LOADING_TIMEOUT);

      try {
        const targetDate = currentItem.date.trim();
        const importFn = CLOCK_LOOKUP[targetDate];

        if (!importFn) {
          throw new Error(
            `Clock lookup failed for date: ${targetDate}. Ensure the folder src/pages/${targetDate}/ exists.`
          );
        }

        // 2. Dynamically import the module
        const module = await importFn().catch(
          (err) => {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`[useClockPage] Critical: Failed to load module for ${targetDate}. Ensure the file exists in src/pages/ and has no syntax/import errors. Original error:`, err);
            
            if (msg.includes('Failed to fetch') || msg.includes('error loading dynamically imported module')) {
              throw new Error(
                `Clock file for ${targetDate} could not be fetched. This usually indicates a syntax error in the clock file, a broken import, a network failure, or an outdated browser cache. ` +
                `Please check the "Network" tab for 404s, the "Console" for script errors, and try a hard refresh (Cmd+Shift+R).`
              );
            }
            throw new Error(`Clock execution failed (${targetDate}): ${msg}`);
          },
        );

        if (!module || !module.default) {
          throw new Error(`Clock module for ${targetDate} is missing a default export.`);
        }

        // 3. Preload defined assets (images + video + audio)
        // Contract: most clock modules export `assets` as `string[]`.
        // Production breakage (black screen) can happen if a particular clock
        // exports a malformed `assets` value or if preloading hard-fails.
        //
        // Fail-open: asset preload must never prevent the clock from mounting.
        try {
          if (Array.isArray(module.assets) && module.assets.length > 0) {
            // Keep only string URLs; ignore any other shapes.
            // Filter out videos (.mp4, .webm) from preloading, as they cause networkidle hangs.
            const assetUrls = module.assets.filter((v) => 
              typeof v === 'string' && !/\.(mp4|webm|ogg)$/i.test(v)
            );

            if (assetUrls.length > 0) {
              await preloadClockAssets(assetUrls as string[]);
            }
          } else if (module.assets !== undefined) {
            // If assets exists but isn't a string[], log for diagnosis.
            // Don't throw.
            if (import.meta.env.PROD) {
              console.warn(
                `[useClockPage] Ignoring malformed assets for ${targetDate}. Type=${typeof module.assets}`,
                module.assets,
              );
            }
          }
        } catch (assetErr) {
          // Fail open: still mount the clock.
          console.warn(
            `[useClockPage] Asset preload failed for ${targetDate}. Clock will still mount.`,
            assetErr,
          );
        }

        // 4. Update component state
        if (!module.default) {
          // This check is redundant but helps with HMR edge cases
          throw new Error('Module loaded but default export is missing.');
        }
        
        console.log(`[useClockPage] Successfully prepared ${targetDate}`);

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
  }, [currentItem, preloadClockAssets]);

  return { ClockComponent, isReady, error, overlayVisible };
}
