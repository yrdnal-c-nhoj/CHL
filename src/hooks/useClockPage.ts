import { useCallback, useEffect, useRef, useState } from 'react';
import type { AssetConfig } from '../utils/assetLoader';
import { preloadAssets } from '../utils/assetLoader';
import { getClockImport } from '@/clock/clockRegistry';

/**
 * Dynamically loads an actual Clock.tsx component and its declared assets.
 *
 * Clock component existence is resolved by clockRegistry. Metadata is not
 * consulted here, so stale or future metadata entries cannot create a clock
 * that does not exist.
 */
export function useClockPage(currentItem: { date: string } | null) {
  const [ClockComponent, setClockComponent] =
    useState<React.ComponentType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReadyRef = useRef(isReady);

  isReadyRef.current = isReady;

  const preloadClockAssets = useCallback(
    async (assetUrls: string[]): Promise<void> => {
      if (!assetUrls.length) return;

      const configurations: AssetConfig[] = assetUrls.map((src) => ({ src }));

      const assetTimeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Asset preloading timed out')),
          5000,
        ),
      );

      try {
        await Promise.race([
          preloadAssets(configurations),
          assetTimeout,
        ]);
      } catch (error) {
        console.warn(
          `[useClockPage] Preload interrupted for ${currentItem?.date}:`,
          error,
        );
      }
    },
    [currentItem?.date],
  );

  useEffect(() => {
    if (!currentItem) {
      setIsReady(false);
      setOverlayVisible(false);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const loadClock = async () => {
      setIsReady(false);
      setOverlayVisible(true);
      setError(null);

      timeoutRef.current = setTimeout(() => {
        console.warn(
          '[useClockPage] Loading timeout reached, forcing overlay hide',
        );
        setOverlayVisible(false);

        if (!isReadyRef.current) {
          setError('Clock loading timed out');
        }
      }, 10000);

      try {
        const targetDate = currentItem.date.trim();
        const importFn = getClockImport(targetDate);

        if (!importFn) {
          throw new Error(
            `No clock component exists for date: ${targetDate}.`,
          );
        }

        const module = await importFn().catch((err) => {
          const msg = err instanceof Error ? err.message : String(err);

          console.error(
            `[useClockPage] Critical: Failed to load module for ${targetDate}.`,
            err,
          );

          if (
            msg.includes('Failed to fetch') ||
            msg.includes('error loading dynamically imported module')
          ) {
            throw new Error(
              `Clock file for ${targetDate} could not be fetched. Check the browser console for details.`,
            );
          }

          throw new Error(
            `Clock execution failed for ${targetDate}: ${msg}`,
          );
        });

        if (!module?.default) {
          throw new Error(
            `Clock module for ${targetDate} is missing a default export.`,
          );
        }

        try {
          if (Array.isArray(module.assets) && module.assets.length > 0) {
            let assetUrls = module.assets.filter(
              (value): value is string => typeof value === 'string',
            );

            if (assetUrls.length > 1) {
              assetUrls = assetUrls.filter(
                (value) => !/\.(mp4|webm|ogg)$/i.test(value),
              );
            }

            if (assetUrls.length > 0) {
              await preloadClockAssets(assetUrls);
            }
          } else if (module.assets !== undefined) {
            console.warn(
              `[useClockPage] Ignoring malformed assets for ${targetDate}. Type=${typeof module.assets}`,
              module.assets,
            );
          }
        } catch (assetError) {
          console.warn(
            `[useClockPage] Asset preload failed for ${targetDate}. Clock will still mount.`,
            assetError,
          );
        }

        setClockComponent(() => module.default);

        requestAnimationFrame(() => {
          setIsReady(true);
          setTimeout(() => setOverlayVisible(false), 50);
        });
      } catch (error) {
        console.error('Error loading clock page:', error);
        setError(
          error instanceof Error ? error.message : 'Unknown loading error',
        );
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
