import { useContext, useMemo, useState, type FC } from 'react';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Thumbnail from './components/Thumbnail';
import listStyles from './styles/ClockList.module.css';
import type { ClockItem, DataContextType } from './types/data';

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const formatDate = (dateStr: string | undefined): string => {
  const parts = dateStr?.split('-');
  if (!parts || parts.length !== 3) return 'Unknown Date';
  const yy = Number(parts[0]);
  const mm = Number(parts[1]);
  const dd = Number(parts[2]);
  if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return 'Unknown Date';
  const date = new Date(2000 + yy, mm - 1, dd);
  if (isNaN(date.getTime())) return 'Unknown Date';
  const day = String(date.getDate());
  const month = MONTH_NAMES[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
  return `${day} ${month} '${year}`.replace(/\s?'/, " '");
};

type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc'
  | 'number-asc'
  | 'number-desc';

const ClockList: FC = () => {
  const context = useContext(DataContext) as DataContextType;
  const { items = [], loading = false, error = null } = context || {};
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const sortedItems = useMemo<ClockItem[]>(() => {
    const filtered = items.filter((item) => item?.date);
    switch (sortBy) {
      case 'date-desc':
        return [...filtered].sort((a, b) => b.date.localeCompare(a.date));
      case 'date-asc':
        return [...filtered].sort((a, b) => a.date.localeCompare(b.date));
      case 'title-asc':
        return [...filtered].sort((a, b) =>
          (a.title || '').localeCompare(b.title || ''),
        );
      case 'title-desc':
        return [...filtered].sort((a, b) =>
          (b.title || '').localeCompare(a.title || ''),
        );
      case 'number-asc':
        return [...filtered].sort(
          (a, b) => Number(a.clockNumber || 0) - Number(b.clockNumber || 0),
        );
      case 'number-desc':
        return [...filtered].sort(
          (a, b) => Number(b.clockNumber || 0) - Number(a.clockNumber || 0),
        );
      default:
        return filtered;
    }
  }, [items, sortBy]);

  const handleDateSort = () =>
    setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc'));
  const handleTitleSort = () =>
    setSortBy((prev) => (prev === 'title-asc' ? 'title-desc' : 'title-asc'));
  const handleNumberSort = () =>
    setSortBy((prev) =>
      prev === 'number-desc' ? 'number-asc' : 'number-desc',
    );

  if (loading) {
    return (
      <div className={listStyles.listPageContainer}>
        <TopNav />
        <div className={listStyles.loadingContainer} />
        <Footer />
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={listStyles.listPageContainer}>
      <TopNav />
      <div className={listStyles.centeredContent}>
        <div className={listStyles.controls}>
          <button
            type="button"
            onClick={handleDateSort}
            className={listStyles.sortButton}
          >
            date{' '}
            {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
          </button>
          <button
            type="button"
            onClick={handleTitleSort}
            className={listStyles.sortButton}
          >
            title{' '}
            {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
          </button>
          <button
            type="button"
            onClick={handleNumberSort}
            className={listStyles.sortButton}
          >
            number{' '}
            {sortBy === 'number-asc'
              ? '↓'
              : sortBy === 'number-desc'
                ? '↑'
                : ''}
          </button>
        </div>

        <ul className={listStyles.simpleList}>
          {sortedItems.map((item) => (
            <li key={`list-${item.date}`}>
              <a href={`/${item.date}`} className={listStyles.simpleListItem}>
                <div className={listStyles.thumbnailWrapper}>
                  <Thumbnail 
                    date={item.date} 
                    title={item.title || ''} 
                  />
                </div>
                <time 
                  className={listStyles.simpleListDate} 
                  dateTime={`20${item.date}`}
                >
                  {formatDate(item.date)}
                </time>
                <span className={listStyles.simpleListTitle}>
                  {item.title || 'No Title'}
                </span>
                <span className={listStyles.simpleListNumber}>
                  #{item.clockNumber}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default ClockList;
