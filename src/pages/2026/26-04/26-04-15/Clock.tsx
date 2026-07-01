import catFont from '@/assets/fonts/26fonts/26-04-15-cat.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

export const assets = [catFont];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const time = useSecondClock();
  // Use a timestamp rounded to 3 seconds to prevent excessive network requests
  const catInterval = Math.floor(time.getTime() / 3000);

  const catUrl = useMemo(() => `https://cataas.com/cat?t=${catInterval}`, [catInterval]);

  // Load the local cat font for this date
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'CatClock', fontUrl: catFont }],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  return (
    <div className={styles.container}>
      <div className={styles.catBox}>
        <img src={catUrl} alt="Random Cat" className={styles.catImage} />
      </div>
      <time
        dateTime={time.toISOString()}
        className={styles.clock}
      >
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
      </time>
    </div>
  );
};

export default Clock;
