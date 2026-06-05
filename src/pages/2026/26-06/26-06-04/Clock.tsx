import React, { useMemo } from 'react';

import animalsVideo from '@/assets/images/26_images/26-06/26-06-04/north.mp4';
import { useClockTime } from '@/utils/hooks/useClockTime';

import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hours, minutes, ampm } = useMemo(() => {
    const h24 = time.getHours();
    const h12 = h24 % 12 || 12;
    const ampmStr = h24 >= 12 ? 'PM' : 'AM';
    const h = formatTime(h12);
    const m = formatTime(time.getMinutes());
    return { hours: h, minutes: m, ampm: ampmStr };
  }, [time]);

  return (
    <div className={styles.container}>
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        src={animalsVideo}
      />
      <time dateTime={time.toISOString()} className={styles.clock}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={`${styles.digit} ${styles.ampm}`}>{ampm[0]}</span>
        <span className={`${styles.digit} ${styles.ampm}`}>{ampm[1]}</span>
      </time>
    </div>
  );
};

export default Clock;
