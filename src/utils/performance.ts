import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Performance optimization utilities for React components
 */

/**
 * Hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling functions
 * @param func - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastExecRef.current > delay) {
        lastExecRef.current = now;
        return func(...args);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(
        () => {
          lastExecRef.current = Date.now();
          func(...args);
        },
        delay - (now - lastExecRef.current),
      );
    },
    [func, delay],
  ) as T;
}

/**
 * Hook for memoizing expensive calculations with cleanup
 * @param factory - Function that creates the value
 * @param cleanup - Function to cleanup the value
 * @param deps - Dependency array
 * @returns Memoized value
 */
export function useMemoWithCleanup<T>(
  factory: () => T,
  cleanup: (value: T) => void,
  deps: React.DependencyList,
): T {
  const valueRef = useRef<T>();
  const depsRef = useRef<React.DependencyList>();

  // Check if dependencies changed
  const depsChanged =
    !depsRef.current || !deps.every((dep, i) => dep === depsRef.current![i]);

  if (depsChanged) {
    // Cleanup previous value
    if (valueRef.current !== undefined) {
      cleanup(valueRef.current);
    }

    // Create new value
    valueRef.current = factory();
    depsRef.current = deps;
  }

  return valueRef.current as T;
}

/**
 * Hook for intersection observer with performance optimizations
 * @param options - Intersection observer options
 * @returns Intersection observer result
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {},
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const setElementRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
          setEntry(entry);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return {
    ref: setElementRef,
    isIntersecting,
    entry,
  };
}

/**
 * Hook for lazy loading images with performance optimizations
 * @param src - Image source
 * @param options - Loading options
 * @returns Loading state and image ref
 */
export function useLazyImage(
  src: string,
  options: {
    threshold?: number;
    rootMargin?: string;
  } = {},
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '50px',
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const setRefs = useCallback(
    (node: HTMLImageElement | null) => {
      intersectionRef(node);
      imgRef.current = node;
    },
    [intersectionRef],
  );

  useEffect(() => {
    if (!isIntersecting || !src) return;

    const img = new Image();
    img.src = src;

    const onLoad = () => {
      setIsLoaded(true);
      setIsError(false);
      if (imgRef.current) {
        imgRef.current.src = src;
      }
    };

    const onError = () => {
      setIsError(true);
      setIsLoaded(false);
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [isIntersecting, src]);

  return {
    ref: setRefs,
    isLoaded,
    isError,
    shouldLoad: isIntersecting,
  };
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  static endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.timers.delete(name);

    // Log performance warnings
    if (duration > 100) {
      console.warn(
        `Slow operation detected: ${name} took ${duration.toFixed(2)}ms`,
      );
    }

    return duration;
  }

  static measureFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
  ): T {
    return ((...args: any[]) => {
      this.startTimer(name);
      try {
        const result = fn(...args);
        this.endTimer(name);
        return result;
      } catch (error) {
        this.endTimer(name);
        throw error;
      }
    }) as T;
  }

  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }
    return { used: 0, total: 0, percentage: 0 };
  }
}

/**
 * Virtual scrolling utilities for large lists
 */
export function useVirtualScrolling<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan,
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    handleScroll,
    offsetY: visibleRange.startIndex * itemHeight,
  };
}
