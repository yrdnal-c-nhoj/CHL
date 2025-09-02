import React, { useEffect, useState } from 'react';
import bgImage from './lp.webp';
import hourHandImage from './arm1.gif';
import minuteHandImage from './arm2.gif';
import secondHandImage from './arm3.gif';

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

  const ticks = Array.from({ length: 60 }).map((_, i) => {
    const angle = i * 6;
    const a = (angle - 90) * (Math.PI / 180);
    const outerX = cx + Math.cos(a) * radius * 1.04;
    const outerY = cy + Math.sin(a) * radius * 1.04;
    const innerX = cx + Math.cos(a) * radius * 0.96;
    const innerY = cy + Math.sin(a) * radius * 0.96;
    return { x1: innerX, y1: innerY, x2: outerX, y2: outerY, major: i % 5 === 0 };
  });

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

  const svgStyle = { display: 'block', width: '100%', height: '100%' };

  // Hand sizes relative to radius
  const hourHandSize = radius * 2.55; // Image height for hour hand
  const minuteHandSize = radius * 4.76; // Image height for minute hand
  const secondHandSize = radius * 2.9; // Image height for second hand
  const handWidthScale = 0.2; // Adjust width relative to height (assumes image aspect ratio)

  return (
    <div style={containerStyle}>
      <svg style={svgStyle} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
  
       

        {/* Hour hand */}
        <image
          href={hourHandImage}
          x={cx - (hourHandSize * handWidthScale) / 2}
          y={cy - hourHandSize}
          width={hourHandSize * handWidthScale}
          height={hourHandSize}
          transform={`rotate(${hourAngle} ${cx} ${cy})`}
          preserveAspectRatio="xMidYMax meet"
        />

        {/* Minute hand */}
        <image
          href={minuteHandImage}
          x={cx - (minuteHandSize * handWidthScale) / 2}
          y={cy - minuteHandSize}
          width={minuteHandSize * handWidthScale}
          height={minuteHandSize}
          transform={`rotate(${minAngle} ${cx} ${cy})`}
          preserveAspectRatio="xMidYMax meet"
        />

        {/* Second hand */}
        {showSeconds && (
          <image
            href={secondHandImage}
            x={cx - (secondHandSize * handWidthScale) / 2}
            y={cy - secondHandSize}
            width={secondHandSize * handWidthScale}
            height={secondHandSize}
            transform={`rotate(${secAngle} ${cx} ${cy})`}
            preserveAspectRatio="xMidYMax meet"
          />
        )}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={radius * 0.03} fill="#000000AA" />
      </svg>
    </div>
  );
}