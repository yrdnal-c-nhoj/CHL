import React from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';

// Returns the max radius a hand at angle `theta` (radians, 0=up, CW) can extend
// within the triangle defined by vertices relative to center cx, cy.
function maxRadiusInTriangle(
  theta: number,
  cx: number,
  cy: number,
  vertices: [number, number][]
): number {
  const dx = Math.sin(theta);
  const dy = -Math.cos(theta);

  let minT = Infinity;

  for (let i = 0; i < vertices.length; i++) {
    const [x1, y1] = vertices[i]!;
    const [x2, y2] = vertices[(i + 1) % vertices.length]!;

    const ex = x2 - x1;
    const ey = y2 - y1;

    const denom = dx * ey - dy * ex;
    if (Math.abs(denom) < 1e-10) continue;

    const tx = x1 - cx;
    const ty = y1 - cy;
    const t = (tx * ey - ty * ex) / denom;
    const s = (tx * dy - ty * dx) / denom;

    if (t > 0.001 && s >= -0.001 && s <= 1.001) {
      minT = Math.min(minT, t);
    }
  }

  return minT === Infinity ? 0 : minT;
}

export default function TriangleClock() {
  const time = useMillisecondClock();

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const secFrac = (seconds + ms / 1000) / 60;
  const minFrac = (minutes + (seconds + ms / 1000) / 60) / 60;
  const hourFrac = (hours + minFrac) / 12;

  const hourAngle = hourFrac * 2 * Math.PI;
  const minAngle = minFrac * 2 * Math.PI;
  const secAngle = secFrac * 2 * Math.PI;

  const VW = 1000;
  const VH = 700;

  const tl: [number, number] = [0, 0];
  const tr: [number, number] = [VW, 0];
  const bm: [number, number] = [VW / 2, VH];

  const cx = VW / 2;
  const cy = VH * 0.4;

  const vertices: [number, number][] = [tl, tr, bm];

  const hourR = maxRadiusInTriangle(hourAngle, cx, cy, vertices) * 0.30;
  const minR = maxRadiusInTriangle(minAngle, cx, cy, vertices) * 0.88;
  const secR = maxRadiusInTriangle(secAngle, cx, cy, vertices) * 0.95;

  const hx = cx + Math.sin(hourAngle) * hourR;
  const hy = cy - Math.cos(hourAngle) * hourR;
  const mx = cx + Math.sin(minAngle) * minR;
  const my = cy - Math.cos(minAngle) * minR;

  const secArcAngle = secFrac * 2 * Math.PI;
  const prevSecAngle = Math.floor(seconds) / 60 * 2 * Math.PI;

  // Numbers positioned inside the triangle
  const numberPct: Record<number, { left: string; top: string; right?: string }> = {
    10: { left: '18%', top: '15%' },
    2: { left: 'auto', top: '15%', right: '18%' },
    6: { left: '50%', top: '80%' },
  };

  // Generate 3 equidistant tick marks on each edge, pointing toward center
  type Tick = { x1: number; y1: number; x2: number; y2: number };
  const cornerTicks: Tick[] = [];

  const makeTicks = (start: [number, number], end: [number, number], cx: number, cy: number, count: number): Tick[] => {
    const ticks: Tick[] = [];
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1);
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t;
      // Tick points from a point closer to center out toward the edge
      const tickLen = 40;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Inner point (closer to center)
      const ix = cx + (dx / dist) * (dist - tickLen);
      const iy = cy + (dy / dist) * (dist - tickLen);
      ticks.push({ x1: ix, y1: iy, x2: x, y2: y });
    }
    return ticks;
  };

  // 3 ticks between 10 (tl) and 2 (tr) on top edge
  cornerTicks.push(...makeTicks(tl, tr, cx, cy, 3));
  // 3 ticks between 2 (tr) and 6 (bm) on right edge
  cornerTicks.push(...makeTicks(tr, bm, cx, cy, 3));
  // 3 ticks between 6 (bm) and 10 (tl) on left edge
  cornerTicks.push(...makeTicks(bm, tl, cx, cy, 3));

  const buildArc = (startAngle: number, endAngle: number, r: number) => {
    const x1 = cx + Math.sin(startAngle) * r;
    const y1 = cy - Math.cos(startAngle) * r;
    const x2 = cx + Math.sin(endAngle) * r;
    const y2 = cy - Math.cos(endAngle) * r;
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  const bg = '#D6C6C6';
  const triStroke = '#F409E4';
  const handHour = '#DAEEEE';
  const handMin = '#BDD5E3';
  const secColor = '#6B3FE3';
  const centerDot = '#F80505';
  const tickMajor = '#184F11';
  const numberFill = '#184F11';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #1a3a5c 0%, #007BA7 50%, #1a3a5c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        outline: '10px solid #2956EB',
        outlineOffset: '-10px',
      }}
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{
          width: 'calc(100% - 40px)',
          height: 'calc(100% - 40px)',
          display: 'block',
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="triangle-clip">
            <polygon points={`${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${bm[0]},${bm[1]}`} />
          </clipPath>

          <radialGradient id="bg-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#B88CBD" />
            <stop offset="30%" stopColor="#B2779E" />
            <stop offset="60%" stopColor="#B387B6" />
            <stop offset="100%" stopColor="#A283AE" />
          </radialGradient>

          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-sec" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-border" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          points={`${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${bm[0]},${bm[1]}`}
          fill="url(#bg-grad)"
          stroke="none"
        />

        <g clipPath="url(#triangle-clip)">
          <radialGradient id="inner-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4a0e4e" stopOpacity="0" />
          </radialGradient>
          <ellipse cx={cx} cy={cy} rx={320} ry={280} fill="url(#inner-glow)" opacity={0.6} />

          <path
            d={buildArc(prevSecAngle, secArcAngle, secR)}
            fill={secColor}
            opacity={0.15}
            filter="url(#glow-sec)"
          />
          <line
            x1={cx}
            y1={cy}
            x2={cx + Math.sin(secAngle) * secR}
            y2={cy - Math.cos(secAngle) * secR}
            stroke={secColor}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={1}
            filter="url(#glow-sec)"
          />

          <line
            x1={cx - Math.sin(minAngle) * 30}
            y1={cy + Math.cos(minAngle) * 30}
            x2={mx}
            y2={my}
            stroke={handMin}
            strokeWidth={12}
            strokeLinecap="round"
            filter="url(#glow-gold)"
          />

          <line
            x1={cx - Math.sin(hourAngle) * 20}
            y1={cy + Math.cos(hourAngle) * 20}
            x2={hx}
            y2={hy}
            stroke={handHour}
            strokeWidth={16}
            strokeLinecap="round"
            filter="url(#glow-gold)"
          />

          {cornerTicks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tickMajor}
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}

          <circle cx={cx} cy={cy} r={10} fill={centerDot} filter="url(#glow-gold)" />
          <circle cx={cx} cy={cy} r={4} fill={bg} />
        </g>

        <polygon
          points={`${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${bm[0]},${bm[1]}`}
          fill="none"
          stroke={triStroke}
          strokeWidth={13.5}
          filter="url(#glow-border)"
        />
        <polygon
          points={`${tl[0] + 8},${tl[1] + 5} ${tr[0] - 8},${tr[1] + 5} ${bm[0]},${bm[1] - 10}`}
          fill="none"
          stroke={triStroke}
          strokeWidth={1}
          opacity={0.3}
        />
      </svg>

      {/* Numbers rendered outside SVG to avoid stretching */}
      {([10, 2, 6] as const).map((n) => {
        const pct = numberPct[n]!;
        return (
          <div
            key={n}
            style={{
              position: 'absolute',
              left: pct.left,
              top: pct.top,
              right: pct.right,
              transform: 'translate(-50%, -50%)',
              color: numberFill,
              fontSize: 38,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 300,
              letterSpacing: '2px',
              userSelect: 'none',
              textShadow: '0 0 10px #EFB8D4, 0 0 20px #F9C3DE',
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
}
