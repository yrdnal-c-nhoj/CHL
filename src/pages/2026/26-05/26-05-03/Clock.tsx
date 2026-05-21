import React, { useMemo, FC } from 'react';
import { useClockTime } from '@/utils/hooks';
import styles from './Clock.module.css';
import fontUrl from '@/assets/fonts/26fonts/26-05-03-dolphin.ttf?url';
import boxImage from '@/assets/images/26_images/26-05/26-05-03/box.webp';

/* ---------------- FONT MAP ---------------- */

const FONT: Record<string, number[][]> = {
  '0': [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [4, 1],
    [0, 2],
    [4, 2],
    [0, 3],
    [4, 3],
    [0, 4],
    [4, 4],
    [0, 5],
    [4, 5],
    [0, 6],
    [4, 6],
    [1, 7],
    [2, 7],
    [3, 7],
  ],
  '1': [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
  ],
  '2': [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 1],
    [3, 2],
    [2, 3],
    [1, 4],
    [0, 5],
    [0, 6],
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
  ],
  '3': [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [4, 1],
    [4, 2],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
    [0, 7],
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
  ],
  '4': [
    [3, 0],
    [2, 1],
    [1, 2],
    [0, 3],
    [3, 3],
    [4, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
  ],
  '5': [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 3],
    [4, 4],
    [0, 5],
    [4, 5],
    [1, 6],
    [4, 6],
    [1, 7],
    [2, 7],
    [3, 7],
  ],
  '6': [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [0, 4],
    [4, 4],
    [0, 5],
    [4, 5],
    [0, 6],
    [4, 6],
    [1, 7],
    [2, 7],
    [3, 7],
  ],
  '7': [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [4, 1],
    [3, 2],
    [2, 3],
    [2, 4],
    [1, 5],
    [1, 6],
    [1, 7],
  ],
  '8': [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [4, 1],
    [0, 2],
    [4, 2],
    [1, 3],
    [2, 3],
    [3, 3],
    [0, 4],
    [4, 4],
    [0, 5],
    [4, 5],
    [0, 6],
    [4, 6],
    [1, 7],
    [2, 7],
    [3, 7],
  ],
  '9': [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [4, 1],
    [0, 2],
    [4, 2],
    [0, 3],
    [4, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [4, 5],
    [4, 6],
    [1, 7],
    [2, 7],
    [3, 7],
  ],
  ':': [
    [2, 2],
    [2, 5],
  ],
};

/* ---------------- COLORS ---------------- */

const COLORS = [
  '#0CA2D0',
  '#06C255',
  '#CE086E',
  '#D89D08',
  '#2B29D7',
  '#CF0625',
  '#C909B3',
  '#D8590A',
  '#800ADB',
  '#3B3A3B',
];

/* ---------------- UTILS ---------------- */

const pickColor = (seed: number) =>
  COLORS[Math.abs(Math.floor(Math.sin(seed) * 9999)) % COLORS.length];

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  return `rgb(${r},${g},${b})`;
};

/* ---------------- VOXEL ---------------- */

interface VoxelProps {
  x: number;
  y: number;
  seed: number;
}

const Voxel: FC<VoxelProps> = ({ x, y, seed }) => {
  const size = 16;
  const depth = 8;
  const color = pickColor(seed);

  return (
    <div className={styles.voxel} style={{ left: x * size, top: y * size }}>
      <div className={styles.cube}>
        <div
          className={styles.face}
          style={{
            transform: `translateZ(${depth}px)`,
            background: shade(color || '#000000', 18),
          }}
        />
        <div
          className={styles.face}
          style={{
            transform: `rotateY(180deg) translateZ(${depth}px)`,
            background: shade(color || '#000000', -18),
          }}
        />
        <div
          className={styles.face}
          style={{
            transform: `rotateY(90deg) translateZ(${depth}px)`,
            background: shade(color || '#000000', -10),
          }}
        />
        <div
          className={styles.face}
          style={{
            transform: `rotateY(-90deg) translateZ(${depth}px)`,
            background: shade(color || '#000000', -10),
          }}
        />
        <div
          className={styles.face}
          style={{
            transform: `rotateX(90deg) translateZ(${depth}px)`,
            background: shade(color || '#000000', 8),
          }}
        />
        <div
          className={styles.face}
          style={{
            transform: `rotateX(-90deg) translateZ(${depth}px)`,
            background: shade(color || '#000000', -24),
          }}
        />
      </div>
    </div>
  );
};

/* ---------------- GLYPH ---------------- */

interface GlyphProps {
  char: string;
}

const Glyph: React.FC<GlyphProps> = ({ char }) => {
  const points = FONT[char] || [];
  const isColon = char === ':';

  return (
    <div className={`${styles.glyph} ${isColon ? styles.colon : ''}`}>
      {points.map(([x, y], i) => (
        <Voxel
          key={`${char}-${i}`}
          x={x || 0}
          y={y || 0}
          seed={char.charCodeAt(0) * 1000 + i}
        />
      ))}
    </div>
  );
};

/* ---------------- CLOCK ---------------- */

const Clock3D: React.FC = () => {
  const time = useClockTime();

  const chars = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return [...h, ':', ...m, ':', ...s];
  }, [time]);

  return (
    <div
      className={styles.clock3d}
      role="img"
      aria-label={time.toLocaleTimeString()}
      style={{ backgroundImage: `url(${boxImage})` }}
    >
      <div className={styles.clockOrbit}>
        {chars.map((c, i) => (
          <Glyph key={`${c}-${i}`} char={c} />
        ))}
      </div>
    </div>
  );
};

export default Clock3D;
