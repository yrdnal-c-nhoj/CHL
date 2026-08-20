import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo, memo } from 'react';

import secondImg from '@/assets/images/25_images/25-04/25-04-16/20.webp';
import minuteImg from '@/assets/images/25_images/25-04/25-04-16/200w.webp';
import hourImg from '@/assets/images/25_images/25-04/25-04-16/2hhj.webp';
import cakeGif from '@/assets/images/25_images/25-04/25-04-16/cake.gif';
import confGif from '@/assets/images/25_images/25-04/25-04-16/conf.gif';
import confJpg from '@/assets/images/25_images/25-04/25-04-16/conf.jpg';
import styles from './Clock.module.css';

export const assets = [cakeGif, minuteImg, hourImg, secondImg, confGif, confJpg];

const BirthdayCakeClock = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);
  const currentTime = useMillisecondClock();

  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const ms = currentTime.getMilliseconds();
    const s = currentTime.getSeconds() + ms / 1000;
    const m = currentTime.getMinutes() + s / 60;
    const h = (currentTime.getHours() % 12) + m / 60;

    const hourDeg = h * 30;
    const minuteDeg = m * 6;
    const secondDeg = s * 6;
    return { hourDeg, minuteDeg, secondDeg };
  }, [currentTime]);

  return (
    <main className={styles.container}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>

      <div className={styles.clockWrapper}>
        <div className={styles.clock}>
          <div className={styles.circle}>
            <img src={cakeGif} alt="Rotating Image" className={styles.circleImg} />
          </div>

          <div className={styles.handBase} style={{ '--minute-deg': `${minuteDeg}deg` } as React.CSSProperties}>
            <img src={minuteImg} alt="Minute hand" className={styles.minuteImg} />
          </div>

          <div className={styles.handBase} style={{ '--hour-deg': `${hourDeg}deg` } as React.CSSProperties}>
            <img src={hourImg} alt="Hour hand" className={styles.hourImg} />
          </div>

          <div className={styles.handBase} style={{ '--second-deg': `${secondDeg}deg` } as React.CSSProperties}>
            <img src={secondImg} alt="Second hand" className={styles.secondImg} />
          </div>
        </div>
      </div>

      <img src={confGif} alt="Confetti gif" className={styles.confettiGif} />
      <img src={confJpg} alt="Confetti background" className={styles.confettiBg} />
    </main>
  );
};

const MemoizedBirthdayCakeClock = memo(BirthdayCakeClock);
MemoizedBirthdayCakeClock.displayName = 'Clock_25_04_16';
export default MemoizedBirthdayCakeClock;
