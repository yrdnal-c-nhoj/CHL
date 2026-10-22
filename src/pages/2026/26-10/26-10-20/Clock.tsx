import carflyVideo from '@/assets/images/26_images/26-10/26-10-20/carfly.webm';
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import React, { memo } from 'react';
import styles from './Clock.module.css';

/**
 * Speedometer-Style Analog Clock
 *
 * A speedometer-inspired analog clock overlaid on a background video.
 * Two needles (hour and minute) sweep across a semi-circular speedometer
 * face, with the "speed" corresponding to the current time.
 *
 * Smooth sub-second updates are provided by useSmoothClock(16) (~60fps),
 * and clock angles come from the shared useClockAngles hook.
 */

export const assets = [carflyVideo];

const Clock_26_10_20 = () => {
  const time = useSmoothClock(16);
  const {
    hourAngle,
    minAngle: minuteAngle,
    secAngle: secondAngle,
  } = useClockAngles(time);

  return (
    <main className={styles.container}>
      <video
        src={carflyVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <SRTime time={time} />

      <div className={styles.speedometerWrapper}>
        {/* Speedometer housing / rim */}
        <div className={styles.speedometerRim} />

        {/* Colored speedometer arc (green / yellow / red zones) */}
        <div className={styles.speedoArc} />

        {/* Tick marks for each hour 1–12 */}
        {Array.from({ length: 12 }, (_, i) => {
          const hour = i + 1;
          const angle = hour * 30; // 360 / 12 = 30 deg per hour
          return (
            <div
              key={hour}
              className={styles.tickMark}
              style={{ transform: `rotate(${angle}deg)` }}
            />
          );
        })}

        {/* Hour numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const hour = i + 1;
          const angle = hour * 30;
          // Position numbers along the arc
          const radius = 38;
          const rad = (angle - 90) * (Math.PI / 180);
          const x = 50 + radius * Math.cos(rad);
          const y = 50 + radius * Math.sin(rad);
          return (
            <div
              key={`h${hour}`}
              className={styles.hourNumber}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {hour}
            </div>
          );
        })}

        {/* Center pivot */}
        <div className={styles.centerPivot} />

        {/* Minute needle — the primary "speed" needle */}
        <div
          className={`${styles.needle} ${styles.minuteNeedle}`}
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        />

        {/* Hour needle — secondary needle */}
        <div
          className={`${styles.needle} ${styles.hourNeedle}`}
          style={{ transform: `rotate(${hourAngle}deg)` }}
        />

        {/* Second needle — thin red sweep hand */}
        <div
          className={`${styles.needle} ${styles.secondNeedle}`}
          style={{ transform: `rotate(${secondAngle}deg)` }}
        />
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_10_20);
MemoizedClock.displayName = 'Clock_26_10_20';
export default MemoizedClock;
