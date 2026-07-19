import TomWebp from '@/assets/images/26_images/26-07/26-07-16/tom.webp';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

export const assets = [TomWebp];

const WORK_EMOJIS = ['🎯', '🛠️', '📊', '🔨', '📌', '📎', '💼', '📱', '📈', '🏗️', '🖥️', '🧱', '🔧', '📋', '⚙️', '💻'];
const PLAY_EMOJIS = ['🎲', '🃏', '🎮', '⚽', '🎨', '🖌️', '🎸', '🎤', '🏖️', '🌊', '🎟️', '🎡', '🎭', '🏀', '🕹️', '🎸'];

const GRID_COLS = 10;
const GRID_ROWS = 14;

const AnalogClock: React.FC = () => {
  const now = useSecondClock();

  const { hourAngle, minuteAngle, secondAngle, currentSecond } = useMemo(() => {
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    return {
      secondAngle: seconds * 6,
      minuteAngle: (minutes + seconds / 60) * 6,
      hourAngle: ((hours % 12) + minutes / 60) * 30,
      currentSecond: seconds,
    };
  }, [now]);

  // More balanced phases (roughly 50/50 split with smoother transitions)
  const isWorkPhase = currentSecond < 30 || (currentSecond >= 45 && currentSecond < 60);

  const activeEmojis = isWorkPhase ? WORK_EMOJIS : PLAY_EMOJIS;
  const totalSecondsElapsed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const fifteenSecondStep = Math.floor(totalSecondsElapsed / 15);

  const gridCells = useMemo(() => {
    const cells = [];
    const midCol = (GRID_COLS - 1) / 2;
    const midRow = (GRID_ROWS - 1) / 2;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const distance = Math.sqrt(Math.pow(c - midCol, 2) + Math.pow(r - midRow, 2));
        const left = (c / (GRID_COLS - 1)) * 100;
        const top = (r / (GRID_ROWS - 1)) * 100;
        const index = r * GRID_COLS + c;
        const parity = (r + c) % 2;

        cells.push({ left: `${left}%`, top: `${top}%`, distance, index, row: r, col: c, parity });
      }
    }
    return cells;
  }, []);

  const phaseColor = isWorkPhase ? '#EB1212' : '#1BC41B';
  const badgeColor = isWorkPhase ? '#ff0000' : '#00ff00';
  const badgeTextColor = isWorkPhase ? '#ffffff' : '#000000';

  return (
    <div style={{ ...styles.container, backgroundColor: phaseColor }}>
      {/* Background Image */}
      <div
        style={{
          ...styles.backgroundImage,
          backgroundImage: `url(${TomWebp})`,
          filter: `hue-rotate(${isWorkPhase ? '0deg' : '120deg'})`,
        }}
      />

      {/* Animated Emoji Grid */}
      <div style={styles.emojiGridWrapper}>
        {gridCells.map((cell) => {
          const baseOffset = cell.parity === 0 ? fifteenSecondStep : fifteenSecondStep + 3;
          const emojiIndex = (Math.floor(cell.index / 2) + baseOffset) % activeEmojis.length;
          const emoji = activeEmojis[emojiIndex];

          const wavePulse = Math.sin((currentSecond + cell.distance) * 0.5);
          const scaleFactor = (isWorkPhase ? 1.0 : 0.85) + (cell.parity === 0 ? 0.1 : -0.05);
          const dynamicScale = Math.max(0.6, scaleFactor + wavePulse * 0.05); // prevent too small

          return (
            <span
              key={cell.index}
              style={{
                ...styles.emojiCell,
                left: cell.left,
                top: cell.top,
                opacity: isWorkPhase ? 0.95 : 0.85,
                transform: `translate(-50%, -50%) scale(${dynamicScale}) translate3d(0, ${wavePulse * 4}px, 0)`,
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
              }}
              aria-hidden="true"
            >
              {emoji}
            </span>
          );
        })}
      </div>

      {/* Clock Face */}
      <div style={styles.clockFace}>
        <div style={styles.pomodoroSectors} />

        <div
          style={{
            ...styles.statusBadge,
            top: isWorkPhase ? '18%' : 'auto',
            bottom: isWorkPhase ? 'auto' : '18%',
            backgroundColor: badgeColor,
            color: badgeTextColor,
          }}
        >
          {isWorkPhase ? 'LABORTEMPO' : 'LUDTEMPO'}
        </div>

        {/* Hands */}
        <div style={{ ...styles.hand, ...styles.hourHand, transform: `rotate(${hourAngle}deg)` }} />
        <div style={{ ...styles.hand, ...styles.minuteHand, transform: `rotate(${minuteAngle}deg)` }} />
        <div
          style={{
            ...styles.hand,
            ...styles.secondHand,
            transform: `rotate(${secondAngle}deg)`,
            backgroundColor: isWorkPhase ? '#00ff00' : '#ff000