import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import styles from './ClockPage.module.css';

// Preload all Clock.jsx files under /pages/**/Clock.jsx using Vite's glob import
const clockModules = import.meta.glob('./pages/**/Clock.jsx');

const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-');

export default function ClockPage() {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [fadeHeader, setFadeHeader] = useState(false);

  // --------------------------------
  // Header fade timing — always runs first
  // --------------------------------
  useEffect(() => {
    setFadeHeader(false); // show immediately
    const timer = setTimeout(() => setFadeHeader(true), 2000); // fade out after 2s
    return () => clearTimeout(timer);
  }, [date]); // runs on every new page

  // --------------------------------
  // Load Clock dynamically (happens behind header)
  // --------------------------------
  useEffect(() => {
    if (loading) return;

    if (!items || items.length === 0) {
      setPageError('No clock is available.');
      return;
    }

    if (!/^\d{2}-\d{2}-\d{2}$/.test(date)) {
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
      return;
    }

    const key = `./pages/${item.path}/Clock.jsx`;
    if (!clockModules[key]) {
      setPageError(`No clock found at path: ${key}`);
      return;
    }

    clockModules[key]()
      .then((mod) => {
        const Component = mod.default;
        const images = Object.values(mod).filter(
          (v) =>
            typeof v === 'string' &&
            (v.endsWith('.jpg') || v.endsWith('.png') || v.endsWith('.webp'))
        );

        if (images.length === 0) {
          setClockComponent(() => Component);
          setIsReady(true);
        } else {
          let loaded = 0;
          images.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = img.onerror = () => {
              loaded++;
              if (loaded === images.length) {
                setClockComponent(() => Component);
                setIsReady(true);
              }
            };
          });
        }
      })
      .catch((err) => setPageError(`Failed to load clock: ${err.message}`));
  }, [date, items, loading, navigate]);

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // --------------------------------
  // Loading overlay
  // --------------------------------
  const LoadingOverlay = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 10, // below header
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '3px',
          height: '20px',
          backgroundColor: '#333',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );

  // --------------------------------
  // Render
  // --------------------------------
  const currentIndex = items.findIndex((i) => normalizeDate(i.date) === normalizeDate(date));
  const currentItem = items[currentIndex];
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return (
    <div className={styles.container}>
      {/* 👇 Header always appears first */}
      <div
        style={{
          opacity: fadeHeader ? 0 : 1,
          transition: 'opacity 2s ease-out',
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100, // ensures it's on top
        }}
      >
        <Header visible={true} />
      </div>

      {/* 👇 Clock + loading content */}
      <div className={styles.content}>
        {!isReady && !pageError && <LoadingOverlay />}
        {pageError && <div className={styles.error}>{pageError}</div>}
        {isReady && ClockComponent && <ClockComponent />}
      </div>

      {isReady && (
        <ClockPageNav
          prevItem={prevItem}
          nextItem={nextItem}
          currentItem={currentItem}
          formatTitle={(t) => t?.replace(/clock/i, '').trim() || 'Home'}
          formatDate={(d) => d}
        />
      )}
    </div>
  );
}
