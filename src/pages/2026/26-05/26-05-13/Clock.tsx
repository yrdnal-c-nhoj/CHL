import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

import dripFont from '@/assets/fonts/26fonts/26-05-13.otf?url';
import analogBgImage from '@/assets/images/26_images/26-05/26-05-13/klein.webp';
import bgVideo from '@/assets/images/26_images/26-05/26-05-13/26-05-13-yves.mp4?url';

export const background = analogBgImage;

const AnalogClock: React.FC = () => {
  const now = useMillisecondClock();

  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'BorrowedAnalog',
        fontUrl: dripFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const pad2 = (n: number) => n.toString().padStart(2, '0');

  const hours = pad2(now.getHours());
  const minutes = pad2(now.getMinutes());
  const seconds = pad2(now.getSeconds());
  const timeText = `${hours}:${minutes}:${seconds}`;

  return (
    <div className={styles.container}>
      {/* Video Layer (behind background image) */}
      <video
        className={styles.videoLayer}
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Background Layer */}
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${analogBgImage})`,
        }}
      />

      {/* Digital Time Layer */}
      <div className={styles.face}>
        <div
          className={styles.digitalTime}
          aria-label={`Current time ${timeText}`}
        >
          {/* fixed stable layout: HH : MM : SS */}
          <span className={styles.digitGroup} aria-hidden="true">
            <span className={styles.digitBox}>{hours[0]}</span>
            <span className={styles.digitBox}>{hours[1]}</span>
            <span className={styles.digitBox}>{minutes[0]}</span>
            <span className={styles.digitBox}>{minutes[1]}</span>
            <span className={styles.digitBox}>{seconds[0]}</span>
            <span className={styles.digitBox}>{seconds[1]}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;
