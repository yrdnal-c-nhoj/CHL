import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClockPageNav.module.css'; // keep using the same styles

const ClockPageNav = ({ prevItem, nextItem, currentItem, formatTitle, formatDate }) => {
  const [visible, setVisible] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState(null);

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

  const handleTouchStart = useCallback(() => {
    setVisible(true);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  const handleTouchEnd = useCallback(() => {
    setVisible(false);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

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
    >
      <Link
        to={prevItem ? `/${prevItem.date}` : '/'}
        className={styles.navButton}
        aria-label={prevItem ? `Go to previous clock: ${formatTitle(prevItem.title)}` : 'Go back to homepage'}
      >
        <span aria-hidden="true">⇽</span>
        <span className={styles.screenReaderText}>
          {prevItem ? `Previous: ${formatTitle(prevItem.title)}` : 'Go back to homepage'}
        </span>
      </Link>

      <Link
        to='/'
        className={styles.footerButton}
        aria-label="Go back to homepage"
      >
        <div className={styles.footerCenter}>
          <span className={styles.footerDate}>{formatDate(currentItem.date)}</span>
          <span className={styles.footerTitle}>{formatTitle(currentItem.title)}</span>
          <span className={styles.footerNumber}>#{currentItem.clockNumber}</span>
        </div>
        <span className={styles.screenReaderText}>
          Go back to homepage
        </span>
      </Link>

      <Link
        to={nextItem ? `/${nextItem.date}` : '/'}
        className={styles.navButton}
        aria-label={nextItem ? `Go to next clock: ${formatTitle(nextItem.title)}` : 'Go back to homepage'}
      >
        <span aria-hidden="true">⇾</span>
        <span className={styles.screenReaderText}>
          {nextItem ? `Next: ${formatTitle(nextItem.title)}` : 'Go back to homepage'}
        </span>
      </Link>
    </div>
  );
};

export default ClockPageNav;
