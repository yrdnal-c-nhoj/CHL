import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import minuteHandImage from '@/assets/images/25_images/25-04/25-04-25/ba.gif';
import backgroundImage from '@/assets/images/25_images/25-04/25-04-25/bad.webp';
import hourHandImage from '@/assets/images/25_images/25-04/25-04-25/ban.webp';
import secondHandImage from '@/assets/images/25_images/25-04/25-04-25/band.gif';

import styles from './Clock.module.css';

export const assets = [backgroundImage, hourHandImage, minuteHandImage, secondHandImage];

const oswaldFontUrl = 'https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUtiZTaR.woff2';
const fontConfigs: FontConfig[] = [
  { fontFamily: 'Oswald', fontUrl: oswaldFontUrl, options: { weight: '700' } },
];

const numerals = Array.from({ length: 12 }, (_, i) => i + 1);

const MyClock =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClock();

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    return {
      secondDeg: s * 6,
      minuteDeg: m * 6 + s * 0.1,
      hourDeg: (h % 12) * 30 + m * 0.5,
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <main className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <time dateTime={isoTime} className={styles.semanticTime} aria-hidden="true" className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clockFace}>
        {numerals.map((num) => (
          <div key={num} className={styles.numeralContainer} style={{ transform: `rotate(${num * 30}deg)` }}>
            <span className={styles.numeral} style={{ transform: `rotate(-${num * 30}deg)` }}>
              {num}
            </span>
          </div>
        ))}
        <img
          src={hourHandImage}
          className={`${styles.hand} ${styles.hourHand}`}
          alt="Hour hand"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        <img
          src={minuteHandImage}
          className={`${styles.hand} ${styles.minuteHand}`}
          alt="Minute hand"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        <img
          src={secondHandImage}
          className={`${styles.hand} ${styles.secondHand}`}
          alt="Second hand"
          style={{ transform: `rotate(${secondDeg}deg)` }}
        />
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(MyClock);
MemoizedClock.displayName = 'MyClock_25_04_25';

export default MemoizedClock;
