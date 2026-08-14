import React from 'react';

import botFontUrl from '@/assets/fonts/25fonts/25-05-25-bot.ttf';
import arm from '@/assets/images/25_images/25-05/25-05-25/arm.gif';
import arm2 from '@/assets/images/25_images/25-05/25-05-25/arm2.gif';
import arm3 from '@/assets/images/25_images/25-05/25-05-25/arm3.gif';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'bot',
      fontUrl: botFontUrl,
      options: { weight: 'normal', style: 'normal' },
    },
  ];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const second = time.getSeconds();
  const minute = time.getMinutes();
  const hour = time.getHours() % 12;

  const secondDeg = second * 6;
  const minuteDeg = minute * 6 + second * 0.1;
  const hourDeg = hour * 30 + minute * 0.5;

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.clockContainer}>
        <div className={styles.clock} role="timer" aria-live="off">
          {/* Numbers */}
          {Array.from({ length: 12 }, (_, i) => {
            const num = i + 1;
            const angle = num * 30 * (Math.PI / 180);
            const x = 50 + 42 * Math.sin(angle);
            const y = 50 - 42 * Math.cos(angle);
            const style = { left: `${x}%`, top: `${y}%` };
            return (
              <div key={num} style={style} className={styles.number}>
                {num}
              </div>
            );
          })}

          {/* Hands */}
          <div className={styles.hand} style={{ transform: `translate(-50%, -100%) rotate(${secondDeg}deg)` }}>
            <img decoding="async" loading="lazy" src={arm2} alt="" className={styles.secondHandImage} />
          </div>
          <div className={styles.hand} style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }}>
            <img decoding="async" loading="lazy" src={arm3} alt="" className={styles.minuteHandImage} />
          </div>
          <div className={styles.hand} style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }}>
            <img decoding="async" loading="lazy" src={arm} alt="" className={styles.hourHandImage} />
          </div>
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_25';

export default MemoizedClock;
