import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import flyImage from '@/assets/images/26_images/26-10/26-10-15/fly.webp';
import callistoImage from '@/assets/images/26_images/26-10/26-10-15/callisto.webp';
import cowVideo from '@/assets/images/26_images/26-10/26-10-15/cow.webm';

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';

export const assets = [flyImage, callistoImage, cowVideo];

const romanNumerals = [
  'XII',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
];

const Clock = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 16);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = hours * 30 + minutes * 0.5 + (seconds * 0.5) / 60;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  const centerX = 50;
  const centerY = 50;
  const radius = 40;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.layers}>
        <video
          className={`${styles.layer} ${styles.fill}`}
          src={cowVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />

        <img
          className={`${styles.layer} ${styles.cover}`}
          src={callistoImage}
          alt=""
        />

        <img
          className={`${styles.layer} ${styles.contain}`}
          src={flyImage}
          alt=""
        />
      </div>

      <div className={styles.analogClock}>
        {romanNumerals.map((numeral, i) => {
          const angle = ((i * 30 - 90) * Math.PI) / 180;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <span
              key={i}
              className={styles.numeral}
              style={
                {
                  left: `${x}%`,
                  top: `${y}%`,
                  '--angle': `${i * 30}deg`,
                } as CSSProperties
              }
            >
              {numeral}
            </span>
          );
        })}

        <div
          className={styles.hand}
          style={
            {
              '--rotation': `${hourDeg}deg`,
            } as CSSProperties
          }
        />

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={
            {
              '--rotation': `${minuteDeg}deg`,
            } as CSSProperties
          }
        />

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--rotation': `${secondDeg}deg`,
            } as CSSProperties
          }
        />
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_10_15';
