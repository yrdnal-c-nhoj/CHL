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

  // Fixed 6x6 grid - time displayed in specific cells, rest empty
  // Grid positions (row, col): 0-indexed
  const gridData: (string | null)[][] = [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [
      null,
      hours[0] ?? null,
      hours[1] ?? null,
      ':',
      minutes[0] ?? null,
      minutes[1] ?? null,
    ],
    [null, ampm[0] ?? null, ampm[1] ?? null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ];

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.grid} aria-hidden="true">
        {gridData.flatMap((row, rowIndex) =>
          row.map((char, colIndex) => (
            <div className={styles.cell} key={`${rowIndex}-${colIndex}`}>
              {char && <Digit char={char} />}
            </div>
          )),
        )}
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_07';
