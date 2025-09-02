import React, { useEffect, useState } from 'react';
import bgImage from './lp.webp'; // local background image, same folder

export default function FullViewportRectangularAnalogClock({ showSeconds = true }) {
  const [now, setNow] = useState(new Date());
  const [size, setSize] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 800,
    h: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), showSeconds ? 1000 : 60000);
    return () => clearInterval(interval);
  }, [showSeconds]);

  const { w, h } = size;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.38;

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secAngle = (seconds / 60) * 360;
  const minAngle = (minutes / 60) * 360;
  const hourAngle = (hours / 12) * 360;

  const pointFromAngle = (angleDeg, length) => {
    const a = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + Math.cos(a) * length, y: cy + Math.sin(a) * length };
  };

  const hourNumbers = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30;
    const pos = pointFromAngle(angle, radius);
    const label = i === 0 ? 12 : i;
    return { x: pos.x, y: pos.y, label };
  });

  const edgeNumerals = [
    { label: '12', x: cx, y: 24 },
    { label: '3', x: w - 24, y: cy },
    { label: '6', x: cx, y: h - 24 },
    { label: '9', x: 24, y: cy },
  ];

  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const angle = i * 6;
    const outer = pointFromAngle(angle, radius * 1.04);
    const inner = pointFromAngle(angle, radius * 0.96);
    return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major: i % 5 === 0 };
  });

  const hourEnd = pointFromAngle(hourAngle, radius * 0.55);
  const minuteEnd = pointFromAngle(minAngle, radius * 0.76);
  const secondEnd = pointFromAngle(secAngle, radius * 0.9);

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    display: 'block',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const svgStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <svg
        style={svgStyle}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ticks */}
        <g stroke="#EDE7E7FF" strokeOpacity={0.7}>
          {ticks.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              strokeWidth={t.major ? 2 : 1}
              strokeOpacity={t.major ? 0.9 : 0.5}
            />
          ))}
        </g>

       

        {/* hour hand */}
        <line
          x1={cx}
          y1={cy}
          x2={hourEnd.x}
          y2={hourEnd.y}
          stroke="#F3EBEBFF"
          strokeWidth={Math.max(6, Math.min(w, h) * 0.02)}
          strokeLinecap="round"
        />

        {/* minute hand */}
        <line
          x1={cx}
          y1={cy}
          x2={minuteEnd.x}
          y2={minuteEnd.y}
          stroke="#E1DCDCFF"
          strokeWidth={Math.max(4, Math.min(w, h) * 0.012)}
          strokeLinecap="round"
        />

        {/* second hand */}
        {showSeconds && (
          <line
            x1={cx}
            y1={cy}
            x2={secondEnd.x}
            y2={secondEnd.y}
            stroke="#D6CFCFFF"
            strokeWidth={Math.max(2, Math.min(w, h) * 0.006)}
            strokeLinecap="round"
          />
        )}

     
      </svg>
    </div>
  );
}
