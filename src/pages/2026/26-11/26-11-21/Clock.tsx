import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';

const Clock_26_11_21 = () => {
  const time = useClock();
  const hourAngle =
    ((time.getHours() % 12) +
      time.getMinutes() / 60 +
      time.getSeconds() / 3600 +
      time.getMilliseconds() / 3_600_000) *
    30;

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.ticks} aria-hidden="true" />
      <div
        className={styles.hand}
        style={{ transform: `rotate(${hourAngle}deg)` }}
        aria-hidden="true"
      />
      <div className={styles.centerDot} aria-hidden="true" />
    </main>
  );
};

Clock_26_11_21.displayName = 'Clock_26_11_21';

export default Clock_26_11_21;
