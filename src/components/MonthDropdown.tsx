import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import homeStyles from '../styles/Home.module.css';
import styles from '../styles/MonthDropdown.module.css';
import sortStyles from '../styles/SortControls.module.css';
import Thumbnail from './Thumbnail';

interface DataItem {
  date: string;
  title?: string;
  clockNumber?: string | number;
  path: string;
  tags?: string[];
}

interface MonthDropdownProps {
  monthKey?: string;
  monthName: string;
  items: DataItem[];
  formatDate: (dateStr: string | undefined) => string;
  onToggle?: (monthKey: string) => void;
  isExpanded?: boolean;
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

const MonthDropdown: React.FC<MonthDropdownProps> = ({
  monthKey,
  monthName,
  items,
  formatDate,
  onToggle,
  isExpanded: propExpanded,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isExpanded =
    propExpanded !== undefined ? propExpanded : internalExpanded;

  useEffect(() => {
    if (isExpanded && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    if (onToggle && monthKey) {
      onToggle(monthKey);
    } else {
      setInternalExpanded(!isExpanded);
    }
  };

  const sortedItems = useMemo<DataItem[]>(() => {
    if (sortBy === 'date-desc')
      return [...items].sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === 'date-asc')
      return [...items].sort((a, b) => a.date.localeCompare(b.date));
    if (sortBy === 'title-asc')
      return [...items].sort((a, b) =>
        (a.title || '').localeCompare(b.title || ''),
      );
    if (sortBy === 'title-desc')
      return [...items].sort((a, b) =>
        (b.title || '').localeCompare(a.title || ''),
      );

    return items;
  }, [items, sortBy]);

  const handleDateSort = () =>
    setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc'));
  const handleTitleSort = () =>
    setSortBy((prev) => (prev === 'title-asc' ? 'title-desc' : 'title-asc'));

  return (
    <div ref={containerRef} className={styles.monthDropdownContainer}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: isHovered ? '100vw' : '0',
          height: '100%',
          backgroundColor: '#e5e7eb',
          transform: 'translateX(-50%)',
          transition: 'width 0.2s ease',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <button
        onClick={toggleExpanded}
        className={`${styles.dropdownButton} ${isHovered ? styles.dropdownButtonHovered : ''} ${isExpanded ? styles.dropdownButtonExpanded : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span style={{ textAlign: 'center' }}>{monthName}</span>
      
      </button>

      {isExpanded && (
        <>
          <div className={sortStyles.sortContainer}>
                 <button
              type="button"
              onClick={handleDateSort}
              className={`${sortStyles.sortButton} ${sortBy.startsWith('date') ? sortStyles.active : ''}`}
            >
              date
              {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
            </button>
            <button
              type="button"
              onClick={handleTitleSort}
              className={`${sortStyles.sortButton} ${sortBy.startsWith('title') ? sortStyles.active : ''}`}
            >
              title
              {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
            </button>
          </div>
          <div>
            <div className={homeStyles.monthGrid}>
              {sortedItems.map((item) => (
                <div
                  key={item.date}
                  className={homeStyles.monthItem}
                  onClick={() => navigate(`/${item.date}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/${item.date}`);
                  }}
                  style={{ cursor: 'pointer', minWidth: 0 }}
                >
                  {/* Image at top */}
                  <div className={homeStyles.monthItemImage}>
                    <Thumbnail
                      date={item.date}
                      title={item.title || ''}
                      style={{
                        opacity: 0.8,
                      }}
                    />
                  </div>

                  {/* Date and number row */}
                  <div className={homeStyles.monthItemInfo}>
                    <span>{formatDate(item.date)}</span>
                    <span>#{item.clockNumber ?? ''}</span>
                  </div>

                  {/* Title centered below */}
                  <div className={homeStyles.monthItemTitle}>
                    {item.title || 'No Title'}
                  </div>

                  {/* Tags row */}
                  <div className="tags-wrapper">
                    {(item.tags || [])
                      .sort((a, b) => a.localeCompare(b))
                      .map((tag) => (
                        <Link
                          key={tag}
                          to={`/tag/${tag}`}
                          className="tag-bubble"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {tag}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthDropdown;
