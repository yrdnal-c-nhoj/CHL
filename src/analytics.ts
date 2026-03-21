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
    navigator?.doNotTrack || (window as any)?.doNotTrack || (navigator as any)?.msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
};

let gaScriptLoading = false;
let gaInitialized = false;

const shouldTrack = (): boolean => Boolean(GA_ID) && isProdEnv() && !dntEnabled();

const loadGaScript = () => {
  if (gaScriptLoading || gaInitialized) return;
  gaScriptLoading = true;

  // Bootstrap dataLayer / gtag stub early
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: any[]) {
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
