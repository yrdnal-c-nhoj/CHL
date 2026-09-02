import fontUrl from '@/assets/fonts/26fonts/26-08-29.ttf?url';
import purpleImage from '@/assets/images/26_images/26-08/26-08-29/purple.webp';
import shellImage from '@/assets/images/26_images/26-08/26-08-29/shell.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React from 'react';
import styles from './Clock.module.css';

export const assets = [shellImage, purpleImage, fontUrl];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_29', fontUrl },
];

const pad = (n: number) => String(n).padStart(2, '0');

const PHOENICIAN_STROKES: string[] = [
  '',              // 0
  '𐤖',             // 1
  '𐤚',             // 2
  '𐤛',             // 3
  '𐤛𐤖',           // 4
  '𐤛𐤚',           // 5
  '𐤛𐤛',           // 6
  '𐤛𐤛𐤖',         // 7
  '𐤛𐤛𐤚',         // 8
  '𐤛𐤛𐤛',         // 9
];

const PHOENICIAN_TEN = '𐤗';   // 10
const PHOENICIAN_TWENTY = '𐤘'; // 20

const toPhoenician = (n: number): string => {
  if (n === 0) return '\u00A0';
  const twenties = Math.floor(n / 20);
  const remainder = n % 20;
  const tens = remainder >= 10 ? 1 : 0;
  const ones = remainder - tens * 10;
  return PHOENICIAN_TWENTY.repeat(twenties) + (tens ? PHOENICIAN_TEN : '') + PHOENICIAN_STROKES[ones];
};

const Clock = () => {
  const time = useClock();
  useSuspenseFontLoader(fontConfigs);

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const isoTime = time.toISOString();

  return (
    <main
      className={styles.container}
      style={{ '--shells': `url(${shellImage}) ` } as React.CSSProperties}
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
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
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

        <circle cx="50" cy="50" r="1" fill="url(#goldGradient)" stroke="#8a6508" strokeWidth="0.2" />
      </svg>

      <div className={styles.digitalClock}>
        <div className={styles.timeUnit}>{toPhoenician(parseInt(hours, 10))}</div>
        <div className={styles.timeUnit}>{toPhoenician(parseInt(minutes, 10))}</div>
        <div className={styles.timeUnit}>{toPhoenician(parseInt(seconds, 10))}</div>
      </div>

      <time dateTime={isoTime} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

Clock.displayName = 'Clock_26_08_29';
export default Clock;
