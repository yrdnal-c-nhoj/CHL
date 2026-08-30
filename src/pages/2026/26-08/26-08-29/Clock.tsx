import fontUrl from '@/assets/fonts/26fonts/26-08-29.ttf?url';
import purpleImage from '@/assets/images/26_images/26-08/26-08-29/purple.webp';
import shellsImage from '@/assets/images/26_images/26-08/26-08-29/shell.webp';
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

  const secondDegrees = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;
  const minuteDegrees = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const hourDegrees = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
  const timeLabel = time.toLocaleTimeString();

  return (
    <main
      className={styles.container}
      style={{ '--shells': `url(${shellsImage})` } as React.CSSProperties}
    >
      <svg className={styles.clockFace} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clockClip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
          <linearGradient id="goldGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
            <stop offset="0%" stopColor="#fffdf0" />
            <stop offset="35%" stopColor="#ffe9a8" />
            <stop offset="55%" stopColor="#f3cf6e" />
            <stop offset="75%" stopColor="#e0b34a" />
            <stop offset="100%" stopColor="#c79a2e" />
          </linearGradient>
          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g clipPath="url(#clockClip)" className={styles.spin}>
          <image href={purpleImage} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
        </g>
        {[
          'XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
        ].map((roman, i) => {
           const angle = i * 30;
          const radian = ((angle - 90) * Math.PI) / 180;
          const cx = 50 + 42 * Math.cos(radian);
          const cy = 50 + 42 * Math.sin(radian);
          return (
            <text
              key={roman}
              x={cx}
              y={cy}
              fill="url(#goldGradient)"
              stroke="#e0b34a"
              strokeWidth="0.15"
              fontSize="9"
              fontWeight="bold"
              fontFamily="ClockFont_26_08_29"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${angle} ${cx} ${cy})`}
              filter="url(#goldGlow)"
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
          stroke="url(#goldGradient)"
          strokeWidth="4.2"
          strokeLinecap="round"
          filter="url(#goldGlow)"
          transform={`rotate(${hourDegrees} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="18"
          stroke="url(#goldGradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#goldGlow)"
          transform={`rotate(${minuteDegrees} 50 50)`}
        />
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="5"
          stroke="url(#goldGradient)"
          strokeWidth="1.6"
          strokeLinecap="round"
          filter="url(#goldGlow)"
          transform={`rotate(${secondDegrees} 50 50)`}
        />

        <circle cx="50" cy="50" r="2.8" fill="url(#goldGradient)" stroke="#8a6508" strokeWidth="0.3" filter="url(#goldGlow)" />
      </svg>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {timeLabel}
      </time>
    </main>
  );
};

Clock.displayName = 'Clock_26_08_29';
export default Clock;
