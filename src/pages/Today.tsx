import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';
import React, { useMemo } from 'react';

/**
 * A page that displays either the clock for the current date or,
 * if one for today doesn't exist, the most recently available clock.
 */
const TodayPage: React.FC = () => {
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
    <div style={{ width: '100%', height: '100dvh', background: '#000' }}>
      {/* Loading overlay */}
      {overlayVisible && !isReady && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999 }} />
      )}
      {errorMessage ? (
        <div style={{ padding: '2rem', fontFamily: 'monospace', color: '#fff' }}>
          Error: {errorMessage}
        </div>
      ) : ClockComponent ? (
        <ClockComponent />
      ) : null}
    </div>
  );
};

export default TodayPage;