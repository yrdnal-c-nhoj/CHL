import React from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import clockFont from '@/assets/fonts/26fonts/26-05-19.ttf?url';
import bgImage from '@/assets/images/2026/26-05/26-05-19/bliss.webp';
import windowsImage from '@/assets/images/2026/26-05/26-05-19/windows5.webp';
import bloowinImage from '@/assets/images/2026/26-05/26-05-19/bloowin.webp';
import styles from './Clock.module.css';

export const assets = [clockFont, bgImage, windowsImage, bloowinImage];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_05_19',
    fontUrl: clockFont,
  },
];

const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  useSuspenseFontLoader(fontConfigs);

  const timeString = currentTime
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bgImage})` }}>
      <img
        src={bloowinImage}
        alt="Bloowin"
        className={styles.cornerLogo}
      />
      <time
        dateTime={currentTime.toISOString()}
        className={styles.digitalTime}
        style={{ fontFamily: 'ClockFont_26_05_19, sans-serif' }}
      >
        {timeString
          .replace(/\./g, '')
          .replace(/:/g, '')
          .replace(/\s/g, '')
          .split(/(\d|\s|am|pm)/g)
          .filter((token) => token !== '')
          .map((token, index) => (
            <span
              key={index}
              className={styles.digitBox}
              style={{ ['--digit-mask-image' as any]: `url(${windowsImage})` }}
            >
              {token === ' ' ? '\u00A0' : token}
            </span>
          ))}
      </time>
    </div>
  );
};

export default DigitalClock;
