import React from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';
import type { FontConfig } from '@/types/clock';

const LION_VIDEO_SRC = '/src/assets/images/2026/26-05/26-05-12/lionwalk.mp4';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont',
    fontUrl: '@/assets/fonts/2026/26-05-05-dolphin.ttf',
  },
];

const BackgroundLayers: React.FC = () => (
  <div className={styles.twoUp}>
    <div className={styles.half}>
      <video
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={LION_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>

    <div className={styles.half}>
      <video
        className={styles.backgroundVideoMirror}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={LION_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  </div>
);

const AnalogClock: React.FC = () => {
  // Keep time subscription so this route still updates if that’s how the app works.
  const currentTime = useClockTime();

  // Keep suspense font loading (even though we removed the clock UI)
  useSuspenseFontLoader(fontConfigs);

  void currentTime;

  return (
    <div className={styles.container}>
      <BackgroundLayers />
    </div>
  );
};

export default AnalogClock;

