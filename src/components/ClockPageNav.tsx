import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClockPageNav.module.css'; // keep using the same styles

/**
 * @typedef {Object} ClockItem
 * @property {string} date
 * @property {string} title
 * @property {number | string} [clockNumber]
 */

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

const ClockPageNav = ({
  prevItem,
  nextItem,
  currentItem,
  formatTitle,
  formatDate,
}: ClockPageNavProps) => {
  const [visible, setVisible] = useState(true);
  // Using a ref for the timer to avoid unnecessary re-renders when setting the state
  const timerRef = useRef(null);

  const clearInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    timerRef.current = setTimeout(() => {
      setVisible(false); // Stay visible for 3 seconds of inactivity
    }, 3000); // Stay visible for 3 seconds of inactivity
  }, [clearInactivityTimer]);

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  const handleMouseLeave = useCallback(() => {
    startInactivityTimer();
  }, [startInactivityTimer]);

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
    startInactivityTimer();
  }, [startInactivityTimer]);

  const handleTouchCancel = useCallback(() => {
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
