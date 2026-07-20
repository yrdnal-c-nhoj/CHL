import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-07-14.otf?url';
import tileImage from '@/assets/images/26_images/26-07/26-07-14/b.webp';
import backgroundImage from '@/assets/images/26_images/26-07/26-07-14/door.webp';

export const assets = [backgroundImage, tileImage, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_14',
    fontUrl,
  },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

export default function DigitalClock() {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const timeString = useMemo(() => {
    return `${formatTime(time.getHours())}:${formatTime(time.getMinutes())}`;
  }, [time]);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundLayer} style={{ '--bg-image': `url(${backgroundImage})` } as React.CSSProperties} />
      <div className={styles.tileOverlay} style={{ '--tile-image': `url(${tileImage})` } as React.CSSProperties} />
      <time dateTime={time.toISOString()} className={styles.digitalClock}>
        {timeString.split('').map((char, index) => {
          const isColon = char === ':';
          return (
            <span
              key={index}
              className={`${styles.digitBox} ${isColon ? styles.colon : ''}`}
            >{char}</span>
          );
        })}
      </time>
    </div>
  );
}