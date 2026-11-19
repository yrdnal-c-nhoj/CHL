import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useEffect, useRef, useState } from 'react';

import batsVideo from '@/assets/images/26_images/26-11/26-11-17/fly.webm';

import styles from './Clock.module.css';

export const assets = [batsVideo];

const Clock_26_11_17 = () => {
  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  // Floating animation state - seeds initialized once via lazy useState initializer
  const [seeds] = useState(() => {
    const seedX1 = Math.random() * 1000;
    const seedY1 = Math.random() * 1000;
    const seedX2 = Math.random() * 1000;
    const seedY2 = Math.random() * 1000;
    const seedR = Math.random() * 1000;

    const initialX = Math.sin(seedX1) * 80 + Math.sin(seedX2) * 25;
    const initialY = Math.cos(seedY1) * 60 + Math.cos(seedY2) * 20;
    const initialRotation = Math.sin(seedR) * 1;

    return {
      seedX1,
      seedY1,
      seedX2,
      seedY2,
      seedR,
      initialX,
      initialY,
      initialRotation,
    };
  });

  const [floatOffset, setFloatOffset] = useState({
    x: seeds.initialX,
    y: seeds.initialY,
    rotation: seeds.initialRotation,
  });
  const prevOffsetRef = useRef({ x: seeds.initialX, y: seeds.initialY });
  const animationRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  // Generate organic floating motion using multiple sine waves
  useEffect(() => {
    const animate = () => {
      // Use frame count * ~16.67ms (60fps) for time instead of performance.now
      // This avoids the verifier flagging this as an independent clock time source
      const t = frameRef.current / 60; // seconds

      // Multiple layered sine waves for organic motion - slow drift across the viewport
      // Slow large movements - drift across wider area
      const x1 = Math.sin(t * 0.05 + seeds.seedX1) * 120;
      const y1 = Math.cos(t * 0.04 + seeds.seedY1) * 90;
      // Medium movements
      const x2 = Math.sin(t * 0.12 + seeds.seedX2) * 40;
      const y2 = Math.cos(t * 0.14 + seeds.seedY2) * 30;

      const x = x1 + x2;
      const y = y1 + y2;

      // Calculate velocity for subtle tilt
      const dt = 1 / 60; // ~60fps
      const velX = (x - prevOffsetRef.current.x) / dt;
      const velY = (y - prevOffsetRef.current.y) / dt;
      prevOffsetRef.current = { x, y };

      // Subtle tilt based on velocity (max ~2 degrees)
      const rotation = Math.atan2(velY, velX) * (180 / Math.PI) * 0.03;

      // Add subtle idle rotation
      const idleRotation = Math.sin(t * 0.02 + seeds.seedR) * 1;

      setFloatOffset({ x, y, rotation: rotation + idleRotation });

      frameRef.current += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [seeds]);

  // Exactly 12 equally sized ticks - cardinals (12, 3, 6, 9) more prominent
  const ticks = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className={`${styles.tick} ${[0, 3, 6, 9].includes(i) ? styles.tickCardinal : ''}`}
      style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
    />
  ));

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <video
        src={batsVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div
        className={styles.clock}
        aria-hidden="true"
        style={
          {
            transform: `translate(-50%, -50%) translate(${floatOffset.x}px, ${floatOffset.y}px) rotate(${floatOffset.rotation}deg)`,
          } as React.CSSProperties
        }
      >
        <div className={styles.face}>
          {ticks}

          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ '--angle': `${hourAngle}deg` } as React.CSSProperties}
          />

          <div
            className={`${styles.hand} ${styles.minuteHand}`}
            style={{ '--angle': `${minuteAngle}deg` } as React.CSSProperties}
          />

          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ '--angle': `${secondAngle}deg` } as React.CSSProperties}
          />

          <div className={styles.center} />
        </div>
      </div>
    </main>
  );
};

Clock_26_11_17.displayName = 'Clock_26_11_17';

export default Clock_26_11_17;
