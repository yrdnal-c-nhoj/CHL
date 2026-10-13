import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import type { CSSProperties } from 'react';
import styles from './Clock.module.css';
import backgroundImage from '@/assets/images/26_images/26-10/26-10-09/windows.webp';

export const assets = [backgroundImage];

const formatDigits = (value: number): string =>
  value.toString().padStart(2, '0');

const Clock_26_10_09 = () => {
  const time = useClock();

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());

  const display = `${hours}:${minutes}`;

  const style = {
    '--background-image': `url(${backgroundImage})`,
  } as CSSProperties;

  return (
    <main className={styles.container} style={style}>
      <SRTime time={time} />
      <div className={styles.digitalDisplay} aria-hidden="true">
        {display.split('').map((char, index) => (
          <span
            key={index}
            className={char === ':' ? styles.colon : styles.digit}
          >
            {char}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_10_09.displayName = 'Clock_26_10_09';

export default Clock_26_10_09;
