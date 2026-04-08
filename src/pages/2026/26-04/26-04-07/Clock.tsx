import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/2026/26-04/26-04-07/wall.webp';
import wallFont from '@/assets/fonts/26-04-07-wall.ttf';
import styles from './Clock.module.css';

const formatDigit = (num: number) => num.toString().padStart(2, '0');

const DigitBox: React.FC<{ value: string }> = ({ value }) => (
  <span className={styles.digitBox}>{value}</span>
);

const Clock: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Wall_26-04-07', fontUrl: wallFont }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const time = useClockTime();

  // Current time digits (HHMM only - user requested no seconds)
  const digits = useMemo(() => {
    const h = formatDigit(time.getHours());
    const m = formatDigit(time.getMinutes());
    return [...h, ...m];
  }, [time]);

  // We create a "Set" of clocks (e.g., 4 clocks in a row)
  // Then we duplicate that set to create the seamless loop.
  const clockCountInSet = 4;
  const clockSet = Array.from({ length: clockCountInSet });

  return (
    <div className={styles.container} role="img" aria-label={`Current time: ${time.getHours()}:${formatDigit(time.getMinutes())}`}>
      {/* Background Layer */}
      <div className={styles.backgroundWrapper} aria-hidden="true">
        <img src={bgImage} className={styles.bgImage} alt="" />
        <img src={bgImage} className={styles.bgImage} alt="" aria-hidden="true" />
      </div>

      {/* The Scrolling Ribbon */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {/* We render the set twice to make it seamless */}
          {[...clockSet, ...clockSet].map((_, index) => (
            <div key={index} className={styles.clockInstance}>
              {digits.map((d, i) => (
                <DigitBox key={i} value={d} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;