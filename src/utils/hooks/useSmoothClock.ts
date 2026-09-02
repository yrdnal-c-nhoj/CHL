import { useState, useEffect, useRef } from 'react';

/**
 * Canonical smooth / sub-second clock hook.
 *
 * Returns a `Date` that updates on every animation frame, throttled to
 * `updateInterval` ms. Use this for smooth hand rotations, sub-second
 * animations, and any visual that needs to track milliseconds.
 *
 * For simple second-tick clocks, prefer `useClock` (cheaper, only re-renders
 * when the second changes).
 *
 * @param updateInterval - Update interval in milliseconds (default: 1000)
 * @returns {Date} Current time
 */
export function useSmoothClock(updateInterval: number = 1000): Date {
  const [time, setTime] = useState(new Date());
  const lastUpdateRef = useRef<number>(0);
  const rafIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (timestamp: number = performance.now()) => {
      if (timestamp - lastUpdateRef.current >= updateInterval) {
        setTime(new Date());
        lastUpdateRef.current = timestamp;
      }
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateInterval]);

  return time;
}

/**
 * @deprecated Use `useClock` instead. This thin re-export is kept only for
 * backward compatibility and will be removed in a future release.
 */
export function useSecondClock(): Date {
  const [time, setTime] = useState(new Date());
  const lastSecondRef = useRef<number>(-1);
  const rafIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (_timestamp: number) => {
      const now = new Date();
      const currentSecond = now.getSeconds();

      if (currentSecond !== lastSecondRef.current) {
        setTime(now);
        lastSecondRef.current = currentSecond;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return time;
}

/**
 * @deprecated Use `useSmoothClock` instead. This thin re-export is kept only
 * for backward compatibility and will be removed in a future release.
 */
export function useMillisecondClock(updateInterval: number = 50): Date {
  return useSmoothClock(updateInterval);
}