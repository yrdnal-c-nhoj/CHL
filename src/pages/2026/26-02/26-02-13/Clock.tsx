import React, { useMemo } from 'react';
import { useClockTime } from '@/hooks/useClockTime';
import styles from './Clock.module.css';
import { GRID, MAPPING, HOUR_WORDS } from './clockConstants'; // Import constants

const WordClock: React.FC = () => {
  const now = useClockTime();

  const activeIndices = useMemo(() => {
    const h = now.getHours();
    const m = now.getMinutes();
    const active = new Set<string>();

    const lightUp = (key: string) => {
      MAPPING[key]?.forEach(([r, c]) => active.add(`${r}-${c}`));
    };

    lightUp('it');
    lightUp('is');

    let hourIdx = h % 12;
    if (m >= 35) hourIdx = (h + 1) % 12;
    lightUp(HOUR_WORDS[hourIdx]);

    if (m >= 5 && m < 10) {
      lightUp('five_m');
      lightUp('past');
    } else if (m >= 10 && m < 15) {
      lightUp('ten_m');
      lightUp('past');
    } else if (m >= 15 && m < 20) {
      lightUp('quarter');
      lightUp('past');
    } else if (m >= 20 && m < 25) {
      lightUp('twenty');
      lightUp('past');
    } else if (m >= 25 && m < 30) {
      lightUp('twenty');
      lightUp('five_m');
      lightUp('past');
    } else if (m >= 30 && m < 35) {
      lightUp('half');
      lightUp('past');
    } else if (m >= 35 && m < 40) {
      lightUp('twenty');
      lightUp('five_m');
      lightUp('to');
    } else if (m >= 40 && m < 45) {
      lightUp('twenty');
      lightUp('to');
    } else if (m >= 45 && m < 50) {
      lightUp('quarter');
      lightUp('to');
    } else if (m >= 50 && m < 55) {
      lightUp('ten_m');
      lightUp('to');
    } else if (m >= 55) {
      lightUp('five_m');
      lightUp('to');
    } else {
      lightUp('oclock');
    }

    return active;
  }, [now]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {GRID.map((row, rIdx) => (
          <div key={rIdx} className={styles.row}>
            {row.map((char, cIdx) => (
              <span
                key={`${rIdx}-${cIdx}`}
                className={`${styles.char} ${activeIndices.has(`${rIdx}-${cIdx}`) ? styles.active : ''}`}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordClock;
