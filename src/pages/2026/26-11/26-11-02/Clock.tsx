import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

const Clock = () => {
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  const chars = timeString.split('');

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 3 }, (_, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {chars.map((char, colIndex) => (
              <div key={colIndex} className={styles.cell}>
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_02';
