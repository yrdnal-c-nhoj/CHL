import { useState, useEffect, useRef } from 'react';

/**
 * Hook for smooth clock updates using requestAnimationFrame
 * Replaces setInterval for better performance and battery efficiency
 *
 * @param updateInterval - Update interval in milliseconds (default: 1000 for seconds, use lower values for milliseconds)
 * @returns Current time
 */
export function useSmoothClock(updateInterval: number = 1000): Date {
  const [time, setTime] = useState(new Date());
  const lastUpdateRef = useRef<number>(0);
  const rafIdRef = useRef<number>();

  useEffect(() => {
    const animate = (timestamp: number = performance.now()) => {
      // Update based on interval to avoid excessive updates
      if (timestamp - lastUpdateRef.current >= updateInterval) {
        setTime(new Date());
        lastUpdateRef.current = timestamp;
      }
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateInterval]);

  return time;
}

/**
 * Hook for smooth clock updates that only updates when seconds change
 * More efficient for clocks that don't need millisecond precision
 *
 * @returns Current time
 */
export function useSecondClock(): Date {
  const [time, setTime] = useState(new Date());
  const lastSecondRef = useRef<number>(-1);
  const rafIdRef = useRef<number>();

  useEffect(() => {
    const animate = (_timestamp: number) => {
      const now = new Date();
      const currentSecond = now.getSeconds();

      // Only update when seconds change
      if (currentSecond !== lastSecondRef.current) {
        setTime(now);
        lastSecondRef.current = currentSecond;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return time;
}

/**
 * Hook for smooth millisecond display
 * Optimized for clocks showing millisecond precision
 *
 * @param updateInterval - Update interval in milliseconds (default: 50)
 * @returns Current time
 */
export function useMillisecondClock(updateInterval: number = 50): Date {
  return useSmoothClock(updateInterval);
}
