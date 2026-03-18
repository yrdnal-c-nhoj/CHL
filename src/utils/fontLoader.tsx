import React, { useState, useLayoutEffect, useMemo } from 'react';

interface FontFaceOptions {
  display?: string;
  weight?: string;
  style?: string;
}

interface FontConfig {
  fontFamily: string;
  fontUrl: string;
  options?: FontFaceOptions;
}

interface StylesConfig {
  fontFaces?: Array<{
    fontFamily: string;
    fontUrl: string;
    options?: FontFaceOptions;
  }>;
  keyframes?: Record<string, string | Record<string, string | number>>;
  custom?: string;
}

interface StyleElement extends HTMLStyleElement {
  remove(): void;
}

/**
 * Style injection utility for centralizing CSS management
 */
class StyleManager {
  private injectedStyles: Map<string, StyleElement>;

  constructor() {
    this.injectedStyles = new Map();
  }

  /**
   * Inject CSS styles into the document head
   * @param id - Unique identifier for the style
   * @param css - CSS content to inject
   */
  inject(id: string, css: string): void {
    if (typeof document === 'undefined') return;

    // Remove existing style if it exists
    if (this.injectedStyles.has(id)) {
      const existingElement = this.injectedStyles.get(id);
      if (existingElement && existingElement.parentNode) {
        existingElement.parentNode.removeChild(existingElement);
      }
    }

    // Create and inject new style element
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    styleElement.setAttribute('data-style-id', id);
    document.head.appendChild(styleElement);
    this.injectedStyles.set(id, styleElement);
  }

  /**
   * Remove injected styles
   * @param id - Unique identifier for the style
   */
  remove(id: string): void {
    if (this.injectedStyles.has(id)) {
      const element = this.injectedStyles.get(id);
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.injectedStyles.delete(id);
    }
  }

  /**
   * Generate font-face CSS
   * @param fontFamily - Font family name
   * @param fontUrl - Font file URL
   * @param options - Font face options
   * @returns CSS string
   */
  generateFontFaceCSS(fontFamily: string, fontUrl: string, options: FontFaceOptions = {}): string {
    const display = options.display || 'swap';
    const weight = options.weight || 'normal';
    const style = options.style || 'normal';
    
    return `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${fontUrl}') format('truetype');
        font-display: ${display};
        font-weight: ${weight};
        font-style: ${style};
      }
    `;
  }

  /**
   * Generate keyframes CSS
   * @param name - Animation name
   * @param keyframes - Keyframe definitions
   * @returns CSS string
   */
  generateKeyframesCSS(name: string, keyframes: Record<string, string | Record<string, string | number>>): string {
    const keyframeRules = Object.entries(keyframes)
      .map(([percentage, styles]) => {
        let styleString: string;
        if (typeof styles === 'string') {
          styleString = `  ${styles}`;
        } else if (typeof styles === 'object' && styles !== null) {
          styleString = Object.entries(styles)
            .map(([prop, value]) => `  ${prop}: ${value};`)
            .join('\n');
        } else {
          styleString = `  ${styles}`;
        }
        return `  ${percentage} {\n${styleString}\n  }`;
      })
      .join('\n');

    return `
      @keyframes ${name} {
        ${keyframeRules}
      }
    `;
  }
}

// Global style manager instance
const styleManager = new StyleManager();

/**
 * Loads a single font programmatically using the FontFace API.
 * Prevents FOUC (Flash of Unstyled Content).
 *
 * @param fontFamily - The font family name
 * @param fontUrl - The URL to the font file
 * @param options - Optional font face options
 * @returns true when font is loaded (or failed but settled)
 */
export function useFontLoader(fontFamily: string, fontUrl: string, options: FontFaceOptions = {}): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;

    const load = async (): Promise<void> => {
      if (typeof document === 'undefined' || !('fonts' in document)) {
        if (isMounted) setIsLoaded(true);
        return;
      }

      try {
        const font = new FontFace(fontFamily, `url(${fontUrl})`, { 
          ...options,
          display: 'swap' // Always use swap to prevent FOUC
        });
        await font.load();
        document.fonts.add(font);
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [fontFamily, fontUrl, JSON.stringify(options)]);

  return isLoaded;
}

