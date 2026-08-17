import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// Import the font file. The '?url' suffix is a Vite convention to get the asset URL.
import hourFontUrl from '@/assets/fonts/26fonts/26-08-15hour.ttf?url';
import minuteFontUrl from '@/assets/fonts/26fonts/26-08-15min.ttf?url';
import secondFontUrl from '@/assets/fonts/26fonts/26-08-15sec.ttf?url';

// 1. Asset Exports (Required for preloading pipeline)
export const assets = [hourFontUrl, minuteFontUrl, secondFontUrl];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_15_Hour', fontUrl: hourFontUrl },
  { fontFamily: 'ClockFont_26_08_15_Min', fontUrl: minuteFontUrl },
  { fontFamily: 'ClockFont_26_08_15_Sec', fontUrl: secondFontUrl },
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);
const SECONDS = Array.from({ length: 60 }, (_, i) => i + 1);

const ClockComponent: React.FC = () => {
  // Use the canonical hook for time updates
  const time = useMillisecondClock(16);

  // Use the canonical hook for font loading
  useSuspenseFontLoader(fontConfigs);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    const smoothSecond = seconds + milliseconds / 1000;
    const smoothMinute = minutes + smoothSecond / 60;
    const smoothHour = (hours % 12) + smoothMinute / 60;

    return {
      hourAngle: -smoothHour * 30,
      minuteAngle: -smoothMinute * 6,
      secondAngle: -smoothSecond * 6,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      {/* Semantic <time> element for accessibility */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.clockContainer}>
        {/* Center Reference Line */}
        <div className={styles.centerLine} />

        {/* 1. Innermost Circle: Hours */}
        <div
          className={styles.ring}
          style={{ width: '28vmin', height: '28vmin', transform: `rotate(${hourAngle}deg)` }}
        >
          {HOURS.map((num, i) => {
            const angle = (i + 1) * 30;
            return (
              <span
                key={`h-${num}`}
                className={styles.number}
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-26vmin)` }}
              >
                {num}
              </span>
            );
          })}
        </div>

        {/* 2. Middle Circle: Minutes */}
        <div
          className={styles.ring}
          style={{ width: '52vmin', height: '52vmin', transform: `rotate(${minuteAngle}deg)` }}
        >
          {MINUTES.map((num, i) => {
            const angle = (i + 1) * 30;
            return (
              <span
                key={`m-${num}`}
                className={`${styles.number} ${styles.minuteNumber}`}
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-38vmin)` }}
              >
                {num}
              </span>
            );
          })}
        </div>

        {/* 3. Outermost Circle: Seconds (Maximized Radius) */}
        <div
          className={styles.ring}
          style={{ width: '99vmin', height: '99vmin', transform: `rotate(${secondAngle}deg)` }}
        >
          {SECONDS.map((num) => {
            const angle = num * 6;
            return (
              <span
                key={`s-${num}`}
                className={`${styles.number} ${styles.secondNumber}`}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-45vmin)`,
                }}
              >
                {num}
              </span>
            );
          })}
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_15';

export default MemoizedClock;