import React, { useEffect, useRef, useState } from 'react';

import portholeVideo from '@/assets/images/26_images/26-07/26-07-25/porthole.mp4';
import { calculateAngles } from '@/utils/clockUtils';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [portholeVideo];

const Clock: React.FC = () => {
  // State to manage the dynamic offsets and rotation for the josseling effect
  const [offsets, setOffsets] = useState({ x: 0, y: 0, rot: 0 });
  // Ref to store the requestAnimationFrame ID for cleanup
  const animationFrameId = useRef<number | null>(null);
  // Ref to store the start time of the animation for consistent motion
  const startTime = useRef(Date.now());

  const time = useMillisecondClock();

  const {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle,
  } = calculateAngles(time, true); // Pass true for millisecond precision

  useEffect(() => {
    const animate = () => {
      const elapsed = (Date.now() - startTime.current) / 1000; // Time in seconds since animation started
      
      // Layer multiple sine/cosine waves with different, non-integer frequencies
      // and amplitudes to create a more complex and less predictable motion.

      // Horizontal sway (x-axis)
      const x1 = Math.sin(elapsed * 1.1) * 25;   // Slower, larger sway
      const x2 = Math.sin(elapsed * 2.7) * 10; // Faster, smaller jiggle
      const x = x1 + x2;

      // Vertical bounce (y-axis)
      const y1 = Math.cos(elapsed * 1.3) * 15;   // Slower, larger bounce
      const y2 = Math.cos(elapsed * 3.1) * 7;   // Faster, smaller jiggle
      const y = y1 + y2;

      // Rotation (rot)
      const rot1 = Math.sin(elapsed * 0.8) * 12;  // Slow, wide tilt
      const rot2 = Math.sin(elapsed * 2.2) * 5;  // Faster, sharper tilt
      const rot = rot1 + rot2;

      setOffsets({ x, y, rot });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

  return (
    <main className={styles.container}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        src={portholeVideo}
      />
    
      <div
        className={styles.analogClock}
        style={{
          // Apply the calculated offsets and rotation to the entire clock
          transform: `translate(${offsets.x}vmin, ${offsets.y}vmin) rotate(${offsets.rot}deg)`,
        }}
      >
        <div className={styles.face}>
          <div className={styles.twelveMarker} />
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }}
          />
          <div className={styles.center} />
        </div>
      </div>
      {/* Accessible time element, hidden from view but available to screen readers */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

const MemoizedClock = React.memo(Clock);
MemoizedClock.displayName = 'Clock_2026_07_24';

export default MemoizedClock;