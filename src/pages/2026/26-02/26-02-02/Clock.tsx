import React from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import digitalBgImage from '@/assets/images/26_images/26-02/26-02-02/boom.webp';
import styles from './Clock.module.css';
export const assets = [digitalBgImage];


const SonicBoomClock =  () => {
  const time = useMillisecondClock();

  const timeString =
    time.getHours().toString().padStart(2, '0') +
    time.getMinutes().toString().padStart(2, '0') +
    time.getSeconds().toString().padStart(2, '0') +
    Math.floor(time.getMilliseconds() / 100).toString();

  const digits = timeString.split('');

  return (
    <div className={styles.container}>
      <div className={styles.backgroundLayer} />
      <div className={styles.digitContainer}>
        {digits.map((digit: string, index: number) => {
          const reverseIndex = digits.length - index - 1;
          const fontSize = 40 + reverseIndex * -4.5;
          const opacity = Math.max(1.0 - reverseIndex * 0.15, 0.3);

          return (
            <span
              key={index}
              className={styles.digit}
              style={{
                fontSize: `${fontSize}vmin`,
                opacity,
                marginLeft: index > 0 ? '-0.2em' : '0',
              }}
            >
              {digit}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SonicBoomClock;
