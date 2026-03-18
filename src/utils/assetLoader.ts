import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Standardized Asset Loading System
 * 
 * Centralizes all asset loading patterns (images, videos, audio, fonts)
 * with consistent error handling, loading states, and performance optimization.
 */

// Global registries to prevent duplicate loading
const imageRegistry = new Map<string, Promise<HTMLImageElement>>();
const videoRegistry = new Map<string, Promise<HTMLVideoElement>>();
const audioRegistry = new Map<string, Promise<HTMLAudioElement>>();

// Asset loading states
export type AssetLoadState = 'loading' | 'loaded' | 'error' | 'fallback';

export interface AssetConfig {
  src: string;
  fallback?: string;
  preload?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  referrerPolicy?: ReferrerPolicy;
  loading?: 'eager' | 'lazy';
}

export interface ImageAssetConfig extends AssetConfig {
  srcSet?: string;
  sizes?: string;
  alt?: string;
}

export interface VideoAssetConfig extends AssetConfig {
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
}

export interface AudioAssetConfig extends AssetConfig {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
}

/**
 * Standardized image loading hook
 */
export function useImageLoader(config: ImageAssetConfig): {
  state: AssetLoadState;
  element: HTMLImageElement | null;
  error: Error | null;
  ref: React.RefObject<HTMLImageElement>;
} {
  const [state, setState] = useState<AssetLoadState>('loading');
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLImageElement>(null);

  const loadImage = useCallback(async () => {
    if (imageRegistry.has(config.src)) {
      try {
        const cachedImage = await imageRegistry.get(config.src)!;
        setState('loaded');
        return cachedImage;
      } catch (err) {
        setError(err as Error);
        setState('error');
        return null;
      }
    }

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setState('loaded');
        resolve(img);
      };
      
      img.onerror = () => {
        const err = new Error(`Failed to load image: ${config.src}`);
        setError(err);
        
        // Try fallback if available
        if (config.fallback) {
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            setState('fallback');
            resolve(fallbackImg);
          };
          fallbackImg.onerror = () => {
            reject(err);
          };
          fallbackImg.src = config.fallback;
        } else {
          reject(err);
        }
      };

      // Set image properties
      img.src = config.src;
      if (config.srcSet) img.srcset = config.srcSet;
      if (config.sizes) img.sizes = config.sizes;
      if (config.crossOrigin) img.crossOrigin = config.crossOrigin;
      if (config.referrerPolicy) img.referrerPolicy = config.referrerPolicy;
      if (config.loading) img.loading = config.loading;
    });

    imageRegistry.set(config.src, loadPromise);
    
    try {
      return await loadPromise;
    } catch (err) {
      setError(err as Error);
      setState('error');
      return null;
    }
  }, [config]);

  useEffect(() => {
    if (config.preload !== false) {
      loadImage();
    }
  }, [loadImage, config.preload]);

  return {
    state,
    element: elementRef.current,
    error,
    ref: elementRef
  };
}

/**
 * Standardized video loading hook
 */
