import React from 'react';
import { useClock } from '@/utils/hooks';
import { useClockAngles } from '@/hooks/useClockAngles';
import SRTime from '@/components/SRTime';
import bgGif from '@/assets/images/25_images/25-05/25-05-17/2501912_2ddac-564534539.gif';
import layer5Gif from '@/assets/images/25_images/25-05/25-05-17/e0435fd452bbed155b5b3c5128b4f7c5.gif';
import layer3Gif from '@/assets/images/25_images/25-05/25-05-17/giphy-3181726992.webp';
import rectangleGif from '@/assets/images/25_images/25-05/25-05-17/tumblr_53c27c64cc9f17a0880aff18b8f6d934_d138a0cd_500.gif';
import styles from './Clock.module.css';

export const assets = [bgGif, layer5Gif, layer3Gif, rectangleGif];

const Clock = () => {
  const time = useClock();
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div
        className={styles.bgimage}
        style={{ backgroundImage: `url(${bgGif})` }}
      />
      <div
        className={styles.layer5}
        style={{ backgroundImage: `url(${layer5Gif})` }}
      />
      <div
        className={styles.layer3}
        style={{ backgroundImage: `url(${layer3Gif})` }}
      />
      <div
        className={styles.rectangle}
        style={{ backgroundImage: `url(${rectangleGif})` }}
      />

      <div className={styles.centerContainer}>
        <div className={styles.clock}>
          <div
            className={`${styles.hand} ${styles.minHand}`}
            style={{ transform: `rotate(${minAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secondHand}`}
            style={{ transform: `rotate(${secAngle}deg)` }}
          />
        </div>
      </div>
    </main>
  );
};

Clock.displayName = 'Clock_25_05_17';

export default Clock;