/**
 * Loads multiple fonts programmatically using the FontFace API.
 * Prevents FOUC (Flash of Unstyled Content) and cleans up component logic.
 *
 * @param fonts - Array of font configurations
 * @param styles - Optional additional CSS to inject
 * @returns true when all fonts are loaded (or failed but settled)
 */
export function useMultipleFontLoader(fonts: FontConfig[], styles: StylesConfig = {}): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;

    const load = async (): Promise<void> => {
      if (typeof document === 'undefined' || !('fonts' in document)) {
        if (isMounted) setIsLoaded(true);
        return;
      }

      try {
        // Load fonts
        const fontPromises = fonts.map(async (f) => {
          const font = new FontFace(
            f.fontFamily,
            `url(${f.fontUrl})`,
            { 
              ...f.options,
              display: 'swap' // Always use swap to prevent FOUC
            }
          );
          await font.load();
          document.fonts.add(font);
        });

        await Promise.all(fontPromises);

        // Inject additional styles if provided
        if (styles.fontFaces || styles.keyframes || styles.custom) {
          const styleId = `clock-styles-${Date.now()}`;
          let css = '';

          // Generate font-face CSS
          if (styles.fontFaces) {
            styles.fontFaces.forEach(({ fontFamily, fontUrl, options }) => {
              css += styleManager.generateFontFaceCSS(fontFamily, fontUrl, options);
            });
          }

          // Generate keyframes CSS
          if (styles.keyframes) {
            Object.entries(styles.keyframes).forEach(([name, keyframes]) => {
              css += styleManager.generateKeyframesCSS(name, keyframes);
            });
          }

          // Add custom CSS
          if (styles.custom) {
            css += styles.custom;
          }

          styleManager.inject(styleId, css);
        }
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [fonts, styles]);

  return isLoaded;
}

/**
 * Hook for injecting styles without font loading
 * @param styles - Style configuration
 */
export function useStyleInjection(styles: StylesConfig = {}): void {
  const styleId = useMemo(() => `style-${Math.random().toString(36).substr(2, 9)}`, []);

  useLayoutEffect(() => {
    let css = '';

    // Generate font-face CSS
    if (styles.fontFaces) {
      styles.fontFaces.forEach(({ fontFamily, fontUrl, options }) => {
        css += styleManager.generateFontFaceCSS(fontFamily, fontUrl, options);
      });
    }

    // Generate keyframes CSS
    if (styles.keyframes) {
      Object.entries(styles.keyframes).forEach(([name, keyframes]) => {
        css += styleManager.generateKeyframesCSS(name, keyframes);
      });
    }

    // Add custom CSS
    if (styles.custom) {
      css += styles.custom;
    }

    if (css) {
      styleManager.inject(styleId, css);
    }

    return () => {
      if (css) {
        styleManager.remove(styleId);
      }
    };
  }, [styleId, styles]);
}

/**
 * Suspense-friendly font loader that throws a promise when fonts are loading
 * @param fonts - Font configurations
 * @param styles - Additional styles to inject
 * @throws Promise during loading, completes when ready
 */
export function useSuspenseFontLoader(fonts: FontConfig[], styles: StylesConfig = {}): void {
  const hasLoaded = useMultipleFontLoader(fonts, styles);
  
  if (!hasLoaded) {
    // Throw a promise that React Suspense can catch
    throw new Promise<void>((resolve) => {
      const checkLoaded = (): void => {
        if (hasLoaded) {
          resolve();
        } else {
          setTimeout(checkLoaded, 50);
        }
      };
      checkLoaded();
    });
  }
}

/**
 * Higher-order component for wrapping clocks with Suspense
 * @param ClockComponent - The clock component to wrap
 * @param fallback - Fallback UI for loading state
 * @returns Wrapped component
 */
export function withClockSuspense<T extends Record<string, any>>(
  ClockComponent: React.ComponentType<T>,
  fallback: React.ReactNode = null
): React.ComponentType<T> {
  const SuspenseWrapper = (props: T) => (
    <React.Suspense fallback={fallback || <ClockLoadingFallback />}>
      <ClockComponent {...props} />
    </React.Suspense>
  );
  
  SuspenseWrapper.displayName = `withClockSuspense(${ClockComponent.displayName || ClockComponent.name})`;
  return SuspenseWrapper;
}

/**
 * Default loading fallback component
 */
export function ClockLoadingFallback(): React.ReactElement {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '1.2rem'
    }}>
      Loading clock...
    </div>
  );
}

export { styleManager };
