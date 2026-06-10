import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LAST_NON_CLOCK_KEY = 'lastNonClockRoute';
const CLOCK_DATE_REGEX = /^\/\d{2}-\d{2}-\d{2}$/;

/**
 * Tracks the last non-clock route visited ("Home", /list, /tags, etc.)
 * so ClockPage center-click can reliably return there.
 */
export const useTrackLastNonClockRoute = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // Ignore clock pages themselves.
    if (CLOCK_DATE_REGEX.test(path)) return;

    // Ignore index.html route.
    if (path === '/index.html') return;

    // Only persist the routes you care about; everything else falls back to home.
    const allowed = new Set(['/', '/list', '/tags']);
    if (!allowed.has(path)) return;

    try {
      window.sessionStorage.setItem(LAST_NON_CLOCK_KEY, path);
    } catch {
      // no-op
    }
  }, [location.pathname]);
};

