import React, { useState, useContext, useMemo, FC } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Thumbnail from './components/Thumbnail';
import { formatDateDots, formatTitle } from './utils/dateUtils';
import styles from './styles/ClockList.module.css';
import homeStyles from './styles/Home.module.css';
import type { DataItem } from './Home';

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'number-asc' | 'number-desc';

const ClockList: FC = () => {
  const { items, loading, error } = useContext(DataContext) as { 
    items: DataItem[], 
    loading: boolean, 
    error: string | null 
  };
  
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const sortedItems = useMemo(() => {
    const result = [...items].filter(item => item.date);
    
    switch (sortBy) {
      case 'date-desc':
        return result.sort((a, b) => b.date.localeCompare(a.date));
      case 'date-asc':
        return result.sort((a, b) => a.date.localeCompare(b.date));
      case 'title-asc':
        return result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title-desc':
        return result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      case 'number-asc':
        return result.sort((a, b) => Number(a.clockNumber || 0) - Number(b.clockNumber || 0));
      case 'number-desc':
        return result.sort((a, b) => Number(b.clockNumber || 0) - Number(a.clockNumber || 0));
      default:
        return result;
    }
  }, [items, sortBy]);

  if (loading) return <div className={homeStyles.loadingContainer}>Loading clocks...</div>;
  if (error) return <div className={homeStyles.error}>Error: {error}</div>;

  return (
    <div className={homeStyles.homeContainer}>
      <TopNav />
      
      <div className={homeStyles.homeCenteredContent} style={{ paddingBottom: '1rem' }}>
        <header style={{ 
          textAlign: 'center', 
          margin: '1rem 0', 
          fontFamily: 'Manrope, sans-serif' 
        }}>
    
          <div className={styles.sortButtonContainer}>
            <button 
              onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
              className={styles.sortButton}
            >
              sort by date {sortBy.startsWith('date') ? (sortBy === 'date-desc' ? '↓' : '↑') : ''}
            </button>
            <button 
              onClick={() => setSortBy(sortBy === 'title-asc' ? 'title-desc' : 'title-asc')}
              className={styles.sortButton}
            >
              sort by title {sortBy.startsWith('title') ? (sortBy === 'title-asc' ? '↓' : '↑') : ''}
            </button>
            <button 
              onClick={() => setSortBy(sortBy === 'number-desc' ? 'number-asc' : 'number-desc')}
              className={styles.sortButton}
            >
              sort by number <nav></nav> {sortBy.startsWith('number') ? (sortBy === 'number-desc' ? '↓' : '↑') : ''}
            </button>
          </div>
        </header>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1px', 
          maxWidth: '800px', 
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {sortedItems.map((item, index) => (
            <Link
              key={item.date}
              to={`/${item.date}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: index === sortedItems.length - 1 ? 'none' : '1px solid #ddd',
                textDecoration: 'none',
                color: 'inherit',
                gap: '1.5rem'
              }}
            >
              <div style={{ width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden', borderRadius: '4px' }}>
                <Thumbnail 
                  date={item.date} 
                  title={item.title || ''} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                flex: 1, 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontFamily: 'Manrope, sans-serif'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#999', fontSize: '0.9rem' }}>{formatDateDots(item.date)}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{formatTitle(item.title)}</span>
                  <span style={{ fontFamily: 'monospace', color: '#999', fontSize: '0.9rem'  }}>#{item.clockNumber}</span>
                   </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClockList;
