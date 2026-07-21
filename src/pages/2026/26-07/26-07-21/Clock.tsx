import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, from 'react';

import gyroVideo from '@/assets/images/26_images/26-07/26-07-21/200.mp4';
import fontUrl from '@/assets/fonts/26fonts/26-07-20.ttf?url';

import styles from './Clock.module.css';

// Export assets for the preloading pipeline
export const assets = [gyroVideo, fontUrl];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_07_21', fontUrl },
];

const DigitalClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const now = useClockTime('ms');
  const isoTime = now.toISOString();

  // Calculate smooth hand rotations
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = now.getHours() + minutes / 60;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30;

  return (
    <div className={styles.container}>
      <video
        className={styles.repeatingBackground}
        src={gyroVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <video
        className={styles.videoBackground}
        src={gyroVideo}
        autoPlay
        loop
        muted
        playsInline
      />
    
      <div className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `rotate(${hourAngle}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${secondAngle}deg)` }}
        />
        <div className={styles.centerDot} />
      </div>
      {/* Screen reader accessible time */}
      <time dateTime={isoTime} className="sr-only" />
    </div>
  );
};

export default DigitalClock;