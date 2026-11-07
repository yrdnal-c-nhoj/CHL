import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-05/screens.mp4';
import font from '@/assets/fonts/26fonts/26-11-05.ttf?url';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_05',
  fontUrl: font,
};

const Clock_26_11_05 = () => {
  const time = useClock();
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const digits = `${hours}${minutes}`.split('');

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
      <div className={styles.digitColumn} aria-hidden="true">
        {digits.map((digit, index) => (
          <span key={index} className={styles.digit}>
            {digit}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_11_05.displayName = 'Clock_26_11_05';
export default Clock_26_11_05;
