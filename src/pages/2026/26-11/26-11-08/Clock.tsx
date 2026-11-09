import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-08/uniqueforms.mp4';
import tileImage from '@/assets/images/26_images/26-11/26-11-08/forms.webp';
import font from '@/assets/fonts/26fonts/26-11-06.otf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, tileImage, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_08',
  fontUrl: font,
};

const GRID_SIZE = 6;

const Clock_26_11_08 = () => {
  const time = useSmoothClock(16);
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const hourAngle = (hours + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  // Generate 6x6 grid of video tiles
  const tiles = [];
  let tileIndex = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      tiles.push(
        <video
          key={`tile-${tileIndex++}`}
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className={styles.videoTile}
          style={
            {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            } as React.CSSProperties
          }
        />,
      );
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.videoGrid} aria-hidden="true">
        {tiles}
      </div>

      <img
        src={tileImage}
        alt=""
        aria-hidden="true"
        className={styles.centerImage}
      />

      <div className={styles.clockFace} aria-hidden="true">
        <div
          className={styles.hand}
          style={{ '--angle': `${hourAngle}deg` } as Record<string, string>}
        />
        <div
          className={styles.minuteHand}
          style={{ '--angle': `${minuteAngle}deg` } as Record<string, string>}
        />
        <div
          className={styles.secondHand}
          style={{ '--angle': `${secondAngle}deg` } as Record<string, string>}
        />
        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_11_08.displayName = 'Clock_26_11_08';
export default Clock_26_11_08;
