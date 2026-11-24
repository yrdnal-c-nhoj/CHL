// Lightweight GA4 helper with environment + DNT guards.

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const APP_ENV =
  import.meta.env.VITE_ENVIRONMENT ||
  import.meta.env.MODE ||
  import.meta.env.NODE_ENV;

const isProdEnv = (): boolean => (APP_ENV || '').toLowerCase() === 'production';
const dntEnabled = (): boolean => {
  const dnt =
    navigator?.doNotTrack ||
    (window as any)?.doNotTrack ||
    (navigator as any)?.msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
};

let gaScriptLoading = false;
let gaInitialized = false;

const shouldTrack = (): boolean =>
  Boolean(GA_ID) && isProdEnv() && !dntEnabled();

const loadGaScript = () => {
  if (gaScriptLoading || gaInitialized) return;
  gaScriptLoading = true;

  // Bootstrap dataLayer / gtag stub early
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(..._args: unknown[]) {
      window.dataLayer.push(arguments);
    };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.onload = () => {
    window.gtag('js', new Date());
    // Disable auto page view; we send manual SPA hits.
    window.gtag('config', GA_ID, { send_page_view: false });
    gaInitialized = true;
  };
  document.head.appendChild(script);
};

export const pageview = (url: string) => {
  if (!shouldTrack()) return;

  loadGaScript();

  // If gtag is ready, send immediately; otherwise it will queue in dataLayer.
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_ID, {
      page_path: url,
    });
  }
};

/**
 * Send a custom event to GA4.
 */
const sendEvent = (name: string, params?: Record<string, any>) => {
  if (!shouldTrack()) return;
  loadGaScript();
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
};

/**
 * Track when a clock is viewed.
 */
export const clockViewed = (date: string, title?: string) =>
  sendEvent('clock_viewed', { clock_date: date, clock_title: title });

/**
 * Track when a clock's background video starts playing.
 */
export const clockVideoPlayed = (date: string) =>
  sendEvent('clock_video_played', { clock_date: date });

/**
 * Track font load success/failure for a clock.
 */
export const fontLoaded = (date: string, success: boolean) =>
  sendEvent('font_loaded', { clock_date: date, success });

/**
 * Track when user toggles reduced motion preference.
 */
export const reducedMotionToggled = (enabled: boolean) =>
  sendEvent('reduced_motion_toggle', { enabled });

/**
 * Track navigation method used.
 */
export const navigationUsed = (type: 'swipe' | 'click' | 'keyboard') =>
  sendEvent('navigation', { type });

/**
 * Track errors during clock rendering.
 */
export const clockError = (date: string, error: string) =>
  sendEvent('clock_error', { clock_date: date, error_message: error });

/**
 * Set user properties for the session.
 */
export const setUserProperties = (props: Record<string, string>) => {
  if (!shouldTrack()) return;
  loadGaScript();
  if (typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', props);
  }
};

/**
 * Initialize user properties from current context (viewport, preferences, etc.).
 */
export const initUserProperties = () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  setUserProperties({
    prefers_reduced_motion: String(prefersReducedMotion),
    device_type: isMobile ? 'mobile' : 'desktop',
    viewport_size: `${viewportWidth}x${viewportHeight}`,
  });

  // Listen for changes
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = (e: MediaQueryListEvent) => {
    setUserProperties({ prefers_reduced_motion: String(e.matches) });
  };
  motionQuery.addEventListener?.('change', handleMotionChange);

  return () => motionQuery.removeEventListener?.('change', handleMotionChange);
};
