import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useState } from 'react';

import nefertitiImage from '@/assets/images/26_images/26-07/26-07-23/nefertiti.webp';
import styles from './Clock.module.css';

export const assets = [nefertitiImage];

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const AnalogClock: React.FC = () => {
  const time = useMillisecondClock();
  const isMobile = useIsMobile();

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30;

  return (
    <main
      className={styles.container}
      style={{
        backgroundImage: `url(${nefertitiImage})`,
        paddingTop: isMobile ? '1vh' : '1vh',
      }}
    >
      <div className={styles.clockFace}>
        <div className={`${styles.hand} ${styles.hourHand}`} style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
        <div className={`${styles.hand} ${styles.minuteHand}`} style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
        <div className={`${styles.hand} ${styles.secondHand}`} style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
        <div className={styles.centerDot} />
      </div>
      <time dateTime={time.toISOString()} aria-label={time.toLocaleTimeString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

export default AnalogClock;