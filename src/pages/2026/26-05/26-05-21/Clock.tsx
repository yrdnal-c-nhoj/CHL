import React, { useMemo } from 'react';
import canisBg from '@/assets/images/2026/26-05/26-05-21/canis.webp';
import canisComponent from '@/assets/images/2026/26-05/26-05-21/canis2.webp';
import canisComponent3 from '@/assets/images/2026/26-05/26-05-21/canis3.webp';
import canisComponent4 from '@/assets/images/2026/26-05/26-05-21/canis4.webp'; // // Corrected image path
import fontUrl from '@/assets/fonts/2026/26-05-21.otf?url'; // Uses existing font file
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

// BTS: Export assets and fonts for the preloading pipeline
export const assets = [canisBg, canisComponent, canisComponent3];

export const fontConfigs: FontConfig[] = [
  {
    fontFamily: '26-05-21',
    fontUrl: fontUrl,
  },
];


// ---------------- COMPONENTS ----------------
const BackgroundLayers: React.FC = () => (
  <div
    className={styles.backgroundImage}
    style={{ backgroundImage: `url(${canisBg})` }}
  />
);

const ComponentLayers: React.FC = () => (
  <>
    <div
      className={styles.componentImage1}
      style={{ backgroundImage: `url(${canisComponent})` }}
    />
    <div
      className={styles.componentImage2}
      style={{ backgroundImage: `url(${canisComponent3})` }}
    />
     <div
      className={styles.componentImage3}
      style={{ backgroundImage: `url(${canisComponent4})` }}
    />
  </>
);

const ClockFace: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const time = useClockTime();

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    const s = time.getSeconds() + time.getMilliseconds() / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;

    return {
      secondDeg: s * 6,
      minuteDeg: m * 6,
      hourDeg: h * 30,
      isoTime: time.toISOString(),
    };
  }, [time]);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className={styles.clockWrapper}>
      <time className={styles.face} dateTime={isoTime}>
        {numbers.map((num) => (
          <span
            key={num}
            className={styles.number}
            style={{
              transform: `translate(-50%, -50%) rotate(${num * 30}deg) translateY(-35vh)`,
              fontFamily: `${fontFamily}, sans-serif`,
            }}
          >
            {num}
          </span>
        ))}
        <div className={styles.hourHand} style={{ transform: `rotate(${hourDeg}deg)` }} />
        <div className={styles.minuteHand} style={{ transform: `rotate(${minuteDeg}deg)` }} />
        <div className={styles.secondHand} style={{ transform: `rotate(${secondDeg}deg)` }} />
        <div className={styles.centerDot} />
      </time>
    </div>
  );
};

const AnalogClock: React.FC = () => {
  // Load the date-specific font
  useSuspenseFontLoader(fontConfigs);

  return (
    <div className={styles.container}>
      <BackgroundLayers />
      <ComponentLayers />
      <ClockFace fontFamily="26-05-21" />
    </div>
  );
};

export default AnalogClock;
