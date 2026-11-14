import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import clockFont from '@/assets/fonts/26fonts/26-11-12-subset.ttf?url';

import styles from './Clock.module.css';

export const assets = [clockFont];

const GRID_SIZE = 100;
const COLUMNS = 100;

const ROWS = Array.from({ length: GRID_SIZE }, (_, i) => i);

const Clock_26_11_12 = () => {
  const time = useClock();

  const hours12 = time.getHours() % 12 || 12;
  const display =
    hours12.toString().padStart(2, '0') +
    time.getMinutes().toString().padStart(2, '0') +
    time.getSeconds().toString().padStart(2, '0') +
    (time.getHours() >= 12 ? 'PM' : 'AM');

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.grid} aria-hidden="true">
        {ROWS.map((row) => (
          <div key={row} className={styles.gridRow}>
            {Array.from({ length: COLUMNS }, (_, i) => (
              <span key={i} className={styles.cell}>
                {display[i % 8]}
              </span>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

Clock_26_11_12.displayName = 'Clock_26_11_12';

export default Clock_26_11_12;
