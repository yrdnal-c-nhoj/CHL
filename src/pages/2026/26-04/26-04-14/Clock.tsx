import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import bgVideo from '@/assets/images/2026/26-04/26-04-14/haumeas.mp4';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  return (
    <div className={styles.container}>
      <video
        className={styles.bgVideo}
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.clock}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.digit}>{seconds[0]}</span>
        <span className={styles.digit}>{seconds[1]}</span>
      </div>
    </div>
  );
};

export default Clock;
