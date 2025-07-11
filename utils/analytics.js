// src/utils/analytics.js
export const pageView = (url) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  }
};
