import React, { useMemo } from 'react';
import { useClock } from '@/utils/hooks';
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
  '🏓',
  '🏸',
  '🏒',
  '🏑',
  '🏏',
  '🥅',
  '🎣',
  '🥊',
  '🎽',
  '🛹',
  '🛷',
  '🥌',
  '🎿',
  '🎭',
  '🎨',
  '🎬',
  '🎹',
  '🥁',
  '🎸',
  '🎯',
  '🐶',
  '🐱',
  '🐹',
  '🦊',
  '🐯',
  '🦁',
  '🐸',
  '🦄',
  '🐄',
  '🐎',
  '🐩',
  '🐈',
  '🐅',
  '🦓',
  '🦒',
  '🦘',
  '🐛',
  '🦋',
  '🐌',
  '🐢',
  '🐍',
  '🦎',
  '🐙',
  '🦑',
  '🦐',
  '🦀',
  '🐡',
  '🐠',
  '🐬',
  '🐳',
  '🐋',
  '🦈',
  '🦃',
  '🦚',
  '🦜',
  '🦩',
  '🐾',
  '🐉',
  '🐲',
  '🌵',
  '🌴',
  '🌱',
  '🌿',
  '🎋',
  '🍁',
  '🍄',
  '🌾',
  '💐',
  '🌹',
  '🌸',
  '🌼',
  '🚗',
  '🚌',
  '🚎',
  '🏎',
  '🚒',
  '🚚',
  '🚜',
  '🚲',
  '🛵',
  '🚍',
  '🚘',
  '🚋',
  '🚞',
  '🚂',
  '🚇',
  '🚊',
  '🚀',
  '🚁',
  '🛶',
  '🚤',
  '🚢',
  '🗿',
  '🗽',
  '🗼',
  '🏰',
  '🏟',
  '🎡',
  '🎢',
  '🎠',
  '🏖',
  '🏜',
  '🌋',
  '🏔',
  '🏕',
  '🏘',
  '🏗',
  '🗺',
  '💺',
  '🎳',
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
  const time = useClock();

  const emojiCycle = useMemo(() => shuffle(BACKGROUND_EMOJIS), []);
  const backgroundIndex = Math.floor(time.getTime() / 3000) % emojiCycle.length;
  const backgroundEmoji = emojiCycle[backgroundIndex] ?? emojiCycle[0] ?? '';

  /*
   * Read the time directly from the Date supplied by useClock.
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
      <div className={styles.background} aria-hidden="true">
        {backgroundEmoji}
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
