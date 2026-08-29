import shellsImage from '@/assets/images/26_images/26-08/26-08-28/shells.webp';
import purpleImage from '@/assets/images/26_images/26-08/26-08-28/purple.webp';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [shellsImage, purpleImage];

const Clock = () => {
  const time = useMillisecondClock();

  const secondDegrees = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;
  const minuteDegrees = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const hourDegrees = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
  const timeLabel = time.toLocaleTimeString();

  return (
    <main className={styles.container}>
      <svg className={styles.clockFace} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clockClip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>
        <g clipPath="url(#clockClip)" className={styles.spin}>
          <image href={purpleImage} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
        </g>


        {[1, 2, 4, 5, 7, 8, 10, 11].map((num) => (
          <line
            key={num}
            x1="50"
            y1="6"
            x2="50"
            y2="10"
            stroke="#333"
            strokeWidth="1"
            transform={`rotate(${num * 30} 50 50)`}
          />
        ))}

        <line
          x1="50"
          y1="50"
          x2="50"
          y2="28"
          stroke="#222"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hourDegrees} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="18"
          stroke="#444"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteDegrees} 50 50)`}
        />
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="5"
          stroke="#D32F2F"
          strokeWidth="1.3"
          strokeLinecap="round"
          transform={`rotate(${secondDegrees} 50 50)`}
        />

        <circle cx="50" cy="50" r="2.5" fill="#222" />
      </svg>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {timeLabel}
      </time>
    </main>
  );
};

Clock.displayName = 'Clock_26_08_28';
export default Clock;
