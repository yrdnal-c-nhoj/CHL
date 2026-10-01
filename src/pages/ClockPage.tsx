import { Suspense, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ClockErrorBoundary from '@/components/ClockErrorBoundary';
import ClockPageNav from '@/components/ClockPageNav';
import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';
import styles from './ClockPage.module.css';

const asString = (v?: string | null) => v ?? '';

export default function ClockPage() {
  const { date } = useParams<{ date: string }>();
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

  // Click-anywhere-to-go-home stays as a mouse convenience; keyboard and
  // screen-reader users get the real link below.
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a,button,input,select,textarea')) {
      return;
    }
    navigate('/');
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.container} onClick={handleBackgroundClick}>
      <a href="/" className={styles.srOnly}>
        Return to home
      </a>

      {overlayVisible && <div className={styles.loadingOverlay}>Loading...</div>}

      {error ? (
     <div className={styles.errorBox} role="alert">
         Error: {error}
     </div>
      ) : ClockComponent ? (
        <ClockErrorBoundary key={date}>
          <Suspense fallback={<div className={styles.loadingOverlay}>Loading...</div>}>
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