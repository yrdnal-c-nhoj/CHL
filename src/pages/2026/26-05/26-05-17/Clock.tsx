import React, { useMemo, Suspense } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { formatTime } from '@/utils/clockUtils';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

// Asset Imports
// Reverting to the standard .otf extension without the extra suffix
import clockFont from '@/assets/fonts/2026/26-05-17.otf?url';
import clockVideo from '@/assets/images/2026/26-05/26-05-17/26-05-17.mp4';

// ---------------- CONFIGURATION ----------------
const CLOCK_CONFIG = {
  COLORS: {
    background: '#000000',
    primary: '#FFFFFF',
  },
} as const;

const FONT_FAMILY = 'ClockFont_26_05_17';

// ---------------- FONT CONFIGURATION ----------------
export const fontConfigs: FontConfig[] = [
  {
    fontFamily: FONT_FAMILY,
    fontUrl: clockFont,
    options: { weight: 'normal', style: 'normal' }
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
    <source src={clockVideo} type="video/mp4" />
  </video>
);

// ---------------- MAIN CLOCK COMPONENT ----------------
const ClockContent: React.FC = () => {
  const currentTime = useClockTime();
  
  // Use direct date methods to ensure "undefined" never appears
  const timeString = useMemo(() => {
    const h = String(currentTime.getHours()).padStart(2, '0');
    const m = String(currentTime.getMinutes()).padStart(2, '0');
    const s = String(currentTime.getSeconds()).padStart(2, '0');
    return `${h}${m}${s}`;
  }, [currentTime]);

  // Load fonts with suspense to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  return (
    <>
      <BackgroundLayers />
      <time 
        dateTime={currentTime.toISOString()} 
        className={styles.digitalTime}
        style={{ fontFamily: FONT_FAMILY }}
      >
        {timeString.split('').map((char, index) => (
          <span key={index} className={styles.digitBox}>
            {char}
          </span>
        ))}
      </time>
    </>
  );
};

const DigitalClock: React.FC = () => {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div style={{ color: 'red', fontSize: '2rem' }}>Loading Clock...</div>}>
        <ClockContent />
      </Suspense>
    </div>
  );
};

export default DigitalClock;
