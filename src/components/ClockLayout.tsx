import React, { useEffect, Suspense } from 'react';
import Header from './Header';
import ClockPageNav from './ClockPageNav';
import { ClockLoadingFallback } from '../utils/fontLoader';
import { useClockPage } from '../hooks/useClockPage';
import { useAutoHeader } from '../hooks/useAutoHeader';
import styles from '../ClockPage.module.css';
import type { ClockItem } from '../types/data';
import { formatTitle } from '../utils/dateUtils';

const HEADER_FADE_DELAY = 1500;
const OVERLAY_FADE_DURATION = 300;

interface ClockLayoutProps {
  currentItem: ClockItem | null;
  prevItem: ClockItem | null;
  nextItem: ClockItem | null;
  loading?: boolean;
  error?: string | null;
  formatDate: (date: string | null | undefined) => string;
  /** If true, adds/removes the 'clock-mode' body class when the clock becomes ready. */
  clockMode?: boolean;
}

const ClockLayout: React.FC<ClockLayoutProps> = ({
  currentItem,
  prevItem,
  nextItem,
  loading = false,
  error: externalError = null,
  formatDate,
  clockMode = false,
}) => {
  const {
    ClockComponent,
    isReady,
    error: clockError,
    overlayVisible,
  } = useClockPage(currentItem);

  const headerVisible = useAutoHeader(HEADER_FADE_DELAY);
  const error = externalError ?? clockError;

  // Optionally manage 'clock-mode' body class based on readiness
  useEffect(() => {
    if (!clockMode) return;
    if (isReady) {
      document.body.classList.add('clock-mode');
    } else {
      document.body.classList.remove('clock-mode');
    }
    return () => {
      document.body.classList.remove('clock-mode');
    };
  }, [isReady, clockMode]);

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

      {/* Clock component */}
      {isReady && ClockComponent && !error && (
        <div className={styles.clockWrapper}>
          <Suspense fallback={<ClockLoadingFallback />}>
            <ClockComponent />
          </Suspense>
        </div>
      )}

      {/* Loading indicator */}
      {loading && !isReady && (
        <div className={styles.loading}>Loading...</div>
      )}

      {/* Navigation */}
      {isReady && ClockComponent && currentItem && (
        <ClockPageNav
          prevItem={prevItem}
          nextItem={nextItem}
          currentItem={currentItem}
          formatTitle={formatTitle}
          formatDate={formatDate}
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

export default ClockLayout;
