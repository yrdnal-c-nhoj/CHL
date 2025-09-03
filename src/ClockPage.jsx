import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav'; // Import the new navigation component
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
const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-');

const ClockPage = () => {
  const { date } = useParams(); // YY-MM-DD
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

    if (!isValidDateFormat(date)) {
      navigate('/', { replace: true });
      return;
    }

    const item = items.find((i) => normalizeDate(i.date) === normalizeDate(date));
    if (!item) {
      navigate('/', { replace: true });
      return;
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
    currentIndex = items.findIndex((i) => normalizeDate(i.date) === normalizeDate(date));
    currentItem = currentIndex >= 0 ? items[currentIndex] : null;
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
      
<ClockPageNav
  prevItem={prevItem}
  nextItem={nextItem}
  currentItem={currentItem}
  formatTitle={formatTitle}
  formatDate={formatDate}
/>
    </div>
  );
};

export default ClockPage;