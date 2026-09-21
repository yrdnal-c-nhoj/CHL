import { getLatestClockDate } from '@/clock/clockRegistry';
import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';
import React, { useMemo } from 'react';
import styles from './Today.module.css';

/**
 * Displays the most recently available clock component.
 *
 * The clock registry is authoritative: a clock is available only when its
 * Clock.tsx file exists. Metadata is used only to decorate that clock.
 */
const TodayPage = () => {
  const { items, loading: dataLoading, error: dataError } = useDataContext();

  const targetItem = useMemo(() => {
    if (dataLoading || dataError) {
      return null;
    }

    const now = new Date();
    const todayString = [
      String(now.getFullYear()).slice(-2),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    const latestDate = getLatestClockDate(todayString);

    if (!latestDate) {
      return null;
    }

    return items.find((item) => item.date === latestDate) ?? {
      path: `/${latestDate}`,
      date: latestDate,
      title: latestDate,
    };
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
