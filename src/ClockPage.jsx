import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import styles from './ClockPage.module.css';

// Helpers
const formatTitle = (title) => {
  if (!title) return 'Home';
  return title.replace(/clock/i, '').trim() || 'Home';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return 'Invalid Date';
  return `${mm}/${dd}/${yy}`;
};

const isValidDateFormat = (date) => {
  const regex = /^\d{2}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  const [yy, mm, dd] = date.split('-').map(Number);
  return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31;
};

const ClockPage = () => {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [navVisible, setNavVisible] = useState(true);
  const [navHasFaded, setNavHasFaded] = useState(false);
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!date || !isValidDateFormat(date)) {
      setPageError('Invalid date format. Use YY-MM-DD (e.g., 25-06-01).');
      return;
    }

    const item = items.find((i) => i?.date === date);

    if (!item || !item.path) {
      setPageError(`No clock found for date ${date}.`);
      return;
    }

    setPageError(null);
    setClockComponent(null);

    import(`./pages/${item.path}/Clock.jsx`)
      .then((mod) => setClockComponent(() => mod.default))
      .catch((err) => setPageError(`Failed to load clock for ${date}: ${err.message}`));
  }, [date, items, loading]);

  useEffect(() => {
    const navFadeMs = 300;
    const footerFadeMs = 2000;
    let navTimer, footerTimer;

    const resetTimers = () => {
      if (!navHasFaded) {
        setNavVisible(true);
        clearTimeout(navTimer);
        navTimer = setTimeout(() => {
          setNavVisible(false);
          setNavHasFaded(true);
        }, navFadeMs);
      }

      setFooterVisible(true);
      clearTimeout(footerTimer);
      footerTimer = setTimeout(() => setFooterVisible(false), footerFadeMs);
    };

    resetTimers();
    window.addEventListener('mousemove', resetTimers);
    window.addEventListener('touchstart', resetTimers);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(footerTimer);
      window.removeEventListener('mousemove', resetTimers);
      window.removeEventListener('touchstart', resetTimers);
    };
  }, [navHasFaded]);

  useEffect(() => {
    setHeaderVisible(true);
    const headerTimer = setTimeout(() => setHeaderVisible(false), 2000);
    return () => clearTimeout(headerTimer);
  }, [date]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const currentIndex = items.findIndex((item) => item?.date === date);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  if (loading) {
    return <div className={styles.loading}>Loading data...</div>;
  }

  if (error || pageError) {
    return (
      <div className={styles.container}>
        <Header visible={headerVisible} />
        <div className={styles.content}>
          <div className={styles.error}>{error || pageError}</div>
        </div>
        <Link
          to="/"
          className={`${styles.footerStrip} ${footerVisible ? styles.visible : styles.hidden}`}
          aria-label="Go back to homepage"
        >
          <div className={styles.footerContent}>
            <div className={styles.footerLeft}>
              <span className={styles.footerNumber}>
                <strong>#</strong> N/A
              </span>
            </div>
            <div className={styles.footerCenter}>
              <span className={styles.footerTitle}>Home</span>
            </div>
            <div className={styles.footerRight}>
              <span className={styles.footerDate}>N/A</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header visible={headerVisible} />
      <div className={styles.content}>
        {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
      </div>

      {prevItem && (
        <Link
          to={`/${prevItem.date}`}
          className={`${styles.sideNav} ${styles.leftNav} ${navVisible ? styles.visible : styles.hidden}`}
          aria-label={`Go to previous clock: ${formatTitle(prevItem.title)}`}
        >
          <span aria-hidden="true">←</span>
          <span className={styles.screenReaderText}>Previous: {formatTitle(prevItem.title)}</span>
        </Link>
      )}

      {nextItem && (
        <Link
          to={`/${nextItem.date}`}
          className={`${styles.sideNav} ${styles.rightNav} ${navVisible ? styles.visible : styles.hidden}`}
          aria-label={`Go to next clock: ${formatTitle(nextItem.title)}`}
        >
          <span aria-hidden="true">→</span>
          <span className={styles.screenReaderText}>Next: {formatTitle(nextItem.title)}</span>
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
              <span className={styles.footerNumber}>
                <strong>#</strong> {currentIndex + 1}
              </span>
            </div>
            <div className={styles.footerCenter}>
              <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
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