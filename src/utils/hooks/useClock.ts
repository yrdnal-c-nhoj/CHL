import { useState, useEffect, useRef } from 'react';

/**
 * useClock: A high-precision hook providing synced NTP time
 * and smooth 60fps updates via requestAnimationFrame.
 */
export function useClock() {
  const [time, setTime] = useState(new Date());
  const offsetRef = useRef<number>(0);
  const rafRef = useRef<number>(null);

  // 1. Sync with NTP on mount
  useEffect(() => {
    const syncTime = async () => {
      try {
        const start = performance.now();
        const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await res.json();
        const end = performance.now();
        
        const networkDelay = (end - start) / 2;
        const serverTime = new Date(data.utc_datetime).getTime();
        offsetRef.current = serverTime - (Date.now() + networkDelay);
      } catch (e) {
        console.warn('NTP Sync failed, falling back to local time.', e);
      }
    };
    syncTime();
  }, []);

  // 2. Smooth Animation Loop
  useEffect(() => {
    const tick = () => {
      const now = new Date(Date.now() + offsetRef.current);
      setTime(now);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    time,
    ms: time.getMilliseconds(),
    seconds: time.getSeconds(),
    minutes: time.getMinutes(),
    hours: time.getHours(),
    // Provides a 0-1 progress value for smooth rotations
    smoothSeconds: time.getSeconds() + time.getMilliseconds() / 1000
  };
}