import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import type { FontConfig } from '../../../types/clock';
import highwayBg from '../../../assets/images/26-03/26-03-26/highway.webp';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const time = useSecondClock();

  // Font configuration - using a clean digital-style font
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);

  // This hook suspends the component until fonts are loaded
  useSuspenseFontLoader(fontConfigs);

  const timeDigits = useMemo(() => {
    const formatTimeUnit = (unit: number) => unit.toString().padStart(2, '0');

    const hours = formatTimeUnit(time.getHours());
    const minutes = formatTimeUnit(time.getMinutes());
    const seconds = formatTimeUnit(time.getSeconds());

    return {
      hours: hours.split(''),
      minutes: minutes.split(''),
      seconds: seconds.split(''),
    };
  }, [time]);

  return (
    <div className={styles.container} style={{ '--bg-image': `url(${highwayBg})` } as React.CSSProperties}>
      <div className={styles.background} />
      <div className={styles.overlay} />
      
      <div className={styles.clockWrapper}>
        <div className={styles.timeUnit}>
          {timeDigits.hours.map((digit, index) => (
            <span key={`h-${index}`} className={styles.digit}>
              {digit}
            </span>
          ))}
        </div>
        
        <span className={styles.separator}>:</span>
        
        <div className={styles.timeUnit}>
          {timeDigits.minutes.map((digit, index) => (
            <span key={`m-${index}`} className={styles.digit}>
              {digit}
            </span>
          ))}
        </div>
        
        <span className={styles.separator}>:</span>
        
        <div className={styles.timeUnit}>
          {timeDigits.seconds.map((digit, index) => (
            <span key={`s-${index}`} className={styles.digit}>
              {digit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;
