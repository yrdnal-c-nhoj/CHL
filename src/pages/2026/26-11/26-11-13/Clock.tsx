import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import whitebullVideo from '@/assets/images/26_images/26-11/26-11-13/whitebull.mp4';
import europaImage from '@/assets/images/26_images/26-11/26-11-13/europa.webp';
import frameImage from '@/assets/images/26_images/26-11/26-11-13/frame.webp';

import styles from './Clock.module.css';

export const assets = [whitebullVideo, europaImage, frameImage];

const Clock_26_11_13 = () => {
  const time = useSmoothClock(16);

  return (
    <main className={styles.container}>
      <video
        src={whitebullVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <img
        src={europaImage}
        alt=""
        aria-hidden="true"
        className={styles.europaLayer}
      />
      <img
        src={frameImage}
        alt=""
        aria-hidden="true"
        className={styles.frameLayer}
      />
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {time.toLocaleTimeString()}
      </div>
    </main>
  );
};

Clock_26_11_13.displayName = 'Clock_26_11_13';

export default Clock_26_11_13;
