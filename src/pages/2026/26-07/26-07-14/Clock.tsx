import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// Assuming an image exists in the corresponding folder for the date
import tileImage from '@/assets/images/26_images/26-07/26-07-14/b.webp'; // The tiled overlay image
import backgroundImage from '@/assets/images/26_images/26-07/26-07-14/door.webp'; // The main background
import styles from './Clock.module.css';
// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-07-14.otf?url';

// Consolidate into a single assets export
export const assets = [backgroundImage, tileImage, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_14',
    fontUrl,
  },
];

/**
 * Formats a number to be two digits, zero-padded.
 * @param num The number to format.
 * @returns A zero-padded string.
 */
const formatTime = (num: number): string => num.toString().padStart(2, '0');

export default function DigitalClock() {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const timeString = useMemo(() => {
    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    return `${hours} ${minutes}`;
  }, [time]);

  return (
    <div className={styles.container}>
      <div
        className={styles.backgroundLayer}
        style={{ '--bg-image': `url(${backgroundImage})` } as React.CSSProperties}
      />
      <div
        className={styles.tileOverlay}
        style={{ '--tile-image': `url(${tileImage})` } as React.CSSProperties}
      />
      <time dateTime={time.toISOString()} className={styles.digitalClock}>
        {timeString}
      </time>
    </div>
  );
}