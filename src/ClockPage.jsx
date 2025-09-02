import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import styles from './ClockPage.module.css';

// Preload all Clock.jsx files under /pages/**/Clock.jsx using Vite's glob import
const clockModules = import.meta.glob('./pages/**/Clock.jsx');

// Helper functions
const formatTitle = (title) => title?.replace(/clock/i, '').trim() || 'Home';
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);
  return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31 ? `${mm}/${dd}/${yy}` : 'Invalid Date';
};
const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);
const getTodayDate = () => {
  const date = new Date();
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};
const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-');

const ClockPage = () => {
  const { date } = useParams(); // 'today' or YY-MM-DD
  const { items, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  // -------------------------------
  // Load Clock component dynamically
  // -------------------------------
  useEffect(() => {
    if (loading) return;
    if (!items || items.length === 0) {
      setPageError('No clocks available.');
      setClockComponent(null);
      return;
    }

    let item;

    if (date === 'today') {
      const todayDate = getTodayDate();
      item = items.find((i) => normalizeDate(i.date) === normalizeDate(todayDate));
      if (!item) {
        // fallback to latest clock
        item = items.reduce(
          (latest, current) =>
            !latest || normalizeDate(current.date) > normalizeDate(latest.date)
              ? current
              : latest,
          null
        );
        console.log(`No clock for today, using latest clock: ${item.date}`);
      }
    } else if (!isValidDateFormat(date)) {
      navigate('/', { replace: true });
      return;
    } else {
      item = items.find((i) => normalizeDate(i.date) === normalizeDate(date));
      if (!item) {
        navigate('/', { replace: true });
        return;
      }
    }

    if (!item.path) {
      setPageError(`Clock path missing for date: ${item.date}`);
      setClockComponent(null);
      return;
    }

    setPageError(null);
    setClockComponent(null);

    const key = `./pages/${item.path}/Clock.jsx`;

    console.log('Available keys:', Object.keys(clockModules));
    console.log('Attempting to load key:', key);

    if (clockModules[key]) {
      clockModules[key]()
        .then((mod) => setClockComponent(() => mod.default))
        .catch((err) =>
          setPageError(`Failed to load clock for ${item.date}: ${err.message}`)
        );
    } else {
      setPageError(`No clock found at path: ${key}`);
    }
  }, [date, items, loading, navigate]);

  // -------------------------------
  // Auto-hide footer after inactivity
  // -------------------------------
  useEffect(() => {
    const footerFadeMs = 1000;
    let footerTimer;
    const resetTimer = () => {
      setFooterVisible(true);
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

  // -------------------------------
  // Auto-hide header shortly after load
  // -------------------------------
  useEffect(() => {
    setHeaderVisible(true);
    const headerTimer = setTimeout(() => setHeaderVisible(false), 1300);
    return () => clearTimeout(headerTimer);
  }, [date]);

  // -------------------------------
  // Prevent scrolling
  // -------------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // -------------------------------
  // Determine navigation items
  // -------------------------------
  let currentIndex = -1;
  let currentItem = null;

  if (items && items.length > 0) {
    if (date === 'today') {
      const todayDate = getTodayDate();
      currentItem = items.find((i) => normalizeDate(i.date) === normalizeDate(todayDate));
      if (!currentItem) {
        currentItem = items.reduce(
          (latest, current) =>
            !latest || normalizeDate(current.date) > normalizeDate(latest.date)
              ? current
              : latest,
          null
        );
      }
      currentIndex = items.findIndex((i) => i.date === currentItem.date);
    } else {
      currentIndex = items.findIndex((i) => normalizeDate(i.date) === normalizeDate(date));
      currentItem = currentIndex >= 0 ? items[currentIndex] : null;
    }
  }

  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // -------------------------------
  // Handle loading & errors
  // -------------------------------
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

  if (!currentItem) {
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

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className={styles.container}>
      <Header visible={headerVisible} />
      <div className={styles.content}>
        {ClockComponent ? (
          <ClockComponent />
        ) : (
          <div className={styles.loading}>Loading clock...</div>
        )}
      </div>

      {/* Footer navigation */}
      <div className={`${styles.footerStrip} ${footerVisible ? styles.visible : styles.hidden}`}>
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
