import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClockPageNav.module.css'; // keep using the same styles

const ClockPageNav = ({ prevItem, nextItem, currentItem, formatTitle, formatDate }) => {
  const [visible, setVisible] = useState(true);
  const [footerTimer, setFooterTimer] = useState(null);

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
    if (footerTimer) {
      clearTimeout(footerTimer);
      setFooterTimer(null);
    }
  }, [footerTimer]);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  // Show footer initially
  useEffect(() => {
    setVisible(true);
    return () => {
      if (footerTimer) {
        clearTimeout(footerTimer);
      }
    };
  }, [footerTimer]);

  if (!currentItem) return null;

  return (
    <div 
      className={`${styles.footerStrip} ${visible ? styles.visible : styles.hidden}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
