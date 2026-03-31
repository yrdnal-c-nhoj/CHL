import React, { useMemo, useRef, Suspense } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import bgVideo from '../../../assets/images/26-03/26-03-31/seafloor.mp4';
import crabFont from '../../../assets/fonts/26-03-31-crab.ttf';
import hourHandImg from '../../../assets/images/26-03/26-03-31/crab1.webp';
import minuteHandImg from '../../../assets/images/26-03/26-03-31/crab2.webp';
import secondHandImg from '../../../assets/images/26-03/26-03-31/crab3.webp';
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
  scaleLo: (0.88 + ((i * 0.007 + 0.003) % 0.08)).toFixed(3),
  scaleHi: (1.04 + ((i * 0.009 + 0.005) % 0.10)).toFixed(3),
}));

const COLORS = [
  'rgba(60,80,50,0.85)',
  'rgba(45,70,60,0.85)',
  'rgba(30,60,70,0.85)',
  'rgba(50,75,65,0.85)',
  'rgba(65,85,55,0.85)',
  'rgba(40,65,75,0.85)',
];

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

  // Generate stable numerals (rendered once)
  const numeralsRef = useRef<React.ReactNode[]>([]);
  if (numeralsRef.current.length === 0) {
    numeralsRef.current = ([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const).map((num, i) => {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = 42;
      const x = 50 + radius * Math.cos(angleRad);
      const y = 50 + radius * Math.sin(angleRad);
      const color = COLORS[i % COLORS.length];
      const glow = 0.5 + ((i * 0.13 + 0.3) % 0.5);
      const drift = NUMERAL_DRIFT[i]!;

      return (
        <div
          key={num}
          className={styles.numeral}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            color,
            fontFamily: 'CrabFont, sans-serif',
            textShadow: `
              1px 0 0 rgba(0,0,0,0.9),
              -1px 0 0 rgba(255,255,255,0.6),
              0 0 ${20 * glow}px rgba(0,100,120,${0.6 * glow}),
              0 0 ${50 * glow}px rgba(0,80,100,${0.4 * glow}),
              0 0 ${90 * glow}px rgba(0,60,80,${0.2 * glow}),
              0 8px 20px rgba(0,0,0,0.8)
            `,
            transform: `translate(-50%, -50%) rotate(${angleDeg + 90}deg)`,
          }}
        >
          <span
            className={styles.numeralInner}
            style={{
              ['--drift-duration' as string]: `${drift.duration}s`,
              ['--drift-delay' as string]: `${drift.delay}s`,
              ['--drift-amp' as string]: drift.amp,
              ['--scale-lo' as string]: drift.scaleLo,
              ['--scale-hi' as string]: drift.scaleHi,
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
    const handClass = handType === 'hour' ? styles.handHour : handType === 'second' ? styles.handSecond : '';
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
