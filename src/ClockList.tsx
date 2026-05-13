import { useContext, useMemo, useState, type FC } from 'react';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Thumbnail from './components/Thumbnail';
import homeStyles from './styles/Home.module.css';
import dropdownStyles from './styles/MonthDropdown.module.css';
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
  return `${day} ${month} '${year}`;
};

type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc'
  | 'number-asc'
  | 'number-desc';

const ClockList: FC = () => {
  const { items, loading, error } = useContext(DataContext) as DataContextType;
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
    return <div className={homeStyles.loadingContainer} />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={homeStyles.homeContainer}>
      <TopNav />
      <div className={homeStyles.homeCenteredContent}>
        <div className={dropdownStyles.controls}>
          <button
            type="button"
            onClick={handleDateSort}
            className={dropdownStyles.sortButton}
          >
            date{' '}
            {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
          </button>
          <button
            type="button"
            onClick={handleTitleSort}
            className={dropdownStyles.sortButton}
          >
            title{' '}
            {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
          </button>
          <button
            type="button"
            onClick={handleNumberSort}
            className={dropdownStyles.sortButton}
          >
            number{' '}
            {sortBy === 'number-asc'
              ? '↓'
              : sortBy === 'number-desc'
                ? '↑'
                : ''}
          </button>
        </div>

        <div className={homeStyles.monthGrid}>
          {sortedItems.map((item) => (
            <a
              key={item.date}
              href={`/${item.date}`}
              className={homeStyles.monthItem}
            >
              <div className={homeStyles.monthItemImage}>
                <Thumbnail
                  date={item.date}
                  title={item.title || ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.8,
                  }}
                />
              </div>
              <div className={homeStyles.monthItemInfo}>
                <span>{formatDate(item.date)}</span>
                <span>#{item.clockNumber}</span>
              </div>
              <div className={homeStyles.monthItemTitle}>
                {item.title || 'No Title'}
              </div>
            </a>
          ))}
        </div>

        <h2 className={listStyles.simpleListHeading}>All clocks</h2>
        <ul className={listStyles.simpleList}>
          {sortedItems.map((item) => (
            <li key={`list-${item.date}`}>
              <a href={`/${item.date}`} className={listStyles.simpleListItem}>
                <span className={listStyles.simpleListDate}>
                  {formatDate(item.date)}
                </span>
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
