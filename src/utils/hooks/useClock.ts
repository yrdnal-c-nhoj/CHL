import { useSmoothClock } from './useSmoothClock';

/**
 * Canonical clock hook used by some older page implementations.
 *
 * Returns a Date object that updates smoothly.
 */
export function useClock() {
  const time = useSmoothClock(1000);
  return { time };
}

export default useClock;

