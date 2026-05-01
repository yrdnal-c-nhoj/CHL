import React, { useState, useEffect, useContext, useMemo } from 'react';
import { DataContext } from './context/DataContext';
import ClockLayout from './components/ClockLayout';
import { ClockItem, DataContextType } from './types/data';
import {
  normalizeDate,
  formatDateSlashes,
  parseDateVal,
  getTodayDate,
} from './utils/dateUtils';

const TodayClockPage = () => {
  const { items, loading, error } = useContext(DataContext) as DataContextType;
  const [currentItem, setCurrentItem] = useState<ClockItem | null>(null);

  // Resolve today's clock: most recent entry on or before today
  useEffect(() => {
    if (loading || items.length === 0) return;
    const todayVal = parseDateVal(getTodayDate());
    const sorted = [...items].sort(
      (a, b) => parseDateVal(b.date) - parseDateVal(a.date),
    );
    setCurrentItem(
      sorted.find((i) => parseDateVal(i.date) <= todayVal) ?? sorted[0] ?? null,
    );
  }, [items, loading]);

  // Prevent page scroll while clock is displayed
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const { prevItem, nextItem } = useMemo(() => {
    if (!currentItem || items.length === 0)
      return { prevItem: null, nextItem: null };
    const idx = items.findIndex(
      (i: ClockItem) =>
        normalizeDate(i.date) === normalizeDate(currentItem.date),
    );
    return {
      prevItem: idx > 0 ? (items[idx - 1] ?? null) : null,
      nextItem:
        idx >= 0 && idx < items.length - 1 ? (items[idx + 1] ?? null) : null,
    };
  }, [currentItem, items]);

  return (
    <ClockLayout
      currentItem={currentItem}
      prevItem={prevItem}
      nextItem={nextItem}
      loading={loading}
      error={error}
      formatDate={formatDateSlashes}
    />
  );
};

export default TodayClockPage;
