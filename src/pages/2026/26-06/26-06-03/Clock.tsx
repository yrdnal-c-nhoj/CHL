import westtImage from '@/assets/images/26_images/26-06/26-06-03/timbrr.webp';
import westVideo from '@/assets/images/26_images/26-06/26-06-03/tre.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

// Export assets for the dynamic loader (useClockPage.ts) to preload
export const assets = [westtImage, westVideo];

// Import the font with the corresponding date from the assets folder
const fontUrl = new URL(
  '../../../../assets/fonts/26fonts/26-06-03.ttf',
  import.meta.url,
).href;

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_03',
    fontUrl,
  },
];

const AnalogClock: React.FC = () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const angles = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    return {
      sec: (s + ms / 1000) * 6,
      min: (m + s / 60 + ms / 60000) * 6,
      hr: ((h % 12) + m / 60 + s / 3600) * 30,
    };
  }, [time]);

  const getHandStyle = (width: string, height: string, angle: number, zIndex: number): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: '#02331588',
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    zIndex,
    willChange: 'transform'
  });

  // Memoize static number positions so we don't recalculate trig every millisecond
  const clockNumbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const angle = (num * 30) - 90;
      const rad = (angle * Math.PI) / 180;
      const radius = 40; // % of container
      
      return {
        num,
        style: {
          position: 'absolute' as const,
          left: `${50 + radius * Math.cos(rad)}%`,
          top: `${50 + radius * Math.sin(rad)}%`,
          transform: `translate(-50%, -50%) rotate(${num * 30}deg)`,
          fontSize: '12vh',
          fontFamily: 'ClockFont_26_06_03',
          color: '#3A5434',
          zIndex: 2,
          textShadow: '0 1px 1px rgba(232, 233, 238, 0.94)',
          userSelect: 'none' as const
        }
      };
    });
  }, []);

  return (
    <time 
      dateTime={time.toISOString()} 
      style={{ width: '85vh', height: '85vh', position: 'relative', display: 'block' }}
    >
      {clockNumbers.map(({ num, style }) => (
        <div key={num} style={style}>{num}</div>
      ))}
      {/* Hands */}
      <div style={getHandStyle('1.2vw', '28%', angles.hr, 3)} />
      <div style={getHandStyle('0.8vw', '42%', angles.min, 4)} />
      <div style={getHandStyle('0.3vw', '48%', angles.sec, 5)} />
    </time>
  );
};

const Clock: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className={styles.container}>
      <video autoPlay loop muted playsInline className={styles.video}>
        <source src={westVideo} type="video/mp4" />
      </video>

      <img src={westtImage} alt="" className={styles.westtImage} decoding="sync" />

      <section className={styles.analogClockSection}>
        <AnalogClock />
      </section>
    </main>
  );
};

export default Clock;
