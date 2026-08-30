import fontUrl from '@/assets/fonts/26fonts/26-08-29.ttf?url';
import purpleImage from '@/assets/images/26_images/26-08/26-08-29/purple.webp';
import shellsImage from '@/assets/images/26_images/26-08/26-08-29/shells1.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [shellsImage, purpleImage, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_29',
    fontUrl,
  },
];

const Clock = () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

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
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff6c0" />
            <stop offset="35%" stopColor="#f5c842" />
            <stop offset="55%" stopColor="#d4a017" />
            <stop offset="75%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#8a6508" />
          </linearGradient>
        </defs>
        <g clipPath="url(#clockClip)" className={styles.spin}>
          <image href={purpleImage} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
        </g>
        <circle cx="50" cy="50" r="48" fill="#c5c6c9" opacity="0.3" />

        {[
          'XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
        ].map((roman, i) => {
          const angle = i * 30;
          const radian = ((angle - 90) * Math.PI) / 180;
          const cx = 50 + 40 * Math.cos(radian);
          const cy = 50 + 40 * Math.sin(radian);
          return (
            <text
              key={roman}
              x={cx}
              y={cy}
              fill="url(#goldGradient)"
              stroke="#8a6508"
              strokeWidth="0.2"
              fontSize="6"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {roman}
            </text>
          );
        })}

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

      <div className={styles.digitalClock}>
        <div className={styles.hourGroup}>
          <span className={styles.digit}>{hours[0]}</span>
          <span className={styles.digit}>{hours[1]}</span>
        </div>
        <div className={styles.minuteGroup}>
          <span className={styles.digit}>{minutes[0]}</span>
          <span className={styles.digit}>{minutes[1]}</span>
        </div>
        <div className={styles.secondGroup}>
          <span className={styles.digit}>{seconds[0]}</span>
          <span className={styles.digit}>{seconds[1]}</span>
        </div>
      </div>
    </main>
  );
};

Clock.displayName = 'Clock_26_08_29';
export default Clock;
