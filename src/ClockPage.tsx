import React, { useEffect, useContext, useMemo, Suspense, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import { ClockLoadingFallback } from './utils/fontLoader';
import { useClockPage } from './hooks/useClockPage';
import styles from './ClockPage.module.css';

// Configuration constants
const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;
const HEADER_FADE_DELAY = 1500; // 1.5 seconds
const OVERLAY_FADE_DURATION = 300; // 0.3 seconds for a smoother fade

const ClockPage: React.FC = () => {
  const { date } = useParams();
  const { items, loading } = useContext(DataContext) as any;
  const navigate = useNavigate();
  const [headerOpacity, setHeaderOpacity] = useState(1);

  // Normalize date helper
  const normalizeDate = useCallback(
    (d: string) =>
      d
        .split('-')
        .map((n) => n.padStart(2, '0'))
        .join('-'),
    [],
  );

  // Memoized normalized date
  const normalizedDate = useMemo(
    () => normalizeDate(date || ''),
    [date, normalizeDate],
  );

  // Memoized current item lookup
  const currentItem = useMemo(() => {
    if (!items || items.length === 0) return null;
    return items.find((item: any) => normalizeDate(item.date) === normalizedDate);
  }, [items, normalizedDate, normalizeDate]);

  // Use the new hook for clock logic
  const { ClockComponent, isReady, error: pageError, overlayVisible } = useClockPage(currentItem);

  // Header fade-out animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderOpacity(0);
    }, HEADER_FADE_DELAY);

    return () => clearTimeout(timer);
  }, []);

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

    const currentIndex = items.findIndex((item: any) => 
      normalizeDate(item.date) === normalizedDate
    );

    return {
      currentIndex,
      prevItem: currentIndex > 0 ? items[currentIndex - 1] : null,
      nextItem:
        currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
    };
  }, [items, normalizedDate, normalizeDate]);

  // Memoized title and date formatting functions
  const formatTitle = useCallback(
    (title: string) => title?.replace(/clock/i, '').trim() || 'Home',
    [],
  );

  const formatDate = useCallback(
    (dateString: string) => dateString.replace(/-/g, '.'),
    [],
  );

  // Error state display
  if (pageError || (!loading && !currentItem && items.length > 0)) {
    return (
      <div
        className={styles.container}
        style={{
          width: '100vw',
          height: '100dvh',
          overflow: 'hidden',
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          color: '#fff',
          fontFamily: 'monospace',
        }}
      >
        <h1>Error</h1>
        <p>{pageError || 'Clock not found'}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${isReady ? styles.loaded : ''}`}
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {/* Header with fade animation */}
      {isReady && (
        <div
          style={{
            opacity: headerOpacity,
            transition: 'opacity 0.5s ease-out',
            pointerEvents: headerOpacity > 0 ? 'auto' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <Header visible={headerOpacity > 0} />
        </div>
      )}

      {/* Clock component without animation */}
      {isReady && ClockComponent && (
        <div
          style={{
            width: '100%',
            height: '100dvh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 1, // Remove animation, start fully visible
          }}
        >
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
          formatDate={formatDate}
        />
      )}

      {/* Loading overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#000',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: overlayVisible ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_DURATION}ms ease-out`,
        }}
      />

      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ClockPage;
