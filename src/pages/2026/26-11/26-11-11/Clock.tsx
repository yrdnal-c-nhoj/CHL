import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-11/fish.mp4';
import clockFont from '@/assets/fonts/26fonts/26-11-11.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, clockFont];

const Clock_26_11_11 = () => {
  const time = useSmoothClock(16);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const digits = [
    ...hours.split(''),
    ':',
    ...minutes.split(''),
    ':',
    ...seconds.split(''),
  ];

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <SRTime time={time} />
      <div
        className={styles.grid}
        aria-hidden="true"
        role="img"
        aria-label={time.toLocaleTimeString()}
      >
        {digits.map((digit, i) => (
          <span key={i} className={styles.digit}>
            {digit}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_11_11.displayName = 'Clock_26_11_11';

export default Clock_26_11_11;
