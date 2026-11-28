import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import styles from './Clock.module.css';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-27/moth.mp4';
import tileImage from '@/assets/images/26_images/26-11/26-11-27/key.gif';
import clockFont from '@/assets/fonts/26fonts/26-11-27.ttf?url';

export const assets = [backgroundVideo, tileImage, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_27',
  fontUrl: clockFont,
};

const ROMAN_NUMERALS = [
  'XII',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
];

// Generate grid positions for tiling
const TILE_SIZE = 120; // px
const GRID_SIZE = 12; // 12x12 grid = 144 tiles

const Clock_26_11_27 = () => {
  const time = useSmoothClock(16);

  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;

  // Generate tile positions
  const tiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const col = i % GRID_SIZE;
    const row = Math.floor(i / GRID_SIZE);
    // Stagger animation delay for organic feel
    const delay = (i * 0.5) % 60;
    return { col, row, delay };
  });

  return (
    <main className={styles.container}>
      {/* Video background */}
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      {/* Grid of rotating images on top of video */}
      <div className={styles.backgroundGrid} aria-hidden="true">
        {tiles.map((tile) => (
          <img
            key={`${tile.col}-${tile.row}`}
            src={tileImage}
            alt=""
            className={styles.backgroundTile}
            style={
              {
                left: `${tile.col * TILE_SIZE}px`,
                top: `${tile.row * TILE_SIZE}px`,
                animationDelay: `${-tile.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <SRTime time={time} />
      <div className={styles.clockFace} aria-hidden="true">
        {/* Roman numerals at 85% radius - matching 26-11-25 geometric pattern */}
        {ROMAN_NUMERALS.map((numeral, i) => {
          const angle = i * 30; // 30 degrees per hour, XII at 0° (top)
          const radius = 85; // percentage of clock face radius

          const left = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const top = 50 - radius * Math.cos((angle * Math.PI) / 180);

          return (
            <div
              key={numeral}
              className={styles.numeral}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                } as React.CSSProperties
              }
            >
              {numeral}
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ '--rotation': `${hourDeg}deg` } as React.CSSProperties}
          aria-hidden="true"
        />

        {/* Minute hand */}
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ '--rotation': `${minuteDeg}deg` } as React.CSSProperties}
          aria-hidden="true"
        />
      </div>
    </main>
  );
};

Clock_26_11_27.displayName = 'Clock_26_11_27';

export default Clock_26_11_27;
