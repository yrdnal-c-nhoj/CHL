import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import styles from './ClockPage.module.css';

// Helpers outside component
const formatTitle = (title) => {
  if (!title) return 'Home';
  return title.replace(/clock/i, '').trim() || 'Home';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts;
  return `${Number(mm)}/${Number(dd)}/${yy}`;
};

const ClockPage = () => {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);

  // Nav/footer visibility state
  const [navVisible, setNavVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);

  // Load clock component on date/items change
  useEffect(() => {
    if (loading) return;

    if (!date || !/^\d{2}-\d{2}-\d{2}$/.test(date)) {
      setPageError('Invalid date format. Use YY-MM-DD (e.g., 25-06-01).');
      setClockComponent(null);
      return;
    }

    const item = items.find(i => i.date === date);

    if (!item || !item.path) {
      setPageError(`No path found for date ${date}.`);
      setClockComponent(null);
      return;
    }

    setPageError(null);
    setClockComponent(null); // Clear before load

    // Dynamically import the clock component
    import(`./pages/${item.path}/Clock.jsx`)
      .then(mod => setClockComponent(() => mod.default))
      .catch(err => setPageError(`Failed to load clock for ${date}: ${err.message}`));

    // Note: styles should be imported statically in Clock.jsx or globally
  }, [date, items, loading]);

  // Handle nav/footer fade on inactivity
  useEffect(() => {
    const navFadeMs = 300;
    const footerFadeMs = 2000;
    let navTimer, footerTimer;

    const resetTimers = () => {
      setNavVisible(true);
      setFooterVisible(true);

      if (navTimer) clearTimeout(navTimer);
      if (footerTimer) clearTimeout(footerTimer);

      navTimer = setTimeout(() => setNavVisible(false), navFadeMs);
      footerTimer = setTimeout(() => setFooterVisible(false), footerFadeMs);
    };

    // Initialize timers
    resetTimers();

    window.addEventListener('mousemove', resetTimers);
    window.addEventListener('touchstart', resetTimers);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(footerTimer);
      window.removeEventListener('mousemove', resetTimers);
      window.removeEventListener('touchstart', resetTimers);
    };
  }, []);

  // Reset body overflow on unmount (if you modify it elsewhere)
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Find current, previous, next items for navigation
  const currentIndex = items.findIndex(item => item.date === date);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // Loading UI
  if (loading) {
    return <div className={styles.loading}>Loading data...</div>;
  }

  // Error UI
  if (error || pageError) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
        </div>

        {currentItem && (
          <Link
            to="/"
            className={`${styles.footerStrip} ${footerVisible ? styles.visible : styles.hidden}`}
            aria-label="Go back to homepage"
          >
            <div className={styles.footerContent}>
              <div className={styles.footerLeft}>
                <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
              </div>
              <div className={styles.footerCenter}>
                <span className={styles.footerNumber}><strong>#</strong> {currentIndex + 1}</span>
              </div>
              <div className={styles.footerRight}>
                <span className={styles.footerDate}>{formatDate(currentItem.date)}</span>
              </div>
            </div>
          </Link>
        )}

        <div className={styles.error}>{error || pageError}</div>
      </div>
    );
  }

  // Main content render
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
      </div>

      {prevItem && (
        <Link
          to={`/${prevItem.date}`}
          className={`${styles.sideNav} ${styles.leftNav} ${navVisible ? styles.visible : styles.hidden}`}
          aria-label={`Go to ${formatTitle(prevItem.title)}`}
        >
          ←
        </Link>
      )}

      {nextItem && (
        <Link
          to={`/${nextItem.date}`}
          className={`${styles.sideNav} ${styles.rightNav} ${navVisible ? styles.visible : styles.hidden}`}
          aria-label={`Go to ${formatTitle(nextItem.title)}`}
        >
          →
        </Link>
      )}

      {currentItem && (
        <Link
          to="/"
          className={`${styles.footerStrip} ${footerVisible ? styles.visible : styles.hidden}`}
          aria-label="Go back to homepage"
        >
          <div className={styles.footerContent}>
            <div className={styles.footerLeft}>
              <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
            </div>
            <div className={styles.footerCenter}>
              <span className={styles.footerNumber}><strong>#</strong> {currentIndex + 1}</span>
            </div>
            <div className={styles.footerRight}>
              <span className={styles.footerDate}>{formatDate(currentItem.date)}</span>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ClockPage;
