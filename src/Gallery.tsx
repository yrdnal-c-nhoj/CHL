import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import { DataContextType } from './types/data';
import Thumbnail from './components/Thumbnail';
import styles from './Gallery.module.css';

const Gallery: React.FC = () => {
  const { items, loading } = useContext(DataContext) as DataContextType;

  // Sort items newest first to show the latest experiments at the top
  const sortedItems = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => b.date.localeCompare(a.date));
  }, [items]);

  if (loading) {
    return <div className={styles.loading}>Loading Archive...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>Archive</h1>
          <p className={styles.subtitle}>Daily experiments in time and motion.</p>
        </div>
        <Link to="/" className={styles.backButton}>
          Close
        </Link>
      </header>

      <div className={styles.grid}>
        {sortedItems.map((clock) => (
          <Link 
            key={clock.date} 
            to={`/${clock.date}`} 
            className={styles.clockCard}
          >
            <div className={styles.thumbnailWrapper}>
              <Thumbnail 
                date={clock.date} 
                title={clock.title} 
                className={styles.thumbnail}
              />
            </div>
            <div className={styles.cardOverlay}>
              <span className={styles.dateLabel}>{clock.date}</span>
              <h2 className={styles.clockTitle}>{clock.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;