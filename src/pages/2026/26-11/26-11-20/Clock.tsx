import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-20/eyes.webm';
import clockFont from '@/assets/fonts/26fonts/26-11-20.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, clockFont];

const fontConfig = {
  fontFamily: 'ClockFont_26_11_20',
  fontUrl: clockFont,
};

const Clock_26_11_20 = () => {
  const time = useSmoothClock(50);

  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  // Split into 6 individual digits for grid layout
  const digits = [
    hours[0],
    hours[1],
    minutes[0],
    minutes[1],
    seconds[0],
    seconds[1],
  ];

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      {/* Background video */}
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.digitalClock} aria-hidden="true">
        {digits.map((digit, index) => (
          <span key={index}>{digit}</span>
        ))}
      </div>
    </main>
  );
};

Clock_26_11_20.displayName = 'Clock_26_11_20';

export default Clock_26_11_20;
