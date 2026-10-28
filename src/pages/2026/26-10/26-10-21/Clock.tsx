import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-21/cells.webm';
import clockFont from '@/assets/fonts/26fonts/26-10-21.ttf?url';

export const assets = [backgroundVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_21',
  fontUrl: clockFont,
};

const formatDigits = (value: number): string =>
  value.toString().padStart(2, '0');

const Clock_26_10_21 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();
  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());
  const seconds = formatDigits(time.getSeconds());

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <SRTime time={time} />
      <div className={styles.digitalDisplay} aria-hidden="true">
        <span className={styles.time}>{`${hours}${minutes}${seconds}`}</span>
      </div>
    </main>
  );
};

Clock_26_10_21.displayName = 'Clock_26_10_21';

export default Clock_26_10_21;