export function useVideoLoader(config: VideoAssetConfig): {
  state: AssetLoadState;
  element: HTMLVideoElement | null;
  error: Error | null;
  ref: React.RefObject<HTMLVideoElement>;
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
} {
  const [state, setState] = useState<AssetLoadState>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const elementRef = useRef<HTMLVideoElement>(null);

  const loadVideo = useCallback(async () => {
    if (videoRegistry.has(config.src)) {
      try {
        const cachedVideo = await videoRegistry.get(config.src)!;
        setState('loaded');
        return cachedVideo;
      } catch (err) {
        setError(err as Error);
        setState('error');
        return null;
      }
    }

    const loadPromise = new Promise<HTMLVideoElement>((resolve, reject) => {
      const video = document.createElement('video');
      
      video.onloadeddata = () => {
        setState('loaded');
        resolve(video);
      };
      
      video.onerror = () => {
        const err = new Error(`Failed to load video: ${config.src}`);
        setError(err);
        
        // Try fallback if available
        if (config.fallback) {
          const fallbackVideo = document.createElement('video');
          fallbackVideo.onloadeddata = () => {
            setState('fallback');
            resolve(fallbackVideo);
          };
          fallbackVideo.onerror = () => {
            reject(err);
          };
          fallbackVideo.src = config.fallback;
        } else {
          reject(err);
        }
      };

      // Set video properties
      video.src = config.src;
      if (config.poster) video.poster = config.poster;
      if (config.crossOrigin) video.crossOrigin = config.crossOrigin;
      if (config.autoplay !== undefined) video.autoplay = config.autoplay;
      if (config.muted !== undefined) video.muted = config.muted;
      if (config.loop !== undefined) video.loop = config.loop;
      if (config.playsInline !== undefined) video.playsInline = config.playsInline;
      if (config.controls !== undefined) video.controls = config.controls;
      
      // Preload the video
      video.load();
    });

    videoRegistry.set(config.src, loadPromise);
    
    try {
      return await loadPromise;
    } catch (err) {
      setError(err as Error);
      setState('error');
      return null;
    }
  }, [config]);

  const play = useCallback(async () => {
    if (elementRef.current) {
      try {
        await elementRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Video play failed:', err);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (config.preload !== false) {
      loadVideo();
    }
  }, [loadVideo, config.preload]);

  return {
    state,
    element: elementRef.current,
    error,
    ref: elementRef,
    play,
    pause,
    isPlaying
  };
}

/**
 * Standardized audio loading hook
 */
export function useAudioLoader(config: AudioAssetConfig): {
  state: AssetLoadState;
  element: HTMLAudioElement | null;
  error: Error | null;
  ref: React.RefObject<HTMLAudioElement>;
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  setVolume: (volume: number) => void;
} {
  const [state, setState] = useState<AssetLoadState>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const elementRef = useRef<HTMLAudioElement>(null);

  const loadAudio = useCallback(async () => {
    if (audioRegistry.has(config.src)) {
      try {
        const cachedAudio = await audioRegistry.get(config.src)!;
        setState('loaded');
        return cachedAudio;
      } catch (err) {
        setError(err as Error);
        setState('error');
        return null;
      }
    }

    const loadPromise = new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = new Audio();
      
      audio.onloadeddata = () => {
        setState('loaded');
        resolve(audio);
      };
      
      audio.onerror = () => {
        const err = new Error(`Failed to load audio: ${config.src}`);
        setError(err);
        
        // Try fallback if available
        if (config.fallback) {
          const fallbackAudio = new Audio(config.fallback);
          fallbackAudio.onloadeddata = () => {
            setState('fallback');
            resolve(fallbackAudio);
          };
          fallbackAudio.onerror = () => {
            reject(err);
          };
        } else {
          reject(err);
        }
      };

      // Set audio properties
      audio.src = config.src;
      if (config.crossOrigin) audio.crossOrigin = config.crossOrigin;
      if (config.autoplay !== undefined) audio.autoplay = config.autoplay;
      if (config.loop !== undefined) audio.loop = config.loop;
      if (config.muted !== undefined) audio.muted = config.muted;
      if (config.volume !== undefined) audio.volume = config.volume;
      
      // Preload the audio
      audio.load();
    });

    audioRegistry.set(config.src, loadPromise);
    
    try {
      return await loadPromise;
    } catch (err) {
      setError(err as Error);
      setState('error');
      return null;
    }
  }, [config]);

  const play = useCallback(async () => {
    if (elementRef.current) {
      try {
        await elementRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio play failed:', err);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (elementRef.current) {
      elementRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  useEffect(() => {
    if (config.preload !== false) {
      loadAudio();
    }
  }, [loadAudio, config.preload]);

  return {
    state,
    element: elementRef.current,
    error,
    ref: elementRef,
    play,
    pause,
    isPlaying,
    setVolume
  };
}

/**
 * Multi-asset loading hook for clocks with multiple assets
 */
export function useMultiAssetLoader<T extends Record<string, AssetConfig>>(
  configs: T
): {
  states: Record<keyof T, AssetLoadState>;
  errors: Record<keyof T, Error | null>;
  isAllLoaded: boolean;
  hasErrors: boolean;
  loadedCount: number;
  totalCount: number;
} {
  const [states, setStates] = useState<Record<keyof T, AssetLoadState>>(
    {} as Record<keyof T, AssetLoadState>
  );
  const [errors, setErrors] = useState<Record<keyof T, Error | null>>(
    {} as Record<keyof T, Error | null>
  );

  useEffect(() => {
    const assetKeys = Object.keys(configs) as (keyof T)[];
    const initialStates = {} as Record<keyof T, AssetLoadState>;
    const initialErrors = {} as Record<keyof T, Error | null>;

    assetKeys.forEach(key => {
      initialStates[key] = 'loading';
      initialErrors[key] = null;
    });

    setStates(initialStates);
    setErrors(initialErrors);

    // Load all assets
    const loadPromises = assetKeys.map(async (key) => {
      const config = configs[key];
      if (!config) return;

      let newState: AssetLoadState = 'loading';
      let newError: Error | null = null;

      try {
        // Determine asset type and load accordingly
        if (config.src.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          // Image asset
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load image: ${config.src}`));
            img.src = config.src;
          });
          newState = 'loaded';
        } else if (config.src.match(/\.(mp4|webm|ogg)$/i)) {
          // Video asset
          const video = document.createElement('video');
          await new Promise<void>((resolve, reject) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => reject(new Error(`Failed to load video: ${config.src}`));
            video.src = config.src;
            video.load();
          });
          newState = 'loaded';
        } else if (config.src.match(/\.(mp3|wav|ogg)$/i)) {
          // Audio asset
          const audio = new Audio();
          await new Promise<void>((resolve, reject) => {
            audio.onloadeddata = () => resolve();
            audio.onerror = () => reject(new Error(`Failed to load audio: ${config.src}`));
            audio.src = config.src;
            audio.load();
          });
          newState = 'loaded';
        }
      } catch (err) {
        newError = err as Error;
        newState = 'error';
        
        // Try fallback if available
        if (config.fallback) {
          try {
            if (config.fallback.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
              const img = new Image();
              await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = config.fallback;
              });
              newState = 'fallback';
            }
          } catch {
            // Fallback also failed
          }
        }
      }

      setStates(prev => ({ ...prev, [key]: newState }));
      setErrors(prev => ({ ...prev, [key]: newError }));
    });

    Promise.allSettled(loadPromises);
  }, [configs]);

  const loadedCount = Object.values(states).filter(state => 
    state === 'loaded' || state === 'fallback'
  ).length;
  const totalCount = Object.keys(configs).length;
  const isAllLoaded = loadedCount === totalCount;
  const hasErrors = Object.values(errors).some(error => error !== null);

  return {
    states,
    errors,
    isAllLoaded,
    hasErrors,
    loadedCount,
    totalCount
  };
}

/**
 * Asset preloading utility for performance optimization
 */
export function preloadAssets(assets: AssetConfig[]): Promise<void[]> {
  const preloadPromises = assets.map(asset => {
    if (asset.src.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = asset.src;
      });
    } else if (asset.src.match(/\.(mp4|webm|ogg)$/i)) {
      return new Promise<void>((resolve, reject) => {
        const video = document.createElement('video');
        video.onloadeddata = () => resolve();
        video.onerror = () => reject();
        video.src = asset.src;
        video.load();
      });
    } else if (asset.src.match(/\.(mp3|wav|ogg)$/i)) {
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio();
        audio.onloadeddata = () => resolve();
        audio.onerror = () => reject();
        audio.src = asset.src;
        audio.load();
      });
    }
    return Promise.resolve();
  });

  return Promise.all(preloadPromises);
}

/**
 * Asset utility functions
 */
export const AssetUtils = {
  /**
   * Get optimal format for current browser
   */
  getOptimalImageFormat(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Test for WebP support
      canvas.width = 1;
      canvas.height = 1;
      const webpData = canvas.toDataURL('image/webp');
      if (webpData.indexOf('data:image/webp') === 0) {
        return 'webp';
      }
    }
    return 'png';
  },

  /**
   * Generate responsive image srcset
   */
  generateSrcSet(basePath: string, sizes: number[]): string {
    const extension = basePath.split('.').pop() || 'png';
    return sizes
      .map(size => `${basePath}-${size}w.${extension} ${size}w`)
      .join(', ');
  },

  /**
   * Check if asset is already cached
   */
  isAssetCached(src: string): boolean {
    // Simple cache check using image loading
    const img = new Image();
    img.src = src;
    return img.complete;
  },

  /**
   * Clear asset registries (useful for testing or memory management)
   */
  clearRegistries(): void {
    imageRegistry.clear();
    videoRegistry.clear();
    audioRegistry.clear();
  }
};

export default {
  useImageLoader,
  useVideoLoader,
  useAudioLoader,
  useMultiAssetLoader,
  preloadAssets,
  AssetUtils
};
