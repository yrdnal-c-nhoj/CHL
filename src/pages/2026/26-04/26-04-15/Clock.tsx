import React, { useMemo, useState, useEffect } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import catFont from '@/assets/fonts/2026/26-04-15-cat.ttf';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const time = useClockTime();
  // Use a timestamp rounded to 3 seconds to prevent excessive network requests
  const catInterval = Math.floor(time.getTime() / 3000);
  const [catUrl, setCatUrl] = useState(`https://cataas.com/cat?t=${catInterval}`);

  // Load the local cat font for this date
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'CatClock', fontUrl: catFont }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // Update the cat image every 3 seconds instead of every second.
  useEffect(() => {
    setCatUrl(`https://cataas.com/cat?t=${catInterval}`);
  }, [catInterval]);

  const { hours, minutes, seconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  return (
    <div className={styles.container}>
      <div className={styles.catBox}>
        <img 
          src={catUrl} 
          alt="Random Cat" 
          className={styles.catImage}
        />
      </div>
      <div className={styles.clock}>
        <div className={styles.digitBox}><span className={styles.digit}>{hours[0]}</span></div>
        <div className={styles.digitBox}><span className={styles.digit}>{hours[1]}</span></div>
        <div className={styles.digitBox}><span className={styles.digit}>{minutes[0]}</span></div>
        <div className={styles.digitBox}><span className={styles.digit}>{minutes[1]}</span></div>
        <div className={styles.digitBox}><span className={styles.digit}>{seconds[0]}</span></div>
        <div className={styles.digitBox}><span className={styles.digit}>{seconds[1]}</span></div>
      </div>
    </div>
  );
};

export default Clock;
