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
  const { items, loading } = useContext(DataContext);
  const navigate = useNavigate();

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [hideHeader, setHideHeader] = useState(false); // <-- state to fade out header

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Header fade-out after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHideHeader(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load everything at once (background, fonts, images, component)
  useEffect(() => {
    const loadEverything = async () => {
      try {
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

        const key = `./pages/${item.path}/Clock.jsx`;
        if (!clockModules[key]) {
          setPageError(`No clock found at path: ${key}`);
          return;
        }

        const mod = await clockModules[key]();
        const Component = mod.default;

        // Collect images to preload
        const images = Object.values(mod).filter(
          (v) =>
            typeof v === 'string' &&
            (v.endsWith('.jpg') || v.endsWith('.png') || v.endsWith('.webp') || v.endsWith('.gif'))
        );

        // Load all images before displaying anything
        await Promise.all(
          images.map(
            (src) =>
              new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = img.onerror = resolve;
              })
          )
        );

        // Optional: preload fonts (for no unstyled text)
        document.fonts.ready.then(() => {
          setClockComponent(() => Component);
          setIsReady(true);
        });
      } catch (err) {
        setPageError(`Failed to load clock: ${err.message}`);
      }
    };

    loadEverything();
  }, [date, items, loading, navigate]);

  // Black overlay while loading (no flicker, no partial load)
  if (!isReady && !pageError) {
    return (
      <div
        style={{
          backgroundColor: '#000',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333',
          fontSize: '1rem',
        }}
      >
        <div
          style={{
            width: '3px',
            height: '20px',
            backgroundColor: '#444',
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
  }

  // Ready: render everything at once
  const currentIndex = items.findIndex((i) => normalizeDate(i.date) === normalizeDate(date));
  const currentItem = items[currentIndex];
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return (
    <div className={styles.container}>
      {pageError ? (
        <div className={styles.error}>{pageError}</div>
      ) : (
        <>
          <Header
            visible={!hideHeader}
            className={`${styles.headerFade} ${hideHeader ? styles.fadeOut : ''}`}
          />

          <div className={styles.content}>
            {/* === FONT ISOLATION WRAPPER (only for clock) === */}
            <div
              style={{
                all: 'initial',
                fontFamily: 'system-ui, sans-serif',
                display: 'block',
                width: '100%',
                height: '100%',
              }}
            >
              <ClockComponent />
            </div>
          </div>

          <ClockPageNav
            prevItem={prevItem}
            nextItem={nextItem}
            currentItem={currentItem}
            formatTitle={(t) => t?.replace(/clock/i, '').trim() || 'Home'}
            formatDate={(d) => d.replace(/-/g, '.')}
          />
        </>
      )}

      {/* CSS for header fade */}
      <style>{`
        .${styles.headerFade} {
          opacity: 1;
          transition: opacity 1s ease-in-out;
        }
        .${styles.fadeOut} {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
