import React from 'react';
import { useClockTime } from '@/utils/hooks/useClockTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import font from '@/assets/fonts/2026/26-05-15.ttf?url';
import backgroundImage from '@/assets/images/2026/26-05/26-05-15/rings.webp';


import styles from './Clock.module.css';


export const assets = [font, backgroundImage];

const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  useSuspenseFontLoader([
    {
      fontFamily: 'CustomFont',
      fontUrl: font,
    },
  ]);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  return (
    <main className={styles.container}>
      <img src={backgroundImage} alt="" className={styles.backgroundImage} aria-hidden="true" />

      {[0, 1, 2, 3, 4].map((i) => (
        <time
          key={i}
          className={styles.clockDisplay}
          dateTime={currentTime.toISOString()}
          aria-hidden={i !== 2}
        >
          <span className={styles.timeSegment}>{hours}</span>
          <span className={styles.timeSegment}>{minutes}</span>
          <span className={styles.timeSegment}>{seconds}</span>
        </time>
      ))}
    </main>
  );
};

export default DigitalClock;

