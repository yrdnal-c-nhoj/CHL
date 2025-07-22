// src/analytics.js
export const pageview = (url) => {
  window.gtag('config', 'G-XXXXXXXXXX', {
    page_path: url,
  });
};
