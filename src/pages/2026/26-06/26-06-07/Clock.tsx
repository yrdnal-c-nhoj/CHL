import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useRef } from 'react';

import carVideo from '@/assets/images/26_images/26-06/26-06-07/spacewalk2.mp4';
// Import the corresponding font from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-06-07.ttf?url';

// Export assets for the preloading pipeline
export const assets = [carVideo, fontUrl];

// Font configuration for the suspense loader
const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont_26_06_07', fontUrl }];

import styles from './Clock.module.css';

const DigitalClock: React.FC = () => {
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
            <span className={styles.digitBox}>
              {String(hours).padStart(2, '0')[0]}
            </span>
            <span className={styles.digitBox}>
              {String(hours).padStart(2, '0')[1]}
            </span>
            <span className={styles.digitBox}>
              {String(minutes).padStart(2, '0')[0]}
            </span>
            <span className={styles.digitBox}>
              {String(minutes).padStart(2, '0')[1]}
            </span>
            <span className={styles.digitBox}>
              {String(seconds).padStart(2, '0')[0]}
            </span>
            <span className={styles.digitBox}>
              {String(seconds).padStart(2, '0')[1]}
            </span>
            <span className={styles.digitBox}>
              {String(Math.floor(ms / 10)).padStart(2, '0')[0]}
            </span>
            <span className={styles.digitBox}>
              {String(Math.floor(ms / 10)).padStart(2, '0')[1]}
            </span>
          </span>
        </div>
      </time>
    </div>
  );
};

export default DigitalClock;
