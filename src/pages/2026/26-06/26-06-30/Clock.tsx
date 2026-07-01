import React, { useEffect, useState } from 'react';

// Cyanotype: the 1842 sun-printing process that gave "cyan" its name.
// Objects laid on chemically treated paper block the sun, leaving a pale
// ghost silhouette on a field of Prussian blue once the paper is washed.
// Anna Atkins used it to print the first photographically illustrated
// book — algae and ferns, pressed flat, exposed, and rinsed. This clock
// borrows that vocabulary: hands drawn as pressed botanical specimens,
// numerals inked in a naturalist's hand, the paper itself uneven and
// sun-worn at the edges.

const INK = '#EAF6F5';
const INK_SOFT = 'rgba(234, 246, 245, 0.55)';
const VEIN = 'rgba(12, 42, 74, 0.45)';
const PAPER_MID = '#1E5187';
const PAPER_LIGHT = '#3574AC';
const PAPER_DEEP = '#0C2C4C';
const WALL = '#0A0A0A';

const DECKLE =
  'M 24,6 L 96,2 168,8 240,1 312,7 384,2 452,8 470,18 476,64 470,128 476,196 468,264 476,332 469,400 476,470 470,538 458,586 392,596 320,590 248,597 176,591 104,596 40,590 8,560 2,492 8,424 1,356 7,288 0,220 6,152 1,88 6,32 Z';

const CyanotypeClock: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=EB+Garamond:ital@1&display=swap';
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
          strokeWidth={isHour ? 2 : 0.75}
          strokeLinecap="round"
        />
        {isHour && <circle cx={x1} cy={y1} r={2.4} fill={INK} opacity={0.9} />}
      </g>
    );
  });

  // Fern frond built from paired leaflets that taper toward the tip
  const fernLeaflets = Array.from({ length: 6 }, (_, i) => {
    const d = 26 + i * 16;
    const size = 13 - i * 1.6;
    const tilt = 32 - i * 2;
    return (
      <g key={i}>
        <ellipse
          cx={cx - 3}
          cy={cy - d}
          rx={size}
          ry={size * 0.42}
          fill={INK}
          opacity={0.88}
          transform={`rotate(${-tilt} ${cx - 3} ${cy - d})`}
        />
        <ellipse
          cx={cx + 3}
          cy={cy - d}
          rx={size}
          ry={size * 0.42}
          fill={INK}
          opacity={0.88}
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
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.04
                      0 0 0 0 0.13
                      0 0 0 0 0.24
                      0 0 0 0.5 0"
            />
          </filter>
          <radialGradient id="wash" cx="42%" cy="38%" r="75%">
            <stop offset="0%" stopColor={PAPER_LIGHT} />
            <stop offset="60%" stopColor={PAPER_MID} />
            <stop offset="100%" stopColor={PAPER_DEEP} />
          </radialGradient>
        </defs>

        {/* the sheet, cast in shadow against the wall */}
        <g filter="url(#dropshadow)">
          <path d={DECKLE} fill={PAPER_DEEP} opacity={0.35} transform="translate(6,10)" />
        </g>

        <g clipPath="url(#deckleClip)">
          <rect x={0} y={0} width={500} height={620} fill="url(#wash)" />
          <rect x={0} y={0} width={500} height={620} filter="url(#grain)" opacity={0.5} />
          {/* uneven brush-coated edges, a hallmark of hand-sensitized paper */}
          <ellipse cx={40} cy={40} rx={140} ry={110} fill={PAPER_DEEP} opacity={0.28} />
          <ellipse cx={470} cy={590} rx={160} ry={120} fill={PAPER_DEEP} opacity={0.3} />
          <ellipse cx={460} cy={60} rx={90} ry={70} fill={PAPER_LIGHT} opacity={0.18} />

          {/* clock face */}
          <circle cx={cx} cy={cy} r={182} fill="none" stroke={INK} strokeWidth={1} opacity={0.5} />
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
                fontSize={17}
                fontStyle="italic"
                fontFamily='"EB Garamond", Georgia, serif'
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={0.85}
              >
                {label}
              </text>
            );
          })}

          {/* hour hand: a single pressed leaf */}
          <g transform={`rotate(${hourDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy} Q ${cx - 10} ${cy - 45} ${cx} ${cy - 92} Q ${cx + 10} ${cy - 45} ${cx} ${cy} Z`}
              fill={INK}
              opacity={0.9}
            />
            <line x1={cx} y1={cy - 4} x2={cx} y2={cy - 90} stroke={VEIN} strokeWidth={1} />
          </g>

          {/* minute hand: fern frond */}
          <g transform={`rotate(${minuteDeg} ${cx} ${cy})`}>
            <line x1={cx} y1={cy} x2={cx} y2={cy - 128} stroke={INK} strokeWidth={1.4} opacity={0.9} />
            {fernLeaflets}
          </g>

          {/* second hand: a strand of algae, Atkins' first specimens */}
          <g transform={`rotate(${secondDeg} ${cx} ${cy})`} style={{ transition: 'transform 0.25s cubic-bezier(0.4,2,0.4,1)' }}>
            <path
              d={`M ${cx} ${cy + 22} Q ${cx + 6} ${cy - 40} ${cx - 4} ${cy - 100} Q ${cx - 9} ${cy - 130} ${cx} ${cy - 152}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.3}
              opacity={0.85}
            />
            {[0.15, 0.32, 0.48, 0.64, 0.78, 0.9].map((f, i) => {
              const yy = cy + 22 - f * 174;
              const xx = cx - f * 6;
              return <circle key={i} cx={xx} cy={yy} r={3.4 - f * 2} fill={INK} opacity={0.75} />;
            })}
          </g>

          {/* a small pressed seed-pod at the pivot */}
          <circle cx={cx} cy={cy} r={9} fill={PAPER_DEEP} stroke={INK} strokeWidth={1.4} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={cx + 3 * Math.sin(a)}
                y1={cy - 3 * Math.cos(a)}
                x2={cx + 8 * Math.sin(a)}
                y2={cy - 8 * Math.cos(a)}
                stroke={INK}
                strokeWidth={0.8}
                opacity={0.8}
              />
            );
          })}

          {/* handwritten caption, in the naturalist's own hand */}
          <text
            x={44}
            y={540}
            fill={INK}
            fontSize={30}
            fontFamily={fontReady ? 'Caveat, cursive' : 'Georgia, serif'}
            opacity={0.92}
          >
            Sun-print no. {dayOfYear}
          </text>
          <text
            x={44}
            y={572}
            fill={INK_SOFT}
            fontSize={22}
            fontFamily={fontReady ? 'Caveat, cursive' : 'Georgia, serif'}
          >
            recorded {timeStr} — {dateStr}
          </text>
          <text
            x={456}
            y={596}
            fill={INK_SOFT}
            fontSize={13}
            fontFamily='"EB Garamond", Georgia, serif'
            fontStyle="italic"
            textAnchor="end"
            opacity={0.55}
          >
            est. 1842
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CyanotypeClock;
