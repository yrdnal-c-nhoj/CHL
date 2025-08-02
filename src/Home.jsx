import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import styles from './Home.module.css';

const Home = () => {
  const { items, loading, error } = useContext(DataContext);
  const [sortBy, setSortBy] = useState('date-desc');
  const [randomSortKey, setRandomSortKey] = useState(0);

  useEffect(() => {
    const savedSort = localStorage.getItem('sortBy');
    if (savedSort) setSortBy(savedSort);
  }, []);

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

const sortedItems = useMemo(() => {
  const isValidDate = (str) => {
    const parts = str?.split('-');
    if (!parts || parts.length !== 3) return false;
    const [yy, mm, dd] = parts.map(Number);
    if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return false;
    const fullYear = 2000 + yy;
    const date = new Date(fullYear, mm - 1, dd);
    return !isNaN(date.getTime());
  };

  const itemsCopy = [...items].filter(item => item.date && isValidDate(item.date));

  if (sortBy === 'date-desc') return itemsCopy.sort((a, b) => b.date.localeCompare(a.date));
  if (sortBy === 'date-asc') return itemsCopy.sort((a, b) => a.date.localeCompare(b.date));
  if (sortBy === 'title-asc') return itemsCopy.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === 'title-desc') return itemsCopy.sort((a, b) => b.title.localeCompare(a.title));
  return itemsCopy.sort(() => Math.random() - 0.5);
}, [items, sortBy, randomSortKey]);


  const handleRandomSort = () => {
    setSortBy('random');
    setRandomSortKey((prev) => prev + 1);
  };

  const handleDateSort = () => {
    setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc'));
  };

  const handleTitleSort = () => {
    setSortBy((prev) => (prev === 'title-asc' ? 'title-desc' : 'title-asc'));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Invalid Date';

    const parts = dateStr.split('-');
    if (parts.length !== 3) return 'Invalid Date';

    let [yy, mm, dd] = parts.map(Number);
    if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return 'Invalid Date';

    const fullYear = 2000 + yy; // handles 2-digit year
    const date = new Date(fullYear, mm - 1, dd);

    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr);
      return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
    }).format(date);
  };

  if (loading) return <div className={styles.loading}>Loading data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <>
      <TopNav />
      <div className={styles.container}>
        <div className={styles.centeredContent}>
          <div className={styles.sortContainer}>
            <button
              onClick={handleRandomSort}
              aria-label="Sort randomly"
              className={`${styles.sortButton} ${sortBy === 'random' ? styles.active : ''}`}
              title="Sort Randomly"
            >
              random
            </button>
            <button
              onClick={handleTitleSort}
              aria-label="Sort by title"
              className={`${styles.sortButton} ${styles.titleSortButton} ${
                sortBy.includes('title') ? styles.active : ''
              }`}
              title={sortBy === 'title-asc' ? 'Sort Z–A' : 'Sort A–Z'}
            >
              title {sortBy === 'title-asc' ? '🔽' : sortBy === 'title-desc' ? '🔼' : ''}
            </button>
            <button
              onClick={handleDateSort}
              aria-label="Sort by date"
              className={`${styles.sortButton} ${styles.dateSortButton} ${
                sortBy.includes('date') ? styles.active : ''
              }`}
              title={sortBy === 'date-desc' ? 'Sort Oldest to Newest' : 'Sort Newest to Oldest'}
            >
              date {sortBy === 'date-asc' ? '🔽' : sortBy === 'date-desc' ? '🔼' : ''}
            </button>
          </div>

          <ul className={styles.dateList}>
            {sortedItems.map((item) => (
              <li key={item.date} className={styles.entry}>
                <Link to={`/${item.date}`} className={styles.navLink}>
                  <span className={styles.clockNumber}>#{item.clockNumber}</span>
                  <span className={styles.title}>{item.title || 'No Title'}</span>
                  <span className={styles.date}>{formatDate(item.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
