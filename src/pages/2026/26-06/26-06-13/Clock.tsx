import React, { useMemo } from 'react';

import animalsVideo from '@/assets/images/26_images/26-06/26-06-13/blacksmith.mp4';
import fireVideo from '@/assets/images/26_images/26-06/26-06-13/fire.mp4';
import { useSecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const time = useSecondClock();

  const { hours, minutes } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    return { hours: h, minutes: m };
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
      <video
        className={styles.fireVideo}
        autoPlay
        loop
        muted
        playsInline
        src={fireVideo}
      />
      <time dateTime={time.toISOString()} className={styles.clock}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
      </time>
    </div>
  );
};

export default Clock;
