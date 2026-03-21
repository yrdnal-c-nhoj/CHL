import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  Suspense,
} from 'react';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import { ClockLoadingFallback } from './utils/fontLoader';
import styles from './ClockPage.module.css';

const clockModules = import.meta.glob('./pages/**/Clock.tsx');

const formatTitle = (title) => title?.replace(/clock/i, '').trim() || 'Home';
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);
  return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31
    ? `${mm}/${dd}/${yy}`
    : 'Invalid Date';
};
const normalizeDate = (d) =>
  d
    .split('-')
    .map((n) => n.padStart(2, '0'))
    .join('-');

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

const TodayClockPage = () => {
  const { items, loading, error } = useContext(DataContext);
  const [currentItem, setCurrentItem] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const OVERLAY_FADE_DURATION = 300;

  // -------------------------------
  // Load today's clock
  // -------------------------------
  useEffect(() => {
    if (loading || !items || items.length === 0) return;

    const today = getTodayDate();
    const todayVal = parseDateVal(today);

    // Sort items descending by date (newest first)
    const sortedItems = [...items].sort(
      (a, b) => parseDateVal(b.date) - parseDateVal(a.date),
    );

    // Find the first item that is today or past
    let item = sortedItems.find(
      (i) => parseDateVal(i.date) <= todayVal
    );

    // Fallback: If no past/today clock found, find the newest available valid clock anywhere
    if (!item) item = sortedItems[0];

    setCurrentItem(item);
  }, [items, loading]);

  const [ClockComponent, setClockComponent] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);

  // Helper to preload images from the module before rendering
  const preloadAssets = async (module) => {
    const promises = [];

    // 1. Preload Images
    const images = Object.values(module).filter(
      (value) =>
        typeof value === 'string' &&
        /\.(jpg|jpeg|png|webp|gif|mp4|webm)$/i.test(value),
    );

    promises.push(...images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = resolve;
        });
      }));

    // 2. Preload Fonts (if exported)
    if (module.fontConfigs && Array.isArray(module.fontConfigs)) {
      promises.push(...module.fontConfigs.map(async (config) => {
        try {
          if (!config.fontFamily || !config.fontUrl) return;
          const font = new FontFace(config.fontFamily, `url(${config.fontUrl})`, config.options);
          const loadedFont = await font.load();
          document.fonts.add(loadedFont);
        } catch (e) {
          console.warn('Font preload failed:', e);
        }
      }));
    }

    await Promise.all(promises);
  };

  useEffect(() => {
    const loadClock = async () => {
      if (!currentItem) return;
      
      try {
        const date = currentItem.date;
        const [yy, mm] = date.split('-');
        // Try standard structure first
        let moduleKey = `./pages/${yy}-${mm}/${date}/Clock.tsx`;
        
        // Fallback to searching if exact path not found
        if (!clockModules[moduleKey]) {
           moduleKey = Object.keys(clockModules).find(key => key.includes(`/${date}/Clock.tsx`));
        }

        if (!moduleKey || !clockModules[moduleKey]) {
          throw new Error('Clock module not found');
        }

        const module = await clockModules[moduleKey]();
        await preloadAssets(module);
        setClockComponent(() => module.default);
        setIsReady(true);
        setTimeout(() => setOverlayVisible(false), OVERLAY_FADE_DURATION);
      } catch (err) {
        console.error(err);
        setPageError('Failed to load clock.');
      }
    };
    loadClock();
  }, [currentItem]);

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
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // -------------------------------
  // Navigation
  // -------------------------------
  const currentIndex = useMemo(
    () =>
      currentItem
        ? items.findIndex(
            (i) => normalizeDate(i.date) === normalizeDate(currentItem.date),
          )
        : -1,
    [currentItem, items],
  );
  const prevItem = useMemo(
    () => (currentIndex > 0 ? items[currentIndex - 1] : null),
    [items, currentIndex],
  );
  const nextItem = useMemo(
    () =>
      currentIndex >= 0 && currentIndex < items.length - 1
        ? items[currentIndex + 1]
        : null,
    [items, currentIndex],
  );

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div
      className={`${styles.container} ${styles.loaded}`}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {isReady && <Header visible={headerVisible} />}

      <div
        className={styles.content}
        style={{
          position: 'relative',
          zIndex: 10000,
          color: '#fff',
          textAlign: 'center',
          paddingTop: '40vh',
        }}
      >
        {loading && <div className={styles.loading}>Loading data...</div>}

        {error || pageError ? (
          <div className={styles.sheet}>
            <div className={styles.error}>{error || pageError}</div>
          </div>
        ) : isReady && ClockComponent ? (
          /* Reset positioning for the clock component */
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              zIndex: 1 /* Below the overlay logic if needed, but above background */,
              backgroundColor: '#000',
            }}
          >
            <div
              style={{
                all: 'initial',
                fontFamily: 'CustomFont, system-ui, sans-serif',
                display: 'block',
                width: '100%',
                height: '100vh',
              }}
            >
              <Suspense fallback={<ClockLoadingFallback />}>
                <ClockComponent />
              </Suspense>
            </div>
          </div>
        ) : (
          !loading && (
            <div className={styles.loading}>Finding today's clock...</div>
          )
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
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: overlayVisible ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_DURATION}ms ease-out`,
        }}
      />
    </div>
  );
};

export default TodayClockPage;
