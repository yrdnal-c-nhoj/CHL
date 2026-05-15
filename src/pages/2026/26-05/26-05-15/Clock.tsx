import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

// Asset imports follow the YY-MM-DD convention
import customFont from '@/assets/fonts/2026/26-05-15.ttf?url';
import backgroundImage from '@/assets/images/2026/26-05/26-05-15/bg.webp';

// Export assets for the framework preloader
export const assets = [backgroundImage];

const fontConfigs = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

const AnalogClock: React.FC = () => {
  const currentTime = useClockTime();

  // Compute precise rotations for smooth movement
  const rotations = useMemo(() => {
    const ms = currentTime.getMilliseconds();
    const s = currentTime.getSeconds() + ms / 1000;
    const m = currentTime.getMinutes() + s / 60;
    const h = (currentTime.getHours() % 12) + m / 60;

    return {
      hr: h * 30,
      min: m * 6,
      sec: s * 6,
    };
  }, [currentTime]);

  useSuspenseFontLoader(fontConfigs);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundLayer}>
        <img
          className={styles.backgroundImage}
          src={backgroundImage}
          alt=""
        />
      </div>

      <time className={styles.clockFace} dateTime={currentTime.toISOString()}>
        {/* Render 1-12 markers with counter-rotation to keep numbers upright */}
        {[...Array(12)].map((_, i) => {
          const val = i === 0 ? 12 : i;
          const angle = i * 30;
          return (
            <div
              key={i}
              className={styles.numeral}
              style={{ transform: `rotate(${angle}deg) translateY(-38vmin)` }}
            >
              <span style={{ transform: `rotate(-${angle}deg)` }}>{val}</span>
            </div>
          );
        })}

        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `rotate(${rotations.hr}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${rotations.min}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${rotations.sec}deg)` }}
        />

        <div className={styles.centerPin} />
      </time>
    </div>
  );
};

export default AnalogClock;