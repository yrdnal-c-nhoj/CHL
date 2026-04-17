import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClockPageNav.module.css';

interface NavItem {
  date: string;
  title: string;
  clockNumber?: number | string;
}

interface ClockPageNavProps {
  prevItem: NavItem | null;
  nextItem: NavItem | null;
  currentItem: NavItem;
  formatTitle: (title: string | null | undefined) => string;
  formatDate: (date: string | null | undefined) => string;
}

const ClockPageNav: React.FC<ClockPageNavProps> = ({
  prevItem,
  nextItem,
  currentItem,
  formatTitle,
  formatDate,
}) => {
  const [visible, setVisible] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

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
    }, 3000); 
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

  const handleTouchMove = useCallback(() => {
    setVisible(true);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  const handleTouchEnd = useCallback(() => {
    // Start inactivity timer instead of immediately hiding (matches mouse behavior)
    startInactivityTimer();
  }, [startInactivityTimer]);

  const handleTouchCancel = useCallback(() => {
    startInactivityTimer();
  }, [startInactivityTimer]);

  useEffect(() => {
    setVisible(true);
    startInactivityTimer();

    return () => {
      clearInactivityTimer();
    };
  }, [startInactivityTimer, clearInactivityTimer]);

  if (!currentItem) return null;

  return (
    <div
      className={`${styles.footerStrip} ${visible ? styles.visible : styles.hidden}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <Link
        to={prevItem ? `/${prevItem.date}` : '/'}
        className={styles.navButton}
        aria-label={
          prevItem
            ? `Go to previous clock: ${formatTitle(prevItem.title)}`
            : 'Go back to homepage'
        }
      >
        <span aria-hidden="true">⇽</span>
        <span className={styles.screenReaderText}>
          {prevItem
            ? `Previous: ${formatTitle(prevItem.title)}`
            : 'Go back to homepage'}
        </span>
      </Link>

      <Link
        to="/"
        className={styles.footerButton}
        aria-label="Go back to homepage"
      >
        <div className={styles.footerCenter}>
          <span className={styles.footerDate}>
            {formatDate(currentItem.date)}
          </span>
          <span className={styles.footerTitle}>
            {formatTitle(currentItem.title)}
          </span>
          <span className={styles.footerNumber}>
            #{currentItem.clockNumber}
          </span>
        </div>
        <span className={styles.screenReaderText}>Go back to homepage</span>
      </Link>

      <Link
        to={nextItem ? `/${nextItem.date}` : '/'}
        className={styles.navButton}
        aria-label={
          nextItem
            ? `Go to next clock: ${formatTitle(nextItem.title)}`
            : 'Go back to homepage'
        }
      >
        <span aria-hidden="true">⇾</span>
        <span className={styles.screenReaderText}>
          {nextItem
            ? `Next: ${formatTitle(nextItem.title)}`
            : 'Go back to homepage'}
        </span>
      </Link>
    </div>
  );
};

export default ClockPageNav;