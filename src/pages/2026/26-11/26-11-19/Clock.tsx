import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import circleImage from '@/assets/images/26_images/26-11/26-11-19/circle.webp';
import hourHandImage from '@/assets/images/26_images/26-11/26-11-19/hour.webp';
import minuteHandImage from '@/assets/images/26_images/26-11/26-11-19/minute.webp';
import secondHandImage from '@/assets/images/26_images/26-11/26-11-19/second.webp';

import styles from './Clock.module.css';
import type { CSSProperties } from 'react';

export const assets = [
  circleImage,
  hourHandImage,
  minuteHandImage,
  secondHandImage,
];

const Clock_26_11_19 = () => {
  const time = useSmoothClock(50);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60 + milliseconds / 60000) * 6;
  const secondAngle = (seconds + milliseconds / 1000) * 6;

  return (
    <main
      className={styles.container}
      style={{ '--bg': `url(${circleImage})` } as CSSProperties}
    >
      <SRTime time={time} />
      <div className={styles.face} aria-hidden="true">
        <img
          className={styles.hand}
          style={{ '--angle': hourAngle } as CSSProperties}
          src={hourHandImage}
          alt=""
        />
        <img
          className={styles.hand}
          style={{ '--angle': minuteAngle } as CSSProperties}
          src={minuteHandImage}
          alt=""
        />
        <img
          className={styles.hand}
          style={{ '--angle': secondAngle } as CSSProperties}
          src={secondHandImage}
          alt=""
        />
      </div>
    </main>
  );
};

Clock_26_11_19.displayName = 'Clock_26_11_19';
export default Clock_26_11_19;
