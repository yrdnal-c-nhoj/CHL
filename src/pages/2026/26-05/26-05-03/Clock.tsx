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

      @keyframes float3d {
        0% { transform: translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        25% { transform: translate3d(var(--x-drift), calc(var(--y-drift) * -1), var(--z-drift)) rotateX(var(--x-rot)) rotateY(var(--y-rot)) rotateZ(var(--z-rot)); }
        50% { transform: translate3d(calc(var(--x-drift) * -1), var(--y-drift), calc(var(--z-drift) * -1)) rotateX(calc(var(--x-rot) * -1)) rotateY(calc(var(--y-rot) * -1)) rotateZ(calc(var(--z-rot) * -1)); }
        75% { transform: translate3d(var(--x-drift), var(--y-drift), 0px) rotateX(var(--x-rot)) rotateY(0deg) rotateZ(var(--z-rot)); }
        100% { transform: translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
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

      .voxel-float {
        transform-style: preserve-3d;
        width: 100%;
        height: 100%;
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
const Voxel: React.FC<{ 
  x: number; 
  y: number; 
  colorSet: string[]; 
  animDuration?: number;
  animDelay?: number;
  xDrift?: number;
  yDrift?: number;
  zDrift?: number;
  xRot?: number;
  yRot?: number;
  zRot?: number;
}> = ({ 
  x, 
  y, 
  colorSet, 
  animDuration = 6,
  animDelay = 0,
  xDrift = 5,
  yDrift = 8,
  zDrift = 3,
  xRot = 15,
  yRot = 20,
  zRot = 10
}) => {
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

// Seeded random function for consistent results
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// --- DIGIT ---
const Number3D: React.FC<{ digit: string; xOffset: number; rotation: number; colorSet: string[] }> = ({ digit, xOffset, rotation: _rotation, colorSet }) => {
  const blocks = DIGIT_MAPS[digit] || [];

  // Generate unique random parameters for each voxel using seeded random
  const generateRandomParams = (seed: number) => {
    const rand1 = seededRandom(seed);
    const rand2 = seededRandom(seed + 1);
    const rand3 = seededRandom(seed + 2);
    const rand4 = seededRandom(seed + 3);
    const rand5 = seededRandom(seed + 4);
    const rand6 = seededRandom(seed + 5);
    const rand7 = seededRandom(seed + 6);
    
    return {
      animDuration: 4 + rand1 * 6, // 4-10 seconds
      animDelay: rand2 * 3, // 0-3 seconds delay
      xDrift: 3 + rand3 * 8, // 3-11px
      yDrift: 5 + rand4 * 10, // 5-15px
      zDrift: 2 + rand5 * 6, // 2-8px
      xRot: 10 + rand6 * 20, // 10-30deg
      yRot: 15 + rand7 * 25, // 15-40deg
      zRot: 5 + seededRandom(seed + 7) * 15 // 5-20deg
    };
  };

  return (
    <div style={{
      position: 'absolute',
      transformStyle: 'preserve-3d',
      left: `${xOffset}px`,
      top: '-60px'
    }}>
      {blocks.map(([bx, by], i) => {
        const params = generateRandomParams(digit.charCodeAt(0) + i * 7 + bx * 3 + by * 11);
        return (
          <Voxel
            key={i}
            x={bx}
            y={by}
            colorSet={colorSet}
            animDuration={params.animDuration}
            animDelay={params.animDelay}
            xDrift={params.xDrift}
            yDrift={params.yDrift}
            zDrift={params.zDrift}
            xRot={params.xRot}
            yRot={params.yRot}
            zRot={params.zRot}
          />
        );
      })}
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
      background: 'linear-gradient(135deg, #3E3737, #444463, #46382B)',
      perspective: '2800px',
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
        animation: 'orbit 20s linear infinite'
      }}>
        {digits.map((d, i) => {
          // Custom spacing: tighter around colon (index 2)
          const offsets = [-180, -60, 0, 60, 180];
          return (
            <Number3D
              key={i}
              digit={d}
              xOffset={offsets[i] || 0}
              rotation={(i - 2) * 10}
              colorSet={COLORS[i % COLORS.length]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Clock3D;