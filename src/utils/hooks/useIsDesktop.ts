import { useEffect, useState } from 'react';

/**
 * Hook for detecting desktop-sized viewports.
 *
 * Uses the native window.matchMedia API for efficient, event-driven
 * updates (no polling or resize thrashing). SSR-safe — returns false
 * when window is unavailable.
 *
 * Breakpoint matches the project convention (768px) used across clocks.
 *
 * @returns {boolean} True when the viewport is >= 768px wide (desktop)
 */
const DESKTOP_QUERY = '(min-width: 768px)';

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(DESKTOP_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    // Set initial value (handles any change between render and effect)
    setIsDesktop(mediaQuery.matches);

    // Subscribe to breakpoint changes (modern API)
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDesktop;
}

export default useIsDesktop;

