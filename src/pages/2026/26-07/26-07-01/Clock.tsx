import React, { useEffect, useState } from 'react';

// Authentic Prussian Blue & Sun-Exposed Paper Palette
const INK = '#F5F9F8';                 // Creamy, unexposed paper silhouette
const VEIN = 'rgba(14, 34, 61, 0.45)';       // Darker, unexposed leaf skeleton lines
const PAPER_LIGHT = '#254E7D';         // Sun-washed hot center
const PAPER_MID = '#16365C';           // Classic Prussian blue
const PAPER_DEEP = '#081629';          // Rich, dense chemical borders (thick hand-brushed look)
const WALL = '#1E1A12';                // Moody darkroom table backdrop

// A highly irregular, organic hand-torn paper shape (500x620)
const DECKLE =
  'M 35,22 C 110,12 210,28 310,15 C 390,5 440,18 465,35 C 490,65 475,150 482,240 C 490,340 472,420 478,510 C 482,565 455,595 390,602 C 310,610 205,592 115,605 C 55,612 22,585 15,530 C 5,450 18,350 10,250 C 4,160 12,85 35,22 Z';

const CyanotypeClock: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Centered inside the 500x620 canvas
  const cx = 250;
  const cy = 310;

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  // Fern frond built from paired leaflets that taper toward the tip (Scaled up by ~1.4x)
  const fernLeaflets = Array.from({ length: 8 }, (_, i) => {
    const d = 30 + i * 20;
    const size = 18 - i * 1.8;
    const tilt = 36 - i * 2;
    return (
      <g key={i}>
        <ellipse
          cx={cx - 4}
          cy={cy - d}
          rx={size}
          ry={size * 0.4}
          fill={INK}
          transform={`rotate(${-tilt} ${cx - 4} ${cy - d})`}
        />
        <ellipse
          cx={cx + 4}
          cy={cy - d}
          rx={size}
          ry={size * 0.4}
          fill={INK}
          transform={`rotate(${tilt} ${cx + 4} ${cy - d})`}
        />
      </g>
    );
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: WALL,
        overflow: 'hidden',
      }}
    >
      <svg viewBox="0 0 500 620" style={{ maxHeight: '95dvh', maxWidth: '95vw', width: 'auto', height: 'auto' }}>
        <defs>
          <clipPath id="deckleClip">
            <path d={DECKLE} />
          </clipPath>
          
          {/* High-frequency analog paper grain texture */}
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={4} seed={42} result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.04
                      0 0 0 0 0.12
                      0 0 0 0 0.24
                      0 0 0 0.45 0"
            />
          </filter>

          {/* Heavy photo-paper fiber shadow */}
          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="5" dy="12" stdDeviation="10" floodColor="#060503" floodOpacity="0.75" />
          </filter>

          {/* Sun exposure gradient - rich dark borders bleeding into an overexposed center */}
          <radialGradient id="wash" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={PAPER_LIGHT} />
            <stop offset="55%" stopColor={PAPER_MID} />
            <stop offset="88%" stopColor={PAPER_DEEP} />
            <stop offset="100%" stopColor="#040b14" />
          </radialGradient>
        </defs>

        {/* Heavy drop shadow beneath the deckle sheet */}
        <path d={DECKLE} fill="none" filter="url(#dropshadow)" />

        {/* The Cyanotype print area */}
        <g clipPath="url(#deckleClip)">
          {/* Base paper chemical tone */}
          <rect x={0} y={0} width={500} height={620} fill="url(#wash)" />
          
          {/* Watercolor paper fiber overlay */}
          <rect x={0} y={0} width={500} height={620} filter="url(#grain)" opacity={0.6} />
          
          {/* Heavy hand-brushed border emulation */}
          <path d={DECKLE} fill="none" stroke={PAPER_DEEP} strokeWidth={40} opacity={0.85} filter="blur(6px)" />
          <path d={DECKLE} fill="none" stroke="#03080f" strokeWidth={15} opacity={0.5} filter="blur(2px)" />

          {/* ================= CLOCK WORK (CENTERED & SCALED UP) ================= */}

          {/* Hour hand: A large, elegant pressed botanical leaf */}
          <g transform={`rotate(${hourDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy} Q ${cx - 16} ${cy - 60} ${cx} ${cy - 125} Q ${cx + 16} ${cy - 60} ${cx} ${cy} Z`}
              fill={INK}
              opacity={0.95}
              style={{ filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.15))' }}
            />
            <line x1={cx} y1={cy} x2={cx} y2={cy - 122} stroke={VEIN} strokeWidth={1.5} strokeLinecap="round" />
          </g>

          {/* Minute hand: Large Fern frond */}
          <g transform={`rotate(${minuteDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy} Q ${cx - 1} ${cy - 90} ${cx} ${cy - 185}`}
              fill="none"
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.95}
            />
            {fernLeaflets}
          </g>

          {/* Second hand: Fine strand of marine algae */}
          <g transform={`rotate(${secondDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy + 30} Q ${cx + 8} ${cy - 60} ${cx - 6} ${cy - 160} Q ${cx - 12} ${cy - 200} ${cx} ${cy - 230}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.85}
            />
            {[0.12, 0.32, 0.52, 0.70, 0.86].map((f, i) => {
              const yy = cy + 30 - f * 260;
              const xx = cx - f * 6;
              return <circle key={i} cx={xx} cy={yy} r={4.5 - f * 2} fill={INK} opacity={0.75} />;
            })}
          </g>

          {/* Seed-pod center pivot */}
          <circle cx={cx} cy={cy} r={11} fill={PAPER_MID} stroke={INK} strokeWidth={2} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * 36 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={cx + 3 * Math.sin(a)}
                y1={cy - 3 * Math.cos(a)}
                x2={cx + 9 * Math.sin(a)}
                y2={cy - 9 * Math.cos(a)}
                stroke={INK}
                strokeWidth={1}
                opacity={0.9}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default CyanotypeClock;