import { useClock } from '@/utils/hooks';
import styles from './Clock.module.css';

const Clock_26_09_06 = () => {
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const fullTimeString = `${hours}:${minutes}:${seconds}`;

  return (
    <main className={styles.container}>
      <div className={styles.clock}>
        <div className={styles.timeGroup}>
          {hours.split('').map((d, i) => (
            <span key={`h${i}`} className={styles.digitBox}>{d}</span>
          ))}
        </div>
        <span className={styles.colon}>:</span>
        <div className={styles.timeGroup}>
          {minutes.split('').map((d, i) => (
            <span key={`m${i}`} className={styles.digitBox}>{d}</span>
          ))}
        </div>
        <span className={styles.colon}>:</span>
        <div className={styles.timeGroup}>
          {seconds.split('').map((d, i) => (
            <span key={`s${i}`} className={styles.digitBox}>{d}</span>
          ))}
        </div>
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {fullTimeString}
      </time>
    </main>
  );
};

Clock_26_09_06.displayName = 'Clock_26_09_06';

export default Clock_26_09_06;
