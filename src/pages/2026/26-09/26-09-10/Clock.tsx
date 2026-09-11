import { useState } from 'react';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-10/parade.mp4?url';
import poster from '@/assets/images/26_images/26-09/26-09-10/parade-poster.jpg?url';
import styles from './Clock.module.css';

export const assets = [backgroundVideo, poster];

const Clock_26_09_10 = () => {
  const time = useClock();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <main className={styles.container}>
      {!videoFailed && (
        <video
          className={styles.backgroundVideo}
          preload="metadata"
          poster={poster}
          muted
          playsInline
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      {videoFailed && (
        <img
          className={styles.poster}
          src={poster}
          alt=""
          aria-hidden="true"
        />
      )}
      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_10.displayName = 'Clock_26_09_10';

export default Clock_26_09_10;
