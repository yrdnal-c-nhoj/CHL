import { useClock } from '@/utils/hooks';

import styles from './Clock.module.css';

const formatTime = (value: number) => value.toString().padStart(2, '0');

const Clock_26_09_15 = () => {
  const time = useClock();
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <main className={styles.container}>
      <time className={styles.display} dateTime={time.toISOString()} aria-label="Current time">
        <span className={styles.segment}>{hours}</span>
        <span className={styles.separator} aria-hidden="true">:</span>
        <span className={styles.segment}>{minutes}</span>
        <span className={styles.separator} aria-hidden="true">:</span>
        <span className={styles.segment}>{seconds}</span>
      </time>
    </main>
  );
};

Clock_26_09_15.displayName = 'Clock_26_09_15';

export default Clock_26_09_15;
