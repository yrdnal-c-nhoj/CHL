import React, { useMemo, useState, type FC, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Thumbnail from '../components/Thumbnail';
import listStyles from '../styles/ClockList.module.css';
import sortStyles from '../styles/SortControls.module.css';
import type { ClockItem } from '../types/data';
import { sortTags } from '../utils/tagUtils';

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const FormattedDate: FC<{ date: string }> = React.memo(({ date }) => {
  const [yy, mm, dd] = date.split('-');
  const monthName =
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
});

interface ClockResultsProps {
  items: ClockItem[];
  loading: boolean;
  error: Error | null;
}

const ClockResults: FC<ClockResultsProps> = ({ items, loading, error }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const sortedItems = useMemo<ClockItem[]>(() => {
    const filtered = items.filter((item) => item?.date);
    switch (sortBy) {
      case 'date-desc':
        return [...filtered].sort((a, b) => b.date.localeCompare(a.date));
      case 'date-asc':
        return [...filtered].sort((a, b) => a.date.localeCompare(b.date));
      case 'title-asc':
        return [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title-desc':
        return [...filtered].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      default:
        return filtered;
    }
  }, [items, sortBy]);

  const handleDateSort = () => setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc'));
  const handleTitleSort = () => setSortBy((prev) => (prev === 'title-asc' ? 'title-desc' : 'title-asc'));
  const handleRowClick = (date: string) => navigate(`/${date}`);

  if (loading) {
    return <div className={listStyles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={listStyles.errorContainer}>Error: {error instanceof Error ? error.message : String(error)}</div>;
  }

  return (
    <div className={listStyles.centeredContent}>
      <div className={sortStyles.sortContainer}>
        <button
          type="button"
          onClick={handleDateSort}
          className={`${sortStyles.sortButton} ${sortBy.startsWith('date') ? sortStyles.active : ''}`}
          style={{ textTransform: 'uppercase' }}
        >
          date
          {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
        </button>
        <button
          type="button"
          style={{ textTransform: 'uppercase' }}
          onClick={handleTitleSort}
          className={`${sortStyles.sortButton} ${sortBy.startsWith('title') ? sortStyles.active : ''}`}
        >
          title
          {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
        </button>
      </div>

      <ul className={listStyles.simpleListContainer}>
        {sortedItems.map((item) => (
          <li key={item.date} className={listStyles.simpleListItem} onClick={() => handleRowClick(item.date)}>
            <div className={listStyles.simpleListRow}>
              <FormattedDate date={item.date} />
              <div className={listStyles.thumbnailWrapper}>
                <Thumbnail date={item.date} title={item.title || ''} />
              </div>
              <div className={listStyles.contentStack}>
                <div className={listStyles.titleNumberRow}>
                  <span className={listStyles.simpleListTitle}>{item.title || 'No Title'}</span>
                  <span className={listStyles.simpleListNumber}>#{item.clockNumber}</span>
                </div>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClockResults;