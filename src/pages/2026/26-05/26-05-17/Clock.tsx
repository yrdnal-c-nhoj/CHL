import React from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { formatTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

// ---------------- CONFIGURATION ----------------
const CLOCK_CONFIG = {
  COLORS: {
    background: '#000000',
    primary: '#FFFFFF',
  },
} as const;

// ---------------- FONT CONFIGURATION ----------------
const fontConfigs = [
  {
    name: 'ClockFont',
    url: '@/assets/fonts/2026/26-05-17-font.ttf',
  },
];

// ---------------- UTILITIES ----------------
// ---------------- COMPONENTS ----------------
const BackgroundLayers: React.FC = () => (
  <video
    className={styles.backgroundVideo}
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/src/assets/images/2026/26-05/26-05-17/26-05-17.mp4" type="video/mp4" />
  </video>
);

// ---------------- MAIN CLOCK COMPONENT ----------------
const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();
  const timeString = formatTime(currentTime, '24h');

  // Load fonts with suspense to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  return (
    <div className={styles.container}>
      <BackgroundLayers />
      
      <time dateTime={currentTime.toISOString()} className={styles.timeDisplay}>
        {timeString}
      </time>
    </div>
  );
};

export default DigitalClock;
