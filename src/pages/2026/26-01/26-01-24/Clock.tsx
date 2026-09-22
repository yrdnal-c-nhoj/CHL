import React, { useEffect, useMemo, useState } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [];

type DigitChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

const DIGIT_TO_EMOJI: Record<DigitChar, string> = {
  '0': '🕳️',
  '1': '📍',
  '2': '🥈',
  '3': '🔱',
  '4': '🍀',
  '5': '⭐',
  '6': '🐝',
  '7': '🎰',
  '8': '🎱',
  '9': '☁️',
};

const BACKGROUND_EMOJIS = [
  '🏓', '🏸', '🏒', '🏑', '🏏', '🥅', '🎣', '🥊',
  '🎽', '🛹', '🛷', '🥌', '🎿', '🎭', '🎨', '🎬',
  '🎹', '🥁', '🎸', '🎯', '🐶', '🐱', '🐹', '🦊',
  '🐯', '🦁', '🐸', '🦄', '🐄', '🐎', '🐩', '🐈',
  '🐅', '🦓', '🦒', '🦘', '🐛', '🦋', '🐌', '🐢',
  '🐍', '🦎', '🐙', '🦑', '🦐', '🦀', '🐡', '🐠',
  '🐬', '🐳', '🐋', '🦈', '🦃', '🦚', '🦜', '🦩',
  '🐾', '🐉', '🐲', '🌵', '🌴', '🌱', '🌿', '🎋',
  '🍁', '🍄', '🌾', '💐', '🌹', '🌸', '🌼', '🚗',
  '🚌', '🚎', '🏎', '🚒', '🚚', '🚜', '🚲', '🛵',
  '🚍', '🚘', '🚋', '🚞', '🚂', '🚇', '🚊', '🚀',
  '🚁', '🛶', '🚤', '🚢', '🗿', '🗽', '🗼', '🏰',
  '🏟', '🎡', '🎢', '🎠', '🏖', '🏜', '🌋', '🏔',
  '🏕', '🏘', '🏗', '🗺', '💺', '🎳',
];

const shuffle = <T,>(array: readonly T[]): T[] => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const Clock = () => {
  const time = useSmoothClock();

  const emojiCycle = useMemo(
    () => shuffle(BACKGROUND_EMOJIS),
    [],
  );

  const [backgroundIndex, setBackgroundIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBackgroundIndex((index) =>
        (index + 1) % emojiCycle.length,
      );
    }, 3000);

    return () => window.clearInterval(timer);
  }, [emojiCycle.length]);

  /*
   * Read the time directly from the Date supplied by useSmoothClock.
   */
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  const renderDigits = (value: string) => (
    <div className={styles.digitGroup}>
      {value.split('').map((digit, index) => (
        <span
          key={`${value}-${index}`}
          className={styles.digit}
          aria-hidden="true"
        >
          {DIGIT_TO_EMOJI[digit as DigitChar]}
        </span>
      ))}
    </div>
  );

  return (
    <main className={styles.container}>
      <div
        className={styles.background}
        aria-hidden="true"
      >
        {emojiCycle[backgroundIndex]}
      </div>

      <time
        className={styles.clock}
        dateTime={`${hours}:${minutes}:${seconds}`}
      >
        <span className={styles.srOnly}>
          {hours}:{minutes}:{seconds}
        </span>
        {renderDigits(hours)}
        {renderDigits(minutes)}
        {renderDigits(seconds)}
      </time>
    </main>
  );
};

const MemoizedClock = React.memo(Clock);

MemoizedClock.displayName = 'Clock_26_01_24';

export default MemoizedClock;