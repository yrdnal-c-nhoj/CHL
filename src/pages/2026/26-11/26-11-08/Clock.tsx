import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import tileImage from '@/assets/images/26_images/26-11/26-11-08/forms.webp';
import backgroundTile from '@/assets/images/26_images/26-11/26-11-08/uniqueforms.webp';
import font from '@/assets/fonts/26fonts/26-11-06.otf?url';

import styles from './Clock.module.css';

export const assets = [tileImage, backgroundTile, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_08',
  fontUrl: font,
};

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

  return (
    <main
      className={styles.container}
      style={
        { '--background-tile': `url(${backgroundTile})` } as React.CSSProperties
      }
    >
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
