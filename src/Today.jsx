import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import styles from './ClockPage.module.css';

// Preload all Clock.jsx files under /pages/**/Clock.jsx using Vite's glob import
const clockModules = import.meta.glob('./pages/**/Clock.jsx');

// Resolve the correct module key for a given item, supporting both:
// - New structure: ./pages/YY-MM/YY-MM-DD/Clock.jsx
// - Old structure: ./pages/YY-MM-DD/Clock.jsx (fallback)
const getClockModuleKey = (item) => {
  const date = item?.date || item?.path;
  if (!date) return null;

  const [yy, mm] = date.split('-');
  if (!yy || !mm) return null;

  const candidates = [
    `./pages/${yy}-${mm}/${item.path}/Clock.jsx`, // month/day structure
    `./pages/${item.path}/Clock.jsx`,             // legacy flat structure
  ];

  for (const key of candidates) {
    if (clockModules[key]) return key;
  }

  return null;
};

const formatTitle = (title) => title?.replace(/clock/i, '').trim() || 'Home';
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);
  return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31 ? `${mm}/${dd}/${yy}` : 'Invalid Date';
};
const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-');

const parseDateVal = (dateStr) => {
  if (!dateStr) return 0;
  const [yy, mm, dd] = dateStr.split('-').map(Number);
  return new Date(2000 + yy, mm - 1, dd).getTime();
};

const getTodayDate = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

/**
 * Custom hook for asset preloading (mirrors ClockPage.jsx logic)
 */
const useAssetPreloader = () => {
  const preloadAssets = useCallback(async (module) => {
    // Preload images exported from module
    const images = Object.values(module).filter(
      (value) =>
        typeof value === "string" &&
        /\.(jpg|jpeg|png|webp|gif|mp4|webm)$/i.test(value)
    );

    const imagePromises = images.map(
      (src) =>
        new Promise((resolve) => {
          if (/\.(mp4|webm)$/i.test(src)) {
            resolve();
          } else {
            const img = new Image();
            img.src = src;
            img.onload = img.onerror = resolve;
          }
        })
    );

    // Helper to avoid hanging forever on fonts.ready
    const fontPromise = (() => {
      try {
        if (typeof document !== "undefined" && 'fonts' in document) {
          return new Promise((resolve) => {
            document.fonts.ready
              .then(() => resolve())
              .catch(() => resolve());
            setTimeout(resolve, 2000);
          });
        }
      } catch {
        // ignore
      }
      return Promise.resolve();
    })();

    await Promise.all([
      ...imagePromises,
      fontPromise,
    ]);

    return true;
  }, []);

  return { preloadAssets };
};

const TodayClockPage = () => {
  const { items, loading, error } = useContext(DataContext);
  const { preloadAssets } = useAssetPreloader();

  // State management aligned with ClockPage.jsx for consistency
  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const OVERLAY_FADE_DURATION = 300;

  // -------------------------------
  // Load today's clock
  // -------------------------------
  useEffect(() => {
    const loadClock = async () => {
      if (loading) return;

      try {
        if (!items || items.length === 0) {
          throw new Error("No clock data is available.");
        }

        const today = getTodayDate();
        const todayVal = parseDateVal(today);

        // Sort items descending by date (newest first)
        const sortedItems = [...items].sort((a, b) => parseDateVal(b.date) - parseDateVal(a.date));

        // Find the first item that is today or past AND has a valid component file
        let item = sortedItems.find((i) => parseDateVal(i.date) <= todayVal && getClockModuleKey(i));

        // Fallback: If no past/today clock found, find the newest available valid clock anywhere
        if (!item) item = sortedItems.find((i) => getClockModuleKey(i));

        if (!item) throw new Error("No valid clock components found.");

        setCurrentItem(item);

        const key = getClockModuleKey(item);

        const mod = await clockModules[key]();
        
        // Preload assets to prevent FOUC/black screens on load
        await preloadAssets(mod);

        setClockComponent(() => mod.default);
        setIsReady(true);
      } catch (err) {
        setPageError(err.message || "Failed to load clock");
      } finally {
        setTimeout(() => setOverlayVisible(false), OVERLAY_FADE_DURATION);
      }
    };

    loadClock();
  }, [items, loading, preloadAssets]);

  // -------------------------------
  // Auto-hide header shortly after load
  // -------------------------------
  useEffect(() => {
    const headerTimer = setTimeout(() => setHeaderVisible(false), 1500);
    return () => clearTimeout(headerTimer);
  }, []);

  // -------------------------------
  // Prevent scrolling
  // -------------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // -------------------------------
  // Navigation
  // -------------------------------
  const currentIndex = useMemo(() => 
    currentItem ? items.findIndex((i) => normalizeDate(i.date) === normalizeDate(currentItem.date)) : -1,
    [currentItem, items]
  );
  const prevItem = useMemo(() => currentIndex > 0 ? items[currentIndex - 1] : null, [items, currentIndex]);
  const nextItem = useMemo(() => currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null, [items, currentIndex]);

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div
      className={`${styles.container} ${styles.loaded}`}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}
    >
      {isReady && <Header visible={headerVisible} />}
      
      <div className={styles.content} style={{ position: 'relative', zIndex: 10000, color: '#fff', textAlign: 'center', paddingTop: '40vh' }}>
        {loading && <div className={styles.loading}>Loading data...</div>}
        
        {error || pageError ? (
          <div className={styles.sheet}><div className={styles.error}>{error || pageError}</div></div>
        ) : isReady && ClockComponent ? (
          /* Reset positioning for the clock component */
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              zIndex: 1, /* Below the overlay logic if needed, but above background */
              backgroundColor: '#000'
            }}
          >
            <div style={{
              all: 'initial',
              fontFamily: 'CustomFont, system-ui, sans-serif',
              display: 'block',
              width: '100%',
              height: '100vh',
            }}
          >
            <ClockComponent />
            </div>
          </div>
        ) : (
          !loading && <div className={styles.loading}>Finding today's clock...</div>
        )}
      </div>

      {isReady && currentItem && (
        <ClockPageNav
          prevItem={prevItem}
          nextItem={nextItem}
          currentItem={currentItem}
          items={items}
          formatTitle={formatTitle}
          formatDate={formatDate}
        />
      )}

      {/* Loading overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: overlayVisible ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_DURATION}ms ease-out`,
        }}
      />
    </div>
  );
};

export default TodayClockPage;
