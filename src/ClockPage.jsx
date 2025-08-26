import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import styles from './ClockPage.module.css';

// Preload all Clock.jsx modules under /pages/**/Clock.jsx
const clockModules = import.meta.glob('./pages/**/Clock.jsx');

const ClockPage = ({ date: propDate, sheetPath: propPath }) => {
  const { items, loading, error } = useContext(DataContext);
  const { date: routeDate } = useParams();

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Determine effective clock
  useEffect(() => {
    if (loading) return;

    let item = null;

    // 1. Try path from props (TodayPage)
    if (propPath) {
      item = items.find(i => i.path.replace(/^\/|\/$/g, '') === propPath.replace(/^\/|\/$/g, ''));
    }

    // 2. Try date from props or route
    if (!item) {
      const targetDate = propDate || routeDate;
      item = items.find(i => i.date === targetDate);
    }

    // 3. Fallback to most recent
    if (!item && items.length > 0) {
      item = items.reduce((latest, i) => (!latest || i.date > latest.date ? i : latest), null);
    }

    if (!item) {
      setPageError('No clock found for this date.');
      return;
    }

    // Build module key
    const key = `./pages/${item.path || item.date}/Clock.jsx`;

    if (clockModules[key]) {
      clockModules[key]()
        .then(mod => setClockComponent(() => mod.default))
        .catch(err => setPageError(`Failed to load clock: ${err.message}`));
    } else {
      console.warn('Available keys:', Object.keys(clockModules));
      setPageError(`No clock module found at path: ${key}`);
    }
  }, [propDate, propPath, routeDate, items, loading]);

  // Auto-hide footer
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

  // Auto-hide header
  useEffect(() => {
    setHeaderVisible(true);
    const headerTimer = setTimeout(() => setHeaderVisible(false), 1300);
    return () => clearTimeout(headerTimer);
  }, [propDate, routeDate]);

  // Prevent scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (loading) return <div className={styles.loading}>Loading clock...</div>;
  if (error || pageError) return <div className={styles.error}>{error || pageError}</div>;

  return (
    <div className={styles.container}>
      <Header visible={headerVisible} />
      <div className={styles.content}>
        {ClockComponent ? <ClockComponent /> : <div className={styles.loading}>Loading clock...</div>}
      </div>
      <div className={`${styles.footerStrip} ${footerVisible ? styles.visible : styles.hidden}`}>
        {/* Footer buttons can go here */}
      </div>
    </div>
  );
};

export default ClockPage;
