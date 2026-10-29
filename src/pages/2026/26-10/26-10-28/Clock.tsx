import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSmoothClock } from '@/utils/hooks';
import { useMemo } from 'react';
import styles from './Clock.module.css';

/* ==========================================================================
 * Clock_26_10_28
 * A clean minimal analog clock with smooth-sweeping hands.
 * Time comes from useSmoothClock; the angles come from useClockAngles.
 * No external assets — the dial and hands are pure CSS.
 * ========================================================================== */

const Clock_26_10_28 = () => {
  const time = useSmoothClock(16);
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  // Tick marks around the dial
  const ticks = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const isMajor = i % 5 === 0;
        return {
          index: i,
          isMajor,
          rotation: i * 6,
        };
      }),
    [],
  );

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.dial} aria-hidden="true">
        <div className={styles.face}>
          {ticks.map((t) => (
            <div
              key={t.index}
              className={
                t.isMajor ? `${styles.tick} ${styles.majorTick}` : styles.tick
              }
              style={{ transform: `rotate(${t.rotation}deg)` }}
            />
          ))}

          <span
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          <span
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `rotate(${minAngle}deg)` }}
          />
          <span
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `rotate(${secAngle}deg)` }}
          />

          <div className={styles.centerPivot} />
        </div>
      </div>
    </main>
  );
};

Clock_26_10_28.displayName = 'Clock_26_10_28';

export default Clock_26_10_28;
