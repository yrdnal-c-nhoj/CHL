import React, { useState, useMemo, useEffect, useRef } from 'react';
import Thumbnail from './Thumbnail';
import styles from '../styles/MonthDropdown.module.css';
import homeStyles from '../styles/Home.module.css';

interface DataItem {
  date: string;
  title?: string;
  clockNumber?: string | number;
  path: string;
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
  isExpanded: propExpanded
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isExpanded = propExpanded !== undefined ? propExpanded : internalExpanded;

  useEffect(() => {
    if (isExpanded && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      return [...items].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    if (sortBy === 'title-desc')
      return [...items].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    
    return items;
  }, [items, sortBy]);

  const handleDateSort = () =>
    setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc') as SortOption);
  const handleTitleSort = () =>
    setSortBy((prev) => (prev === 'title-asc' ? 'title-desc' : 'title-asc') as SortOption);

  return (
    <div 
      ref={containerRef}
      className={styles.monthDropdownContainer}
    >
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
        {isExpanded && (
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'inherit',
          }}>
            ↑
          </span>
        )}
      </button>
      
      {isExpanded && (
        <>
          <div className={styles.controls}>
            <button
              onClick={handleDateSort}
              className={styles.sortButton}
            >
              date{' '}
              {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
            </button>
            <button
              onClick={handleTitleSort}
              className={styles.sortButton}
            >
              title{' '}
              {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
            </button>
          </div>
          <div>
            <div className={homeStyles.monthGrid}>
              {sortedItems.map((item) => (
                <a
                  key={item.date}
                  href={`/${item.date}`}
                  className={homeStyles.monthItem}
                >
                  {/* Image at top */}
                  <div className={homeStyles.monthItemImage}>
                    <Thumbnail 
                      date={item.date} 
                      title={item.title || ''} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                    />
                  </div>
                  
                  {/* Date and number row */}
                  <div className={homeStyles.monthItemInfo}>
                    <span>
                      {formatDate(item.date)}
                    </span>
                    <span>
                      #{item.clockNumber}
                    </span>
                  </div>
                  
                  {/* Title centered below */}
                  <div className={homeStyles.monthItemTitle}>
                    {item.title || 'No Title'}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthDropdown;
