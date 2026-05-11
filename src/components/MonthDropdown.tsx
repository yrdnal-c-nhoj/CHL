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
          transition: 'color 0.2s',
          color: isHovered ? '#000000' : (isExpanded ? '#2d2d2d' : '#4a4a4a'),
          fontFamily: 'Manrope, sans-serif',
          fontWeight: isExpanded ? '700' : '400',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
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
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            margin: '0.5rem 0 1.5rem 0',
            justifyContent: 'center',
            width: '100%'
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
              {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
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
