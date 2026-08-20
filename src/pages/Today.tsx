import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';
import React, { useMemo } from 'react';
import styles from './Today.module.css';

/**
 * A page that displays either the clock for the current date or,
 * if one for today doesn't exist, the most recently available clock.
 */
const TodayPage =  () => {
  const { items, loading: dataLoading, error: dataError } = useDataContext();

  const targetItem = useMemo(() => {
    if (dataLoading || dataError || !items.length) {
      return null;
    }

    // Get today's date in 'YY-MM-DD' format
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    // Find a clock for today's date
    const todayItem = items.find((item) => item.date === todayString);
    if (todayItem) {
      return todayItem;
    }

    // If no clock for today, fall back to the most recent one.
    // The DataContext already sorts items by date ascending, so the last one is the most recent.
    return items[items.length - 1] ?? null;
  }, [items, dataLoading, dataError]);

  const { ClockComponent, isReady, error: clockError, overlayVisible } = useClockPage(targetItem);

  const errorMessage = dataError?.message || clockError;

  return (
    <div className={styles.container}>
      {/* Loading overlay */}
      {overlayVisible && !isReady && (
        <div className={styles.loadingOverlay} />
      )}
      {errorMessage ? (
        <div className={styles.errorBox}>
          Error: {errorMessage}
        </div>
      ) : ClockComponent ? (
        <ClockComponent />
      ) : null}
    </div>
  );
};

export default TodayPage;