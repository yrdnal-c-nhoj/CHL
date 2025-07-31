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
  const [yy, mm, dd] = parts;
  return `${Number(mm)}/${Number(dd)}/${yy}`;
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
    setClockComponent(null);

    import(`./pages/${item.path}/Clock.jsx`)
      .then(mod => setClockComponent(() => mod.default))
      .catch(err => setPageError(`Failed to load clock for ${date}: ${err.message}`));
  }, [date, items, loading]);

  useEffect(() => {
    if (pageError) {
      navigate('/');
    }
  }, [pageError, navigate]);

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
    // Ensure header is visible on initial render
    setHeaderVisible(true);
    const headerTimer = setTimeout(() => {
      setHeaderVisible(false);
    }, 2000);

    return () => clearTimeout(headerTimer);
  }, [date]); // Trigger on date change to reset header visibility on page navigation

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const currentIndex = items.findIndex(item => item.date === date);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  if (loading) {
    return <div className={styles.loading}>Loading data...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header visible={headerVisible} />
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
                <span className={styles.footerNumber}><strong>#</strong> {currentIndex + 1}</span>
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
        <div className={styles.error}>{error}</div>
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
              <span className={styles.footerNumber}><strong>#</strong> {currentIndex + 1}</span>
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