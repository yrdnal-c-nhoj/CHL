import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import styles from './ClockPage.module.css';

const ClockPage = () => {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);
  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [navVisible, setNavVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(true);

  const formatTitle = (title) => {
    if (!title) return 'Home';
    return title.replace(/clock/i, '').trim() || 'Home';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [yy, mm, dd] = parts;
    const month = Number(mm);
    const day = Number(dd);
    const year = yy;
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (date && date.match(/^\d{2}-\d{2}-\d{2}$/)) {
      const item = items.find(i => i.date === date);
      if (item && item.path) {
        import(`./pages/${item.path}/Clock.jsx`)
          .then(module => {
            setClockComponent(() => module.default);
          })
          .catch(err => {
            setPageError(`Failed to load clock for ${date}: ${err.message}`);
          });

        import(`./pages/${item.path}/styles.css`).catch(() => {});
      } else {
        setPageError(`No path found for date ${date}.`);
      }
    } else {
      setPageError('Invalid date format. Use YY-MM-DD (e.g., 25-06-01).');
    }
  }, [date, items, loading]);

  useEffect(() => {
    const navFadeDelay = 300;
    const footerFadeDelay = 2000;

    let navTimer = setTimeout(() => setNavVisible(false), navFadeDelay);
    let footerTimer = setTimeout(() => setFooterVisible(false), footerFadeDelay);

    const handleInteraction = () => {
      setNavVisible(true);
      setFooterVisible(true);
      clearTimeout(navTimer);
      clearTimeout(footerTimer);
      navTimer = setTimeout(() => setNavVisible(false), navFadeDelay);
      footerTimer = setTimeout(() => setFooterVisible(false), footerFadeDelay);
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      clearTimeout(navTimer);
      clearTimeout(footerTimer);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const currentIndex = items.findIndex(item => item.date === date);
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  const currentItem = items[currentIndex];

  if (loading) return <div className={styles.loading}>Loading data...</div>;

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
            <div className={styles.footerLeft}>
              <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
            </div>
            <div className={styles.footerCenter}>
              <span className={styles.footerNumber}><strong>#</strong> {currentIndex + 1}</span>
            </div>
            <div className={styles.footerRight}>
              <span className={styles.footerDate}>{formatDate(currentItem.date)}</span>
            </div>
          </Link>
        )}
      </div>
    );
  }

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
          <div className={styles.footerLeft}>
            <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
          </div>
          <div className={styles.footerCenter}>
            <span className={styles.footerNumber}><strong>#</strong> {currentIndex + 1}</span>
          </div>
          <div className={styles.footerRight}>
            <span className={styles.footerDate}>{formatDate(currentItem.date)}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ClockPage;