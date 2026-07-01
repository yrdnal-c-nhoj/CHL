import React, { useEffect, useState } from 'react';


// Authentic Prussian Blue & Sun-Exposed Paper Palette
const INK = '#F5F9F8';                 // Creamy, unexposed paper silhouette
const INK_SOFT = 'rgba(245, 249, 252, 0.4)'; // Faint ghosting/shadows
const VEIN = 'rgba(14, 34, 61, 0.35)';       // Darker, unexposed leaf skeleton lines
const PAPER_LIGHT = '#22446C';         // Sun-washed center
const PAPER_MID = '#163256';           // Classic Prussian blue
const PAPER_DEEP = '#0A1C33';          // Rich, dense chemical borders
const WALL = '#322914';                // Studio darkroom wall backdrop

const DECKLE =
  'M 24,6 L 96,2 168,8 240,1 312,7 384,2 452,8 470,18 476,64 470,128 476,196 468,264 476,332 469,400 476,470 470,538 458,586 392,596 320,590 248,597 176,591 104,596 40,590 8,560 2,492 8,424 1,356 7,288 0,220 6,152 1,88 6,32 Z';

const CyanotypeClock: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [, setFontReady] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&family=EB+Garamond:ital,wght@1,400;1,500&display=swap';
    link.onload = () => setFontReady(true);
    document.head.appendChild(link);
    return () => {
      clearInterval(id);
      document.head.removeChild(link);
    };
  }, []);

  const cx = 250;
  const cy = 258;

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const timeStr = `${pad(now.getHours())}:${pad(minutes)}:${pad(seconds)}`;
  
  const dayOfYear = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      86400000
  );

  // Ring of grass-blade ticks, a small seed-head at each hour
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isHour = i % 5 === 0;
    const angle = i * 6;
    const rad = (angle * Math.PI) / 180;
    const outer = 172;
    const inner = isHour ? 148 : 160;
    const x1 = cx + outer * Math.sin(rad);
    const y1 = cy - outer * Math.cos(rad);
    const x2 = cx + inner * Math.sin(rad);
    const y2 = cy - inner * Math.cos(rad);
    return (
      <g key={i}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isHour ? INK : INK_SOFT}
          strokeWidth={isHour ? 1.8 : 0.6}
          strokeLinecap="round"
        />
        {isHour && <circle cx={x1} cy={y1} r={2.2} fill={INK} opacity={0.85} />}
      </g>
    );
  });

  // Fern frond built from paired leaflets that taper toward the tip
  const fernLeaflets = Array.from({ length: 7 }, (_, i) => {
    const d = 22 + i * 15;
    const size = 12 - i * 1.4;
    const tilt = 34 - i * 2;
    return (
      <g key={i}>
        <ellipse
          cx={cx - 3}
          cy={cy - d}
          rx={size}
          ry={size * 0.4}
          fill={INK}
          transform={`rotate(${-tilt} ${cx - 3} ${cy - d})`}
        />
        <ellipse
          cx={cx + 3}
          cy={cy - d}
          rx={size}
          ry={size * 0.4}
          fill={INK}
          transform={`rotate(${tilt} ${cx + 3} ${cy - d})`}
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
        fontFamily: '"EB Garamond", Georgia, serif',
      }}
    >
      <svg width={420} height={520} viewBox="0 0 500 620" style={{ maxHeight: '92dvh', maxWidth: '92vw' }}>
        <defs>
          <clipPath id="deckleClip">
            <path d={DECKLE} />
          </clipPath>
          
          {/* Paper texture grain */}
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={12} result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.05
                      0 0 0 0 0.15
                      0 0 0 0 0.28
                      0 0 0 0.4 0"
            />
          </filter>

          {/* Soft drop shadow for the heavy photo paper */}
          <filter id="dropshadow" x="-10%" y="-10%" width={130} height={130}>
            <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="#0d0e10" floodOpacity="0.6" />
          </filter>

          {/* Sun exposure wash gradient */}
          <radialGradient id="wash" cx="48%" cy="45%" r="70%">
            <stop offset="0%" stopColor={PAPER_LIGHT} />
            <stop offset="65%" stopColor={PAPER_MID} />
            <stop offset="100%" stopColor={PAPER_DEEP} />
          </radialGradient>
        </defs>

        {/* The paper sheet shadow */}
        <path d={DECKLE} fill="none" filter="url(#dropshadow)" />

        {/* The actual chemical sheet */}
        <g clipPath="url(#deckleClip)">
          <rect x={0} y={0} width={500} height={620} fill="url(#wash)" />
          <rect x={0} y={0} width={500} height={620} filter="url(#grain)" opacity={0.4} />
          
          {/* Uneven hand-brushed chemistry streaks */}
          <ellipse cx={50} cy={50} rx={160} ry={130} fill={PAPER_DEEP} opacity={0.35} />
          <ellipse cx={450} cy={570} rx={180} ry={140} fill={PAPER_DEEP} opacity={0.4} />
          <ellipse cx={440} cy={70} rx={110} ry={90} fill={PAPER_LIGHT} opacity={0.15} />

          {/* Clock face ring */}
          <circle cx={cx} cy={cy} r={182} fill="none" stroke={INK} strokeWidth={1} opacity={0.4} />
          {ticks}

          {['XII', 'III', 'VI', 'IX'].map((label, i) => {
            const angle = i * 90;
            const rad = (angle * Math.PI) / 180;
            const r = 122;
            const x = cx + r * Math.sin(rad);
            const y = cy - r * Math.cos(rad);
            return (
              <text
                key={label}
                x={x}
                y={y}
                fill={INK}
                fontSize={19}
                fontFamily='"EB Garamond", Georgia, serif'
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={0.8}
              >
                {label}
              </text>
            );
          })}

          {/* Hour hand: A pressed botanical leaf */}
          <g transform={`rotate(${hourDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy} Q ${cx - 11} ${cy - 45} ${cx} ${cy - 88} Q ${cx + 11} ${cy - 45} ${cx} ${cy} Z`}
              fill={INK}
              opacity={0.9}
            />
            <line x1={cx} y1={cy - 2} x2={cx} y2={cy - 86} stroke={VEIN} strokeWidth={1.2} />
          </g>

          {/* Minute hand: Fern frond */}
          <g transform={`rotate(${minuteDeg} ${cx} ${cy})`}>
            <line x1={cx} y1={cy} x2={cx} y2={cy - 124} stroke={INK} strokeWidth={1.5} opacity={0.9} />
            {fernLeaflets}
          </g>

          {/* Second hand: A strand of marine algae */}
          <g transform={`rotate(${secondDeg} ${cx} ${cy})`} style={{ transition: 'transform 0.2s cubic-bezier(0.4, 2, 0.4, 1)' }}>
            <path
              d={`M ${cx} ${cy + 20} Q ${cx + 5} ${cy - 40} ${cx - 4} ${cy - 100} Q ${cx - 8} ${cy - 130} ${cx} ${cy - 150}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.2}
              opacity={0.8}
            />
            {[0.15, 0.35, 0.55, 0.72, 0.88].map((f, i) => {
              const yy = cy + 20 - f * 170;
              const xx = cx - f * 5;
              return <circle key={i} cx={xx} cy={yy} r={3 - f * 1.5} fill={INK} opacity={0.7} />;
            })}
          </g>

          {/* Seed-pod center pivot */}
          <circle cx={cx} cy={cy} r={8} fill={PAPER_MID} stroke={INK} strokeWidth={1.5} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={cx + 2.5 * Math.sin(a)}
                y1={cy - 2.5 * Math.cos(a)}
                x2={cx + 7 * Math.sin(a)}
                y2={cy - 7 * Math.cos(a)}
                stroke={INK}
                strokeWidth={0.8}
                opacity={0.8}
              />
            );
          })}

        </g>
      </svg>
    </div>
  );
};

export default CyanotypeClock;