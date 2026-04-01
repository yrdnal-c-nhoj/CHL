import React, { useMemo } from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgVideo from '@/assets/images/2026/26-03/26-03-28/water.mp4';
import bgImage from '@/assets/images/2026/26-03/26-03-28/h2o.webp';
import clockFont from '@/assets/fonts/2026/26-03-28-h2o.ttf';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const time = useMillisecondClock();

  // Font configuration with Suspense loading
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'H2OClock',
      fontUrl: clockFont,
    }
  ], []);

  // This hook suspends the component until fonts are loaded, preventing FOUC
  useSuspenseFontLoader(fontConfigs);


  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds();
  const msTens = Math.floor(ms / 100).toString();
  const msOnes = Math.floor((ms % 100) / 10).toString();

  return (
    <div className={styles.container}>
      {/* Video background - bottom layer */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.videoBackground}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Image overlay - top layer */}
      <div
        className={styles.imageOverlay}
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Image overlay - flipped 180° horizontally */}
      <div
        className={styles.imageOverlayFlipped}
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Clock display */}
      <div className={styles.clockDisplay}>
        {/* Hours */}
        <div className={styles.digitBox}>{hours[0]}</div>
        <div className={styles.digitBox}>{hours[1]}</div>
        {/* Minutes */}
        <div className={styles.digitBox}>{minutes[0]}</div>
        <div className={styles.digitBox}>{minutes[1]}</div>
        {/* Seconds */}
        <div className={styles.digitBox}>{seconds[0]}</div>
        <div className={styles.digitBox}>{seconds[1]}</div>
        <div className={styles.digitBox}>{msTens}</div>
        <div className={styles.digitBox}>{msOnes}</div>
      </div>
    </div>
  );
};

export default Clock;
