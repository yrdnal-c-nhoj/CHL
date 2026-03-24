import React, { useState, useEffect, CSSProperties } from 'react';

// Asset imports
import clockDigitImage from '../../../assets/images/26-01/26-01-23/eye.gif';
import clockBackground from '../../../assets/images/26-01/26-01-23/eye.webp';
import styles from './Clock.module.css';

interface CustomStyle extends CSSProperties {
  '--rotation'?: string;
}

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [bgReady, setBgReady] = useState<boolean>(false);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Preload background and digit asset to avoid flash
  useEffect(() => {
    let isMounted = true;
    const imgs = [clockDigitImage, clockBackground];
    
    const loadPromises = imgs.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });
    });

    Promise.all(loadPromises).then(() => {
      if (isMounted) setBgReady(true);
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      if (isMounted) setBgReady(true);
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  // Calculate time values including milliseconds for smooth movement
  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  // Rotations
  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360;
  const hourDeg = ((hours % 12) / 12) * 360;

  // Background rotation: Counter-clockwise (-), once per 60 seconds
  const bgRotation = -(seconds / 60) * 360;

  return (
    <div
      className={styles.container}
      style={{
        opacity: bgReady ? 1 : 0,
        visibility: bgReady ? 'visible' : 'hidden',
      }}
    >
      <div className={styles.clockFace}>
        {/* Rotating Background Layer */}
        <div
          className={styles.bgLayer}
          style={{
            backgroundImage: `url(${clockBackground})`,
            '--rotation': `${bgRotation}deg`,
          } as CustomStyle}
        />

        {/* Static Digits Layer */}
        {[...Array(12)].map((_, i) => {
          const rotation = (i + 1) * 30;
          return (
            <div
              key={i}
              className={styles.digitContainer}
              style={{ '--rotation': `${rotation}deg` } as CustomStyle}
            >
              <img
                decoding="async"
                loading="lazy"
                src={clockDigitImage}
                alt={`digit-${i + 1}`}
                className={styles.digitImage}
              />
            </div>
          );
        })}

        {/* Hands */}
        <div
          className={`${styles.hand} ${styles.handHour}`}
          style={{ '--rotation': `${hourDeg}deg` } as CustomStyle}
        />
        <div
          className={`${styles.hand} ${styles.handMinute}`}
          style={{ '--rotation': `${minDeg}deg` } as CustomStyle}
        />
        <div
          className={`${styles.hand} ${styles.handSecond}`}
          style={{ '--rotation': `${secDeg}deg` } as CustomStyle}
        />

        {/* Center Pivot */}
        <div className={styles.centerDot} />
      </div>
    </div>
  );
};

export default Clock;
