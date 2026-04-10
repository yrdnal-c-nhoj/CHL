import { useMillisecondClock } from '@/utils/useSmoothClock';
import hourHand from '@/assets/images/2026/26-04/26-04-10/hour.webp';
import minuteHand from '@/assets/images/2026/26-04/26-04-10/minute.webp';
import secondHand from '@/assets/images/2026/26-04/26-04-10/second.webp';
import backgroundImage from '@/assets/images/2026/26-04/26-04-10/sand.jpg';
import styles from './Clock.module.css';

const Clock = () => {
  const now = useMillisecondClock();

  const ms = now.getMilliseconds();
  const s = now.getSeconds() + ms / 1000;
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;

  // Hand size configuration (percentage of clock face)
  const HOUR_HAND_WIDTH = '20%';
  const HOUR_HAND_HEIGHT = '29%';
  const MINUTE_HAND_WIDTH = '22%';
  const MINUTE_HAND_HEIGHT = '49%';
  const SECOND_HAND_WIDTH = '23%';
  const SECOND_HAND_HEIGHT = '50%';

  const hourRotate = h * 30;
  const minuteRotate = m * 6;
  const secondRotate = s * 6;

  const hourFilter = 'saturate(100%) contrast(200%) brightness(100%)';
  const minuteFilter = 'saturate(100%) brightness(100%)';
  const secondFilter = 'saturate(100%) brightness(100%)';

  return (
    <div className={styles.container}>
      <img src={backgroundImage} className={styles.background} alt="background" />
      <div className={styles.clockWrapper}>
        <div className={styles.face}>
          <img
            src={hourHand}
            className={styles.hand}
            style={{
              '--hand-width': HOUR_HAND_WIDTH,
              '--hand-height': HOUR_HAND_HEIGHT,
              '--hand-rotate': `${hourRotate}deg`,
              '--hand-filter': hourFilter,
            } as React.CSSProperties}
            alt="hour hand"
          />
          <img
            src={minuteHand}
            className={styles.hand}
            style={{
              '--hand-width': MINUTE_HAND_WIDTH,
              '--hand-height': MINUTE_HAND_HEIGHT,
              '--hand-rotate': `${minuteRotate}deg`,
              '--hand-filter': minuteFilter,
            } as React.CSSProperties}
            alt="minute hand"
          />
          <img
            src={secondHand}
            className={styles.hand}
            style={{
              '--hand-width': SECOND_HAND_WIDTH,
              '--hand-height': SECOND_HAND_HEIGHT,
              '--hand-rotate': `${secondRotate}deg`,
              '--hand-filter': secondFilter,
            } as React.CSSProperties}
            alt="second hand"
          />
        </div>
      </div>
    </div>
  );
};

export default Clock;
