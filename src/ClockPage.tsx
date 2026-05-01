import React, { useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import ClockLayout from './components/ClockLayout';
import styles from './ClockPage.module.css';
import { ClockItem, DataContextType } from './types/data';
import { DATE_REGEX, normalizeDate, formatDateDots } from './utils/dateUtils';

const ClockPage: React.FC = () => {
  const { date } = useParams();
  const { items, loading, error: contextError } = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();

  const normalizedDate = useMemo(() => normalizeDate(date || ''), [date]);

  const currentItem = useMemo(
    () => items.find((item: ClockItem) => normalizeDate(item.date) === normalizedDate) ?? null,
    [items, normalizedDate],
  );

  const { prevItem, nextItem } = useMemo(() => {
    const idx = items.findIndex(
      (item: ClockItem) => normalizeDate(item.date) === normalizedDate,
    );
    return {
      prevItem: idx > 0 ? (items[idx - 1] ?? null) : null,
      nextItem: idx >= 0 && idx < items.length - 1 ? (items[idx + 1] ?? null) : null,
    };
  }, [items, normalizedDate]);

  // Redirect if date format is invalid
  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) {
      navigate('/', { replace: true });
    }
  }, [date, navigate]);

  // Show error page if clock not found after loading
  if (!loading && !currentItem && items.length > 0) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error</h1>
        <p>{contextError || 'Clock not found'}</p>
        <button onClick={() => navigate('/')} className={styles.errorButton}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <ClockLayout
      currentItem={currentItem}
      prevItem={prevItem}
      nextItem={nextItem}
      loading={loading}
      error={contextError}
      formatDate={formatDateDots}
      clockMode
    />
  );
};

export default ClockPage;
