import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-17/dance.webm';
import bubblesOverlay from '@/assets/images/26_images/26-09/26-09-17/bubbles.webp';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo, bubblesOverlay];

const Clock_26_09_17 = () => {
  const time = useClock();

  return (
    <main className={styles.container}>
      <div className={styles.background}>
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div
        className={styles.bubblesOverlay}
        style={{ backgroundImage: `url(${bubblesOverlay})` }}
      />

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_17.displayName = 'Clock_26_09_17';
export default Clock_26_09_17;
