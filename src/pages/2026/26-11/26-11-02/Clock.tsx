import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

const Clock = () => {
  const time = useClock();

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.logo} aria-hidden="true">
        FIRE
      </div>
      <time className={styles.time} dateTime={time.toISOString()}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_02';
