import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime, formatTime } from '@/utils/clockUtils';
import type { FontConfig } from '@/types/clock';
import d25090120font from '@/assets/fonts/2026/26-01-20-hairdo.ttf';
import styles from './Clock.module.css';

type DigitChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

const DIGIT_MAP: Record<DigitChar, string> = {
  '0': 'B',
  '1': 'V',
  '2': 'A',
  '3': 'X',
  '4': 'D',
  '5': 'Q',
  '6': 'M',
  '7': 'G',
  '8': 'H',
  '9': 'T',
};

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'MyD25090120font',
    fontUrl: d25090120font,
  },
];

const Clock: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds } = useMemo(() => formatTime(time, '24h'), [time]);

  const renderUnit = (value: string) => (
    <div className={styles.unitWrapper}>
      {value.split('').map((digit, i) => (
        <span key={i} className={styles.digit}>
          {DIGIT_MAP[digit as DigitChar] || digit}
        </span>
      ))}
    </div>
  );

  return (
    <main className={styles.container}>
      <div className={styles.background} aria-hidden="true" />
      <time className={styles.content} dateTime={`${hours}:${minutes}:${seconds}`}>
        {renderUnit(hours)}
        {renderUnit(minutes)}
        {renderUnit(seconds)}
      </time>
    </main>
  );
};

export default Clock;
