import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import styles from './ClockPage.module.css';

// Preload all Clock.jsx files under /pages/**/Clock.jsx using Vite's glob import
const clockModules = import.meta.glob('./pages/**/Clock.jsx');

// Helper function to remove 'Clock' from title and trim whitespace
const formatTitle = (title) => title?.replace(/clock/i, '').trim() || 'Home';

// Helper function to format date string from YY-MM-DD to MM/DD/YY
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);
  return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31 ? `${mm}/${dd}/${yy}` : 'Invalid Date';
};

// Helper to check if string matches YY-MM-DD format
const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);

// Helper to get today’s date in YY-MM-DD format
const getTodayDate = () => {
  const date = new Date();
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

const ClockPage = () => {
  const { date } = useParams(); // Get date from URL params ('today' or YY-MM-DD)
  const { items, loading, error } = useContext(DataContext); // DataContext provides clock items
  const navigate = useNavigate(); // Router navigation

  // State to store the dynamically imported Clock component
  const [ClockComponent, setClockComponent] = useState(null);
  // State for page-level errors
  const [pageError, setPageError] = useState(null);
  // States for auto-hide header/footer
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Effect: Load Clock component based on current date parameter
  useEffect(() => {
    if (loading) return; // Wait until data loads

    if (!items || items.length === 0) {
      setPageError('No clocks available.');
      setClockComponent(null);
      return;
    }

    let item;

    if (date === 'today') {
      // Find today's clock or most recent one
      const todayDate = getTodayDate();
      item = items.find((i) => i.date === todayDate) || 
             items.reduce((latest, current) =>
               !latest || current.date > latest.date ? current : latest,
               null
             );
    } else if (!isValidDateFormat(date)) {
      // Invalid date format → redirect to home
      navigate('/', { replace: true });
      return;
    } else {
      // Specific date requested
      item = items.find((i) => i.date === date) || null;
      if (!item) {
        navigate('/', { replace: true });
        return;
      }
    }

    // Check if item has a valid path to Clock.jsx
    if (!item || !item.path) {
      setPageError(`Clock path missing for date: ${item?.date || 'unknown'}`);
      setClockComponent(null);
      return;
    }

    // Reset state before loading new Clock
    setPageError(null);
    setClockComponent(null);

    // Construct key for Vite glob import
    const key = `./pages/${item.path}/Clock.jsx`.replace(/^\/|\/$/g, '');

    // Dynamically import the Clock component
    if (clockModules[key]) {
      clockModules[key]()
        .then((mod) => setClockComponent(() => mod.default))
        .catch((err) =>
          setPageError(`Failed to load clock for ${item.date}: ${err.message}`)
        );
    } else {
      console.log('Available keys:', Object.keys(clockModules));
      setPageError(`No clock found at path: ${key}`);
    }
  }, [date, items, loading, navigate]);

  // Auto-hide footer after user inactivity
  useEffect(() => {
    const footerFadeMs = 1000;
    let footerTimer;
    const resetTimer = () => {
      setFooterVisible(true); // Show footer
      clearTimeout(footerTimer);
      footerTimer = setTimeout(() => setFooterVisible(false), footerFadeMs);
    };
    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    return () => {
      clearTimeout(footerTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, []);

  // Auto-hide header shortly after loading
  useEffect(() => {
    setHeaderVisible(true);
    const headerTimer = setTimeout(() => setHeaderVisible(false), 1300);
    return () => clearTimeout(headerTimer);
  }, [date]);

  // Prevent page scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Determine current, previous, and next clock for footer navigation
  let currentIndex;
  let currentItem;

  if (date === 'today') {
    const todayDate = getTodayDate();
    currentItem = items.find((i) => i.date === todayDate) || 
                  items.reduce((latest, current) =>
                    !latest || current.date > latest.date ? current : latest,
                    null
                  );
    currentIndex = items.findIndex((i) => i.date === currentItem.date);
  } else {
    currentIndex = items.findIndex((item) => item.date === date);
    currentItem = currentIndex >= 0 ? items[currentIndex] : null;
  }

  if (!currentItem) {
    setPageError('No valid clock found.');
    return (
      <div className={styles.container}>
        <Header visible={headerVisible} />
        <div className={styles.content}>
          <div className={styles.sheet}>
            <div className={styles.error}>No valid clock found.</div>
          </div>
        </div>
      </div>
    );
  }

  // Determine previous and next items for navigation
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // Loading and error states
  if (loading) return <div className={styles.loading}>Loading data...</div>;
  if (error || pageError)
    return (
      <div className={styles.container}>
        <Header visible={headerVisible} />
        <div className={styles.content}>
          <div className={styles.sheet}>
            <div className={styles.error}>{error || pageError}</div>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <Header visible={headerVisible} />
      <div className={styles.content}>
        {/* Render dynamically loaded Clock component or loading message */}
        {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
      </div>

      {/* Footer navigation strip */}
      <div className={`${styles.footerStrip} ${footerVisible ? styles.visible : styles.hidden}`}>
        {/* Previous Clock */}
        <Link
          to={prevItem ? `/${prevItem.date}` : '/'}
          className={styles.navButton}
          aria-label={prevItem ? `Go to previous clock: ${formatTitle(prevItem.title)}` : 'Go back to homepage'}
        >
          <span aria-hidden="true">⇽</span>
          <span className={styles.screenReaderText}>
            {prevItem ? `Previous: ${formatTitle(prevItem.title)}` : 'Go back to homepage'}
          </span>
        </Link>

        {/* Current Clock / Homepage */}
        <Link
          to={date === 'today' ? '/today' : '/'}
          className={styles.footerButton}
          aria-label="Go back to homepage or refresh today"
        >
          <div className={styles.footerCenter}>
            <span className={styles.footerDate}>{formatDate(currentItem.date)}</span>
            <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
            <span className={styles.footerNumber}><strong>#</strong>{currentItem.clockNumber}</span>
          </div>
          <span className={styles.screenReaderText}>
            {date === 'today' ? 'Refresh today’s clock' : 'Go back to homepage'}
          </span>
        </Link>

        {/* Next Clock */}
        <Link
          to={nextItem ? `/${nextItem.date}` : '/'}
          className={styles.navButton}
          aria-label={nextItem ? `Go to next clock: ${formatTitle(nextItem.title)}` : 'Go back to homepage'}
        >
          <span aria-hidden="true">⇾</span>
          <span className={styles.screenReaderText}>
            {nextItem ? `Next: ${formatTitle(nextItem.title)}` : 'Go back to homepage'}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ClockPage;
