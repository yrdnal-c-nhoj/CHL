import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';
import styles from './Clock.module.css';
import ClockHand from './Clockhand';

import swipeImage1 from '@/assets/images/26_images/26-10/26-10-28/swipe1.webp';
import swipeImage2 from '@/assets/images/26_images/26-10/26-10-28/swipe2.webp';
import swipeImage3 from '@/assets/images/26_images/26-10/26-10-28/swipe3.webp';
import swipeImage4 from '@/assets/images/26_images/26-10/26-10-28/swipe4.webp';
import swipeImage5 from '@/assets/images/26_images/26-10/26-10-28/swipe5.webp';
import swipeImage6 from '@/assets/images/26_images/26-10/26-10-28/swipe6.webp';
import swipeImage7 from '@/assets/images/26_images/26-10/26-10-28/swipe7.webp';

export const assets = [
  swipeImage1,
  swipeImage2,
  swipeImage3,
  swipeImage4,
  swipeImage5,
  swipeImage6,
  swipeImage7,
];

const swipeImages = [
  swipeImage1,
  swipeImage2,
  swipeImage3,
  swipeImage4,
  swipeImage5,
  swipeImage6,
  swipeImage7,
];

/* Seeded PRNG so decoration positions are stable across renders */
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface DecorationSpec {
  src: string;
  left: number;
  top: number;
  size: number;
  rotation: number;
  opacity: number;
}

/* ==========================================================================
 * Clock_26_10_28
 * Analog clock with stylized SVG hands + decorative swipe images
 * placed at random positions behind the dial.
 * Time: useSmoothClock(16)
 * ========================================================================== */

const Clock_26_10_28 = () => {
  const time = useSmoothClock(16);
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  const ticks = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        index: i,
        isMajor: i % 5 === 0,
        rotation: i * 6,
      })),
    [],
  );

  // Generate random positions for the swipe images (stable via seeded PRNG)
  const decorations = useMemo<DecorationSpec[]>(() => {
    const rng = mulberry32(0x261028);
    return swipeImages.map((src) => ({
      src,
      left: rng() * 70 + 15, // 15%–85%
      top: rng() * 70 + 15, // 15%–85%
      size: rng() * 12 + 10, // 10%–22%
      rotation: rng() * 360, // 0°–360°
      opacity: rng() * 0.25 + 0.1, // 10%–35%
    }));
  }, []);

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.dial} aria-hidden="true">
        <div className={styles.face}>
          {ticks.map((tick) => (
            <div
              key={tick.index}
              className={
                tick.isMajor
                  ? `${styles.tick} ${styles.majorTick}`
                  : styles.tick
              }
              style={{ transform: `rotate(${tick.rotation}deg)` }}
            />
          ))}

          {/* Decorative swipe images at random positions */}
          {decorations.map((d, i) => (
            <img
              key={i}
              src={d.src}
              alt=""
              className={styles.decoration}
              style={{
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: `${d.size}%`,
                height: `${d.size}%`,
                transform: `rotate(${d.rotation}deg)`,
                opacity: d.opacity,
              }}
            />
          ))}

          {/* Hour hand */}
          <ClockHand
            className={`${styles.hand} ${styles.hourHand}`}
            angle={hourAngle}
          />

          {/* Minute hand */}
          <ClockHand
            className={`${styles.hand} ${styles.minuteHand}`}
            angle={minAngle}
          />

          {/* Second hand */}
          <ClockHand
            className={`${styles.hand} ${styles.secondHand}`}
            angle={secAngle}
            variant="finger"
          />

          {/* Center pivot */}
          <div className={styles.centerPivot} />
        </div>
      </div>
    </main>
  );
};

Clock_26_10_28.displayName = 'Clock_26_10_28';

export default Clock_26_10_28;
