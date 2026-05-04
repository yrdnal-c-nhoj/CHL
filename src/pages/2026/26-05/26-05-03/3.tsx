import React, { useMemo, useEffect } from 'react';
import { useClockTime } from '@/utils/hooks';

// Import monospace font for a high-tech digital aesthetic
import '@fontsource/share-tech-mono/400.css';

// --- GLOBAL STYLES ---
const addGlobalStyles = () => {
  const styleId = 'clock3d-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotateY(var(--base-rot)); }
        50% { transform: translateY(-25px) rotateY(var(--base-rot)); }
      }

      /* COUNTERCLOCKWISE = negative rotation */
      @keyframes orbit {
        0%   { transform: rotateX(25deg) rotateY(0deg) scale(1.4); }
        100% { transform: rotateX(25deg) rotateY(-360deg) scale(1.4); }
      }

      .cube {
        position: absolute;
        width: 26px;
        height: 26px;
        transform-style: preserve-3d;
      }

      .face {
        position: absolute;
        width: 26px;
        height: 26px;
      }
    `;
    document.head.appendChild(style);
  }
};

// --- DIGIT MAPS ---
const DIGIT_MAPS: Record<string, [number, number][]> = {
  '0': [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  '1': [[2,0],[2,1],[2,2],[2,3],[2,4]],
  '2': [[0,0],[1,0],[2,0],[2,1],[0,2],[1,2],[2,2],[0,3],[0,4],[1,4],[2,4]],
  '3': [[0,0],[1,0],[2,0],[2,1],[0,2],[1,2],[2,2],[2,3],[0,4],[1,4],[2,4]],
  '4': [[0,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[2,3],[2,4]],
  '5': [[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2],[2,3],[0,4],[1,4],[2,4]],
  '6': [[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  '7': [[0,0],[1,0],[2,0],[2,1],[2,2],[2,3],[2,4]],
  '8': [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  '9': [[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[2,3],[0,4],[1,4],[2,4]],
  ':': [[1,1],[1,3]]
};

// --- FUN COLOR PALETTE ---
const COLORS = [
  ['#ff6b6b','#c0392b','#ff8a8a','#e74c3c','#ff4d4d','#a93226'], // red
  ['#feca57','#b9770e','#ffd978','#f39c12','#ffbe33','#9c640c'], // yellow
  ['#48dbfb','#1f618d','#6fe7ff','#3498db','#2ed573','#1b4f72'], // blue/teal
  ['#1dd1a1','#117864','#55efc4','#10ac84','#00d2d3','#0e6655'], // green
  ['#a29bfe','#5b2c6f','#c8c6ff','#6c5ce7','#8e44ad','#4a235a'], // purple
];

// --- VOXEL ---
const Voxel: React.FC<{ x: number; y: number; colorSet: string[] }> = ({ x, y, colorSet }) => {
  const size = 26;
  const depth = 13;

  return (
    <div
      className="cube"
      style={{
        transform: `translate3d(${x * (size + 4)}px, ${y * (size + 4)}px, 0)`
      }}
    >
      <div className="face" style={{ transform: `translateZ(${depth}px)`, background: colorSet[0] }} />
      <div className="face" style={{ transform: `translateZ(-${depth}px) rotateY(180deg)`, background: colorSet[1] }} />
      <div className="face" style={{ transform: `rotateY(90deg) translateZ(${depth}px)`, background: colorSet[2] }} />
      <div className="face" style={{ transform: `rotateY(-90deg) translateZ(${depth}px)`, background: colorSet[3] }} />
      <div className="face" style={{ transform: `rotateX(90deg) translateZ(${depth}px)`, background: colorSet[4] }} />
      <div className="face" style={{ transform: `rotateX(-90deg) translateZ(${depth}px)`, background: colorSet[5] }} />
    </div>
  );
};

// --- DIGIT ---
const Number3D: React.FC<{ digit: string; xOffset: number; rotation: number; colorSet: string[] }> = ({ digit, xOffset, rotation, colorSet }) => {
  const blocks = DIGIT_MAPS[digit] || [];

  return (
    <div style={{
      position: 'absolute',
      transformStyle: 'preserve-3d',
      left: `${xOffset}px`,
      top: '-60px'
    }}>
      <div
        style={{
          transformStyle: 'preserve-3d',
          ['--base-rot' as any]: `${rotation}deg`,
          animation: 'float 6s ease-in-out infinite'
        }}
      >
        {blocks.map(([bx, by], i) => (
          <Voxel key={i} x={bx} y={by} colorSet={colorSet} />
        ))}
      </div>
    </div>
  );
};

// --- CLOCK ---
const Clock3D: React.FC = () => {
  const time = useClockTime();

  const digits = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    return [h[0], h[1], ':', m[0], m[1]];
  }, [time]);

  const digitalReadout = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, [time]);

  useEffect(() => {
    addGlobalStyles();
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #CBB3B3, #B98A80, #F2C195)',
      perspective: '3200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: '"Share Tech Mono", monospace'
    }}>
      {/* CAMERA ORBIT */}
      <div style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        animation: 'orbit 30s linear infinite'
      }}>
        {digits.map((d, i) => (
          <Number3D
            key={i}
            digit={d}
            xOffset={(i - 2) * 140}
            rotation={(i - 2) * 10}
            colorSet={COLORS[i % COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
};

export default Clock3D;