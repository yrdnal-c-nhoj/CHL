import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ClockPageNav from '@/components/ClockPageNav';
import { useDataContext } from '@/context/DataContext';
import { useClockPage } from '@/hooks/useClockPage';
import styles from './ClockPage.module.css';

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
  const navigate = useNavigate();

  const { items = [] } = useDataContext();

  const currentItem = React.useMemo(() => {
    if (!date) return null;
    return items.find((it) => it.date === date) ?? null;
  }, [date, items]);

  const { ClockComponent, isReady, error, overlayVisible } =
    useClockPage(currentItem);

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

  const handleContainerClick = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Keyboard accessibility: allow Enter/Space to trigger the same
  // navigation as a click (WCAG 2.1 — clickable elements must be
  // operable by keyboard). See ARCHITECTURE.md §11.
  const handleContainerKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate('/');
      }
    },
    [navigate],
  );

  return (
    <div
      onClick={handleContainerClick}
      onKeyDown={handleContainerKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Return to home"
      className={styles.container}
    >
      {/* Loading overlay */}
      {overlayVisible && !isReady && (
        <div className={styles.loadingOverlay}>
          Loading...
        </div>
      )}

      {error ? (
        <div className={styles.errorBox}>
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
