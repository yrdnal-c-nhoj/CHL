import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import zoomVideo from '@/assets/images/26_images/26-07/26-07-22/zoom.mp4';

import styles from './Clock.module.css';

// Export assets for the preloading pipeline
export const assets = [zoomVideo];

// =========================
// UTILITY FUNCTIONS
// =========================
const formatDigits = (num: number): string => num.toString().padStart(2, '0');

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// =========================
// MAIN COMPONENT
// =========================
const ZoomClock: React.FC = () => {
  const time = useSecondClock();

  const { hours, minutes, seconds, isoTime, dateStr } = useMemo(() => {
    const h = formatDigits(time.getHours());
    const m = formatDigits(time.getMinutes());
    const s = formatDigits(time.getSeconds());
    const dayName = DAYS[time.getDay()];
    const monthName = MONTHS[time.getMonth()];
    const dayNum = time.getDate();
    const year = time.getFullYear();
    return {
      hours: h,
      minutes: m,
      seconds: s,
      isoTime: time.toISOString(),
      dateStr: `${dayName}, ${monthName} ${dayNum}, ${year}`,
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <video
        className={styles.videoBackground}
        src={zoomVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay} />

      <time className={styles.timeDisplay} dateTime={isoTime}>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{hours[0]}</span>
          <span className={styles.digit}>{hours[1]}</span>
        </span>
        <span className={styles.separator}>:</span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{minutes[0]}</span>
          <span className={styles.digit}>{minutes[1]}</span>
        </span>
        <span className={styles.separator}>:</span>
        <span className={styles.digitGroup}>
          <span className={styles.digit}>{seconds[0]}</span>
          <span className={styles.digit}>{seconds[1]}</span>
        </span>
      </time>

      <span className={styles.dateDisplay} aria-hidden="true">
        {dateStr}
      </span>
    </div>
  );
};

export default ZoomClock;

