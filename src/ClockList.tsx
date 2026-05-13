import React, { useState, useContext, useMemo, FC } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Thumbnail from './components/Thumbnail';
import { formatDateDots, formatTitle } from './utils/dateUtils';
import styles from './styles/Home.module.css'; // Reusing grid styles for consistency
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

  if (loading) return <div className={styles.loadingContainer}>Loading clocks...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.homeContainer}>
      <TopNav />
      
      <div className={styles.homeCenteredContent} style={{ paddingBottom: '4rem' }}>
        <header style={{ 
          textAlign: 'center', 
          margin: '2rem 0', 
          fontFamily: 'Manrope, sans-serif' 
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>All Clocks</h1>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
              style={{ padding: '8px 16px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff' }}
            >
              Sort by Date {sortBy.startsWith('date') ? (sortBy === 'date-desc' ? '↓' : '↑') : ''}
            </button>
            <button 
              onClick={() => setSortBy(sortBy === 'title-asc' ? 'title-desc' : 'title-asc')}
              style={{ padding: '8px 16px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff' }}
            >
              Sort by Title {sortBy.startsWith('title') ? (sortBy === 'title-asc' ? '↓' : '↑') : ''}
            </button>
            <button 
              onClick={() => setSortBy(sortBy === 'number-desc' ? 'number-asc' : 'number-desc')}
              style={{ padding: '8px 16px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff' }}
            >
              Sort by Number {sortBy.startsWith('number') ? (sortBy === 'number-desc' ? '↓' : '↑') : ''}
            </button>
          </div>
        </header>

        <div className={styles.monthGrid}>
          {sortedItems.map((item) => (
            <Link
              key={item.date}
              to={`/${item.date}`}
              className={styles.monthItem}
            >
              <div className={styles.monthItemImage}>
                <Thumbnail 
                  date={item.date} 
                  title={item.title || ''} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                />
              </div>
              
              <div className={styles.monthItemInfo}>
                <span>{formatDateDots(item.date)}</span>
                <span>#{item.clockNumber}</span>
              </div>
              
              <div className={styles.monthItemTitle}>
                {formatTitle(item.title)}
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
