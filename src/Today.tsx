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
import { useClockPage } from './hooks/useClockPage';
import { ClockLoadingFallback } from './utils/fontLoader';
import { useAutoHeader } from './hooks/useAutoHeader';
import styles from './ClockPage.module.css';
import { ClockItem, DataContextType } from './types/data';
import {
  normalizeDate,
  formatTitle,
  formatDateSlashes,
  parseDateVal,
  getTodayDate,
} from './utils/dateUtils';

const TodayClockPage = () => {
  const { items, loading, error } = useContext(DataContext) as DataContextType;
  const [currentItem, setCurrentItem] = useState<ClockItem | null>(null);
  const headerVisible = useAutoHeader(1500);
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
    let item = sortedItems.find((i) => parseDateVal(i.date) <= todayVal);

    // Fallback: If no past/today clock found, find the newest available valid clock anywhere
    if (!item) item = sortedItems[0];

    setCurrentItem(item);
  }, [items, loading]);

  // Use the hook to load the clock
  const {
    ClockComponent,
    isReady,
    error: pageError,
    overlayVisible,
  } = useClockPage(currentItem);

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
      currentItem && items
        ? items.findIndex(
            (i: ClockItem) =>
              normalizeDate(i.date) === normalizeDate(currentItem.date),
          )
        : -1,
    [currentItem, items],
  );
  const prevItem = useMemo<ClockItem | null>(
    () => (items && currentIndex > 0 ? items[currentIndex - 1] : null),
    [items, currentIndex],
  );
  const nextItem = useMemo<ClockItem | null>(
    () =>
      items && currentIndex >= 0 && currentIndex < items.length - 1
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
          formatDate={formatDateSlashes}
        />
      )}

      {/* Loading overlay */}
      <div 
        className={styles.loadingOverlay}
        style={{ 
          opacity: overlayVisible ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_DURATION}ms ease-out`
        }} 
      />
    </div>
  );
};

export default TodayClockPage;
