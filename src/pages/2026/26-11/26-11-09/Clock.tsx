import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import styles from './Clock.module.css';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-09/giraffe.mp4';
import clockFont from '@/assets/fonts/26fonts/26-11-09.ttf?url';

export const assets = [backgroundVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_09',
  fontUrl: clockFont,
};

const Clock_26_11_09 = () => {
  const time = useSmoothClock(16);
  useSuspenseFontLoader([fontConfig]);

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {time.toLocaleTimeString()}
      </div>
    </main>
  );
};

Clock_26_11_09.displayName = 'Clock_26_11_09';
export default Clock_26_11_09;
