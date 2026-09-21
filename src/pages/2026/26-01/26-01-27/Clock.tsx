import { useState, useRef } from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import backgroundImage from '@/assets/images/26_images/26-01/26-01-27/pan.jpg';
import panFont from '@/assets/fonts/26fonts/26-01-27-pan.ttf';

export const assets = [backgroundImage, panFont];

const FONT_FAMILY = 'PanoramaClock_26-01-27';
const fontConfigs: FontConfig[] = [
  { fontFamily: FONT_FAMILY, fontUrl: panFont },
];

const formatTimeString = (date: Date): string =>
  date
    .toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' })
    .replace(/\s/, '');

export default function PanoramaClock() {
  const time = useClock();
  useSuspenseFontLoader(fontConfigs);

  const timeString = formatTimeString(time);
  const [bgDuration, setBgDuration] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageLoad = () => {
    if (imgRef.current) {
      const width = imgRef.current.offsetWidth;
      const speed = 9; // Pixels per second (very slow scrolling)
      setBgDuration(width / speed);
    }
  };

  const clockGroup = (
    <div className={styles.clockGroup}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={styles.clockDisplay}>
          {timeString}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.root}>
      <SRTime time={time} />

      {/* BACKGROUND LAYER */}
      <div className={styles.bgLayer}>
        <div
          className={styles.bgContainer}
          style={{ animationDuration: `${bgDuration}s` }}
        >
          <img
            decoding="async"
            loading="lazy"
            ref={imgRef}
            onLoad={handleImageLoad}
            src={backgroundImage}
            alt=""
            className={styles.backgroundImage}
          />
          <img
            decoding="async"
            loading="lazy"
            src={backgroundImage}
            alt=""
            className={styles.backgroundImage}
          />
        </div>
      </div>

      {/* CLOCK LAYER (Opposite Direction) */}
      <div className={styles.clockLayer}>
        <div className={styles.clockWrapper}>{clockGroup}{clockGroup}</div>
      </div>
    </div>
  );
}

PanoramaClock.displayName = 'Clock_26_01_27';
