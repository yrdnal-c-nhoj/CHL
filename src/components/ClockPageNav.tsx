import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/ClockPageNav.module.css';

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
  _formatDate: (date: string | null | undefined) => string;
}

const ClockPageNav: React.FC<ClockPageNavProps> = ({
  prevItem,
  nextItem,
  currentItem,
  formatTitle,
  _formatDate,
}) => {
  // _formatDate is part of the interface but not used in this component
  void _formatDate;
  const [visible, setVisible] = useState(true);
  const [isInHotZone, setIsInHotZone] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(0);

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
      setVisible(false);
    }, 1500);
  }, [clearInactivityTimer]);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setVisible(true);
    startInactivityTimer();
  }, [startInactivityTimer]);

  const handleMouseEnter = useCallback(() => {
    setIsInHotZone(true);
    resetActivity();
  }, [resetActivity]);

  const handleMouseLeave = useCallback(() => {
    setIsInHotZone(false);
    startInactivityTimer();
  }, [startInactivityTimer]);

  const handleMouseMove = useCallback(() => {
    resetActivity();
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

  useEffect(() => {
    startInactivityTimer();
    return () => clearInactivityTimer();
  }, [startInactivityTimer, clearInactivityTimer]);

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

  const sortedTags = [...(currentItem.tags ?? [])].sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      data-nav
      tabIndex={0}
      role="navigation"
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
              {(() => {
                if (!currentItem.date) return null;
                const [yy, mm, dd] = currentItem.date.split('-');
                if (!yy || !mm || !dd) return null;
                const months = [
                  'JAN',
                  'FEB',
                  'MAR',
                  'APR',
                  'MAY',
                  'JUN',
                  'JUL',
                  'AUG',
                  'SEP',
                  'OCT',
                  'NOV',
                  'DEC',
                ];
                const monthName = months[parseInt(mm, 10) - 1] || '???';
                return `${dd} ${monthName} '${yy}`;
              })()}
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
          {sortedTags.length > 0 && (
            <div className={styles.footerTags}>
              {sortedTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tag/${tag}`}
                  className={styles.tagItem}
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag}
                </Link>
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
