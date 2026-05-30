import { useContext, useMemo, useState, type FC, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Thumbnail from './components/Thumbnail';
import TopNav from './components/TopNav';
import { DataContext } from './context/DataContext';
import listStyles from './styles/ClockList.module.css';
import type { ClockItem, DataContextType } from './types/data';

type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'title-asc'
  | 'title-desc'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const ClockList: FC = () => {
  const context = useContext(DataContext) as DataContextType;
  const { items = [], loading = false, error = null } = context || {};
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Memoized sorting logic to prevent unnecessary re-renders
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

  const handleDateSort = () =>
    setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc'));
  const handleTitleSort = () =>
    setSortBy((prev) => (prev === 'title-asc' ? 'title-desc' : 'title-asc'));
 
  const handleRowClick = (date: string) => {
    navigate(`/${date}`);
  };

  if (loading) return (
    <div className={listStyles.listPageContainer}>
      <TopNav />
      <div className={listStyles.loadingContainer}>Loading...</div>
      <Footer />
    </div>
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={listStyles.listPageContainer}>
      <TopNav />
      <div className={listStyles.centeredContent}>
        {/* Layout Controls */}
        <div className="sort-container">
          <h1 className="sort-title">
            {sortedItems.length} {sortedItems.length === 1 ? 'clock' : 'clocks'}
          </h1>
          <span className="sort-label">Sort:</span>
          <button
            type="button"
            onClick={handleDateSort}
            className="sort-button"
          >
            date{' '}
            {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
          </button>
          <button
            type="button"
            onClick={handleTitleSort}
            className="sort-button"
          >
            title{' '}
            {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
          </button>
        </div>

        <ul className={listStyles.simpleListContainer}>
          {sortedItems.map((item) => (
            <li key={item.date}>
              <div
                className={listStyles.simpleListImage}
                onClick={() => handleRowClick(item.date)}
              >
                {/* Column 1: Date */}
                <time
                  className={listStyles.simpleListDate}
                  dateTime={`20${item.date}`}
                >
                  {(() => {
                    const [yy, mm, dd] = item.date.split('-');
                    const monthName = MONTHS[parseInt(mm, 10) - 1] || '???';
                    return (
                      <>
                        {/* Using padStart and removing inline font-size to ensure all digits are identical in size */}
                        <span>{dd.padStart(2, '0')}</span>
                        <span>{monthName}</span>
                        <span>'{yy}</span>
                      </>
                    );
                  })()}
                </time>

                {/* Column 2: Image */}
                <div className={listStyles.thumbnailWrapper}>
                  <Thumbnail date={item.date} title={item.title || ''} />
                </div>

                {/* Column 3: Content Stack (Title/Number Row + Tags Row) */}
                <div className={listStyles.contentStack}>
                  <div className={listStyles.titleNumberRow}>
                    <span className={listStyles.simpleListTitle}>
                      {item.title || 'No Title'}
                    </span>
                    <span className={listStyles.simpleListNumber}>
                      #{item.clockNumber}
                    </span>
                  </div>
                  <div className="tag-wrapper">
                    {[...(item.tags || [])]
                      .sort((a, b) => a.localeCompare(b))
                      .map((tag) => (
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
      <Footer />
    </div>
  );
};

export default ClockList;
