import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import styles from './Home.module.css';

const Home = () => {
  const { items, loading, error } = useContext(DataContext);
  const [sortBy, setSortBy] = useState('date-desc');
  const [randomSortKey, setRandomSortKey] = useState(0);

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
    if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    return Math.random() - 0.5;
  });

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
    const [yy, mm, dd] = dateStr.split('-');
    return `${parseInt(mm, 10)}/${parseInt(dd, 10)}/${parseInt(yy, 10)}`;
  };

  if (loading) return <div className={styles.loading}>Loading data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.topNav}>
        <TopNav />
      </div>
      <div className={styles.container}>
        <div className={styles.centeredContent}>
          <div className={styles.sortContainer}>
            <button
              onClick={handleTitleSort}
              className={`${styles.sortButton} ${styles.titleSortButton} ${
                sortBy.includes('title') ? styles.active : ''
              }`}
              title={sortBy === 'title-asc' ? 'Sort Reverse Alphabetically' : 'Sort Alphabetically'}
            >
              Sort by Title
            </button>
            <button
              onClick={handleRandomSort}
              className={`${styles.sortButton} ${styles.randomSortButton} ${
                sortBy === 'random' ? styles.active : ''
              }`}
              title="Sort Randomly"
            >
              Random
            </button>
            <button
              onClick={handleDateSort}
              className={`${styles.sortButton} ${styles.dateSortButton} ${
                sortBy.includes('date') ? styles.active : ''
              }`}
              title={sortBy === 'date-desc' ? 'Sort Oldest to Newest' : 'Sort Newest to Oldest'}
            >
              Sort by Date
            </button>
          </div>
          <ul className={styles.dateList}>
            {sortedItems.map((item) => (
              <li key={`${item.date}-${randomSortKey}`} className={styles.entry}>
                <Link to={`/${item.date}`} className={styles.navLink}>
                  <div className={styles.entryTop}>
                    <span className={styles.title}>{item.title || 'No Title'}</span>
                    <span className={styles.connector}> </span>
                    <span className={styles.clockNumber}>#{item.clockNumber}</span>
                  </div>
                  <div className={styles.entryBottom}>
                    <span className={styles.connector}> </span>
                    <span className={styles.date}>{formatDate(item.date)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          © {new Date().getFullYear()} Cubist Heart Laboratories. All rights reserved.
        </div>
        <div className={styles.footerStrip}>
          🧊🫀🔭 🧊🫀🔭 🧊🫀🔭 🧊🫀🔭 🧊🫀🔭 🧊🫀🔭 🧊🫀🔭 🧊🫀🔭 🧊🫀🔭 🧊🫀🔭
        </div>
      </footer>
    </div>
  );
};

export default Home;