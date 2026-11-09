import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';
import { Digit } from './DigitPaths';

const Clock = () => {
  const time = useClock();

  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12;

  const hours = hours12.toString().padStart(2, '0'); // "09"
  const minutes = time.getMinutes().toString().padStart(2, '0'); // "45"
  const ampm = hours24 >= 12 ? 'PM' : 'AM'; // "AM" or "PM"

  // Each row: single digit repeated 6 times
  const rows = [
    Array(6).fill(hours[0]), // Row 1: first hour digit
    Array(6).fill(hours[1]), // Row 2: second hour digit
    Array(6).fill(minutes[0]), // Row 3: first minute digit
    Array(6).fill(minutes[1]), // Row 4: second minute digit
    Array(6).fill(ampm[0]), // Row 5: A or P
    Array(6).fill(ampm[1]), // Row 6: M
  ];

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.grid} aria-hidden="true">
        {rows.flatMap((rowChars) =>
          rowChars.map((char) => (
            <div className={styles.cell} key={char}>
              <Digit char={char} />
            </div>
          )),
        )}
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_07';
