import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-05/screens.mp4';

export const assets = [backgroundVideo];

const Clock_26_11_05 = () => {
  const time = useClock();

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
        preload="none"
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

Clock_26_11_05.displayName = 'Clock_26_11_06';
export default Clock_26_11_05;
