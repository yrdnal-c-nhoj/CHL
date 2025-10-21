import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import styles from './Home.module.css';
import instaImg from './assets/i.png';
import elonImg from './assets/x.png';

const Home = () => {
  const { items, loading, error } = useContext(DataContext);
  const [sortBy, setSortBy] = useState('date-desc');
  const [randomSortKey, setRandomSortKey] = useState(0);
  const [fontsReady, setFontsReady] = useState(sessionStorage.getItem('fontsLoaded') === 'true');

  // 🟢 Load fonts and prevent FOUT
  useEffect(() => {
    if (!fontsReady) {
      document.fonts.ready.then(() => {
        sessionStorage.setItem('fontsLoaded', 'true');
        setFontsReady(true);
      });
    }
  }, [fontsReady]);

  // Load saved sort preference
  useEffect(() => {
    const savedSort = localStorage.getItem('sortBy');
    if (savedSort) setSortBy(savedSort);
  }, []);

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

  // Validate date format
  const isValidDate = (str) => {
    const parts = str?.split('-');
    if (!parts || parts.length !== 3) return false;
    const [yy, mm, dd] = parts.map(Number);
    if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return false;
    const date = new Date(2000 + yy, mm - 1, dd);
    return !isNaN(date.getTime());
  };

  // Format date
  const formatDate = (dateStr) => {
    const parts = dateStr?.split('-');
    if (!parts || parts.length !== 3) return 'Unknown Date';
    const [yy, mm, dd] = parts.map(Number);
    const date = new Date(2000 + yy, mm - 1, dd);
    return isNaN(date.getTime())
      ? 'Unknown Date'
      : new Intl.DateTimeFormat('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' }).format(date);
  };

  // Sorted items
  const sortedItems = useMemo(() => {
    const itemsCopy = [...items].filter(item => item?.date && isValidDate(item.date));

    if (sortBy === 'date-desc') return itemsCopy.sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === 'date-asc') return itemsCopy.sort((a, b) => a.date.localeCompare(b.date));
    if (sortBy === 'title-asc') return itemsCopy.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'title-desc') return itemsCopy.sort((a, b) => b.title.localeCompare(a.title));
    return itemsCopy.sort(() => Math.random() - 0.5);
  }, [items, sortBy, randomSortKey]);

  const handleRandomSort = () => setSortBy('random') || setRandomSortKey(prev => prev + 1);
  const handleDateSort = () => setSortBy(prev => (prev === 'date-desc' ? 'date-asc' : 'date-desc'));
  const handleTitleSort = () => setSortBy(prev => (prev === 'title-asc' ? 'title-desc' : 'title-asc'));

  // 🟡 Show loader until fonts AND data are ready
  if (!fontsReady || loading) {
    return (
      <div style={{
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        fontFamily: 'sans-serif',
      }}>
        
      </div>
    );
  }

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <>
      <TopNav />
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        opacity: fontsReady ? 1 : 0,
        transition: "opacity 0.6s ease-in",
      }}>
        <main style={{ flex: 1 }}>
          <div className={styles.container}>
            <div className={styles.centeredContent}>
              <div className={styles.sortContainer}>
                <button
                  onClick={handleDateSort}
                  className={`${styles.sortButton} ${styles.dateSortButton} ${sortBy.includes('date') ? styles.active : ''}`}
                  title={sortBy === 'date-desc' ? 'Sort Oldest to Newest' : 'Sort Newest to Oldest'}
                >
                  date {sortBy === 'date-asc' ? '↓' : sortBy === 'date-desc' ? '↑' : ''}
                </button>
                <button
                  onClick={handleTitleSort}
                  className={`${styles.sortButton} ${styles.titleSortButton} ${sortBy.includes('title') ? styles.active : ''}`}
                  title={sortBy === 'title-asc' ? 'Sort Z–A' : 'Sort A–Z'}
                >
                  title {sortBy === 'title-asc' ? '↓' : sortBy === 'title-desc' ? '↑' : ''}
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
                {sortedItems.map(item => (
                  <li key={item.date} className={styles.entry}>
                    <Link to={`/${item.date}`} className={styles.navLink}>
                      <span className={styles.date}>{formatDate(item.date)}</span>
                      <span className={styles.title}>{item.title || 'No Title'}</span>
                      <span className={styles.clockNumber}>#{item.clockNumber}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.1rem",
          padding: "0.1rem",
        }}>
          <a href="https://www.instagram.com/cubist_heart_labs/" target="_blank" rel="noopener noreferrer">
            <img src={instaImg} alt="Instagram" style={{ width: "2rem", height: "2rem" }} />
          </a>
          <a href="https://x.com/cubistheartlabs" target="_blank" rel="noopener noreferrer">
            <img src={elonImg} alt="X" style={{ width: "2rem", height: "2rem" }} />
          </a>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
