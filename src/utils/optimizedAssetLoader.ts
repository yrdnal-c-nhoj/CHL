import { useCallback, useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from './performance';

/**
 * Optimized asset loading utilities with performance enhancements
 */

interface AssetLoadOptions {
  preload?: boolean;
  priority?: 'high' | 'low' | 'auto';
  cache?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface AssetLoadResult {
  isLoaded: boolean;
  isError: boolean;
  isLoading: boolean;
  progress: number;
  error?: Error;
}

/**
 * Hook for optimized font loading with performance monitoring
 */
export function useOptimizedFontLoader(
  fontConfigs: Array<{
    fontFamily: string;
    fontUrl: string;
    options?: FontFaceDescriptors;
  }>,
  options: AssetLoadOptions = {}
) {
  const [loadState, setLoadState] = useState<Record<string, AssetLoadResult>>({});
  const loadedFonts = useRef<Set<string>>(new Set());

  const loadFont = useCallback(async (config: typeof fontConfigs[0]) => {
    const { fontFamily, fontUrl, options = {} } = config;
    const key = `${fontFamily}-${fontUrl}`;
    
    // Return early if already loaded
    if (loadedFonts.current.has(fontFamily)) {
      return;
    }

    // Update loading state
    setLoadState(prev => ({
      ...prev,
      [key]: { isLoaded: false, isError: false, isLoading: true, progress: 0 }
    }));

    try {
      const font = new FontFace(fontFamily, `url(${fontUrl})`, {
        ...options,
        display: 'swap',
        weight: options.weight || 'normal',
        style: options.style || 'normal',
      });

      // Load the font
      await font.load();
      
      // Add to document
      document.fonts.add(font);
      loadedFonts.current.add(fontFamily);

      // Update success state
      setLoadState(prev => ({
        ...prev,
        [key]: { isLoaded: true, isError: false, isLoading: false, progress: 100 }
      }));
    } catch (error) {
      // Update error state
      setLoadState(prev => ({
        ...prev,
        [key]: { 
          isLoaded: false, 
          isError: true, 
          isLoading: false, 
          progress: 0,
          error: error as Error
        }
      }));
    }
  }, []);

  // Load all fonts
  useEffect(() => {
    if (options.preload) {
      fontConfigs.forEach(loadFont);
    }
  }, [fontConfigs, loadFont, options.preload]);

  const allLoaded = Object.values(loadState).every(state => state.isLoaded);
  const hasError = Object.values(loadState).some(state => state.isError);

  return {
    loadFont,
    loadState,
    allLoaded,
    hasError,
    isLoading: Object.values(loadState).some(state => state.isLoading),
  };
}

/**
 * Hook for optimized image loading with lazy loading and progressive enhancement
 */
export function useOptimizedImageLoader(
  src: string,
  options: AssetLoadOptions & {
    placeholder?: string;
    formats?: Array<'webp' | 'avif' | 'jpg' | 'png'>;
  } = {}
) {
  const [loadResult, setLoadResult] = useState<AssetLoadResult>({
    isLoaded: false,
    isError: false,
    isLoading: false,
    progress: 0,
  });

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const abortController = useRef<AbortController | null>(null);

  const loadImage = useCallback(async () => {
    if (!src) return;

    // Cancel previous request if exists
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    const { signal } = abortController.current;

    setLoadResult(prev => ({ ...prev, isLoading: true, progress: 0 }));

    try {
      // Try modern formats first if supported
      const formats = options.formats || ['webp', 'avif', 'jpg'];
      let loadSrc = src;

      for (const format of formats) {
        if (format === 'webp' && supportsWebP()) {
          loadSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          break;
        } else if (format === 'avif' && supportsAVIF()) {
          loadSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
          break;
        }
      }

      // Create image with progress tracking
      const img = new Image();
      
      img.onload = () => {
        setLoadResult({
          isLoaded: true,
          isError: false,
          isLoading: false,
          progress: 100,
        });
        
        // Set the actual image src
        if (imageRef.current) {
          imageRef.current.src = loadSrc;
        }
      };

      img.onerror = () => {
        setLoadResult(prev => ({
          ...prev,
          isError: true,
          isLoading: false,
          error: new Error('Failed to load image'),
        }));
      };

      // Progress tracking (if available)
      if ('onprogress' in img) {
        (img as any).onprogress = (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setLoadResult(prev => ({ ...prev, progress }));
          }
        };
      }

      img.src = loadSrc;

    } catch (error) {
      if (!signal.aborted) {
        setLoadResult(prev => ({
          ...prev,
          isError: true,
          isLoading: false,
          error: error as Error,
        }));
      }
    }
  }, [src, options.formats]);

  // Start loading when intersecting
  useEffect(() => {
    if (isIntersecting && !loadResult.isLoaded && !loadResult.isLoading) {
      loadImage();
    }
  }, [isIntersecting, loadResult.isLoaded, loadResult.isLoading, loadImage]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const setRefs = useCallback((node: HTMLImageElement | null) => {
    intersectionRef(node);
    imageRef.current = node;
  }, [intersectionRef]);

  return {
    ref: setRefs,
    ...loadResult,
    shouldLoad: isIntersecting,
  };
}

/**
 * Hook for preloading critical assets
 */
export function useAssetPreloader(assets: string[], options: AssetLoadOptions = {}) {
  const [preloadedAssets, setPreloadedAssets] = useState<Set<string>>(new Set());
  const [failedAssets, setFailedAssets] = useState<Set<string>>(new Set());

  const preloadAsset = useCallback(async (asset: string): Promise<void> => {
    if (preloadedAssets.has(asset) || failedAssets.has(asset)) {
      return;
    }

    try {
      if (asset.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        // Preload image
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = asset;
        });
      } else if (asset.match(/\.(woff|woff2|ttf|otf)$/i)) {
        // Preload font
        const font = new FontFace('preload-font', `url(${asset})`);
        await font.load();
      } else if (asset.match(/\.(css)$/i)) {
        // Preload CSS
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = asset;
        document.head.appendChild(link);
      }

      setPreloadedAssets(prev => new Set(prev).add(asset));
    } catch (error) {
      setFailedAssets(prev => new Set(prev).add(asset));
    }
  }, [preloadedAssets, failedAssets]);

  useEffect(() => {
    if (options.preload) {
      assets.forEach(preloadAsset);
    }
  }, [assets, preloadAsset, options.preload]);

  return {
    preloadAsset,
    preloadedAssets,
    failedAssets,
    isPreloaded: (asset: string) => preloadedAssets.has(asset),
    isFailed: (asset: string) => failedAssets.has(asset),
  };
}

