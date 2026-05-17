import React, { useMemo } from 'react';
import styles from './Clock.module.css';
import { useClockTime } from '@/utils/hooks';

// Dynamically find the background image in the corresponding asset folder
// Using a relative path for better reliability in Vite glob patterns
const imageModules = import.meta.glob('../../../../assets/images/**/26-05-14/*.{webp,jpg,jpeg,png,gif}', {
  eager: true,
  import: 'default',
});

const backgroundImage = (Object.values(imageModules).find(val => typeof val === 'string') as string) || '';

export const assets = backgroundImage ? [backgroundImage] : [];

const AnalogClock: React.FC = () => {
  const time = useClockTime();

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    return {
      secondDeg: s * 6,
      minuteDeg: m * 6 + s * 0.1,
      hourDeg: (h % 12) * 30 + m * 0.5,
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className={styles.backgroundImage}
          aria-hidden="true"
        />
      )}

      <div className={styles.analogClock}>
        <time className={styles.face} dateTime={isoTime}>
          {/* 12 hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={styles.tick}
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}

          {/* Hands */}
          <div className={styles.hourHand} style={{ transform: `rotate(${hourDeg}deg)` }} />
          <div className={styles.minuteHand} style={{ transform: `rotate(${minuteDeg}deg)` }} />
          <div className={styles.secondHand} style={{ transform: `rotate(${secondDeg}deg)` }} />

        </time>
      </div>
    </main>
  );
};

export default AnalogClock;
