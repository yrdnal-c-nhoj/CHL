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
        // Keep navigation visible and functional
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '60px',
        zIndex: 99999,
        opacity: 1,
        pointerEvents: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0',
        boxSizing: 'border-box',
        // Restore original background styling
        background: 'rgba(3, 2, 2, 0.7)',
        border: '0.5px solid rgba(98, 103, 112, 0.8)'
      }}
    >
      <button
        onClick={() => handleNavClick(prevItem ? `/${prevItem.date}` : '/')}
        className={styles.navButton}
        style={{
          // Use original button styling
          background: 'rgba(3, 2, 2, 0.7)',
          border: '0.5px solid rgba(98, 103, 112, 0.8)',
          color: '#dadbd7',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100px',
          fontSize: '2.2rem',
          cursor: 'pointer',
          textDecoration: 'none',
          boxSizing: 'border-box',
          fontFamily: 'Manrope, sans-serif',
          transition: 'background 0.4s ease, color 0.4s ease, opacity 0.4s ease',
          minHeight: '50px'
        }}
      >
        <span>⇽</span>
      </button>

      <button
        onClick={() => handleNavClick('/')}
        className={styles.footerButton}
        style={{
          // Use original footer button styling
          background: 'rgba(3, 2, 2, 0.7)',
          border: '0.5px solid rgba(98, 103, 112, 0.8)',
          color: '#dadbd7',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          cursor: 'pointer',
          textDecoration: 'none',
          boxSizing: 'border-box',
          fontFamily: 'Manrope, sans-serif',
          transition: 'background 0.4s ease, color 0.4s ease, opacity 0.4s ease',
          minHeight: '50px'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <span style={{ fontSize: '1rem', letterSpacing: '-0.05rem' }}>
            {formatDate(currentItem.date)}
          </span>
          <span style={{ fontSize: '1rem', letterSpacing: '0.02rem' }}>
            {formatTitle(currentItem.title)}
          </span>
          <span style={{ fontSize: '1rem', letterSpacing: '-0.05rem' }}>
            #{currentItem.clockNumber}
          </span>
        </div>
      </button>

      <button
        onClick={() => handleNavClick(nextItem ? `/${nextItem.date}` : '/')}
        className={styles.navButton}
        style={{
          // Use original button styling
          background: 'rgba(3, 2, 2, 0.7)',
          border: '0.5px solid rgba(98, 103, 112, 0.8)',
          color: '#dadbd7',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100px',
          fontSize: '2.2rem',
          cursor: 'pointer',
          textDecoration: 'none',
          boxSizing: 'border-box',
          fontFamily: 'Manrope, sans-serif',
          transition: 'background 0.4s ease, color 0.4s ease, opacity 0.4s ease',
          minHeight: '50px'
        }}
      >
        <span>⇾</span>
      </button>
    </div>
  );
};

export default ClockPageNav;
