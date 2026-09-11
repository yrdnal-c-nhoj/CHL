import React from 'react';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-09/robot.webm?url';
import font from '@/assets/fonts/26fonts/26-09-09.otf?url';
import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_09',
  fontUrl: font,
};

const Clock_26_09_09: React.FC = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const digits = [...hours, ...minutes, ...seconds];

  // 3×3 grid of identical videos so the center one stays exactly
  // the same size/position as a single object-fit:contain video,
  // while copies fill left/right (landscape) or top/bottom (portrait/phone).
  const videos = Array.from({ length: 9 }, (_, i) => (
    <video
      key={i}
      src={backgroundVideo}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
      className={styles.backgroundVideo}
    />
  ));

  return (
    <main className={styles.container}>
      <div className={styles.videoGrid}>{videos}</div>
      <div className={styles.digitalClock} aria-hidden="true">
        {digits.map((digit, index) => (
          <span className={styles.digit} key={index}>{digit}</span>
        ))}
      </div>
      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_09.displayName = 'Clock_26_09_09';

export default Clock_26_09_09;