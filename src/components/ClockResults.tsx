import React, { useMemo, useState, type FC, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import listStyles from '../styles/ClockList.module.css';
import sortStyles from '../styles/SortControls.module.css';
import type { ClockItem } from '../types/data';
import { sortTags } from '../utils/tagUtils';
import Thumbnail from './Thumbnail';

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

type SortKey = 'date' | 'title';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const FormattedDate: FC<{ date: string }> = ({ date }) => {
  const [yy, mm, dd] = date.split('-');
  const monthName =
    // Defensive check for valid month format
    mm && /^\d{2}$/.test(mm)
      ? MONTHS[parseInt(mm, 10) - 1] || '???'
      : '???';
  const day = dd ? dd.padStart(2, '0') : '--';

  return (
    <time className={listStyles.simpleListDate} dateTime={`20${date}`}>
      <span>{day}</span>
      <span>{monthName}</span>
      <span>'{yy}</span>
    </time>
  );
};
const MemoizedFormattedDate = React.memo(FormattedDate);
MemoizedFormattedDate.displayName = 'FormattedDate';

interface ClockResultsProps {
  items: ClockItem[];
  loading: boolean;
  error: Error | null;
}

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (key: SortKey) => void;
}

const SortControls: FC<SortControlsProps> = React.memo(({ sortBy, onSortChange }) => (
  <div className={sortStyles.sortContainer}>
    <button
      type="button"
      onClick={() => onSortChange('date')}
      className={`${sortStyles.sortButton} ${sortBy.startsWith('date') ? sortStyles.active : ''}`}
      style={{ textTransform: 'uppercase' }}
      aria-label={`Sort by date, current direction: ${sortBy === 'date-desc' ? 'descending' : 'ascending'}`}
    >
      date
      {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
    </button>
    <button
      type="button"
      style={{ textTransform: 'uppercase' }}
      onClick={() => onSortChange('title')}
      className={`${sortStyles.sortButton} ${sortBy.startsWith('title') ? sortStyles.active : ''}`}
      aria-label={`Sort by title, current direction: ${sortBy === 'title-asc' ? 'ascending' : 'descending'}`}
    >
      title
      {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
    </button>
  </div>
));
SortControls.displayName = 'SortControls';

const ClockResults: FC<ClockResultsProps> = ({ items, loading, error }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const sortedItems = useMemo<ClockItem[]>(() => {
    const filtered = items.filter((item) => item?.date);
    const [key, direction] = sortBy.split('-') as [SortKey, 'asc' | 'desc'];

    return [...filtered].sort((a, b) => {
      const valA = key === 'title' ? a.title || '' : a.date;
      const valB = key === 'title' ? b.title || '' : b.date;
      const comparison = valA.localeCompare(valB);
      return direction === 'asc' ? comparison : -comparison;
    });
  }, [items, sortBy]);

  const handleSortChange = (key: SortKey) => {
    setSortBy((prev) => {
      const currentKey = prev.split('-')[0];
      const newDirection = prev.endsWith('asc') || currentKey !== key ? 'desc' : 'asc';
      return `${key}-${newDirection}`;
    });
  };

  const handleRowClick = (date: string) => navigate(`/${date}`);

  if (loading) {
    return <div className={listStyles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={listStyles.errorContainer}>Error: {error instanceof Error ? error.message : String(error)}</div>;
  }

  return (
    <div className={listStyles.centeredContent}>
      <SortControls sortBy={sortBy} onSortChange={handleSortChange} />

      <ul className={listStyles.simpleListContainer}>
        {sortedItems.map((item) => (
          <li key={item.date} className={listStyles.simpleListItem} onClick={() => handleRowClick(item.date)}>
            <div className={listStyles.simpleListRow}>
              <MemoizedFormattedDate date={item.date} />
              <div className={listStyles.thumbnailWrapper}>
                <Thumbnail date={item.date} title={item.title || ''} />
              </div>
              <div className={listStyles.contentStack}>
                <span className={listStyles.simpleListTitle}>{item.title || 'No Title'}</span>
                <div className="tag-wrapper">
                  {sortTags(item.tags || []).map((tag) => (
                    <Link
                      key={tag}
                      to={`/tag/${tag}`}
                      className="tag-bubble"
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              <span className={listStyles.simpleListNumber}>#{item.clockNumber}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClockResults;