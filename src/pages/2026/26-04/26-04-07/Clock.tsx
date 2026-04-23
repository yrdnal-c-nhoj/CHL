import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/2026/26-04/26-04-07/wall.webp';
import wallFont from '@/assets/fonts/2026/26-04-07-wall.ttf';
import styles from './Clock.module.css';

const formatDigit = (num: number) => num.toString().padStart(2, '0');

const DigitBox: React.FC<{ value: string }> = ({ value }) => (
  <span className={styles.digitBox}>{value}</span>
);

const Clock: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Wall_26-04-07', fontUrl: wallFont }],
    []
  );

  useSuspenseFontLoader(fontConfigs);
  const time = useClockTime();

  // Better digit extraction
  const displayTime = useMemo(() => {
    const h = formatDigit(time.getHours());
    const m = formatDigit(time.getMinutes());
    return [...h, ...m];
  }, [time]);

  const clockCountInSet = 4;

  return (
    <div className={styles.container} role="img" aria-label={`Current time: ${time.getHours()}:${formatDigit(time.getMinutes())}`}>
      {/* Background */}
      <div className={styles.backgroundWrapper} aria-hidden="true">
        <img src={bgImage} className={styles.bgImage} alt="" />
        <img src={bgImage} className={styles.bgImage} alt="" />
      </div>

      {/* Marquee */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {Array.from({ length: clockCountInSet * 2 }).map((_, index) => (
            <div key={index} className={styles.clockInstance}>
              {displayTime.map((digit, i) => (
                <DigitBox key={i} value={digit} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;