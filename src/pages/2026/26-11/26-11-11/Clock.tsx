import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';

export const assets: string[] = [];

const Clock_26_11_11 = () => {
  const time = useSmoothClock(16);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const digits = [
    ...hours.split(''),
    ':',
    ...minutes.split(''),
    ':',
    ...seconds.split(''),
  ];

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div
        className={styles.grid}
        aria-hidden="true"
        role="img"
        aria-label={time.toLocaleTimeString()}
      >
        {digits.map((digit, i) => (
          <span key={i} className={styles.digit}>
            {digit}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_11_11.displayName = 'Clock_26_11_11';

export default Clock_26_11_11;
