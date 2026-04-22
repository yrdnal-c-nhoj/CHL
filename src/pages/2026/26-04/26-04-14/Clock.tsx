import React, { useMemo } from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

// Asset import for video and overlay image
import bgVideo from '@/assets/images/2026/26-04/26-04-14/haumeas.mp4';
import overlayImage from '@/assets/images/2026/26-04/26-04-14/haumea.webp';

// Export assets for the preloading pipeline
export { bgVideo, overlayImage };

const Clock: React.FC = () => {
  // Load Hanalei font using useSuspenseFontLoader
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Hanalei', fontUrl: 'https://fonts.gstatic.com/s/hanalei/v23/wEO_EBrAnchaJ3eGCBz5hQ.woff2' }
  ], []);
  useSuspenseFontLoader(fontConfigs);

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

      {/* Overlay image on top of video */}
      <img src={overlayImage} alt="" className={styles.imageOverlay} />

      {/* Radial gradient overlay - covers background only */}
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
                '--x': `${x}%`,
                '--y': `${y}%`,
                '--rot': `${rot}deg`,
              } as React.CSSProperties}
            >
              {num}
            </span>
          );
        })}

        <Hand deg={hourDeg} className={styles.hourHand} />
        <Hand deg={minDeg} className={styles.minuteHand} />
        <Hand deg={secDeg} className={styles.secondHand} />

        <div className={styles.centerDot} />
      </time>
    </main>
  );
};

interface HandProps { deg: number; className: string; }
const Hand: React.FC<HandProps> = ({ deg, className }) => (
  <div 
    className={className} 
    style={{ '--deg': `${deg}deg` } as React.CSSProperties} 
  />
);

export default Clock;