import React, {
  useEffect,
  useContext,
  useMemo,
  Suspense,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import { ClockLoadingFallback } from './utils/fontLoader';
import { useClockPage } from './hooks/useClockPage';
import styles from './styles/ClockPage.module.css';
import type { ClockItem, DataContextType } from './types/data';
import { useAutoHeader } from './hooks/useAutoHeader';

import {
  DATE_REGEX,
  normalizeDate,
  formatTitle,
  formatDateDots,
} from './utils/dateUtils';

// Configuration constants
const HEADER_FADE_DELAY = 1500; // 1.5 seconds
const OVERLAY_FADE_DURATION = 300; // 0.3 seconds for a smoother fade

/**
 * Custom hook to encapsulate navigation and item discovery logic.
 * This helps keep the main component under the 50-line BTS limit.
 */
const useClockNavigation = (items: ClockItem[] = [], date = '') => {
  const normalizedDate = useMemo(() => normalizeDate(date || ''), [date]);

  return useMemo(() => {
const idx = items.findIndex((i) => i?.date && normalizeDate(i.date) === normalizedDate);
    const currentItem = idx !== -1 ? items[idx] : null;
    return {
      currentItem,
      prevItem: idx > 0 ? items[idx - 1] : null,
      nextItem: idx < items.length - 1 ? items[idx + 1] : null,
    };
  }, [items, normalizedDate]);
};

/**
 * Extract month key from date string (YY-MM-DD -> YY-MM)
 */
const getMonthFromDate = (date: string): string => {
  const parts = date.split('-');
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : '';
};

/**
 * Sub-component for Error UI to keep main component within line limits.
 */
const ErrorDisplay: React.FC<{ message: string; onBack: () => void }> = ({ message, onBack }) => (
  <div className={styles.errorContainer}>
    <h1>Error</h1>
    <p>{message}</p>
    <button onClick={onBack} className={styles.errorButton}>
      Back to Home
    </button>
  </div>
);

const LoadingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    className={styles.loadingOverlay}
    style={{
      opacity: visible ? 1 : 0,
      transition: `opacity ${OVERLAY_FADE_DURATION}ms ease-out`,
      pointerEvents: 'none',
    }}
  />
);

const ClockPage: React.FC = () => {
  const { date } = useParams();
  const { items, loading, error: contextError } = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();
  const headerVisible = useAutoHeader(HEADER_FADE_DELAY);
  const { currentItem, prevItem, nextItem } = useClockNavigation(items, date);
const { ClockComponent, isReady, error: pageError, overlayVisible } = useClockPage(currentItem ?? null);

  const handleHeaderClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) {
      navigate('/', { replace: true });
    }
  }, [date, navigate]);

  if (pageError || contextError || (!loading && !currentItem && items.length > 0)) {
    return (
      <ErrorDisplay
        message={pageError || contextError || 'Clock not found'}
        onBack={() => navigate('/')}
      />
    );
  }


  return (
    <div className={`${styles.container} ${isReady ? styles.loaded : ''}`}>
      {isReady && (
        <div
          onClick={handleHeaderClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleHeaderClick();
            }
          }}
              aria-label="Go back"
          style={{
            cursor: 'pointer',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            className={styles.headerWrapper}
            style={{
              opacity: headerVisible ? 1 : 0,
              pointerEvents: headerVisible ? 'auto' : 'none',
            }}
          >
            <Header visible={headerVisible} />
          </div>

          {ClockComponent && (
            <div className={styles.clockWrapper}>
              <Suspense fallback={<ClockLoadingFallback />}>
                <ClockComponent />
              </Suspense>
            </div>
          )}
        </div>
      )}

      {isReady && ClockComponent && currentItem && (
        <ClockPageNav
          prevItem={prevItem ?? null}
          nextItem={nextItem ?? null}
          currentItem={currentItem}
          formatTitle={formatTitle}
          formatDate={formatDateDots}
        />
      )}

      <LoadingOverlay visible={overlayVisible} />
    </div>
  );
};

export default ClockPage;
