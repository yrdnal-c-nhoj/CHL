import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import clockFont from '@/assets/fonts/26fonts/26-11-12-subset.ttf?url';

import styles from './Clock.module.css';

export const assets = [clockFont];

const GRID_SIZE = 100;
const ROWS = Array.from({ length: GRID_SIZE }, (_, i) => i);
const COLUMNS = 100;

const Clock_26_11_12 = () => {
  const time = useClock();

  const hours12 = time.getHours() % 12 || 12;
  const hh = hours12.toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const display = `${hh}${mm}${ss}${ampm}`;
  const characters = Array.from(display.repeat(COLUMNS));

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.grid} aria-hidden="true">
        {ROWS.map((row) => (
          <div
            key={row}
            className={`${styles.gridRow} ${row % 2 ? styles.staggered : ''}`}
          >
            {characters.map((ch, i) => (
              <span key={i} className={styles.cell}>
                {ch}
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
