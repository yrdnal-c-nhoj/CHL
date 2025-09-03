import React, { useEffect, useState } from 'react';
import bgImage from './lp.webp';
import hourHandImage from './arm2.gif';
import minuteHandImage from './arm1.gif';
import secondHandImage from './arm3.gif';

export default function FullViewportRectangularAnalogClock({
  showSeconds = true,
  xOffset = -10,  // horizontal offset in pixels (default center)
  yOffset = 10,  // vertical offset in pixels (default center)
}) {
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
  const cx = w / 2 + xOffset;  // apply horizontal offset
  const cy = h / 2 + yOffset;  // apply vertical offset
  const radius = Math.min(w, h) * 0.38;

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secAngle = (seconds / 60) * 360;
  const minAngle = (minutes / 60) * 360;
  const hourAngle = (hours / 12) * 360;

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
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

  const hourHandSize = radius * 0.7;
  const minuteHandSize = radius * 1.1;
  const secondHandSize = radius * 1.3;
  const handWidthScale = 0.3;

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
          opacity={0.9}
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
          opacity={0.9}
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
            opacity={0.9}
          />
        )}
      </svg>
    </div>
  );
}

