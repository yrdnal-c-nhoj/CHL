import TomWebp from '@/assets/images/26_images/26-07/26-07-16/tom.webp';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

export const assets: string[] = [TomWebp];

const WORK_EMOJIS = ['🎯', '🛠️', '📊', '🔨', '📌', '📎', '💼',  '📱', '📈', '🏗️','🖥️', '🧱', '🔧', '📋', '⚙️', '💻'];
const PLAY_EMOJIS = ['🎲', '🃏', '🎮',  '⚽',  '🎨', '🖌️', '🎸', '🎤', '🏖️', '🌊', '🎟️', '🎡', '🎭','🏀','🕹️', '🎸'];

const GRID_COLS = 10;
const GRID_ROWS = 14;

const AnalogClock: React.FC = () => {
  const now = useSecondClock();

  const { hourAngle, minuteAngle, secondAngle, currentSecond, isoTime } = useMemo(() => {
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    return {
      secondAngle: seconds * 6,
      minuteAngle: (minutes + seconds / 60) * 6,
      hourAngle: ((hours % 12) + minutes / 60) * 30,
      currentSecond: seconds,
      isoTime: now.toISOString(),
    };
  }, [now]);

  // Phase matching logic
  const isWorkPhase = currentSecond < 25 || (currentSecond >= 30 && currentSecond < 55);
  const activeEmojis = isWorkPhase ? WORK_EMOJIS : PLAY_EMOJIS;

  const totalSecondsElapsed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const fifteenSecondStep = Math.floor(totalSecondsElapsed / 15);

  // Checkerboard-style grid generation
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

        cells.push({
          left: `${left}%`,
          top: `${top}%`,
          distance,
          index,
          row: r,
          col: c,
          parity,
        });
      }
    }
    return cells;
  }, []);

  return (
    <main
      className={styles.container}
      style={{ '--bg-color': isWorkPhase ? '#EB1212' : '#1BC41B' } as React.CSSProperties}
    >
      <time dateTime={isoTime} className={styles.semanticTime}>
        {now.toLocaleTimeString()}
      </time>
      {/* Background Image Layer */}
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${TomWebp})`, '--hue-filter': isWorkPhase ? '0deg' : '120deg' } as React.CSSProperties}
      />

      {/* Background Emoji Grid Layer */}
      <div className={styles.emojiGridWrapper}>
        {gridCells.map((cell) => {
          const baseOffset = cell.parity === 0 ? fifteenSecondStep : fifteenSecondStep + 3;
          const emojiIndex = (Math.floor(cell.index / 2) + baseOffset) % activeEmojis.length;
          const emoji = activeEmojis[emojiIndex];

          const wavePulse = Math.sin((currentSecond + cell.distance) * 0.5);
          const scaleFactor = (isWorkPhase ? 1.0 : 0.85) + (cell.parity === 0 ? 0.1 : -0.05);
          const dynamicScale = scaleFactor + wavePulse * 0.05;

          return (
            <span
              key={cell.index}
              className={styles.emojiCell}
              style={{
                left: cell.left,
                top: cell.top,
                '--opacity': isWorkPhase ? 0.95 : 0.85,
                '--transform': `translate(-50%, -50%) scale(${dynamicScale}) translate3d(0, ${wavePulse * 4}px, 0)`,
              }}
              aria-hidden="true"
            >
              {emoji}
            </span>
          );
        })}
      </div>

      {/* Main Clock Dial */}
      <div className={styles.clockFace}>
        <div className={styles.pomodoroSectors} />

        <div
          className={styles.statusBadge}
          data-work-phase={isWorkPhase}
        >
          {isWorkPhase ? 'LABORTEMPO' : 'LUDTEMPO'}
        </div>

        {/* Hand Indicators */}
        <div className={`${styles.hand} ${styles.hourHand}`} style={{ transform: `rotate(${hourAngle}deg)` }} />
        <div className={`${styles.hand} ${styles.minuteHand}`} style={{ transform: `rotate(${minuteAngle}deg)` }} />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${secondAngle}deg)`, backgroundColor: isWorkPhase ? '#00ff00' : '#ff0000' }}
        />

        <div className={styles.centerDot} />
      </div>
    </main>
  );
};

export default AnalogClock;