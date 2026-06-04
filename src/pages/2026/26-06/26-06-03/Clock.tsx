import westVideo from '@/assets/images/26_images/26-06/26-06-03/timbrr.mp4';
import westtImage from '@/assets/images/26_images/26-06/26-06-03/trees.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

// Import the font with the corresponding date from the assets folder
const fontUrl = new URL(
  '../../../../assets/fonts/26fonts/26-06-03.otf',
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

  const getHandStyle = (width, height, angle, zIndex) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: '#5B6C5F88',
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    zIndex,
    willChange: 'transform',
  });

  const getNumberStyle = (num: number): React.CSSProperties => {
    // Calculate angle for each number (1-12).
    // -90 degrees offset to make 12 o'clock point upwards (0 degrees in standard trig).
    const angle = (num * 30) - 90;
    const rad = (angle * Math.PI) / 180;
    // Radius for number placement, as a percentage of the clock's container size.
    // Adjust this value to move numbers closer or further from the center.
    const radius = 40;

    // Calculate x and y coordinates using trigonometry, relative to the center (50%, 50%).
    const x = 50 + radius * Math.cos(rad);
    const y = 50 + radius * Math.sin(rad);

    return {
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%) rotate(${num * 30}deg)`, // Rotate numbers to align radially with the perimeter
      fontSize: '15.5vh', // Responsive font size based on viewport width
      fontFamily: 'ClockFont_26_06_03',
      fontWeight: 'bold',
      color: '#023315', // Matching the hand color for consistency
      zIndex: 2, // Ensures numbers are below the hands but above the background
      textShadow: '0 1px 1px rgba(232, 233, 238, 0.4)', // Subtle glow for visibility
    };
  };

  return (
    <div style={{ width: '45vw', height: '45vw', position: 'relative' }}>
      {/* Render clock numbers 1 through 12 */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
        <div key={num} style={getNumberStyle(num)}>{num}</div>
      ))}
      <div style={getHandStyle('5px', '28%', angles.hr, 3)} />
      <div style={getHandStyle('3.5px', '42%', angles.min, 4)} />
      <div style={getHandStyle('1.5px', '48%', angles.sec, 5)} />

      
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
