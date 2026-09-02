import { memo, useEffect, useState, useRef } from 'react';
import { useClock } from '@/utils/hooks';
import clockDigitImage from '@/assets/images/26_images/26-01/26-01-23/eye.gif';
import clockBackground from '@/assets/images/26_images/26-01/26-01-23/eye.webp';
import styles from './Clock.module.css';

export const assets = [clockDigitImage, clockBackground];

interface CustomStyle extends React.CSSProperties {
  '--rotation'?: string;
}

const Clock =  () => {
  const time = useClock();
  const [bgReady, setBgReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const imgs = [clockDigitImage, clockBackground];
    const loadPromises = imgs.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });
    });
    Promise.all(loadPromises).then(() => {
      if (isMounted) setBgReady(true);
    });
    const timeout = setTimeout(() => {
      if (isMounted) setBgReady(true);
    }, 1200);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360;
  const hourDeg = ((hours % 12) / 12) * 360;
  const bgRotation = -(seconds / 60) * 360;

  return (
    <main className={styles.container} style={{ opacity: bgReady ? 1 : 0, visibility: bgReady ? 'visible' : 'hidden' }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.clockFace}>
        <div className={styles.bgLayer} style={{ backgroundImage: `url(${clockBackground})`, '--rotation': `${bgRotation}deg` } as CustomStyle} />

        {[...Array(12)].map((_, i) => {
          const rotation = (i + 1) * 30;
          return (
            <div key={i} className={styles.digitContainer} style={{ '--rotation': `${rotation}deg` } as CustomStyle}>
              <img src={clockDigitImage} alt={`digit-${i + 1}`} className={styles.digitImage} />
            </div>
          );
        })}

        <div className={`${styles.hand} ${styles.handHour}`} style={{ '--rotation': `${hourDeg}deg` } as CustomStyle} />
        <div className={`${styles.hand} ${styles.handMinute}`} style={{ '--rotation': `${minDeg}deg` } as CustomStyle} />
        <div className={`${styles.hand} ${styles.handSecond}`} style={{ '--rotation': `${secDeg}deg` } as CustomStyle} />

        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_01_23';
export default MemoizedClock;
