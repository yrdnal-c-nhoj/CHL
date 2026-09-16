import { useState } from 'react';
import type { CSSProperties } from 'react';

import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';

import burchfield from '@/assets/images/26_images/26-09/26-09-14/burchfield.webp';
import styles from './Clock.module.css';

export const assets = [burchfield];

interface AnalogClockProps {
  size?: number;
  showSeconds?: boolean;
  className?: string;
}

const AnalogClock = ({
  size = 280,
  showSeconds = true,
  className = '',
}: AnalogClockProps) => {
  const time = useSmoothClock(50);
  const [motionStart] = useState(() => Date.now());
  const initialDelay = 250;
  const spinDuration = 15000;
  const holdDuration = 300;
  const totalDegrees = 5400;
  const cycleDuration = spinDuration + holdDuration;
  const elapsed = Math.max(0, time.getTime() - motionStart - initialDelay);
  const completedSpins = Math.floor(elapsed / cycleDuration);
  const cycleElapsed = elapsed % cycleDuration;
  const direction = completedSpins % 2 === 0 ? -1 : 1;
  const completedRotation = completedSpins % 2 === 0 ? 0 : -totalDegrees;
  const progress = Math.min(cycleElapsed / spinDuration, 1);
  // Keep the start and stop gradual while concentrating rotation speed in the middle.
  const eased =
    progress ** 5 *
    (126 -
      420 * progress +
      540 * progress ** 2 -
      315 * progress ** 3 +
      70 * progress ** 4);
  const rotation =
    elapsed === 0
      ? 0
      : completedRotation + direction * totalDegrees * eased;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const style = {
    '--clock-size': `${size}px`,
    '--clock-rotation': `${rotation}deg`,
    '--hour-angle': `${hours * 30 + minutes * 0.5}deg`,
    '--minute-angle': `${minutes * 6 + seconds * 0.1}deg`,
    '--second-angle': `${seconds * 6}deg`,
    '--background-image': `url("${burchfield}")`,
  } as CSSProperties;

  return (
    <main className={`${styles.container} ${className}`.trim()} style={style}>
      <div className={styles.clock} aria-label="Analog clock">

        <div className={`${styles.marker} ${styles.marker12}`} aria-hidden="true" />
        <div className={`${styles.marker} ${styles.marker3}`} aria-hidden="true" />
        <div className={`${styles.marker} ${styles.marker6}`} aria-hidden="true" />
        <div className={`${styles.marker} ${styles.marker9}`} aria-hidden="true" />

        <div className={`${styles.hand} ${styles.hourHand}`} aria-hidden="true" />
        <div className={`${styles.hand} ${styles.minuteHand}`} aria-hidden="true" />
        {showSeconds && (
          <div className={`${styles.hand} ${styles.secondHand}`} aria-hidden="true" />
        )}
      </div>

      <SRTime time={time} />
    </main>
  );
};

AnalogClock.displayName = 'AnalogClock_26_09_14';

export default AnalogClock;
