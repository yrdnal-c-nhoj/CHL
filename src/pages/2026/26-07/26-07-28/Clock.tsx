import React, { useMemo } from 'react';

import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

// 1. Asset Exports (Required)
import digit1 from '@/assets/images/26_images/26-07/26-07-28/1.webp';
import digit10 from '@/assets/images/26_images/26-07/26-07-28/10.webp';
import digit11 from '@/assets/images/26_images/26-07/26-07-28/11.webp';
import digit12 from '@/assets/images/26_images/26-07/26-07-28/12.webp';
import digit2 from '@/assets/images/26_images/26-07/26-07-28/2.webp';
import digit3 from '@/assets/images/26_images/26-07/26-07-28/3.webp';
import digit4 from '@/assets/images/26_images/26-07/26-07-28/4.webp';
import digit5 from '@/assets/images/26_images/26-07/26-07-28/5.webp';
import digit6 from '@/assets/images/26_images/26-07/26-07-28/6.webp';
import digit7 from '@/assets/images/26_images/26-07/26-07-28/7.webp';
import digit8 from '@/assets/images/26_images/26-07/26-07-28/8.webp';
import digit9 from '@/assets/images/26_images/26-07/26-07-28/9.webp';
import backgroundImage from '@/assets/images/26_images/26-07/26-07-28/background.webp';

const digitImages = [
  digit1,
  digit2,
  digit3,
  digit4,
  digit5,
  digit6,
  digit7,
  digit8,
  digit9,
  digit10,
  digit11,
  digit12,
];

export const assets = [backgroundImage, ...digitImages];

// 2. Main Component
const ClockComponent: React.FC = () => {
  // 2a. Use standard hooks for time.
  const time = useMillisecondClock(); // Smooth second hand

  // 2b. Memoize expensive calculations for clock hand rotation.
  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      secondDeg: seconds * 6,
      minuteDeg: minutes * 6,
      hourDeg: hours * 30,
    };
  }, [time]);

  // Generate a random starting hue for the color overlay animation, memoized to run only once.
  const randomStartHue = useMemo(() => Math.floor(Math.random() * 360), []);

  return (
    <main
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Accessible time element (Required) */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>

      {/* Color shifting overlay */}
      <div
        className={styles.colorOverlay}
        style={
          {
            // Set the starting color directly. The animation will handle the rotation from here.
            backgroundColor: `hsl(${randomStartHue}, 70%, 50%)`,
          } as React.CSSProperties
        }
      />

      {/* Clock UI */}
      <div className={styles.clockFace}>
        {/* Digits with Image Backgrounds */}
        {digitImages.map((imgSrc, i) => {
          const rotationDeg = (i + 1) * 30;
          return (
            <div
              key={i}
              className={styles.digit}
              style={
                {
                  '--bg-image': `url(${imgSrc})`,
                  '--rotation': `${rotationDeg}deg`,
                } as React.CSSProperties
              }
            />
          );
        })}

        {/* Hands */}
        <div className={styles.hourHand} style={{ transform: `rotate(${hourDeg}deg)` }} />
        <div className={styles.minuteHand} style={{ transform: `rotate(${minuteDeg}deg)` }} />
        <div className={styles.secondHand} style={{ transform: `rotate(${secondDeg}deg)` }} />
        <div className={styles.centerPin} />
      </div>
    </main>
  );
};

// 3. Performance and Debugging (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_07_28';

export default MemoizedClock;