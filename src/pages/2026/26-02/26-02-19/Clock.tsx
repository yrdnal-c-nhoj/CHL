import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import { useMemo } from 'react';
import type { FontConfig } from '@/types/clock';

import styles from './Clock.module.css';

import platFont from '@/assets/fonts/26fonts/26-02-19-plat.ttf?url';

export const assets = [platFont];

const fontConfig: FontConfig = {
  fontFamily: 'PlatFont',
  fontUrl: platFont,
};

const Clock_26_02_19 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  const mins = time.getMinutes();
  const hrs = time.getHours();
  const secs = time.getSeconds();
  const minDegrees = mins * 6;
  const hrDegrees = (hrs % 12) * 30 + mins * 0.5;
  const secDegrees = secs * 6;

  const timeString = useMemo(
    () => time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    [time],
  );

  const [rawTime, amPm] = timeString.split(' ');
  const digits = rawTime.replace(/:/g, '').split('');
  const spacedAmPm = amPm.split('').join(' ');

  return (
    <main className={styles.mainContainer}>
      <div className={styles.digitalGroup}>
        <div className={styles.digitsContainer}>
          {digits.map((char, index) => (
            <div key={index} className={styles.digitBox}>
              {char}
            </div>
          ))}
        </div>
        <div className={styles.ampmBox}>{spacedAmPm}</div>
      </div>
      <div className={styles.analogSection}>
        <div className={styles.clockFace}>
          {[...Array(12)].map((_, i) => {
            const isMainHour = [0, 3, 6, 9].includes(i);
            return (
              <div
                key={i}
                className={`${styles.tickMark} ${isMainHour ? styles.tickMain : styles.tickMinor}`}
              />
            );
          })}
          <div
            className={`${styles.handBase} ${styles.hourHand}`}
            style={{ transform: `rotate(${hrDegrees}deg)` }}
          />
          <div
            className={`${styles.handBase} ${styles.minuteHand}`}
            style={{ transform: `rotate(${minDegrees}deg)` }}
          />
          <div
            className={`${styles.handBase} ${styles.secondHand}`}
            style={{ transform: `rotate(${secDegrees}deg)` }}
          />
          <div className={styles.centerDot} />
        </div>
      </div>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

Clock_26_02_19.displayName = 'Clock_26_02_19';

export default Clock_26_02_19;