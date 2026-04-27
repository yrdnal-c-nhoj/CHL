import React, { useMemo } from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import styles from './Clock.module.css';

// Asset imports
import bgVideo from '@/assets/images/2026/26-04/26-04-14/haumeas.mp4';
import overlayImage from '@/assets/images/2026/26-04/26-04-14/haumea.webp';

// Export assets for preloading
export { bgVideo, overlayImage };

const Clock: React.FC = () => {
  const time = useMillisecondClock(16);
  const ms = time.getMilliseconds();

  const { secDeg, minDeg, hourDeg } = useMemo(() => {
    const s = time.getSeconds() + ms / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;

    return {
      secDeg: s * 6,
      minDeg: m * 6,
      hourDeg: h * 30,
    };
  }, [time, ms]);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <main className={styles.container}>
      <video src={bgVideo} autoPlay loop muted playsInline className={styles.video} />
      <img src={overlayImage} alt="" className={styles.imageOverlay} />
      <div className={styles.overlay} />
      <time className={styles.clockFace} dateTime={time.toISOString()}>
        {numbers.map((num) => {
          const angle = num * 30 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 38 * Math.cos(rad);
          const y = 50 + 38 * Math.sin(rad);
          const rot = angle + 90;

          return (
            <span
              key={num}
              className={styles.number}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              }}
            >
              {num}
            </span>
          );
        })}

        <div className={`${styles.hand} ${styles.hourHand}`} style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
        <div className={`${styles.hand} ${styles.minuteHand}`} style={{ transform: `translateX(-50%) rotate(${minDeg}deg)` }} />
        <div className={`${styles.hand} ${styles.secondHand}`} style={{ transform: `translateX(-50%) rotate(${secDeg}deg)` }} />
        <div className={styles.centerDot} />
      </time>
    </main>
  );
};

export default Clock;