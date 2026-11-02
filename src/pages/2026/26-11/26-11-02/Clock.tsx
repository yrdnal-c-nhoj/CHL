import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

const Clock = () => {
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.time} aria-hidden="true">
        {timeString}
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_02';
