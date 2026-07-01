import customFont from '@/assets/fonts/26fonts/26-05-12.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// Properly import assets so Vite can resolve and hash them
import fireImage from '@/assets/images/26_images/26-05/26-05-12/fire.webp';
import lionVideo from '@/assets/images/26_images/26-05/26-05-12/lionwalk.mp4';

const ROMAN_NUMERALS = [
  'XII',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
];

// Export assets for the useClockPage hook to preload
export const assets = [lionVideo, fireImage];

const fontConfigs = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const BackgroundLayers: React.FC = () => (
  <div className={styles.backgroundLayersContainer}>
    <div className={styles.twoUp}>
      <div className={styles.half}>
        <video
          className={styles.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={lionVideo} type="video/mp4" />
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
          <source src={lionVideo} type="video/mp4" />
        </video>
      </div>
    </div>
    <img src={fireImage} alt="" className={styles.fireOverlay} />
  </div>
);

const AnalogClock: React.FC = () => {
  const currentTime = useMillisecondClock();

  const rotations = useMemo(() => {
    const seconds =
      currentTime.getSeconds() + currentTime.getMilliseconds() / 1000;
    const minutes = currentTime.getMinutes() + seconds / 60;
    const hours = (currentTime.getHours() % 12) + minutes / 60;
    return {
      hr: hours * 30,
      min: minutes * 6,
      sec: seconds * 6,
    };
  }, [currentTime]);

  useSuspenseFontLoader(fontConfigs);

  return (
    <div className={styles.container}>
      <BackgroundLayers />

      {/* Analog Clock Construction */}
      <div className={styles.clockFace}>
        {/* Roman Numerals for the South Wind */}
        {ROMAN_NUMERALS.map((num, i) => (
          <div
            key={num}
            className={styles.numeral}
            style={{
              transform: `rotate(${i * 30}deg) translateY(-135px) rotate(-${i * 30}deg)`,
            }}
          >
            {num}
          </div>
        ))}

        <div className={styles.centerPin} />
        <div
          className={`${styles.hand} ${styles.hour}`}
          style={{ transform: `rotate(${rotations.hr}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minute}`}
          style={{ transform: `rotate(${rotations.min}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.second}`}
          style={{ transform: `rotate(${rotations.sec}deg)` }}
        />
      </div>
    </div>
  );
};
export default AnalogClock;
