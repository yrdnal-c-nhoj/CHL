// INDIVIDUAL CLOX

import React, { Suspense, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClockPageNav from '../components/ClockPageNav';

const LAST_NON_CLOCK_KEY = 'lastNonClockRoute';

import { DataContext } from '../context/DataContext';
import { useAutoHeader } from '../hooks/useAutoHeader';
import { useClockPage } from '../hooks/useClockPage';
import { useTrackLastNonClockRoute } from '../hooks/useTrackLastNonClockRoute';

import styles from '../styles/ClockPage.module.css';
import type { ClockItem, DataContextType } from '../types/data';
import { ClockLoadingFallback } from '../utils/fontLoader';

import {
  DATE_REGEX,
  formatDateDots,
  formatTitle,
  normalizeDate,
} from '../utils/dateUtils';

// Configuration constants
const HEADER_FADE_DELAY = 0;
const OVERLAY_FADE_DURATION = 300; // 0.3 seconds for a smoother fade

/**
 * Custom hook to encapsulate navigation and item discovery logic.
 * This helps keep the main component under the 50-line BTS limit.
 */
const useClockNavigation = (items: ClockItem[] = [], date = '') => {
  const normalizedDate = useMemo(() => normalizeDate(date || ''), [date]);

  return useMemo(() => {
    const idx = items.findIndex(
      (i) => i?.date && normalizeDate(i.date) === normalizedDate,
    );
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
const ErrorDisplay: React.FC<{ message: string; onBack: () => void }> = ({
  message,
  onBack,
}) => (
  <div 
    className={styles.errorContainer}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      backgroundColor: '#fdfdfd',
      color: '#000',
      padding: '2rem',
      textAlign: 'center',
    }}
  >
    <h1 style={{ color: '#ff4444' }}>Error</h1>
    <p style={{ margin: '1rem 0', maxWidth: '600px', fontFamily: 'monospace' }}>{message}</p>
    <button 
      onClick={onBack} 
      className={styles.errorButton}
      style={{ 
        padding: '0.5rem 1rem', 
        cursor: 'pointer',
        marginTop: '1rem',
      }}
    >
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
  useTrackLastNonClockRoute();


  const { date } = useParams();
  const {
    items,
    loading,
    error: contextError,
  } = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();
  const headerVisible = useAutoHeader(HEADER_FADE_DELAY);
  const { currentItem, prevItem, nextItem } = useClockNavigation(items, date);
  const {
    ClockComponent,
    isReady,
    error: pageError,
    overlayVisible,
  } = useClockPage(currentItem ?? null);

  const handleHeaderClick = () => {
    // When user clicks the center (header overlay area), return to the last
    // "non-clock" page the user visited: Home, /list, or /tags.
    // Fallback to / when there is no usable history.
    const lastNonClock = window.sessionStorage.getItem(LAST_NON_CLOCK_KEY);
    if (lastNonClock) {
      navigate(lastNonClock, { replace: false });
      return;
    }
    navigate('/', { replace: false });
  };

  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) {
      navigate('/', { replace: true });
    }
  }, [date, navigate]);

  if (
    pageError ||
    contextError ||
    (!loading && !currentItem && items.length > 0)
  ) {
    return (
      <ErrorDisplay
        message={pageError || contextError || 'Clock not found'}
        onBack={() => navigate('/')}
      />
    );
  }

  // If we have an error but the above check didn't catch it for some reason, 
  // or if context isn't ready, show error instead of a white screen.
  if (pageError) {
    return <ErrorDisplay message={pageError} onBack={() => navigate('/')} />;
  }

  return (
    <div className={`${styles.container} ${isReady ? styles.loaded : ''}`}>
      {isReady ? (
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
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {ClockComponent && (
            <div 
              className={styles.clockWrapper}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                // matches Header.module.css font sizes (safe default)
                ['--header-h' as any]: headerVisible ? '4.5rem' : '0px',
              }}
            >
              <Suspense fallback={<ClockLoadingFallback />}>
                <ClockComponent />
              </Suspense>
            </div>
          )}
        </div>
      ) : (
        <div style={{ height: '100dvh', width: '100vw', backgroundColor: '#f8f8f8' }} />
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