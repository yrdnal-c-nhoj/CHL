import { useSecondClock } from '@/utils/hooks';
import React from 'react';
import styles from './Clock.module.css';

const ClockComponent: React.FC = () => {
  const time = useSecondClock();

  const hours = time.getHours().toString();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeString = `*${hours}:${minutes}`;

  return (
    <main className={styles.container}>
      <div className={styles.quoteContainer}>
        {/* Spanish Original */}
        <p className={styles.title}>
         "δὶς ἐς τὸν αὐτὸν ποταμὸν οὐκ ἂν ἐμβαίης."*
        </p>
        <span className={`${styles.sansAccents} ${styles.spanishAuthor}`}>
          — Heraclitus
        </span>

        {/* English Translation */}
        <p className={`${styles.title} ${styles.englishQuote}`}>
         "You can't step into the same river twice"*
        </p>
        <span className={`${styles.sansAccents} ${styles.englishAuthor}`}>
            — Heraclitus
        </span>
      </div>

      <div className={styles.clockPositioner}>
        <time dateTime={time.toISOString()} className={styles.digitalClock} aria-label={`Current time: ${time.toLocaleTimeString()}`}>
          {timeString}
        </time>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_17';

export default MemoizedClock;