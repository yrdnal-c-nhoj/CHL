import React, { useMemo, useRef } from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import bgVideo from '@/assets/images/2026/26-03/26-03-31/seafloor.mp4';
import crabFont from '@/assets/fonts/2026/26-03-31.ttf';
import hourHandImg from '@/assets/images/2026/26-03/26-03-31/hour.webp';
import minuteHandImg from '@/assets/images/2026/26-03/26-03-31/minute.webp';
import secondHandImg from '@/assets/images/2026/26-03/26-03-31/second.webp';
import styles from './Clock.module.css';

// ---- DRIFT CONFIGS ----
const HAND_DRIFT = {
  hour: { duration: 7.2, delay: -1.3, amp: 10, scaleLo: '0.93', scaleHi: '1.07' },
  minute: { duration: 5.8, delay: -3.1, amp: 15, scaleLo: '0.90', scaleHi: '1.10' },
  second: { duration: 4.1, delay: -0.7, amp: 20, scaleLo: '0.88', scaleHi: '1.12' },
};

const NUMERAL_DRIFT = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((_, i) => ({
  duration: 4 + ((i * 1.37 + 2.1) % 6),
  delay: -((i * 0.83 + 0.5) % 8),
  amp: 6 + ((i * 2.11 + 3) % 14),
  scaleLo: (0.3 + ((i * 0.007 + 0.003) % 0.08)).toFixed(3),
  scaleHi: (3 + ((i * 0.009 + 0.005) % 0.10)).toFixed(3),
}));

const Clock: React.FC = () => {
  const time = useMillisecondClock();

  // Load custom font via Suspense
  const fontConfigs = useMemo(() => [{ fontFamily: 'CrabFont', fontUrl: crabFont }], []);
  useSuspenseFontLoader(fontConfigs);

  // Time calculations
  const ms = time.getMilliseconds();
  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours();

  const secondsWithMs = s + ms / 1000;
  const minutesWithSeconds = m + secondsWithMs / 60;
  const hoursWithMinutes = (h % 12) + m / 60;

  const rotation = {
    s: secondsWithMs * 6,
    m: minutesWithSeconds * 6,
    h: hoursWithMinutes * 30,
  };

  // Generate stable numerals with animated gradient colors
  const numeralsRef = useRef<React.ReactNode[]>([]);
  if (numeralsRef.current.length === 0) {
    numeralsRef.current = ([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const).map((num, i) => {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = 42;
      const x = 50 + radius * Math.cos(angleRad);
      const y = 50 + radius * Math.sin(angleRad);
      const drift = NUMERAL_DRIFT[i]!;
      
      // Unique gradient animation for each numeral
      const gradientDuration = 3 + (i * 0.7);
      const gradientDelay = i * 0.5;
      const startAngle = i * 30;

      return (
        <div
          key={num}
          className={styles.numeral}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            fontFamily: 'CrabFont, sans-serif',
            transform: `translate(-50%, -50%) rotate(${angleDeg + 90}deg)`,
          }}
        >
          <span
            className={`${styles.numeralInner} ${styles.gradientText}`}
            style={{
              ['--drift-duration' as string]: `${drift.duration}s`,
              ['--drift-delay' as string]: `${drift.delay}s`,
              ['--drift-amp' as string]: drift.amp,
              ['--scale-lo' as string]: drift.scaleLo,
              ['--scale-hi' as string]: drift.scaleHi,
              ['--gradient-duration' as string]: `${gradientDuration}s`,
              ['--gradient-delay' as string]: `${gradientDelay}s`,
              ['--start-angle' as string]: `${startAngle}deg`,
              ['--color-index' as string]: i,
            }}
          >
            {num}
          </span>
        </div>
      );
    });
  }

  // Hand factory
  const createHand = (
    src: string,
    rotationDeg: number,
    height: string,
    handType: 'hour' | 'minute' | 'second'
  ) => {
    const drift = HAND_DRIFT[handType]!;
    const handClass = handType === 'hour' ? styles.handHour : handType === 'minute' ? styles.handMinute : handType === 'second' ? styles.handSecond : '';
    const imgClass = handType === 'hour' ? styles.hourHand : handType === 'minute' ? styles.minuteHand : styles.secondHand;

    return (
      <div
        className={`${styles.hand} ${handClass}`}
        style={{
          ['--drift-duration' as string]: `${drift.duration}s`,
          ['--drift-delay' as string]: `${drift.delay}s`,
          ['--drift-amp' as string]: drift.amp,
          ['--scale-lo' as string]: drift.scaleLo,
          ['--scale-hi' as string]: drift.scaleHi,
        }}
      >
        <div
          className={styles.handInner}
          style={{ ['--rotation' as string]: `${rotationDeg}deg` }}
        >
          <img
            src={src}
            alt={`${handType} hand`}
            className={`${styles.handImg} ${imgClass}`}
            style={{ height }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <video autoPlay muted loop playsInline className={styles.videoBg}>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className={styles.clockWrapper}>
        {/* Minute hand - bottom */}
        {createHand(minuteHandImg, rotation.m, '22vh', 'minute')}

        {/* Hour hand - middle */}
        {createHand(hourHandImg, rotation.h, '18vh', 'hour')}

        {/* Numerals container */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
          {numeralsRef.current}
        </div>

        {/* Second hand - top */}
        {createHand(secondHandImg, rotation.s, '22vh', 'second')}
      </div>
    </div>
  );
};

export default Clock;
