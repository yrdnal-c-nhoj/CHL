import { useSmoothClock } from '@/utils/hooks';
import rocketGif from '@/assets/images/25_images/25-07/25-07-03/rocket.webp';
import rockFont from '@/assets/fonts/25fonts/25-07-03-rock.ttf';
import styles from './Clock.module.css';

export const assets = [rocketGif, rockFont];

const formatDigits = (num: number): string =>
  num.toString().padStart(2, '0');

const Clock = () => {
  const time = useSmoothClock(50);

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());
  const seconds = formatDigits(time.getSeconds());
  const centiseconds = time
    .getMilliseconds()
    .toString()
    .padStart(3, '0')
    .slice(0, 2);

  const formattedTime = `T-${hours}:${minutes}:${seconds}.${centiseconds}`;

  return (
    <main className={styles.container}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${rocketGif})` }}
      />

      <div className={styles.clock}>
        <span className={styles.clockText}>{formattedTime}</span>
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

Clock.displayName = 'Clock_25_07_03';
export default Clock;
