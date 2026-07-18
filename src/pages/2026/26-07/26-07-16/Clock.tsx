import TomWebp from '@/assets/images/26_images/26-07/26-07-16/Tom.webp';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

const WORK_EMOJIS = ['🎯', '🛠️', '📊', '🔨', '📌', '📎', '💼',  '📱', '📈', '🏗️','🖥️', '🧱', '🔧', '📋', '⚙️', '💻'];
const PLAY_EMOJIS = ['🎲', '🃏', '🎮',  '⚽',  '🎨', '🖌️', '🎸', '🎤', '🏖️', '🌊', '🎟️', '🎡', '🎭','🏀','🕹️', '🎸'];

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
    <div
      style={{
        ...styles.container,
        backgroundColor: isWorkPhase ? '#EB1212' : '#1BC41B',
      }}
    >
      {/* Background Image Layer */}
      <div
        style={{
          ...styles.backgroundImage,
          backgroundImage: `url(${TomWebp})`,
          filter: `hue-rotate(${isWorkPhase ? '0deg' : '120deg'})`,
        }}
      />

      {/* Background Emoji Grid Layer */}
      <div style={styles.emojiGridWrapper}>
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

      {/* Main Clock Dial */}
      <div style={styles.clockFace}>
        <div style={styles.pomodoroSectors} />

        <div
          style={{
            ...styles.statusBadge,
            top: isWorkPhase ? '18%' : 'auto',
            bottom: isWorkPhase ? 'auto' : '18%',
            backgroundColor: isWorkPhase ? '#ff0000' : '#00ff00',
            color: isWorkPhase ? '#ffffff' : '#000000',
          }}
        >
          {isWorkPhase ? 'LABORTEMPO' : 'LUDTEMPO'}
        </div>

        {/* Hand Indicators */}
        <div style={{ ...styles.hand, ...styles.hourHand, transform: `rotate(${hourAngle}deg)` }} />
        <div style={{ ...styles.hand, ...styles.minuteHand, transform: `rotate(${minuteAngle}deg)` }} />
        <div
          style={{
            ...styles.hand,
            ...styles.secondHand,
            transform: `rotate(${secondAngle}deg)`,
            backgroundColor: isWorkPhase ? '#00ff00' : '#ff0000', // Dynamic coloring applied here
          }}
        />

        <div style={styles.centerDot} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100dvh',
    overflow: 'hidden',
    position: 'relative',
    transition: 'background-color 0.2s linear',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
    transition: 'filter 0.4s ease-in-out',
    willChange: 'filter',
  },
  emojiGridWrapper: {
    position: 'absolute',
    top: '-2%',
    left: '-2%',
    width: '104%',
    height: '104%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  emojiCell: {
    position: 'absolute',
    fontSize: 'clamp(48px, 8vw, 110px)',
    willChange: 'transform, opacity',
  },
  clockFace: {
    position: 'relative',
    width: 340,
    height: 340,
    opacity: 0.9,
    border: '6px solid #111010',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 30px rgba(0,0,0,0.4), inset 0 0 25px rgba(0,0,0,0.2)',
    zIndex: 2,
  },
  pomodoroSectors: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(
      #ff0000 0deg 150deg,
      #00ff00 150deg 180deg,
      #ff0000 180deg 330deg,
      #00ff00 330deg 360deg
    )`,
  },
  statusBadge: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: '900',
    fontSize: '13px',
    letterSpacing: '1.5px',
    zIndex: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.69)',
    transition: 'background-color 0.2s, color 0.2s, top 0.2s, bottom 0.2s',
  },
  hand: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '4px',
  },
  hourHand: {
    width: 6,
    height: '29%',
    backgroundColor: '#000000',
    marginLeft: -4,
  },
  minuteHand: {
    width: 6,
    height: '48%',
    backgroundColor: '#111111',
    marginLeft: -3,
  },
  secondHand: {
    width: 2,
    height: '342%',
    marginLeft: -1,
    transition: 'background-color 0.2s linear', // Added a smooth transition for the color flip
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 18,
    height: 18,
    backgroundColor: '#CAC4C4',
    border: '4px solid #141313',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 0 8px rgba(255, 0, 0, 0.6)',
  },
};

export default AnalogClock;