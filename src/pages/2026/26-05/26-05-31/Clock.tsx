import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { memo, useMemo } from 'react';
import styles from './Clock.module.css';

import customFont from '@/assets/fonts/26fonts/26-05-31.ttf?url';
import hotwater from '@/assets/images/26_images/26-05/26-05-31/hotwater.webp';

const accordionBg = hotwater;
const bellImage2 = hotwater;

export const assets = [bellImage2, accordionBg];

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

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
  },
];

const DigitalClock = () => {
  const currentTime = useMillisecondClock(50);

  useSuspenseFontLoader(FONT_CONFIGS);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  const milliseconds = Math.floor(currentTime.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0');

  return (
    <main className={styles.container}>
      <BackgroundLayers />

      <div className={styles.face}>
        <time
          dateTime={currentTime.toISOString()}
          className={styles.srOnly}
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
    </main>
  );
};

const MemoizedClock = memo(DigitalClock);
MemoizedClock.displayName = 'Clock_26_05_31';
export default MemoizedClock;
