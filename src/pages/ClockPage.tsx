import { Suspense, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ClockErrorBoundary from '@/components/ClockErrorBoundary';
import ClockPageNav from '@/components/ClockPageNav';
import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { getRandomClockDate } from '@/utils/randomClock';
import styles from '@/styles/ClockPage.module.css';

const asString = (v?: string | null) => v ?? '';

export default function ClockPage() {
  const { date } = useParams<{ date: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useDataContext();

  const { ClockComponent, error, overlayVisible } = useClockPage(date);

  const { currentItem, prevItem, nextItem } = useMemo(() => {
    const idx = items.findIndex((it) => it.date === date);
    return {
      currentItem: idx >= 0 ? (items[idx] ?? null) : null,
      prevItem: idx > 0 ? (items[idx - 1] ?? null) : null,
      nextItem: idx >= 0 ? (items[idx + 1] ?? null) : null,
    };
  }, [date, items]);

  // Swipe left/right navigates the clock sequence. We use `replace` so the
  // exploratory swipe trail does not flood the browser history; the back
  // button still returns to the real previous page (home, list, etc.).
  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      // swipe left -> advance to the next (later) clock;
      // swipe right -> return to the previous (earlier) clock.
      const target = direction === 'left' ? nextItem : prevItem;
      navigate(target ? `/${target.date}` : '/', { replace: true });
    },
    [nextItem, prevItem, navigate],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const swipeConsumedRef = useSwipeNavigation(containerRef, {
    onSwipe: handleSwipe,
    exclude: '[data-nav]',
  });

  // Click-anywhere-to-go-home stays as a mouse convenience; keyboard and
  // screen-reader users get the real link below.
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // A swipe was just performed: the trailing click that a touchend
    // synthesises must NOT also navigate home.
    if (swipeConsumedRef.current) {
      swipeConsumedRef.current = false;
      return;
    }

    if ((e.target as HTMLElement).closest('a,button,input,select,textarea')) {
      return;
    }

    if (
      location.state !== null &&
      typeof location.state === 'object' &&
      'randomMode' in location.state &&
      location.state.randomMode === true
    ) {
      const randomDate = getRandomClockDate(items, date);
      if (randomDate) {
        navigate(`/${randomDate}`, { state: { randomMode: true } });
        return;
      }
    }

    navigate('/');
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={containerRef}
      className={styles.container}
      onClick={handleBackgroundClick}
    >
      <a href="/" className={styles.srOnly}>
        Return to home
      </a>

      {overlayVisible && (
        <div className={styles.loadingOverlay}>Loading...</div>
      )}

      {error ? (
        <div className={styles.errorBox} role="alert">
          Error: {error}
        </div>
      ) : ClockComponent ? (
        <ClockErrorBoundary key={date}>
          <Suspense
            fallback={<div className={styles.loadingOverlay}>Loading...</div>}
          >
            <ClockComponent />
          </Suspense>
        </ClockErrorBoundary>
      ) : null}

      {currentItem && (
        <ClockPageNav
          prevItem={prevItem}
          nextItem={nextItem}
          currentItem={currentItem}
          formatTitle={asString}
          formatDate={asString}
        />
      )}
    </div>
  );
}
