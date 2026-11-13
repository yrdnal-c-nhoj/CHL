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
      <div className={styles.time} aria-hidden="true">
        {hours}
        {minutes}
      </div>
    </main>
  );
};

Clock_26_11_11.displayName = 'Clock_26_11_11';

export default Clock_26_11_11;
