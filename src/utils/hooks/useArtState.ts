/**
 * useArtState Hook
 * 
 * Manages art-specific state separately from time updates
 * Prevents double-rendering and performance issues
 * Based on technical survey findings
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useClockTime } from './useClockTime';

interface ArtStateConfig<T> {
  generator: (time: Date) => T;
  dependencies?: unknown[];
  memoize?: boolean;
}

export function useArtState<T>({
  generator,
  dependencies = [],
  memoize = true
}: ArtStateConfig<T>): T {
  const time = useClockTime();
  
  // Memoize the generator function to prevent unnecessary recalculations
  const memoizedGenerator = useCallback(
    (currentTime: Date) => generator(currentTime),
    dependencies
  );
  
  // Use useMemo for performance optimization
  if (memoize) {
    return useMemo(
      () => memoizedGenerator(time),
      [time, memoizedGenerator]
    );
  }
  
  // Fallback for non-memoized version
  return memoizedGenerator(time);
}

// Specialized art state hooks for common patterns
export function useDigitColors(totalCells: number) {
  return useArtState({
    generator: (time: Date) => {
      // Seeded random for consistency
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      const seed = (hours * 3600 + minutes * 60 + seconds) % 1000;
      const random = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      return Array.from({ length: totalCells }, (_, i) => 
        Math.floor(random(seed + i) * 10)
      );
    },
    dependencies: [totalCells],
    memoize: true
  });
}

export function useClockCycle(cycleLength: number) {
  return useArtState({
    generator: (time: Date) => {
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      return Math.floor(totalSeconds / cycleLength) % cycleLength;
    },
    dependencies: [cycleLength],
    memoize: true
  });
}

export function useDigitMapping(digits: string[]) {
  return useArtState({
    generator: () => {
      const mapping: Record<string, string> = {};
      digits.forEach((digit, index) => {
        mapping[index.toString()] = digit;
      });
      return mapping;
    },
    dependencies: [digits],
    memoize: true
  });
}

export function useArtStateWithCleanup<T>(
  generator: (time: Date) => T,
  cleanup?: () => void,
  dependencies: unknown[] = []
): T {
  const result = useArtState({
    generator,
    dependencies,
    memoize: true
  });
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return result;
}
