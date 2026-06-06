import westtImage from '@/assets/images/26_images/26-06/26-06-03/timbrr.webp';
import westVideo from '@/assets/images/26_images/26-06/26-06-03/tre.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// Export assets for the dynamic loader (useClockPage.ts) to preload
export const assets = [westtImage];

// Import the font with the corresponding date from the assets folder
const fontUrl = new URL(
  '../../../../assets/fonts/26fonts/26-06-03.ttf',
  import.meta.url,
).href;

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_03',
    fontUrl,
  },
];

const AnalogClock: React.FC = () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const angles = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    return {
      sec: (s + ms / 1000) * 6,
      min: (m + s / 60 + ms / 60000) * 6,
      hr: ((h % 12) + m / 60 + s / 3600) * 30,
    };
  }, [time]);

  // Memoize static number positions so we don't recalculate trig every millisecond
  const clockNumbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const angle = (num * 30) - 90;
      const rad = (angle * Math.PI) / 180;
      const radius = 40; // % of container
      
      return {
        num,
        left: `${50 + radius * Math.cos(rad)}%`,
        top: `${50 + radius * Math.sin(rad)}%`,
        rotate: `${num * 30}deg`
      };
    });
  }, []);

  return (
    <time dateTime={time.toISOString()} className={styles.time} aria-label={time.toLocaleTimeString()}>
      <span className={styles.srOnly}>{time.toLocaleTimeString()}</span>
      
      {clockNumbers.map(({ num, left, top, rotate }) => (
        <div 
          key={num} 
          className={styles.number} 
          style={{ left, top, transform: `translate(-50%, -50%) rotate(${rotate})` }}
          aria-hidden="true"
        >
          {num}
        </div>
      ))}

      <div 
        className={`${styles.hand} ${styles.hourHand}`} 
        style={{ transform: `translateX(-50%) rotate(${angles.hr}deg)` }} 
      />
      <div 
        className={`${styles.hand} ${styles.minHand}`} 
        style={{ transform: `translateX(-50%) rotate(${angles.min}deg)` }} 
      />
      <div 
        className={`${styles.hand} ${styles.secHand}`} 
        style={{ transform: `translateX(-50%) rotate(${angles.sec}deg)` }} 
      />
    </time>
  );
};

const Clock: React.FC = () => {
  return (
    <main className={styles.container}>
      <video autoPlay loop muted playsInline className={styles.video}>
        <source src={westVideo} type="video/mp4" />
      </video>

      <img src={westtImage} alt="" className={styles.westtImage} decoding="async" />

      <img src={westtImage} alt="" className={styles.westtImage2} decoding="async" />

      <section className={styles.analogClockSection}>
        <AnalogClock />
      </section>
    </main>
  );
};

export default Clock;
