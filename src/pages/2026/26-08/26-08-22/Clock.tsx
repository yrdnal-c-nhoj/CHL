import wallFont from '@/assets/fonts/26fonts/26-08-22.ttf';
import bgImage from '@/assets/images/26_images/26-08/26-08-22/mars.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

const formatDigit = (num: number) => num.toString().padStart(2, '0');

const DigitBox: React.FC<{ value: string }> = ({ value }) => (
  <span className={styles.digitBox}>{value}</span>
);

const Clock = () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'Wall_26-04-07', fontUrl: wallFont }],
    [],
  );

  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  // Better digit extraction
  const displayTime = useMemo(() => {
    const h = formatDigit(time.getHours());
    const m = formatDigit(time.getMinutes());
    const s = formatDigit(time.getSeconds());
    return [...h, ...m, ...s];
  }, [time]);

  return (
    <div
      className={styles.container}
      role="img"
      aria-label={`Current time: ${time.getHours()}:${formatDigit(time.getMinutes())}`}
    >
      <div className={styles.backgroundWrapper} aria-hidden="true">
        <img src={bgImage} className={styles.bgImage} alt="" />
        <img src={bgImage} className={styles.bgImage} alt="" />
      </div>

      <div className={styles.clockContainer}>
        <div className={styles.clockInstance}>
          {displayTime.map((digit, i) => (
            <DigitBox key={i} value={digit} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;
