import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { formatTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [time, setTime] = useState(() => new Date());
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [bgReady, setBgReady] = useState<boolean>(false);

  // --- EMOJI POOL ---
  const allEmojis = useMemo(() => {
    const rawList = [
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
    return [...new Set(rawList)].filter(Boolean);
  }, []);

  // --- NON-REPEATING CYCLE SYSTEM ---
  const [emojiCycle] = useState(() =>
    [...allEmojis].sort(() => Math.random() - 0.5),
  );
  const [emojiIndex, setEmojiIndex] = useState<number>(0);

  // --- DOUBLE BUFFER SYSTEM ---
  const [activeBuffer, setActiveBuffer] = useState<number>(1);
  const [buffer1Emoji, setBuffer1Emoji] = useState<string>(emojiCycle[0]);
  const [buffer2Emoji, setBuffer2Emoji] = useState<string>('');

  // --- DIGIT MAPPING ---
  type DigitChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  const digitToEmoji: Record<DigitChar, string> = useMemo(() => ({
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
  }), []);

  // --- MAIN EFFECT LOOP ---
  useEffect(() => {
    let frameId: number;
    let secondsCounter = 0;
    let lastTime = Date.now();

    const tick = () => {
      const now = Date.now();
      setTime(new Date());

      if (now - lastTime >= 1000) {
        secondsCounter++;
        lastTime = now;

        if (secondsCounter % 3 === 0) {
          setEmojiIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % emojiCycle.length;
            const nextEmoji = emojiCycle[nextIndex];

            if (activeBuffer === 1) {
              setBuffer2Emoji(nextEmoji);
              setActiveBuffer(2);
            } else {
              setBuffer1Emoji(nextEmoji);
              setActiveBuffer(1);
            }
            return nextIndex;
          });
        }
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [emojiCycle, activeBuffer]);

  useEffect(() => {
    const t = setTimeout(() => setBgReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const tileSize: number = 60;

  const getLayerStyle = useCallback((emoji: string, isVisible: boolean) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}">
        <text x="50%" y="55%" font-size="${tileSize * 0.7}" text-anchor="middle" dominant-baseline="middle">
          ${emoji}
        </text>
      </svg>`.trim();
    return {
      className: styles.layer,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}")`,
      opacity: isVisible ? 1 : 0,
    };
  }, []);

  const { hours, minutes, seconds } = useMemo(() => formatTime(time, '12h'), [time]);

  const renderDigits = (str: string) => (
    <div className={styles.digitGroup}>
      {str.split('').map((d, i) => (
        <div
          key={i}
          className={`${styles.digit} ${isLargeScreen ? styles.digitLarge : styles.digitMobile}`}
        >
          {digitToEmoji[d as DigitChar]}
        </div>
      ))}
    </div>
  );

  return (
    <main className={styles.container} style={{ opacity: bgReady ? 1 : 0 }}>
      <div className={styles.layer} style={getLayerStyle(buffer1Emoji, activeBuffer === 1)} />
      <div className={styles.layer} style={getLayerStyle(buffer2Emoji, activeBuffer === 2)} />

      <time className={styles.content} dateTime={`${hours}:${minutes}:${seconds}`}>
        {renderDigits(hours)}
        {renderDigits(minutes)}
        {renderDigits(seconds)}
      </time>
    </main>
  );
};

export default Clock;
