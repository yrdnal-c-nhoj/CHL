import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-20.ttf?url';
import decoImage from '@/assets/images/26_images/26-07/26-07-20/deco.webp';

import styles from './Clock.module.css';

// Export assets for the preloading pipeline
export const assets = [decoImage, fontUrl];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_07_20', fontUrl },
];

const DigitalClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const now = useClockTime('ms');
  const isoTime = now.toISOString();

  // Memoize the digit array to prevent recalculation on every render
  const digits = useMemo(() => {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const centiseconds = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    return (hours + minutes + seconds + centiseconds).split('');
  }, [now]);

  return (
    <main className={styles.container}>
      <div className={styles.blurStrip} />
      <img src={decoImage} alt="" className={styles.backgroundImage} />
      <time dateTime={isoTime} className={styles.timeWrapper}>
        <div className={styles.digitalTime}>
          {digits.map((digit, index) => (
            <span key={index} className={styles.digitBox}>
              {digit}
            </span>
          ))}
        </div>
      </time>
    </main>
  );
};

export default DigitalClock;