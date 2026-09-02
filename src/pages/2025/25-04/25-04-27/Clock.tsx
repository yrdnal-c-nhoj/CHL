import coinGif from '@/assets/images/25_images/25-04/25-04-27/coin.gif';
import spinWebp from '@/assets/images/25_images/25-04/25-04-27/spin.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

export const assets = [coinGif, spinWebp];

// Component Props interface
interface SpinningCoinClockProps {
  // No props required for this component
}

const SpinningCoinClock: React.FC<SpinningCoinClockProps> = () => {
  // Font loading configuration (memoized) - no custom fonts needed to avoid network errors
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);

  // Load fonts using suspense-based loader
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for time updates
  const currentTime = useClock();

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return {
      hourAngle: hours * 30 + minutes * 0.5,
      minuteAngle: minutes * 6,
      secondAngle: seconds * 6,
    };
  }, [currentTime]);

  return (
    <main className={styles.container}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>

      <img
        decoding="async"
        loading="lazy"
        src={coinGif}
        alt="coin background"
        className={styles.backgroundImage}
      />
      <div id="clock" className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{
            transform: `translateX(-50%) rotate(${hourAngle}deg)`,
          }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
          }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{
            transform: `translateX(-50%) rotate(${secondAngle}deg)`,
          }}
        />
        <div
          className={styles.center}
          style={{
            backgroundImage: `url(${spinWebp})`,
          }}
         />
      </div>
    </main>
  );
};

const MemoizedSpinningCoinClock = React.memo(SpinningCoinClock);
MemoizedSpinningCoinClock.displayName = 'Clock_25_04_27';
export default MemoizedSpinningCoinClock;
