import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { formatTime as utilFormatTime } from '@/utils/clockUtils'; // Alias to avoid conflict with local formatTime
import { useClockTime } from '@/utils/hooks'; // Use the standardized hook
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const time = useClockTime(); // Centralized time source
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

  // --- EMOJI CYCLING LOGIC ---
  const lastCycledSecond = useRef<number>(-1);

  // This useEffect replaces the time update and emoji cycling from the old rAF loop
  useEffect(() => {
    const currentSecond = time.getSeconds();
    
    // Only update emoji every 3 seconds
    // Ensure it only triggers once per second when the condition is met
    if (
      currentSecond % 3 === 0 &&
      currentSecond !== lastCycledSecond.current
    ) {
      lastCycledSecond.current = currentSecond;

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
  }, [time.getSeconds(), emojiCycle, activeBuffer]); // Depend on seconds to trigger every second, then filter every 3rd.

  // --- SCREEN RESIZE LISTENER ---
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- BACKGROUND READY EFFECT ---
  // This is for the initial fade-in of the component
  // The ClockPage.tsx already handles a loading overlay, so this might be redundant
  // but keeping it for now as it's part of the component's internal logic.
  useEffect(() => {
    const t = setTimeout(() => setBgReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getLayerStyle = useCallback((emoji: string, isVisible: boolean) => {
    // Determine base size for SVG emoji based on screen size
    const baseSvgSize = isLargeScreen ? 60 : 40; // Example: 60px for large, 40px for small

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${baseSvgSize}" height="${baseSvgSize}">
        <text x="50%" y="55%" font-size="${baseSvgSize * 0.7}" text-anchor="middle" dominant-baseline="middle">
          ${emoji}
        </text>
      </svg>`.trim();
    return {
      className: styles.layer,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}")`, // Use baseSvgSize here
      opacity: isVisible ? 1 : 0,
    };
  }, [isLargeScreen]); // Re-create if isLargeScreen changes

  const { hours, minutes, seconds } = useMemo(() => utilFormatTime(time, '12h'), [time]);

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
