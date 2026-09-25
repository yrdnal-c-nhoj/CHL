import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

export const assets: string[] = [];

const QUOTE_TEXT = (
  <>
    Time spent laughing
    <br />
    is time spent
    <br />
    with the gods.*
  </>
);

const Clock = () => {
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <main className={styles.container}>
      <div className={styles.quoteWrapper}>
        <span className={styles.quoteMark} aria-hidden="true">
          “
        </span>

        <blockquote className={styles.quote}>{QUOTE_TEXT}</blockquote>
      </div>

      <div className={styles.digitalDisplay} aria-hidden="true">
        {hours}:{minutes}:{seconds}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock.displayName = 'Clock_26_09_24';

export default Clock;