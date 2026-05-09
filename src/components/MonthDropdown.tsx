import React, { useState, useMemo } from 'react';

import Thumbnail from './Thumbnail';
import styles from '../Home.module.css';

interface DataItem {
  date: string;
  title?: string;
  clockNumber?: string | number;
  path: string;
}

interface MonthDropdownProps {
  monthKey: string;
  monthName: string;
  items: DataItem[];
  formatDate: (dateStr: string | undefined) => string;
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

const MonthDropdown: React.FC<MonthDropdownProps> = ({ 
  monthKey, 
  monthName, 
  items, 
  formatDate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
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
    <div style={{ marginBottom: '0.25rem' }}>
      <button
        onClick={toggleExpanded}
        style={{
          backgroundColor: 'transparent',
          fontSize: 'clamp(0.9rem, 1.5vw, 1.5rem)',
          padding: 'clamp(0.4rem, 0.8vw, 1rem) clamp(1.5rem, 2.5vw, 3rem)',
          border: '1px solid transparent',
          borderRadius: '3px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'background-color 0.2s, text-shadow 0.2s',
          color: '#8b8f8c',
          fontFamily: 'Manrope, sans-serif',
          width: 'auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(48, 49, 50, 0.5)';
          e.currentTarget.style.color = '#feffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#8b8f8c';
        }}
      >
        <span>{monthName}</span>
        <span style={{ 
          fontSize: '0.8rem', 
          color: 'inherit',
        }}>
          {isExpanded ? '↑' : '↓'}
        </span>
      </button>
      
      {isExpanded && (
        <div>
          <div style={{ 
            display: 'flex', 
            gap: '0.25rem', 
            marginBottom: '0.5rem',
            paddingLeft: '1rem'
          }}>
            <button
              onClick={handleDateSort}
              style={{
                backgroundColor: 'transparent',
                fontSize: 'clamp(0.8rem, 1.2vw, 1.2rem)',
                padding: 'clamp(0.3rem, 0.6vw, 0.8rem) clamp(1rem, 1.8vw, 2rem)',
                border: '1px solid transparent',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, text-shadow 0.2s',
                color: '#8b8f8c',
                fontFamily: 'Manrope, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(48, 49, 50, 0.5)';
                e.currentTarget.style.color = '#feffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#8b8f8c';
              }}
            >
              date{' '}
              {sortBy === 'date-asc'
                ? '↓'
                : sortBy === 'date-desc'
                  ? '↑'
                  : ''}
            </button>
            <button
              onClick={handleTitleSort}
              style={{
                backgroundColor: 'transparent',
                fontSize: 'clamp(0.8rem, 1.2vw, 1.2rem)',
                padding: 'clamp(0.3rem, 0.6vw, 0.8rem) clamp(1rem, 1.8vw, 2rem)',
                border: '1px solid transparent',
                borderRadius: '3px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, text-shadow 0.2s',
                color: '#8b8f8c',
                fontFamily: 'Manrope, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(48, 49, 50, 0.5)';
                e.currentTarget.style.color = '#feffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#8b8f8c';
              }}
            >
              title{' '}
              {sortBy === 'title-asc'
                ? '↓'
                : sortBy === 'title-desc'
                  ? '↑'
                  : ''}
            </button>
          </div>
          <div style={{
            paddingLeft: '1rem',
            borderLeft: '2px solid rgba(157, 161, 168, 0.2)',
          }}>
            <div className={styles.monthGrid}>
              {sortedItems.map((item) => (
                <a
                  key={item.date}
                  href={`/${item.date}`}
                  className={styles.monthItem}
                >
                  {/* Image at top */}
                  <div className={styles.monthItemImage}>
                    <Thumbnail 
                      date={item.date} 
                      title={item.title || undefined} 
                      style={{ width: '100%', height: 'auto', objectFit: 'cover', opacity: 0.8 }}
                    />
                  </div>
                  
                  {/* Date and number row */}
                  <div className={styles.monthItemInfo}>
                    <span className={styles.monthItemDate}>
                      {formatDate(item.date)}
                    </span>
                    <span className={styles.monthItemNumber}>
                      #{item.clockNumber}
                    </span>
                  </div>
                  
                  {/* Title centered below */}
                  <div className={styles.monthItemTitle}>
                    {item.title || 'No Title'}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthDropdown;
