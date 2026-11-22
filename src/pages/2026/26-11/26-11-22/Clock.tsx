import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import batsVideo from '@/assets/images/26_images/26-11/26-11-22/bats.webm';

import styles from './Clock.module.css';

export const assets = [batsVideo];

const Clock_26_11_22 = () => {
  const time = useSmoothClock(16);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <video
        src={batsVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <div className={styles.content} aria-hidden="true">
        {time.toLocaleTimeString()}
      </div>
    </main>
  );
};

Clock_26_11_22.displayName = 'Clock_26_11_22';

export default Clock_26_11_22;
