import React from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import clockFont from '@/assets/fonts/2026/26-05-19.ttf';
import bgImage from '@/assets/images/2026/26-05/26-05-19/bliss.webp';
import styles from './Clock.module.css';

export const assets = [clockFont, bgImage];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_05_19',
    fontUrl: clockFont,
  },
];

const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  useSuspenseFontLoader(fontConfigs);

  const timeString = currentTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(/:/g, '');

  return (
    <div 
      className={styles.container}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <time 
        dateTime={currentTime.toISOString()} 
        className={styles.digitalTime}
        style={{ fontFamily: 'ClockFont_26_05_19, sans-serif' }}
      >
        {timeString.split('').map((char, index) => (
          <span key={index} className={styles.digitBox}>
            {char}
          </span>
        ))}
      </time>
    </div>
  );
};

export default DigitalClock;
