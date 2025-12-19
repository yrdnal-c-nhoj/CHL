// src/analytics.js
export const pageview = (url) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', 'G-24VJ4G2H48', {
      page_path: url,
    });
  }
};
