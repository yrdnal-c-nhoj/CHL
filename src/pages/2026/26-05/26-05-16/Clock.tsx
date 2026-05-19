import React, { useMemo } from 'react';
import styles from './Clock.module.css';
import { useSmoothClock } from '@/utils/hooks';
import backgroundImage from '@/assets/images/2026/26-05/26-05-16/depart.gif';

export const assets = [backgroundImage];

const AnalogClock: React.FC = () => {
  const smoothTime = useSmoothClock(16);
  const time = smoothTime || new Date();

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    // Get local time in milliseconds to ensure monotonic rotation.
    // This prevents the hands from "winding" backwards when resetting at 60/12.
    const localTimestamp = time.getTime() - time.getTimezoneOffset() * 60000;

    return {
      secondDeg: (localTimestamp / 1000) * 6,
      minuteDeg: (localTimestamp / 60000) * 6,
      hourDeg: (localTimestamp / 3600000) * 30,
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