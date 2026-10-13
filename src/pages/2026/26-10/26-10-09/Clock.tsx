import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

const formatDigits = (value: number): string =>
  value.toString().padStart(2, '0');

const Clock_26_10_09 = () => {
  const time = useClock();

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());

  const display = `${hours}:${minutes}`;

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div className={styles.digitalDisplay} aria-hidden="true">
        {display.split('').map((char, index) => (
          <span
            key={index}
            className={char === ':' ? styles.colon : styles.digit}
          >
            {char}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_10_09.displayName = 'Clock_26_10_09';

export default Clock_26_10_09;
