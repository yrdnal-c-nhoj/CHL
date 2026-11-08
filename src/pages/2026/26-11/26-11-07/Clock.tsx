import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';
import { Digit } from './DigitPaths';

const Clock = () => {
  const time = useClock();

  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;

  const hours = hours12.toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours24 >= 12 ? 'PM' : 'AM';

  const chars = `${hours}${minutes}${ampm}`.split('');

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 3 }, (_, rowIndex) => (
          <div className={styles.row} key={rowIndex}>
            {chars.map((char, colIndex) => (
              <div className={styles.cell} key={colIndex}>
                <Digit char={char} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_07';
