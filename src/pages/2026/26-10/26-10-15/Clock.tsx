import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import flyImage from '@/assets/images/26_images/26-10/26-10-15/fly.webp';
import cowVideo from '@/assets/images/26_images/26-10/26-10-15/cow.webm';

export const assets = [flyImage, cowVideo];

const Clock = () => {
  const time = useClock();

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <video
        className={styles.cow}
        src={cowVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <img className={styles.fly} src={flyImage} alt="" />
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_10_15';
