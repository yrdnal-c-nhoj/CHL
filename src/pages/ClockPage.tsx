import React from 'react';
import { useParams } from 'react-router-dom';

import ClockPageNav from '@/components/ClockPageNav';
import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';

/**
 * Dynamic clock route page.

 *
 * Expects the route param:
 *   /:date  where date is typically YY-MM-DD
 *
 * Finds the matching ClockItem from DataContext and uses useClockPage
 * to dynamically import the corresponding clock module from:
 *   src/pages/<date>/Clock.tsx
 */
export default function ClockPage() {
  const { date } = useParams<{ date: string }>();

  const { items = [] } = useDataContext();






  const currentItem = React.useMemo(() => {
    if (!date) return null;
    return items.find((it) => it.date === date) ?? null;
  }, [date, items]);

  const { ClockComponent, isReady, error, overlayVisible } = useClockPage(
    currentItem,
  );

  const prevItem = React.useMemo(() => {
    if (!currentItem) return null;
    const idx = items.findIndex((it) => it.date === currentItem.date);
    if (idx <= 0) return null;
    return items[idx - 1] ?? null;
  }, [currentItem, items]);

  const nextItem = React.useMemo(() => {
    if (!currentItem) return null;
    const idx = items.findIndex((it) => it.date === currentItem.date);
    if (idx < 0) return null;
    return items[idx + 1] ?? null;
  }, [currentItem, items]);

  const formatTitle = React.useCallback((title?: string | null) => {
    return (title ?? '').toString();
  }, []);

  const formatDate = React.useCallback((d?: string | null) => {
    return (d ?? '').toString();
  }, []);


  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
      }}
    >
      {/* Loading overlay */}
      {overlayVisible && !isReady && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'monospace',
          }}
        >
          Loading...
        </div>
      )}

      {error ? (
        <div
          style={{
            padding: '2rem',
            fontFamily: 'monospace',
            color: '#fff',
            background: '#000',
          }}
        >
          Error: {error}
        </div>
      ) : ClockComponent ? (
        <ClockComponent />
      ) : null}

      {currentItem ? (
        <ClockPageNav
          prevItem={prevItem}
          nextItem={nextItem}
          currentItem={currentItem}
          formatTitle={formatTitle}
          formatDate={formatDate}
        />
      ) : null}

    </div>
  );
}

