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

const ClockPage: React.FC = () => {
  const { date } = useParams();
  const { items, loading, error: contextError } = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();
  const headerVisible = useAutoHeader(HEADER_FADE_DELAY);

  // Memoized normalized date
  const normalizedDate = useMemo(
    () => normalizeDate(date || ''),
    [date, normalizeDate],
  );

  // Memoized current item lookup
  const currentItem = useMemo(() => {
    if (!items || items.length === 0) return null;
    return items.find(
      (item: ClockItem) => normalizeDate(item.date) === normalizedDate,
    );
  }, [items, normalizedDate, normalizeDate]);

  // Use the new hook for clock logic
  const {
    ClockComponent,
    isReady,
    error: pageError,
    overlayVisible,
  } = useClockPage(currentItem);

  // Validate date format and redirect if invalid
  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) {
      navigate('/', { replace: true });
    }
  }, [date, navigate]);

  // Memoized navigation items
  const navigationItems = useMemo(() => {
    if (!items || items.length === 0) {
      return { currentIndex: -1, prevItem: null, nextItem: null };
    }

    const currentIndex = items.findIndex(
      (item: ClockItem) => normalizeDate(item.date) === normalizedDate,
    );

    return {
      currentIndex,
      prevItem: currentIndex > 0 ? items[currentIndex - 1] : null,
      nextItem:
        currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
    };
  }, [items, normalizedDate, normalizeDate]);

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
      {/* Header with fade animation */}
      {isReady && (
        <div
          className={styles.headerWrapper}
          style={{
            opacity: headerVisible ? 1 : 0,
            pointerEvents: headerVisible ? 'auto' : 'none',
          }}
        >
          <Header visible={headerVisible} />
        </div>
      )}

      {/* Clock component without animation */}
      {isReady && ClockComponent && (
        <div className={styles.clockWrapper}>
          <Suspense fallback={<ClockLoadingFallback />}>
            <ClockComponent />
          </Suspense>
        </div>
      )}

      {/* Navigation component */}
      {isReady && ClockComponent && currentItem && (
        <ClockPageNav
          prevItem={navigationItems.prevItem}
          nextItem={navigationItems.nextItem}
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
          transition: `opacity ${OVERLAY_FADE_DURATION}ms ease-out`,
        }}
      />
    </div>
  );
};

export default ClockPage;
