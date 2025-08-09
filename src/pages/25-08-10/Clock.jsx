import React, { useEffect, useState } from 'react';

// Full-viewport rectangular analog clock component for Vite + React
// - fills entire viewport (100vw x 100vh)
// - rectangular face (SVG rect) that occupies the viewport
// - analog hands (hour, minute, optional second)
// - numbers: 12 top-center, 3 center-right, 6 bottom-center, 9 center-left
// - responsive on resize

export default function FullViewportRectangularAnalogClock({ showSeconds = true }) {
  const [now, setNow] = useState(new Date());
  const [size, setSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 800, h: typeof window !== 'undefined' ? window.innerHeight : 600 });

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    // update every 1000ms if seconds shown, otherwise every 60s is enough
    const interval = setInterval(() => setNow(new Date()), showSeconds ? 1000 : 60000);
    return () => clearInterval(interval);
  }, [showSeconds]);

  const { w, h } = size;
  const cx = w / 2;
  const cy = h / 2;
  // radius is scaled to fit into the rectangle while leaving a margin for edge numbers
  const radius = Math.min(w, h) * 0.38; // circle radius for placements

  // compute hand angles (degrees)
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secAngle = (seconds / 60) * 360;
  const minAngle = (minutes / 60) * 360;
  const hourAngle = (hours / 12) * 360;

  // helper to get end point of a hand given angle and length (polar -> cartesian)
  const pointFromAngle = (angleDeg, length) => {
    const a = (angleDeg - 90) * (Math.PI / 180); // subtract 90 so 0deg is top
    return { x: cx + Math.cos(a) * length, y: cy + Math.sin(a) * length };
  };

  // hour numbers positions (12 points) placed around a circle inside the rectangle
  const hourNumbers = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30; // 0 -> 11
    const pos = pointFromAngle(angle, radius);
    const label = i === 0 ? 12 : i;
    return { x: pos.x, y: pos.y, label };
  });

  // also create the edge-centered numerals explicitly (12,3,6,9) overriding exact positions to be perfectly centered on edges
  const edgeNumerals = [
    { label: '12', x: cx, y: 24 },
    { label: '3', x: w - 24, y: cy },
    { label: '6', x: cx, y: h - 24 },
    { label: '9', x: 24, y: cy },
  ];

  // determine tick marks (optional) -- draw 60 small ticks around the central circle
  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const angle = i * 6;
    const outer = pointFromAngle(angle, radius * 1.04);
    const inner = pointFromAngle(angle, radius * 0.96);
    return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major: i % 5 === 0 };
  });

  // hand end points
  const hourEnd = pointFromAngle(hourAngle, radius * 0.55);
  const minuteEnd = pointFromAngle(minAngle, radius * 0.76);
  const secondEnd = pointFromAngle(secAngle, radius * 0.9);

  // inline styles
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    display: 'block',
    background: 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)',
    WebkitFontSmoothing: 'antialiased',
  };

  const svgStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <svg style={svgStyle} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* rectangular face background */}
        <rect x="0" y="0" width={w} height={h} rx={Math.min(w, h) * 0.02} fill="#0b1220" stroke="#233044" strokeWidth={Math.max(2, Math.min(w, h) * 0.002)} />

        {/* subtle inner rounded panel for contrast */}
        <rect x={w * 0.03} y={h * 0.03} width={w * 0.94} height={h * 0.94} rx={Math.min(w, h) * 0.02} fill="url(#panelGrad)" stroke="rgba(255,255,255,0.02)" />

        <defs>
          <radialGradient id="panelGrad" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="1" />
            <stop offset="100%" stopColor="#071024" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* center pivot */}
        <circle cx={cx} cy={cy} r={Math.max(4, Math.min(w, h) * 0.008)} fill="#fff" />

        {/* ticks */}
        <g stroke="#9fb0c8" strokeOpacity={0.7} strokeWidth={1}>
          {ticks.map((t, idx) => (
            <line key={idx} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={t.major ? 2.2 : 1} strokeOpacity={t.major ? 0.9 : 0.45} />
          ))}
        </g>

        {/* hour numbers placed around the circle */}
        <g fontFamily="Arial, Helvetica, sans-serif" fontWeight="600" fontSize={Math.max(14, Math.min(w, h) * 0.04)} fill="#e6f0fb" textAnchor="middle" dominantBaseline="central">
          {hourNumbers.map((n, i) => (
            <text key={i} x={n.x} y={n.y}>
              {n.label}
            </text>
          ))}
        </g>

        {/* explicit edge numerals (12,3,6,9) to ensure centered on edges */}
        <g fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize={Math.max(16, Math.min(w, h) * 0.045)} fill="#ffffff" textAnchor="middle" dominantBaseline="central">
          {edgeNumerals.map((n, i) => (
            <text key={`edge-${i}`} x={n.x} y={n.y}>
              {n.label}
            </text>
          ))}
        </g>

        {/* hour hand */}
        <line x1={cx} y1={cy} x2={hourEnd.x} y2={hourEnd.y} stroke="#f8fafc" strokeWidth={Math.max(6, Math.min(w, h) * 0.02)} strokeLinecap="round" />

        {/* minute hand */}
        <line x1={cx} y1={cy} x2={minuteEnd.x} y2={minuteEnd.y} stroke="#cbd5e1" strokeWidth={Math.max(4, Math.min(w, h) * 0.012)} strokeLinecap="round" />

        {/* second hand (optional) */}
        {showSeconds && (
          <line x1={cx} y1={cy} x2={secondEnd.x} y2={secondEnd.y} stroke="#ff6b6b" strokeWidth={Math.max(2, Math.min(w, h) * 0.006)} strokeLinecap="round" strokeOpacity={0.9} />
        )}

        {/* small shadow / center circle overlay */}
        <circle cx={cx} cy={cy} r={Math.max(3, Math.min(w, h) * 0.005)} fill="#0b1220" stroke="#ffffff" strokeWidth={Math.max(1, Math.min(w, h) * 0.002)} />
      </svg>
    </div>
  );
}
