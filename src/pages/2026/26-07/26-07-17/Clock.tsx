import TomWebp from '@/assets/images/26_images/26-07/26-07-16/tom.webp';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

export const assets: string[] = [TomWebp];

const WORK_EMOJIS = ['🎯', '🛠️', '📊', '🔨', '📌', '📎', '💼', '📱', '📈', '🏗️', '🖥️', '🧱', '🔧', '📋', '⚙️', '💻'];
const PLAY_EMOJIS = ['🎲', '🃏', '🎮', '⚽', '🎨', '🖌️', '🎸', '🎤', '🏖️', '🌊', '🎟️', '🎡', '🎭', '🏀', '🕹️', '🎸'];

const GRID_COLS = 10;
const GRID_ROWS = 14;

const STYLES: Record<string, React.CSSProperties> = {
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
  semanticTime: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: '20%',
    backgroundPosition: 'center',
    zIndex: 0,
    opacity: 0.7,
    transition: 'filter 0.4s ease-in-out',
    willChange: 'filter, transform',
    animation: 'rotate-ccw 60s linear infinite',
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
    fontSize: 'clamp(32px, 7vw, 60px)',
    willChange: 'transform, opacity',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
    filter: 'drop-shadow(4px 4px 5px rgba(0, 0, 0, 0.6))',
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
    fontWeight: 900,
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
    marginLeft: -3,
  },
  minuteHand: {
    width: 6,
    height: '48%',
    backgroundColor: '#111111',
    marginLeft: -3,
  },
  secondHand: {
    width: 2,
    height: '348%',
    marginLeft: -1,
    transition: 'background-color 0.2s linear',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 18,
    height: 18,
    backgroundColor: '#656262',
    border: '4px solid #141313',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 0 8px rgba(255, 0, 0, 0.6)',
  },
};

const KEYFRAMES = `
  @keyframes rotate-ccw {
    from {
      transform: rotate(0deg) scale(1.42);
    }
    to {
      transform: rotate(-360deg) scale(1.42);
    }
  }
`;

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

  const statusBadgeStyle: React.CSSProperties = {
    ...STYLES.statusBadge,
    ...(isWorkPhase
      ? { top: '18%', backgroundColor: '#ff0000', color: '#ffffff' }
      : { bottom: '18%', backgroundColor: '#00ff00', color: '#000000' }),
  };

  return (
    <main
      style={{
        ...STYLES.container,
        backgroundColor: isWorkPhase ? '#EB1212' : '#1BC41B',
      }}
    >
      <style>{KEYFRAMES}</style>
      <time dateTime={isoTime} style={STYLES.semanticTime}>
        {now.toLocaleTimeString()}
      </time>
      
      {/* Background Image Layer */}
      <div
        style={{
          ...STYLES.backgroundImage,
          backgroundImage: `url(${TomWebp})`,
          filter: `hue-rotate(5deg) saturate(1.5) contrast(0.8) brightness(1.1) hue-rotate(${
            isWorkPhase ? '0deg' : '120deg'
          })`,
        }}
      />

      {/* Background Emoji Grid Layer */}
      <div style={STYLES.emojiGridWrapper}>
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
                ...STYLES.emojiCell,
                left: cell.left,
                top: cell.top,
                opacity: isWorkPhase ? 0.95 : 0.85,
                transform: `translate(-50%, -50%) scale(${dynamicScale}) translate3d(0, ${wavePulse * 4}px, 0)`,
              }}
              aria-hidden="true"
            >
              {emoji}
            </span>
          );
        })}
      </div>

      {/* Main Clock Dial */}
      <div style={STYLES.clockFace}>
        <div style={STYLES.pomodoroSectors} />

        <div style={statusBadgeStyle} data-work-phase={isWorkPhase}>
          {isWorkPhase ? 'LABORTEMPO' : 'LUDTEMPO'}
        </div>

        {/* Hand Indicators */}
        <div style={{ ...STYLES.hand, ...STYLES.hourHand, transform: `rotate(${hourAngle}deg)` }} />
        <div style={{ ...STYLES.hand, ...STYLES.minuteHand, transform: `rotate(${minuteAngle}deg)` }} />
        <div
          style={{
            ...STYLES.hand,
            ...STYLES.secondHand,
            transform: `rotate(${secondAngle}deg)`,
            backgroundColor: isWorkPhase ? '#00ff00' : '#ff0000',
          }}
        />

        <div style={STYLES.centerDot} />
      </div>
    </main>
  );
};

export default AnalogClock;