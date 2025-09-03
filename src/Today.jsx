import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import styles from './ClockPage.module.css';

// Preload all Clock.jsx files under /pages/**/Clock.jsx using Vite's glob import
const clockModules = import.meta.glob('./pages/**/Clock.jsx');

const formatTitle = (title) => title?.replace(/clock/i, '').trim() || 'Home';
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [yy, mm, dd] = parts.map(Number);
  return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31 ? `${mm}/${dd}/${yy}` : 'Invalid Date';
};
const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-');

const getTodayDate = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

const TodayClockPage = () => {
  const { items, loading, error } = useContext(DataContext);

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  // -------------------------------
  // Load today's clock
  // -------------------------------
  useEffect(() => {
    if (loading || !items || items.length === 0) return;

    const today = getTodayDate();
    let item = items.find((i) => normalizeDate(i.date) === normalizeDate(today));

    if (!item) {
      const sortedItems = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
      item = sortedItems[sortedItems.length - 1];
    }

    if (!item || !item.path) {
      setPageError(`Clock path missing for date: ${item?.date || 'N/A'}`);
      setClockComponent(null);
      return;
    }

    setPageError(null);
    setCurrentItem(item);
    setClockComponent(null);

    const key = `./pages/${item.path}/Clock.jsx`;
    if (clockModules[key]) {
      clockModules[key]()
        .then((mod) => setClockComponent(() => mod.default))
        .catch((err) => setPageError(`Failed to load clock for ${item.date}: ${err.message}`));
    } else {
      setPageError(`No clock found at path: ${key}`);
    }
  }, [items, loading]);

  // -------------------------------
  // Auto-hide footer after inactivity
  // -------------------------------
  useEffect(() => {
    const footerFadeMs = 3000; // slightly longer for better UX
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
    const headerTimer = setTimeout(() => setHeaderVisible(false), 1500); // slightly longer for visibility
    return () => clearTimeout(headerTimer);
  }, []);

  // -------------------------------
  // Prevent scrolling
  // -------------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // -------------------------------
  // Navigation
  // -------------------------------
  const currentIndex = currentItem
    ? items.findIndex((i) => normalizeDate(i.date) === normalizeDate(currentItem.date))
    : -1;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // -------------------------------
  // Loading & error states
  // -------------------------------
  if (loading) return <div className={styles.loading}>Loading data...</div>;
  if (error || pageError) {
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
  }

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

export default TodayClockPage;
