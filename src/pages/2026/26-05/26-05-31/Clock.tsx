import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { memo, useEffect, useState } from 'react';
import styles from './Clock.module.css';

import customFont from '@/assets/fonts/26fonts/26-05-31.ttf?url';
import hotwater from '@/assets/images/26_images/26-05/26-05-31/hotwater.webp';

const accordionBg = hotwater;
const bellImage2 = hotwater;

// ======================================================
// Config & Constants
// ======================================================

export const assets = [bellImage2, accordionBg];

// ======================================================
// Pure Presentational Components (Render Once)
// ======================================================

const BackgroundLayers = memo(() => (
  <>
    <div
      className={styles.backgroundLayer}
      style={{
        backgroundImage: `url(${accordionBg})`,
        backgroundSize: '45vmin',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        zIndex: -1,
      }}
    />
    <div
      className={styles.backgroundLayer}
      style={{ opacity: 0.12, zIndex: 0 }}
    />
    <div
      className={styles.backgroundLayer}
      style={{
        backgroundImage: `url(${bellImage2})`,
        backgroundSize: '100vmin',
        zIndex: 1,
      }}
    />
  </>
));
BackgroundLayers.displayName = 'BackgroundLayers';

// ======================================================
// Main Component
// ======================================================

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
  },
];

const DigitalClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      setCurrentTime(new Date());
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useSuspenseFontLoader(FONT_CONFIGS);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  const milliseconds = Math.floor(currentTime.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0');

  return (
    <div className={styles.container}>
      <BackgroundLayers />

      <div className={styles.face}>
        <time
          dateTime={currentTime.toISOString()}
          className={styles.digitalTime}
        >
          <span className={styles.digitGroup}>
            <span className={styles.digitBox}>{hours[0]}</span>
            <span className={styles.digitBox}>{hours[1]}</span>
            <span className={styles.separator}>:</span>
            <span className={styles.digitBox}>{minutes[0]}</span>
            <span className={styles.digitBox}>{minutes[1]}</span>
            <span className={styles.separator}>:</span>
            <span className={styles.digitBox}>{seconds[0]}</span>
            <span className={styles.digitBox}>{seconds[1]}</span>
            <span className={styles.separator}>:</span>
            <span className={styles.digitBox}>{milliseconds[0]}</span>
            <span className={styles.digitBox}>{milliseconds[1]}</span>
          </span>
        </time>
      </div>
    </div>
  );
};

export default memo(DigitalClock);
