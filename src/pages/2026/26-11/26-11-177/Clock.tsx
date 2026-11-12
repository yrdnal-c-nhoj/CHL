import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-11/fish.mp4';
import font from '@/assets/fonts/26fonts/26-11-11.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_11',
  fontUrl: font,
};

const Clock_26_11_11 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useSmoothClock(16);

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

Clock_26_11_11.displayName = 'Clock_26_11_11';

export default Clock_26_11_11;