/**
 * Utility functions for format detection
 */
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}

/**
 * Performance monitoring for asset loading
 */
export class AssetPerformanceMonitor {
  private static metrics: Map<string, {
    loadTime: number;
    size: number;
    type: string;
    timestamp: number;
  }> = new Map();

  static recordAssetLoad(
    url: string,
    loadTime: number,
    size: number,
    type: string
  ): void {
    this.metrics.set(url, {
      loadTime,
      size,
      type,
      timestamp: Date.now(),
    });

    // Log slow assets
    if (loadTime > 1000) {
      console.warn(`Slow asset detected: ${url} took ${loadTime}ms to load`);
    }
  }

  static getMetrics(): Array<{
    url: string;
    loadTime: number;
    size: number;
    type: string;
    timestamp: number;
  }> {
    return Array.from(this.metrics.entries()).map(([url, metrics]) => ({
      url,
      ...metrics,
    }));
  }

  static getAverageLoadTime(type?: string): number {
    const metrics = this.getMetrics().filter(m => !type || m.type === type);
    if (metrics.length === 0) return 0;
    
    const totalTime = metrics.reduce((sum, m) => sum + m.loadTime, 0);
    return totalTime / metrics.length;
  }

  static clear(): void {
    this.metrics.clear();
  }
}

/**
 * Smart asset caching utility
 */
export class AssetCache {
  private static cache: Map<string, {
    data: any;
    timestamp: number;
    expiresAt: number;
  }> = new Map();

  static set(key: string, data: any, ttl: number = 3600000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  static has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Cleanup expired cache entries periodically
if (typeof window !== 'undefined') {
  setInterval(() => AssetCache.cleanup(), 60000); // Every minute
}
