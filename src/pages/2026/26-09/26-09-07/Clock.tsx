import { useClock } from '@/utils/hooks';
import launchVideo from '@/assets/images/26_images/26-09/26-09-07/launch.webm';
import { useState, useEffect, useRef } from 'react';
import styles from './Clock.module.css';

export const assets = [launchVideo];

const Clock_26_09_07 = () => {
  const time = useClock();
  const [fallingIndex, setFallingIndex] = useState<number | null>(null);
  const hasFallenRef = useRef(false);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const allDigits = [
    ...hours.split(''),
    ...minutes.split(''),
    ...seconds.split(''),
  ];

  useEffect(() => {
    if (hasFallenRef.current) return;
    hasFallenRef.current = true;

    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allDigits.length);
      setFallingIndex(randomIndex);
    }, 2000);

    return () => clearTimeout(timer);
  }, [allDigits.length]);

  const renderDigits = (digits: string[], offset: number) =>
    digits.map((d, i) => {
      const globalIndex = offset + i;
      const isFalling = fallingIndex === globalIndex;
      return (
        <span
          key={`${offset}-${i}`}
          className={`${styles.digitBox} ${isFalling ? styles.falling : ''}`}
        >
          {d}
        </span>
      );
    });

  const fullTimeString = `${hours}:${minutes}:${seconds}`;

  return (
    <main className={styles.container}>
      <video
        src={launchVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clock}>
        <div className={styles.timeGroup}>
          {renderDigits(hours.split(''), 0)}
        </div>
        <span className={styles.colon}>:</span>
        <div className={styles.timeGroup}>
          {renderDigits(minutes.split(''), 2)}
        </div>
        <span className={styles.colon}>:</span>
        <div className={styles.timeGroup}>
          {renderDigits(seconds.split(''), 4)}
        </div>
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {fullTimeString}
      </time>
    </main>
  );
};

Clock_26_09_07.displayName = 'Clock_26_09_07';

export default Clock_26_09_07;
