import React, { useState, useContext, useEffect, useMemo, FC } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import styles from './Home.module.css';
import instaImg from '@/assets/icons/i.png';
import elonImg from '@/assets/icons/x.png';

interface DataItem {
  date: string;
  title?: string;
  clockNumber?: string | number;
  path: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'random';

const isValidDate = (str: string | undefined): boolean => {
  const parts = str?.split('-');
  if (!parts || parts.length !== 3) return false;
  const [yy, mm, dd] = parts.map(Number);
  if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return false;
  // Assumes 20xx
  const date = new Date(2000 + yy, mm - 1, dd);
  return !isNaN(date.getTime());
};

const formatDate = (dateStr: string | undefined): string => {
  const parts = dateStr?.split('-');
  if (!parts || parts.length !== 3) return 'Unknown Date';
  const [yy, mm, dd] = parts.map(Number);
  const date = new Date(2000 + yy, mm - 1, dd);
  if (isNaN(date.getTime())) return 'Unknown Date';

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

// New component for handling image and fallback
interface ThumbnailProps {
  date: string;
  title?: string;
}

const Thumbnail: FC<ThumbnailProps> = ({ date, title }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = `/screenshots/${date}.png`;

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div style={{
        width: '80px',
        height: '45px',
        marginRight: '1.5rem',
        flexShrink: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--lab-bg-gray)', // Use a distinct background color
        border: '1px solid rgba(157, 161, 168, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(157, 161, 168, 0.5)',
        fontSize: '0.6rem',
        textAlign: 'center',
        lineHeight: '1',
      }}>
        No Image
      </div>
    );
  }

  return (
    <div style={{
      width: '80px',
      height: '45px',
      marginRight: '1.5rem',
      flexShrink: 0,
      overflow: 'hidden',
      backgroundColor: '#111', // This background will be covered by the image if it loads
      border: '1px solid rgba(157, 161, 168, 0.2)'
    }}>
      <img
        src={imageUrl}
        alt={title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
};

const Home: FC = () => {
  const { items, loading, error } = useContext(DataContext) as { items: DataItem[], loading: boolean, error: string | null };
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [randomSortKey, setRandomSortKey] = useState(0);
  const [fontsReady, setFontsReady] = useState<boolean>(
    sessionStorage.getItem('fontsLoaded') === 'true',
  );

  useEffect(() => {
    if (!fontsReady) {
      document.fonts.ready.then(() => {
        sessionStorage.setItem('fontsLoaded', 'true');
        setFontsReady(true);
      });
    }
  }, [fontsReady, setFontsReady]);

  // Load saved sort preference
  useEffect(() => {
    const savedSort = localStorage.getItem('sortBy') as SortOption | null;
    if (savedSort) setSortBy(savedSort);
  }, []);

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

  const sortedItems = useMemo<DataItem[]>(() => {
    const itemsCopy = [...items].filter(
      (item) => item?.date && isValidDate(item.date),
    );

    if (sortBy === 'date-desc')
      return itemsCopy.sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === 'date-asc')
      return itemsCopy.sort((a, b) => a.date.localeCompare(b.date));
    if (sortBy === 'title-asc')
      return itemsCopy.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    if (sortBy === 'title-desc')
      return itemsCopy.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    if (sortBy === 'random')
      // Use the randomSortKey as a seed-like trigger for a fresh shuffle
      // and sort using a more stable comparison
      return itemsCopy.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    
    return itemsCopy;
  }, [items, sortBy, randomSortKey]);

  const handleRandomSort = () =>
    { setSortBy('random'); setRandomSortKey((prev) => prev + 1); };
  const handleDateSort = () =>
    setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc') as SortOption);
  const handleTitleSort = () =>
    setSortBy((prev) => (prev === 'title-asc' ? 'title-desc' : 'title-asc') as SortOption);

  if (!fontsReady || loading) {
    return (
      <div
        style={{
          height: '100dvh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--lab-bg-gray)',
          fontFamily: 'sans-serif',
        }}
      ></div>
    );
  }

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowY: 'auto' }}>
      <TopNav />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--lab-bg-gray)',
          opacity: fontsReady ? 1 : 0,
          transition: 'opacity 0.6s ease-in',
        }}
      >
        <main style={{ flex: 1 }}>
          <div className={styles.container}>
            <div className={styles.centeredContent}>
              <div className={styles.sortContainer}>
                <button
                  onClick={handleDateSort}
                  className={`${styles.sortButton} ${styles.dateSortButton} ${sortBy.includes('date') ? styles.active : ''}`}
                  title={
                    sortBy === 'date-desc'
                      ? 'Sort Oldest to Newest'
                      : 'Sort Newest to Oldest'
                  }
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
                  className={`${styles.sortButton} ${styles.titleSortButton} ${sortBy.includes('title') ? styles.active : ''}`}
                  title={sortBy === 'title-asc' ? 'Sort Z–A' : 'Sort A–Z'}
                >
                  title{' '}
                  {sortBy === 'title-asc'
                    ? '↓'
                    : sortBy === 'title-desc'
                      ? '↑'
                      : ''}
                </button>
                <button
                  onClick={handleRandomSort}
                  className={`${styles.sortButton} ${sortBy === 'random' ? styles.active : ''}`}
                  title="Sort Randomly"
                >
                  random
                </button>
              </div>

              <ul className={styles.dateList}>
                {sortedItems.map((item) => (
                  <li key={item.date} className={styles.entry}>
                    <Link 
                      to={`/${item.date}`} 
                      className={styles.navLink}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Thumbnail date={item.date} title={item.title} />
                      <span className={styles.date}>
                        {formatDate(item.date)}
                      </span>
                      <span className={styles.title}>
                        {item.title || 'No Title'}
                      </span>
                      <span className={styles.clockNumber}>
                        #{item.clockNumber}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '0.1rem',
            padding: '0.1rem',
          }}
        >
          <a
            href="https://www.instagram.com/cubist_heart_labs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src={instaImg}
              alt="Instagram"
              style={{ width: '2rem', height: '2rem' }}
            />
          </a>
          <a
            href="https://x.com/cubistheartlabs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              decoding="async"
              loading="lazy"
              src={elonImg}
              alt="X"
              style={{ width: '2rem', height: '2rem' }}
            />
          </a>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
