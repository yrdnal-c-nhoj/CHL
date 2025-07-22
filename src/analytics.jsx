// src/analytics.js
export const pageview = (url) => {
  window.gtag('config', 'G-497702120', {
    page_path: url,
  });
};
