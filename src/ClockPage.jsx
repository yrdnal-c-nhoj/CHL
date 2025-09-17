import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);
const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-');

const ClockPage = () => {
  const { date } = useParams();
  const { items, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [footerVisible, setFooterVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // -------------------------------
  // Load Clock component dynamically
  // -------------------------------
  useEffect(() => {
    if (loading) return;
    if (!items || items.length === 0) {
      setPageError('No clocks available.');
      setClockComponent(null);
      setIsContentReady(false);
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
      setIsContentReady(false);
      return;
    }

    setPageError(null);
    setClockComponent(null);

    const key = `./pages/${item.path}/Clock.jsx`;

    if (clockModules[key]) {
      clockModules[key]()
        .then((mod) => {
          setClockComponent(() => mod.default);
          setIsContentReady(true);
        })
        .catch((err) => {
          setPageError(`Failed to load clock for ${item.date}: ${err.message}`);
          setIsContentReady(false);
        });
    } else {
      setPageError(`No clock found at path: ${key}`);
      setIsContentReady(false);
    }
  }, [date, items, loading, navigate]);

  // -------------------------------
  // Wait for all fonts to be ready
  // -------------------------------
  useEffect(() => {
    const loadFonts = async () => {
      if ('fonts' in document) {
        try {
          // Wait for all fonts to be ready
          await document.fonts.ready;
          console.log('All fonts loaded successfully');
          setFontsLoaded(true);
        } catch (err) {
          console.error('Error loading fonts:', err);
          // Still show content if fonts fail to load
          setFontsLoaded(true);
        }
      } else {
        // Fallback for browsers without Font Loading API
        console.warn('Font Loading API not supported');
        setFontsLoaded(true);
      }
    };

    // Add a small delay to ensure fonts are properly loaded
    const fontTimer = setTimeout(loadFonts, 100);
    
    // Fallback: Show content after 8 seconds if fonts fail to load
    const fallbackTimer = setTimeout(() => {
      console.warn('Fallback: Fonts did not load within 8 seconds');
      setFontsLoaded(true);
    }, 8000);

    return () => {
      clearTimeout(fontTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // -------------------------------
  // Wait for images to load
  // -------------------------------
  useEffect(() => {
    const checkImages = () => {
      const images = document.querySelectorAll('img');
      if (images.length === 0) {
        setImagesLoaded(true);
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };

      const onImageError = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };

      images.forEach(img => {
        if (img.complete) {
          onImageLoad();
        } else {
          img.addEventListener('load', onImageLoad);
          img.addEventListener('error', onImageError);
        }
      });

      // Fallback timer for images
      setTimeout(() => {
        if (!imagesLoaded) {
          console.warn('Fallback: Images did not load within 5 seconds');
          setImagesLoaded(true);
        }
      }, 5000);
    };

    // Check images after a short delay to ensure DOM is ready
    const imageTimer = setTimeout(checkImages, 200);
    return () => clearTimeout(imageTimer);
  }, [ClockComponent, imagesLoaded]);

  // -------------------------------
  // Show content only when everything is ready
  // -------------------------------
  useEffect(() => {
    if (isContentReady && fontsLoaded && imagesLoaded && !loading && !error && !pageError) {
      // Add a small delay for smoother transition
      const showTimer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(showTimer);
    }
  }, [isContentReady, fontsLoaded, imagesLoaded, loading, error, pageError]);

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
  // Auto-hide header
  // -------------------------------
  useEffect(() => {
    if (showContent) {
      setHeaderVisible(true);
      const headerTimer = setTimeout(() => setHeaderVisible(false), 1300);
      return () => clearTimeout(headerTimer);
    }
  }, [showContent]);

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
  // Loading overlay
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
        opacity: showContent ? 0 : 1,
        visibility: showContent ? 'hidden' : 'visible',
        transition: 'opacity 0.8s ease-out, visibility 0.8s ease-out'
      }}
    >
      <div style={{
        width: '2px', 
        height: '20px',
        backgroundColor: '#333',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
  );

  // -------------------------------
  // Handle errors
  // -------------------------------
  if (error || pageError) {
    return (
      <>
        <LoadingOverlay />
        {showContent && (
          <div className={styles.container}>
            <Header visible={headerVisible} />
            <div className={styles.content}>
              <div className={styles.sheet}>
                <div className={styles.error}>{error || pageError}</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (!currentItem && !loading) {
    return (
      <>
        <LoadingOverlay />
        {showContent && (
          <div className={styles.container}>
            <Header visible={headerVisible} />
            <div className={styles.content}>
              <div className={styles.sheet}>
                <div className={styles.error}>No valid clock found.</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <>
      <LoadingOverlay />
      {/* Only render content when everything is fully loaded */}
      {showContent && (
        <div 
          className={styles.container} 
          style={{ 
            opacity: 1,
            transition: 'opacity 0.8s ease-in'
          }}
        >
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
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ClockPage;