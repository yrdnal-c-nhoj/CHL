import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';
import React, { useMemo } from 'react';
import styles from './Today.module.css';

/**
 * Displays the most recently published clock.
 *
 * The clock index is sorted chronologically by DataContext. Only clocks
 * dated today or earlier are eligible, so future-dated index entries cannot
 * become the /today clock before their date.
 */
const TodayPage = () => {
  const { items, loading: dataLoading, error: dataError } = useDataContext();

  const targetItem = useMemo(() => {
    if (dataLoading || dataError || !items.length) {
      return null;
    }

    const now = new Date();
    const todayString = [
      String(now.getFullYear()).slice(-2),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    // DataContext sorts items ascending by date. Select the newest clock
    // that has been published for today or an earlier date.
    return (
      [...items]
        .reverse()
        .find((item) => item.date <= todayString) ?? null
    );
  }, [items, dataLoading, dataError]);

  const {
    ClockComponent,
    isReady,
    error: clockError,
    overlayVisible,
  } = useClockPage(targetItem);

  const errorMessage = dataError?.message || clockError;

  return (
    <div className={styles.container}>
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
