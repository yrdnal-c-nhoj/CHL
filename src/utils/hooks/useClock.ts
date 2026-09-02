import { useState, useEffect, useRef } from 'react';

/**
 * Canonical 1-second clock hook.
 *
 * Returns a `Date` that updates once per second via `requestAnimationFrame`.
 * Only re-renders when the displayed second actually changes — this is the
 * default time source for clocks that don't need sub-second precision.
 *
 * For smooth / sub-second animations, use `useSmoothClock` instead.
 *
 * @returns {Date} Current time, updates each second
 */
export function useClock(): Date {
  const [time, setTime] = useState(() => new Date());
  const lastSecondRef = useRef<number>(-1);
  const rafIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const tick = (_timestamp: number) => {
      const now = new Date();
      const currentSecond = now.getSeconds();
      if (currentSecond !== lastSecondRef.current) {
        lastSecondRef.current = currentSecond;
        setTime(now);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return time;
}

export default useClock;