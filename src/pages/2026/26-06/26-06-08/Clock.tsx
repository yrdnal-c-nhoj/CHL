import customFont from '@/assets/fonts/26fonts/26-06-08.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React from 'react';

const VIDEO_ID = 'FBYUkqutqzE';
const YOUTUBE_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&enablejsapi=1`;

// Font configuration defined outside component for reference stability
const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'JesoloFont',
    fontUrl: customFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

// Export assets so the global loader waits for the font to be ready
export const assets: string[] = [customFont];

const Clock: React.FC = () => {
  const time = useClockTime();

  useSuspenseFontLoader(FONT_CONFIGS);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0, 
    backgroundColor: '#000'
  };

  const iframeStyle: React.CSSProperties = {
    position: 'fixed', // Use fixed to cover the entire viewport
    inset: 0, // Top, right, bottom, left to 0
    width: '100%',
    height: '56.25vw', // Maintain 16:9 ratio
    minHeight: '100dvh',
    minWidth: '177.77dvh',
    border: 'none',
    zIndex: 0, // Behind the overlay and clock
    pointerEvents: 'none',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker overlay for better contrast
    zIndex: 1, // Between the video and the clock
  };

  // Calculate clock hand angles
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Angles in degrees
  const secondAngle = seconds * 6; // 360 degrees / 60 seconds = 6 deg/sec
  // Minute hand moves continuously: 360/60 = 6 deg/min + (seconds/60)*6 deg/min
  const minuteAngle = minutes * 6 + seconds * 0.1;
  // Hour hand moves continuously: 360/12 = 30 deg/hr + (minutes/60)*30 deg/hr
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  const clockRadius = 180; // Radius for the main clock face elements
  const digitRadius = 160; // Radius for placing the digits
  const center = { x: 200, y: 200 }; // Center of the SVG viewBox (400x400)

  // Function to get position and rotation for a digit
  const getDigitPositionAndRotation = (
    hour: number,
    radius: number,
    centerX: number,
    centerY: number,
  ) => {
    // Adjust angle so 12 is at the top (0 degrees), and 3 is at the right (90 degrees)
    // SVG rotation is clockwise, so we adjust accordingly.
    // (hour - 3) * (Math.PI / 6) makes 3 o'clock align with 0 radians (right side)
    const angle = (hour - 3) * (Math.PI / 6); 
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // Rotate text to align with the perimeter.
    // The text's baseline is horizontal by default.
    // We want the text to be perpendicular to the radius line at its position.
    // The angle of the radius line is `(hour - 3) * 30` degrees.
    // To make the text perpendicular, we add 90 degrees.
    const rotation = (hour - 3) * 30 + 90; 
    
    return { x, y, rotation };
  };

  const digits = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <main style={containerStyle}>
      <iframe
        src={YOUTUBE_URL}
        title="Background Stream"
        style={iframeStyle}
        allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div style={overlayStyle} />
      <svg
        viewBox="0 0 400 400"
        style={{
          width: 'min(90vmin, 400px)', // Constrain max size for very large screens
          height: 'min(90vmin, 400px)',       borderRadius: '50%',
          position: 'relative', // Relative to main, but z-index handles stacking
          zIndex: 2, // Above video and overlay
        }}
      >
        <defs>
          {/* Carved Wood Texture for the Oar */}
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#3e2723', stopOpacity: 1 }} />
          </linearGradient>

          {/* Bamboo Texture */}
          <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#99aa3d', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#c5e1a5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#99aa3d', stopOpacity: 1 }} />
          </linearGradient>

          {/* Depth Shadow */}
          <filter id="tikiShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="3" dy="3" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.6" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

      
        {/* Digits */}
        {digits.map((digit) => {
          const { x, y, rotation } = getDigitPositionAndRotation(
            digit,
            digitRadius, // Radius for digits
            center.x,
            center.y,
          );
          return (
            <text
              key={digit}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central" // Centers text vertically
              fill="#ABC68C"
              fontSize="50"
              fontFamily="JesoloFont, sans-serif" // Ensure custom font is used
              transform={`rotate(${rotation} ${x} ${y})`}
              style={{ filter: 'url(#tikiShadow)' }}
            >
              {digit}
            </text>
          );
        })}

        {/* Clock Hands */}

        {/* Hour Hand: Bamboo Staff */}
        <g transform={`rotate(${hourAngle} 200 200)`} style={{ filter: 'url(#tikiShadow)' }}>
          <rect x="197" y="135" width="6" height="80" rx="3" fill="url(#bambooGrad)" />
          {/* Bamboo Nodes */}
          <line x1="197" y1="155" x2="203" y2="155" stroke="#5d4037" strokeWidth="1.5" />
          <line x1="197" y1="180" x2="203" y2="180" stroke="#5d4037" strokeWidth="1.5" />
          <line x1="197" y1="205" x2="203" y2="205" stroke="#5d4037" strokeWidth="1.5" />
        </g>

        {/* Minute Hand: Bamboo Staff */}
        <g transform={`rotate(${minuteAngle} 200 200)`} style={{ filter: 'url(#tikiShadow)' }}>
          <rect x="198" y="90" width="4" height="120" rx="2" fill="url(#bambooGrad)" />
          {/* Bamboo Nodes */}
          <line x1="198" y1="120" x2="202" y2="120" stroke="#5d4037" strokeWidth="1" />
          <line x1="198" y1="150" x2="202" y2="150" stroke="#5d4037" strokeWidth="1" />
          <line x1="198" y1="180" x2="202" y2="180" stroke="#5d4037" strokeWidth="1" />
        </g>

        {/* Center Dot */}
        <circle cx={center.x} cy={center.y} r="2" fill="#3e2723" />
        <circle cx={center.x} cy={center.y} r="1" fill="#DEB887" />
      </svg>
    </main>
  );
};

export default Clock;