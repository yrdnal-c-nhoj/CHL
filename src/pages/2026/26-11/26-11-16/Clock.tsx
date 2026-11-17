import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import yayVideo from '@/assets/images/26_images/26-11/26-11-16/yay.webm';
import font from '@/assets/fonts/26fonts/26-11-16.ttf?url';

import styles from './Clock.module.css';

export const assets = [yayVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_16',
  fontUrl: font,
};

const Clock_26_11_16 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const displayTime = `${hours}:${minutes}:${seconds}`;

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <video
        src={yayVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.content} aria-hidden="true">
        {displayTime}
      </div>
    </main>
  );
};

Clock_26_11_16.displayName = 'Clock_26_11_16';

export default Clock_26_11_16;
