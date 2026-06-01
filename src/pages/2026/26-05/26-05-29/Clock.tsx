// import bloowinImage from '@/assets/images/26_images/26-05/26-05-19/bloowin.webp';

import bgImage from '@/assets/images/26_images/26-05/26-05-29/granite.webp';

import { useClockTime } from '@/utils/hooks';
import React, { useEffect } from 'react';
import styles from './Clock.module.css';

export const assets = [bgImage];

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Bentham&display=swap';

const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Format time for 12-hour display, no leading zero for hours, with AM/PM, and no seconds.
  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric', // 'numeric' for no leading zero
    minute: '2-digit',
    hour12: true,
  });

  const [timePart, ampmPart] = timeString.split(/\s+/);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <time
        dateTime={currentTime.toISOString()}
        className={styles.digitalTime}
      >
        {timePart}
        {ampmPart && <span className={styles.ampm}> {ampmPart}</span>}
      </time>
    </div>
  );
};

export default DigitalClock;
