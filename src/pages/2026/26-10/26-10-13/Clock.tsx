import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import styles from './Clock.module.css';

const formatTime = (time: Date): string =>
  `${String(time.getHours()).padStart(2, '0')}${String(
    time.getMinutes(),
  ).padStart(2, '0')}`;

function Digits({ time }: { time: string }) {
  return (
    <div className={styles.clockDigits}>
      {time.split('').map((digit, index) => (
        <span className={styles.clockDigit} key={index}>
          {digit}
        </span>
      ))}
    </div>
  );
}

function Track({ time }: { time: string }) {
  const COPIES = 24;

  return (
    <div className={styles.clockTrack}>
      {[0, 1].map((copy) => (
        <div className={styles.clockGroup} key={copy}>
          {Array.from({ length: COPIES }, (_, index) => (
            <Digits time={time} key={index} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Clock() {
  const time = useClock();
  const display = formatTime(time);

  return (
    <main className={styles.clockField}>
      <SRTime time={time} />

      <time dateTime={time.toISOString()} hidden>
        {display}
      </time>

      <div className={styles.clockDesktop}>
        {Array.from({ length: 5 }, (_, index) => (
          <div className={styles.clockLane} key={index}>
            <Track time={display} />
          </div>
        ))}
      </div>

      <div className={styles.clockMobile}>
        {Array.from({ length: 3 }, (_, index) => (
          <div className={styles.clockLane} key={index}>
            <Track time={display} />
          </div>
        ))}
      </div>
    </main>
  );
}

Clock.displayName = 'Clock_26_10_13';

export default Clock;
