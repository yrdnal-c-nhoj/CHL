import React from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

// ---------------- FONT CONFIGURATION ----------------
const fontConfigs = [
  {
    name: 'ClockFont',
    url: '@/assets/fonts/2026/26-05-05-dolphin.ttf',
  },
];

// ---------------- COMPONENTS ----------------
// ---------------- MAIN COMPONENT ----------------
const AnalogClock: React.FC = () => {
  // Load fonts with suspense to prevent FOUC
  useSuspenseFontLoader(fontConfigs);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImageTop} />
      <div className={styles.backgroundImage} />
    </div>
  );
};

export default AnalogClock;
