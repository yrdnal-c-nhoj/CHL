import {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import ClockPageNav from './components/ClockPageNav';
import Header from './components/Header';
import { DataContext } from './context/DataContext';
import { useAutoHeader } from './hooks/useAutoHeader';
import { useClockPage } from './hooks/useClockPage';
import styles from './styles/ClockPage.module.css';
import type { ClockItem, DataContextType } from './types/data';
import {
  formatDateSlashes,
  formatTitle,
  getTodayDate,
  normalizeDate,
  parseDateVal,
} from './utils/dateUtils';
import { ClockLoadingFallback } from './utils/fontLoader';

const TodayClockPage = () => {
  const { items, loading, error } = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState<ClockItem | null>(null);
  const headerVisible = useAutoHeader(0);
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

    setCurrentItem(item ?? null);
  }, [items, loading]);

  const handleGoHome = () => {
    navigate('/');
  };

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
  const { prevItem, nextItem } = useMemo(() => {
    const idx =
      currentItem && items
        ? items.findIndex(
            (i) => normalizeDate(i.date) === normalizeDate(currentItem.date),
          )
        : -1;
    return {
      prevItem: idx > 0 ? (items[idx - 1] ?? null) : null,
      nextItem:
        idx !== -1 && idx < items.length - 1 ? (items[idx + 1] ?? null) : null,
    };
  }, [items, currentItem]);

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div
      className={`${styles.container} ${styles.loaded}`}
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      {isReady && <Header visible={headerVisible} />}

      <div
        className={styles.content}
        style={{
          position: 'relative',
          zIndex: 10000,
          color: '#000',
          textAlign: 'center',
          paddingTop: '40dvh',
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
            onClick={handleGoHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleGoHome();
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100dvh',
              zIndex: 1,
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                all: 'initial',
                fontFamily: 'CustomFont, system-ui, sans-serif',
                display: 'block',
                width: '100%',
                height: '100dvh',
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
          formatTitle={formatTitle}
          formatDate={formatDateSlashes}
        />
      )}

      {/* Loading overlay */}
      <div
        className={styles.loadingOverlay}
        style={{
          opacity: overlayVisible ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_DURATION}ms ease-out`,
        }}
      />
    </div>
  );
};

export default TodayClockPage;
