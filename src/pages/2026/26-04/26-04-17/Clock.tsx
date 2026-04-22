import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundImage from '@/assets/images/2026/26-04/26-04-17/tati.webp';
import styles from './Clock.module.css';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Space Grotesk', fontUrl: 'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2' }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.clock}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={styles.digit}>{seconds[0]}</span>
        <span className={styles.digit}>{seconds[1]}</span>
      </div>
    </div>
  );
};

export default Clock;
