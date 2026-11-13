import { useMemo } from 'react';
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

  const display = useMemo(() => {
    const hours = time.getHours();
    const hh = String(hours % 12 || 12).padStart(2, '0');
    const mm = String(time.getMinutes()).padStart(2, '0');
    const ss = String(time.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return `${hh}${mm}${ss}${ampm}`;
  }, [time]);

  const characters = useMemo(
    () => Array.from(display.repeat(COLUMNS)),
    [display],
  );

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.grid} aria-hidden="true">
        {ROWS.map((row) => (
          <div
            key={row}
            className={`${styles.gridRow} ${row % 2 ? styles.staggered : ''}`}
          >
            {characters.map((character, index) => (
              <span key={index} className={styles.cell}>
                {character}
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
