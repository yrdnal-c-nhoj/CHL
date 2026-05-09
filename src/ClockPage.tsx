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
import styles from './ClockPage.module.css';
import { ClockItem, DataContextType } from './types/data'; // Import centralized interfaces
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
const useClockNavigation = (items: ClockItem[], date: string | undefined) => {
  const normalizedDate = useMemo(() => normalizeDate(date || ''), [date]);

  const currentItem = useMemo(() => {
    return items?.find((item) => normalizeDate(item.date) === normalizedDate) || null;
  }, [items, normalizedDate]);

  const navItems = useMemo(() => {
    if (!items?.length || !currentItem) return { prevItem: null, nextItem: null };
    const idx = items.findIndex((i) => normalizeDate(i.date) === normalizedDate);
    return {
      prevItem: idx > 0 ? items[idx - 1] : null,
      nextItem: idx < items.length - 1 ? items[idx + 1] : null
    };
  }, [items, currentItem, normalizedDate]);

  return { currentItem, ...navItems };
};

const ClockPage: React.FC = () => {
  const { date } = useParams();
  const context = useContext(DataContext) as DataContextType;
  const { items, loading, error: contextError } = context;
  const navigate = useNavigate();
  const headerVisible = useAutoHeader(HEADER_FADE_DELAY);
  const { currentItem, prevItem, nextItem } = useClockNavigation(items, date);
  const { ClockComponent, isReady, error: pageError, overlayVisible } = useClockPage(currentItem);

  // Validate date format and redirect if invalid
  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) {
      navigate('/', { replace: true });
    }
  }, [date, navigate]);

  // Apply/remove 'clock-mode' class to body based on clock readiness
  useEffect(() => {
    document.body.classList.toggle('clock-mode', isReady);
    return () => document.body.classList.remove('clock-mode');
  }, [isReady]);

  // Error state display
  if (pageError || contextError || (!loading && !currentItem && items.length > 0)) {
    return (
      <div
        className={styles.errorContainer}
      >
        <h1>Error</h1>
        <p>{pageError || contextError || 'Clock not found'}</p>
        <button
          onClick={() => navigate('/')}
          className={styles.errorButton}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isReady ? styles.loaded : ''}`}>
      {isReady && <div className={styles.headerWrapper} style={{ opacity: headerVisible ? 1 : 0, pointerEvents: headerVisible ? 'auto' : 'none' }}>
        <Header visible={headerVisible} />
      </div>}

      {isReady && ClockComponent && <div className={styles.clockWrapper}>
        <Suspense fallback={<ClockLoadingFallback />}>
          <ClockComponent />
        </Suspense>
      </div>}

      {isReady && ClockComponent && currentItem && (
        <ClockPageNav
          prevItem={prevItem}
          nextItem={nextItem}
          currentItem={currentItem}
          formatTitle={formatTitle}
          formatDate={formatDateDots}
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

export default ClockPage;
