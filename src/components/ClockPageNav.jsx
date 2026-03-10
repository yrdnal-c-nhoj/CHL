import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ClockPageNav.module.css'; // keep using the same styles

const ClockPageNav = ({ prevItem, nextItem, currentItem, formatTitle, formatDate }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                           window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
  }, [inactivityTimer]);

  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1000); // 1 second
    setInactivityTimer(timer);
  }, [clearInactivityTimer]);

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  const handleMouseMove = useCallback(() => {
    setVisible(true);
    startInactivityTimer();
  }, [startInactivityTimer]);

  const handleNavClick = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleTouchStart = useCallback(() => {
    setVisible(true);
    clearInactivityTimer();
    // Don't hide immediately on touch end for mobile
  }, [clearInactivityTimer]);

  const handleTouchEnd = useCallback((e) => {
    // On mobile, allow fading after a longer delay
    if (isMobile) {
      e.preventDefault();
      clearInactivityTimer();
      // Start timer to hide after 3 seconds on mobile
      setTimeout(() => {
        setVisible(false);
      }, 3000);
      return;
    }
    // Prevent immediate hiding to allow link clicks
    e.preventDefault();
    clearInactivityTimer();
    // Start timer to hide after a delay
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }, [clearInactivityTimer, isMobile]);

  const handleTouchMove = useCallback(() => {
    setVisible(true);
    startInactivityTimer();
  }, [startInactivityTimer]);

  // Show footer initially and start inactivity timer
  useEffect(() => {
    setVisible(true);
    startInactivityTimer();
    
    return () => {
      clearInactivityTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentItem) return null;

  return (
    <div 
      className={`${styles.footerStrip} ${visible ? styles.visible : styles.hidden}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      style={{
        // Mobile-specific overrides to ensure visibility
        ...(isMobile && {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: 'none',
          width: '100%',
          zIndex: 10000,
          opacity: visible ? 0.9 : 0,
          pointerEvents: 'auto'
        })
      }}
    >
      <button
        onClick={() => handleNavClick(prevItem ? `/${prevItem.date}` : '/')}
        className={styles.navButton}
        aria-label={prevItem ? `Go to previous clock: ${formatTitle(prevItem.title)}` : 'Go back to homepage'}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer'
        }}
      >
        <span aria-hidden="true">⇽</span>
        <span className={styles.screenReaderText}>
          {prevItem ? `Previous: ${formatTitle(prevItem.title)}` : 'Go back to homepage'}
        </span>
      </button>

      <button
        onClick={() => handleNavClick('/')}
        className={styles.footerButton}
        aria-label="Go back to homepage"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer'
        }}
      >
        <div className={styles.footerCenter}>
          <span className={styles.footerDate}>{formatDate(currentItem.date)}</span>
          <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
          <span className={styles.footerNumber}>#{currentItem.clockNumber}</span>
        </div>
        <span className={styles.screenReaderText}>
          Go back to homepage
        </span>
      </button>

      <button
        onClick={() => handleNavClick(nextItem ? `/${nextItem.date}` : '/')}
        className={styles.navButton}
        aria-label={nextItem ? `Go to next clock: ${formatTitle(nextItem.title)}` : 'Go back to homepage'}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer'
        }}
      >
        <span aria-hidden="true">⇾</span>
        <span className={styles.screenReaderText}>
          {nextItem ? `Next: ${formatTitle(nextItem.title)}` : 'Go back to homepage'}
        </span>
      </button>
    </div>
  );
};

export default ClockPageNav;
