import { useState, useEffect, useCallback, useRef } from 'react';
import type { ComponentType } from 'react';

// Preload all Clock.tsx files under /pages/**/Clock.tsx
const clockModules = import.meta.glob('../../pages/**/Clock.tsx');

export interface ClockItem {
  date: string;
  path: string;
  title?: string;
}

interface UseClockPageResult {
  ClockComponent: ComponentType | null;
  isReady: boolean;
  error: string | null;
  overlayVisible: boolean;
}

export const useClockPage = (item: ClockItem | null | undefined): UseClockPageResult => {
  const [ClockComponent, setClockComponent] = useState<ComponentType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  
  // Ref to track the current loading item to prevent race conditions
  const loadingItemRef = useRef<string | null>(null);


  const getClockModuleKey = useCallback((item: ClockItem) => {
    const date = item?.date || item?.path;
    if (!date) return null;

    const [yy, mm] = date.split('-');
    if (!yy || !mm) return null;

    const candidates = [
      `../../pages/${yy}-${mm}/${item.path}/Clock.tsx`, // month/day structure
      `../../pages/${item.path}/Clock.tsx`, // legacy flat structure
    ];


    for (const key of candidates) {
      if (clockModules[key]) {
        return key;
      }
    }

    return null;
  }, []);

  const preloadAssets = useCallback(async (module: any) => {
    // Preload images exported from module
    const images = Object.values(module).filter(
      (value): value is string =>
        typeof value === 'string' &&
        /\.(jpg|jpeg|png|webp|gif|mp4|webm)$/i.test(value),
    );

    const imagePromises = images.map(
      (src) =>
        new Promise<void>((resolve) => {
          if (/\.(mp4|webm)$/i.test(src)) {
            resolve();
          } else {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        }),
    );

    await Promise.all(imagePromises);
  }, []);

  useEffect(() => {
    const loadClock = async () => {
      if (!item) {
        setClockComponent(null);
        setIsReady(false);
        return;
      }

      const itemKey = item.date || item.path;
      loadingItemRef.current = itemKey;
      
      setOverlayVisible(true);
      setError(null);

      try {
        const moduleKey = getClockModuleKey(item);
        if (!moduleKey) {
          throw new Error(`No clock found for date: ${item.date}`);
        }

        const moduleLoader = clockModules[moduleKey] as () => Promise<any>;
        const module = await moduleLoader();
        
        // Only proceed if we're still loading the same item
        if (loadingItemRef.current === itemKey) {
          await preloadAssets(module);
          
          setClockComponent(() => module.default);
          setIsReady(true);
          setTimeout(() => setOverlayVisible(false), 300);
        }
      } catch (err: any) {
        if (loadingItemRef.current === itemKey) {
          console.error('Failed to load clock:', err);
          setError(err.message || 'Failed to load clock');
        }
      }
    };

    loadClock();
  }, [item, getClockModuleKey, preloadAssets]);

  return { ClockComponent, isReady, error, overlayVisible };
};