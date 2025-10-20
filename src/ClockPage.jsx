import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from './context/DataContext';
import Header from './components/Header';
import ClockPageNav from './components/ClockPageNav';
import styles from './ClockPage.module.css';

// Preload all Clock.jsx files under /pages/**/Clock.jsx using Vite's glob import
const clockModules = import.meta.glob('./pages/**/Clock.jsx');

const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-');

const ClockPage = () => {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // -------------------------------
  // Load Clock dynamically
  // -------------------------------
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

    // Dynamically import Clock component
    clockModules[key]()
      .then((mod) => {
        const Component = mod.default;

        // Preload all images inside the ClockComponent
        const tempContainer = document.createElement('div');
        tempContainer.style.display = 'none';
        document.body.appendChild(tempContainer);

        const instance = <Component />;
        const rendered = React.cloneElement(instance);

        // Render temporarily to find images
        const wrapper = document.createElement('div');
        tempContainer.appendChild(wrapper);

        // Create a hidden div to mount the component
        const root = document.createElement('div');
        wrapper.appendChild(root);

        // This is just to find all <img> sources in the JSX
        // Note: Since we can't fully render JSX outside React, we'll assume images are imported modules
        const images = Object.values(mod)
          .filter((v) => typeof v === 'string' && (v.endsWith('.jpg') || v.endsWith('.webp') || v.endsWith('.png')));

        if (images.length === 0) {
          setClockComponent(() => Component);
          setIsReady(true);
        } else {
          let loadedCount = 0;
          images.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = img.onerror = () => {
              loadedCount++;
              if (loadedCount === images.length) {
                setClockComponent(() => Component);
                setIsReady(true);
              }
            };
          });
        }

        // Cleanup temp container
        document.body.removeChild(tempContainer);
      })
      .catch((err) => {
        setPageError(`Failed to load clock: ${err.message}`);
      });
  }, [date, items, loading, navigate]);

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // -------------------------------
  // Full-screen loading overlay
  // -------------------------------
  const LoadingOverlay = () => (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        backgroundColor: '#000',
        zIndex: 9999,
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
          animation: 'pulse 1.5s ease-in-out infinite'
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

  // -------------------------------
  // Show nothing until ready
  // -------------------------------
  if (!isReady && !pageError) {
    return <LoadingOverlay />;
  }

  // -------------------------------
  // Show error if any
  // -------------------------------
  if (pageError || error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{pageError || error}</div>
      </div>
    );
  }

  // -------------------------------
  // Navigation items
  // -------------------------------
  const currentIndex = items.findIndex((i) => normalizeDate(i.date) === normalizeDate(date));
  const currentItem = items[currentIndex];
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // -------------------------------
  // Render page
  // -------------------------------
  return (
    <div className={styles.container}>
      <Header visible={true} />
      <div className={styles.content}>
        {ClockComponent && <ClockComponent />}
      </div>
      <ClockPageNav
        prevItem={prevItem}
        nextItem={nextItem}
        currentItem={currentItem}
        formatTitle={(t) => t?.replace(/clock/i, '').trim() || 'Home'}
        formatDate={(d) => d}
      />
    </div>
  );
};

export default ClockPage;
