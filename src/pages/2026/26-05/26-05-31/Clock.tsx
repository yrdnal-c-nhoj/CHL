import React, { useEffect, useMemo, useRef } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

// ---------------- INTERFACES ----------------
interface HandDimensions {
  width: string;
  height: string;
  zIndex: number;
}

interface ClockHandProps {
  type: 'hour' | 'minute' | 'second';
  rotation: number;
}

interface TimeValues {
  hr: number;
  min: number;
  sec: number;
}

// ---------------- CONFIGURATION ----------------
const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
  COLORS: {
    background: '#000000',
    primary: '#FFFFFF',
    shadow: 'drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.8))',
  },
  HAND_DIMENSIONS: {
    hour: { width: '1.2vmin', height: '20vmin', zIndex: 3 },
    minute: { width: '0.8vmin', height: '32vmin', zIndex: 4 },
    second: { width: '0.4vmin', height: '38vmin', zIndex: 5 },
  },
} as const;

// ---------------- FONT CONFIGURATION ----------------
const fontConfigs = [
  {
    name: 'ClockFont',
    url: '@/assets/fonts/26fonts/26-05-05-dolphin.ttf',
  },
];

// ---------------- UTILITIES ----------------
const calculateTimeValues = (date: Date): TimeValues => {
  const msec = date.getMilliseconds();
  const sec = date.getSeconds() + msec / 1000;
  const min = date.getMinutes() + sec / 60;
  const hr = (date.getHours() % 12) + min / 60;

  return { hr, min, sec };
};

const calculateNumeralPosition = (number: number) => {
  const angleRad = (number / 12) * 2 * Math.PI;
  const angleDeg = (number / 12) * 360;

  return {
    x: 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angleRad),
    y: 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angleRad),
    angle: angleDeg,
  };
};

const getHandRotation = (value: number, multiplier: number): number => value * multiplier;

// ---------------- COMPONENTS ----------------
const BackgroundLayers: React.FC = () => (
  <video
    className={styles.backgroundVideo}
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/src/assets/images/2026/26-05/26-05-05/jump.mp4" type="video/mp4" />
  </video>
);

const ClockNumerals: React.FC = () => {
  const numerals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const { x, y, angle } = calculateNumeralPosition(num);

      return (
        <div
          key={num}
          className={styles.numeral}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          }}
        >
          {num}
        </div>
      );
    });
  }, []);

  return <>{numerals}</>;
};

const ClockHand: React.FC<ClockHandProps> = ({ type, rotation }) => {
  const { width, height, zIndex } = CLOCK_CONFIG.HAND_DIMENSIONS[type];

  return (
    <div
      className={styles.hand}
      style={{
        width,
        height,
        zIndex,
        transform: `translate(-50%, 0) rotate(${rotation}deg)`,
      }}
    />
  );
};

const CenterDot: React.FC = () => (
  <div className={styles.centerDot} />
);

// ---------------- MAIN CLOCK COMPONENT ----------------
const AnalogClock: React.FC = () => {
  const currentTime = useClockTime();
  const { hr, min, sec } = calculateTimeValues(currentTime);

  // Load fonts with suspense to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  return (
    <div className={styles.container}>
      <BackgroundLayers />
      
      <time dateTime={currentTime.toISOString()} className={styles.clockFace}>
        <ClockNumerals />
        
        <ClockHand type="hour" rotation={getHandRotation(hr, 30)} />
        <ClockHand type="minute" rotation={getHandRotation(min, 6)} />
        <ClockHand type="second" rotation={getHandRotation(sec, 6)} />
        
        <CenterDot />
      </time>
    </div>
  );
};

export default AnalogClock;
