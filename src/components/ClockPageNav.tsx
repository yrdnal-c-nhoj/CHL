import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/ClockPageNav.module.css'; // keep using the same styles

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
  tags?: string[];
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
  const [isInHotZone, setIsInHotZone] = useState(false);
  const navigate = useNavigate();
  // Using a ref for the timer to avoid unnecessary re-renders when setting the state
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(0);

  // Initialize last activity time on mount
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    timerRef.current = setTimeout(() => {
      setVisible(false); // Hide after 1500ms of inactivity
    }, 1500); // Hide after 1500ms
  }, [clearInactivityTimer]);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setVisible(true);
    startInactivityTimer();
  }, [startInactivityTimer]);

  const handleMouseEnter = useCallback(() => {
    setIsInHotZone(true);
    resetActivity(); // Immediately restore navigation and restart timer
  }, [resetActivity]);

  const handleMouseLeave = useCallback(() => {
    setIsInHotZone(false);
    startInactivityTimer(); // Start timer when leaving to ensure fade behavior
  }, [startInactivityTimer]);

  const handleMouseMove = useCallback(() => {
    resetActivity(); // Any mouse movement resets timer and shows navigation
  }, [resetActivity]);

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
  }, [startInactivityTimer]);

  // Auto-hide nav after initial inactivity period on mount
  useEffect(() => {
    startInactivityTimer();
    return () => clearInactivityTimer();
  }, [startInactivityTimer, clearInactivityTimer]);

  // Global mouse movement listener to detect activity anywhere on page
  useEffect(() => {
    const handleGlobalMouseMove = () => {
      if (isInHotZone) {
        resetActivity();
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () =>
      document.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isInHotZone, resetActivity]);

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
          prevItem ? `Previous: ${formatTitle(prevItem.title)}` : 'Home'
        }
      >
        <span aria-hidden="true">⇽</span>
      </Link>

      <button
        className={styles.footerButton}
        onClick={() => navigate(-1)}
        type="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate(-1);
          }
        }}
        aria-label="Go back"
      >
        <div className={styles.footerCenter}>
          <div className={styles.footerTopRow}>
            <span className={styles.footerDate}>
              {formatDate(currentItem.date)
                .replace(/^(\w+)\s*/, '$1 ')
                .replace(/\s*'/g, " '")}
            </span>
            {currentItem.clockNumber !== undefined &&
              currentItem.clockNumber !== null && (
              <span className={styles.footerNumber}>
                #{currentItem.clockNumber}
              </span>
            )}
          </div>
          <span className={styles.footerTitle}>
            {formatTitle(currentItem.title)}
          </span>
          {currentItem.tags && currentItem.tags.length > 0 && (
            <div className={styles.footerTags}>
              {currentItem.tags.map((tag) => (
                <span key={tag} className={styles.tagItem}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>

      <Link
        to={nextItem ? `/${nextItem.date}` : '/'}
        className={styles.navButton}
        aria-label={nextItem ? `Next: ${formatTitle(nextItem.title)}` : 'Home'}
      >
        <span aria-hidden="true">⇾</span>
      </Link>
    </div>
  );
};

export default ClockPageNav;
