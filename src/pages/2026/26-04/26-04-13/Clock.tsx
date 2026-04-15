import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/2026/26-04/26-04-13/bg.webp';
import carFont from '@/assets/fonts/26-04-13-car.otf';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

// Custom hook for smooth millisecond updates
const useMsClockTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      setTime(new Date());
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return time;
};

const fontConfigs: FontConfig[] = [
  { fontFamily: 'Car', fontUrl: carFont }
];

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMsClockTime();

  const { hours, minutes, seconds, msTens, msOnes } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    const ms = formatTime(time.getMilliseconds());
    return {
      hours: h,
      minutes: m,
      seconds: s,
      msTens: ms[0],
      msOnes: ms[1],
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={styles.clockRow}>
        {/* Hours */}
        <div className={styles.digitBox}>
          <span className={styles.digit}>{hours[0]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{hours[1]}</span>
        </div>

        {/* Minutes */}
        <div className={styles.digitBox}>
          <span className={styles.digit}>{minutes[0]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{minutes[1]}</span>
        </div>

        {/* Seconds */}
        <div className={styles.digitBox}>
          <span className={styles.digit}>{seconds[0]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{seconds[1]}</span>
        </div>

        {/* Milliseconds */}
        <div className={styles.digitBox}>
          <span className={styles.digit}>{msTens}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{msOnes}</span>
        </div>
      </div>
    </div>
  );
};

export default Clock;
