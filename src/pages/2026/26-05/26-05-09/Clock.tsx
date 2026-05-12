import React, { useMemo } from 'react';
import { useClockTime, formatTime, getFormattedDate } from '@/utils/clockUtils';
import styles from './Clock.module.css';

/**
 * May 9, 2026 - "Capture"
 * A minimalist white-themed clock using high-contrast typography.
 */
const CaptureClock: React.FC = () => {
  const time = useClockTime();
  
  const { hours, minutes, seconds } = useMemo(() => 
    formatTime(time, '12h'),
  [time]);

  const handleCapture = () => {
    window.print();
  };

  return (
    <div className={styles.container} onClick={handleCapture} style={{ cursor: 'crosshair' }}>
      <div className={styles.captureFrame}>
        <div className={styles.bracketTopLeft} />
        <div className={styles.bracketTopRight} />
        <div className={styles.bracketBottomLeft} />
        <div className={styles.bracketBottomRight} />
        
        <time dateTime={time.toISOString()} className={styles.timeWrapper}>
          <span className={styles.digit}>{hours}</span><span className={styles.separator}>:</span><span className={styles.digit}>{minutes}</span><span className={styles.seconds}>{seconds}</span>
        </time>
        
        <div className={styles.label}>{getFormattedDate(time, 'MMM DD \'YY').toUpperCase()}</div>
      </div>

      <div className={styles.captureHint}>
        Click to Capture
      </div>
    </div>
  );
};

export default CaptureClock;
