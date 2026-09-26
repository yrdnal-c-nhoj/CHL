import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

export const assets: string[] = [];

const Clock = () => {
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const digits = `${hours}${minutes}${seconds}`;

  return (
    <main className={styles.container}>
      <div className={styles.digitRow}>
        {digits.split('').map((digit, index) => (
          <div key={index} className={styles.digitWrapper}>
            <div className={styles.digit}>{digit}</div>
          </div>
        ))}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock.displayName = 'Clock_26_09_25';

export default Clock;
