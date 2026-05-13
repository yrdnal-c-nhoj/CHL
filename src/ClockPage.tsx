import React, {
  useEffect,
  useContext,
  useMemo,
  Suspense,
  useState,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import { ClockLoadingFallback } from './utils/fontLoader';
import { useClockPage } from './hooks/useClockPage';
import styles from './styles/ClockPage.module.css';
import sortStyles from './styles/SortButtons.module.css';
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
    if (currentItem?.date) {
      const monthKey = getMonthFromDate(currentItem.date);
      // Navigate to home with month expanded
      navigate(`/?month=${monthKey}`);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) {
      navigate('/', { replace: true });
    }
  }, [date, navigate]);

  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'number-asc' | 'number-desc'>('date-desc');

  const sortedItems = useMemo(() => {
    const result = [...items].filter((item) => item?.date);

    switch (sortBy) {
      case 'date-desc':
        return result.sort((a, b) => b.date.localeCompare(a.date));
      case 'date-asc':
        return result.sort((a, b) => a.date.localeCompare(b.date));
      case 'title-asc':
        return result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title-desc':
        return result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      case 'number-asc':
        return result.sort((a, b) => Number(a.clockNumber || 0) - Number(b.clockNumber || 0));
      case 'number-desc':
        return result.sort((a, b) => Number(b.clockNumber || 0) - Number(a.clockNumber || 0));
      default:
        return result;
    }
  }, [items, sortBy]);

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
          style={{
            cursor: 'pointer',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <header
            style={{
              textAlign: 'center',
              margin: '1rem 0',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            <div className={sortStyles.sortButtonContainer}>
              <button
                onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
                className={`${sortStyles.sortButton} ${sortBy.startsWith('date') ? sortStyles.active : ''}`}
              >
                sort by date{' '}
                {sortBy.startsWith('date')
                  ? sortBy === 'date-desc'
                    ? '↓'
                    : '↑'
                  : ''}
              </button>
              <button
                onClick={() => setSortBy(sortBy === 'title-asc' ? 'title-desc' : 'title-asc')}
                className={`${sortStyles.sortButton} ${sortBy.startsWith('title') ? sortStyles.active : ''}`}
              >
                sort by title{' '}
                {sortBy.startsWith('title')
                  ? sortBy === 'title-asc'
                    ? '↓'
                    : '↑'
                  : ''}
              </button>
              <button
                onClick={() => setSortBy(sortBy === 'number-desc' ? 'number-asc' : 'number-desc')}
                className={`${sortStyles.sortButton} ${sortBy.startsWith('number') ? sortStyles.active : ''}`}
              >
                sort by number{' '}
                {sortBy.startsWith('number')
                  ? sortBy === 'number-desc'
                    ? '↓'
                    : '↑'
                  : ''}
              </button>
            </div>
          </header>
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleHeaderClick();
            }
          }}
          aria-label="Go back to month"
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
currentItem={currentItem!}
          formatTitle={formatTitle}
          formatDate={formatDateDots}
        />
      )}

      <LoadingOverlay visible={overlayVisible} />
    </div>
  );
};

export default ClockPage;
