import React, { useMemo } from 'react';
import styles from './Clock.module.css';
import { useClockTime } from '@/utils/hooks';
import backgroundImage from '@/assets/images/2026/26-05/26-05-16/depart.gif';

export const assets = [backgroundImage];

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
          {/* Hands */}
          <div className={styles.hourHand} style={{ transform: `rotate(${hourDeg}deg)` }} />
          <div className={styles.minuteHand} style={{ transform: `rotate(${minuteDeg}deg)` }} />
          <div className={styles.secondHand} style={{ transform: `rotate(${secondDeg}deg)` }} />

          {/* Center axis pin */}
          <div className={styles.centerDot} />
        </time>
      </div>
    </main>
  );
};

export default AnalogClock;