import React from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

// ---------------- FONT CONFIGURATION ----------------
const fontConfigs = [
  {
    name: 'ClockFont',
    url: '@/assets/fonts/26fonts/26-05-05-dolphin.ttf',
  },
];

const BackgroundLayers: React.FC = () => (
  <video className={styles.backgroundVideo} autoPlay loop muted playsInline>
    <source
      src="/src/assets/images/26_images/26-05/26-05-05/jump.mp4"
      type="video/mp4"
    />
  </video>
);

function get12HourParts(date: Date): {
  hh: string;
  mm: string;
  ampm: 'AM' | 'PM';
} {
  const rawHours = date.getHours();
  const ampm: 'AM' | 'PM' = rawHours >= 12 ? 'PM' : 'AM';
  const hours12 = rawHours % 12 || 12;

  const hh = String(hours12).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return { hh, mm, ampm };
}

// ---------------- MAIN CLOCK COMPONENT ----------------
const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  // Load fonts with suspense to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  const { hh, mm, ampm } = get12HourParts(currentTime);
  const ariaLabel = `Current time ${hh}${mm} ${ampm}`;

  return (
    <div className={styles.container}>
      <BackgroundLayers />

      <time dateTime={currentTime.toISOString()} className={styles.clockFace} aria-label={ariaLabel}>
        {/* 6 cells total, no separators/spaces */}
        <div className={styles.digitalGrid} aria-hidden="true">
          <span className={styles.cell}>{hh[0]}</span>
          <span className={styles.cell}>{hh[1]}</span>
          <span className={styles.cell}>{mm[0]}</span>
          <span className={styles.cell}>{mm[1]}</span>
          <span className={styles.cell}>{ampm[0]}</span>
          <span className={styles.cell}>{ampm[1]}</span>
        </div>
      </time>
    </div>
  );
};

export default DigitalClock;

