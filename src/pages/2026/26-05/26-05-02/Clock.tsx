import React, { useMemo, useRef, useEffect } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import AnimatedDigit from '@/components/AnimatedDigit';

import carVideo from '@/assets/images/2026/26-05/26-05-02/car.mp4';
// Import the corresponding font from the assets folder
import fontUrl from '@/assets/fonts/2026/26-05-02-carfall.ttf?url';

// Export assets for the preloading pipeline
export const assets = [carVideo];

// Font configuration for the suspense loader
const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont', fontUrl },
];

import styles from './Clock.module.css';

interface HandProps {
  angle: number;
  length: number;
  width: number;
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const getHandZIndex = (type: 'hour' | 'minute' | 'second'): number => {
  if (type === 'second') return 30;
  if (type === 'minute') return 20;
  return 10;
};

const getHandBorderRadius = (type: 'hour' | 'minute' | 'second', width: number): string => {
  if (type === 'second') return '1px';
  return `${width / 2}px`;
};

const getHandTransition = (type: 'hour' | 'minute' | 'second'): string => {
  if (type === 'second') return 'none';
  return 'transform 0.1s ease-out';
};

const ClockHand: React.FC<HandProps> = ({ angle, length, width, color, type }) => {
  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius: getHandBorderRadius(type, width),
    zIndex: getHandZIndex(type),
    transition: getHandTransition(type),
  };

  return <div style={handStyle} className={styles.hand} data-hand-type={type} />;
};

const AnalogClock: React.FC = () => {
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  // Suspend rendering until the custom font is ready
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const animate = () => {
      forceRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // This ensures the milliseconds update smoothly in the digital boxes.
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();
  const isoTime = now.toISOString();

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  const tickMarks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const isHour = i % 5 === 0;
      const angle = i * 6;
      return {
        id: i,
        angle,
        isHour,
        length: isHour ? 16 : 8,
        width: isHour ? 4 : 2,
      };
    });
  }, []);

  const numbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i === 0 ? 12 : i;
      const angle = i * 30;
      const radian = (angle - 90) * (Math.PI / 180);
      const radius = 35;
      const x = 50 + radius * Math.cos(radian);
      const y = 50 + radius * Math.sin(radian);
      return {
        num,
        x,
        y,
      };
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.videoOverlay} />
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />
      <time dateTime={isoTime} className={styles.timeWrapper}>
        <div className={styles.digitalTime}>
          <span className={styles.digitGroup}>
            <AnimatedDigit value={String(hours).padStart(2, '0')[0]} className={styles.digitBox} />
            <AnimatedDigit value={String(hours).padStart(2, '0')[1]} className={styles.digitBox} />
            <AnimatedDigit value={String(minutes).padStart(2, '0')[0]} className={styles.digitBox} />
            <AnimatedDigit value={String(minutes).padStart(2, '0')[1]} className={styles.digitBox} />
            <AnimatedDigit value={String(seconds).padStart(2, '0')[0]} className={styles.digitBox} />
            <AnimatedDigit value={String(seconds).padStart(2, '0')[1]} className={styles.digitBox} />
            <span className={styles.digitBox}>{String(Math.floor(ms / 10)).padStart(2, '0')[0]}</span>
            <span className={styles.digitBox}>{String(Math.floor(ms / 10)).padStart(2, '0')[1]}</span>
          </span>
        </div>
      </time>
    </div>
  );
};

export default AnalogClock;
