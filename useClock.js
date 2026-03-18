import { useState, useEffect, useMemo } from 'react';

/**
 * Standardized hook for Clock components.
 * Provides time, date parts, and responsive metrics.
 *
 * @param {number} tickRate - Update interval in ms (default 1000)
 */
export function useClock(tickRate = 1000) {
  const [now, setNow] = useState(new Date());
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // 1. Time Loop
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), tickRate);
    return () => clearInterval(timer);
  }, [tickRate]);

  // 2. Resize Listener (Debounced could be better, but native is usually fine for simple clocks)
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Derived State (Memoized for performance)
  const timeData = useMemo(
    () => ({
      now,
      isPortrait: dimensions.height > dimensions.width,
      ...dimensions,
    }),
    [now, dimensions],
  );

  return timeData;
}
