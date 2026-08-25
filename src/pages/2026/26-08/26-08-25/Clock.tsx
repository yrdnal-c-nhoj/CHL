import { useSecondClock } from '@/utils/hooks';
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-25/radar.webm';
import styles from './Clock.module.css';

export const assets: string[] = [backgroundVideo];

const Clock = () => {
  const time = useSecondClock();

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <main className={styles.container}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.backgroundVideo}
        src={backgroundVideo}
        aria-hidden="true"
      />

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.digitalClock}>
        <span className={styles.digit}>{hours[0]}</span>
        <span className={styles.digit}>{hours[1]}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digit}>{minutes[0]}</span>
        <span className={styles.digit}>{minutes[1]}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digit}>{seconds[0]}</span>
        <span className={styles.digit}>{seconds[1]}</span>
      </div>
    </main>
  );
};

Clock.displayName = 'Clock_26_08_25';
export default Clock;
