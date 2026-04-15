import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import eyesFont from '@/assets/fonts/26-04-11-eyes.ttf';
import bgImage from '@/assets/images/2026/26-04/26-04-11/eyes.webp'; 
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const digitToLetter = (digit: string): string => {
  const map: Record<string, string> = {
    '0': 'W', '1': 'A', '2': 'Z', '3': 'E', '4': 'J',
    '5': 'B', '6': 'P', '7': 'M', '8': 'T', '9': 'R',
  };
  return map[digit] || digit;
};

const fontConfigs: FontConfig[] = [
  { fontFamily: 'Eyes', fontUrl: eyesFont }
];

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return {
      hours: h.split('').map(digitToLetter),
      minutes: m.split('').map(digitToLetter),
      seconds: s.split('').map(digitToLetter),
    };
  }, [time]);

  return (
    <div className={styles.container}>
      <div
        className={styles.bgOverlay}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={styles.clockGrid}>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{hours[0]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{hours[1]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{minutes[0]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{minutes[1]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{seconds[0]}</span>
        </div>
        <div className={styles.digitBox}>
          <span className={styles.digit}>{seconds[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default Clock;