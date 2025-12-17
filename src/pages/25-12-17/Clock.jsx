import { useState, useEffect, useMemo, memo } from 'react';

import bgImage from './steel.webp';
import digitTexture from './steel2.webp';
import screwFont from './screw.ttf?url';

// Constants moved outside to prevent re-creation
const FONT_NAME = 'screw251214';

// Memoized individual digit to prevent re-renders of hours when minutes change
const Digit = memo(({ value, offset }) => {
  const style = {
    fontSize: '18vmin',
    fontFamily: 'inherit',
    lineHeight: '1',
    fontVariantNumeric: 'tabular-nums',
    backgroundImage: `url(${digitTexture})`,
    backgroundSize: '320% 320%',
    backgroundPosition: `${offset.x}% ${offset.y}%`,
    backgroundRepeat: 'no-repeat',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter: 'contrast(1.15) brightness(1.05)',
    textShadow: `
      -0.08vh -0.08vh 0.18vh rgba(255,255,255,0.35),
       0.08vh  0.08vh 0.22vh rgba(0,0,0,0.55)
    `,
    display: 'inline-block',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ width: '20vmin', height: '20vmin', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <span style={style}>{value}</span>
    </div>
  );
});

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // 1. Stable Texture Offsets (Fixed for 4 positions: HH:MM)
  const textureOffsets = useMemo(() => 
    Array.from({ length: 4 }, () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    })), []
  );

  // 2. Timer Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Simplified Font Detection
  useEffect(() => {
    if (!document.fonts) {
      setFontLoaded(true);
      return;
    }
    document.fonts.ready.then(() => {
      if (document.fonts.check(`1em ${FONT_NAME}`)) {
        setFontLoaded(true);
      }
    });
  }, []);

  // 4. Time Formatting
  const hours = time.getHours().toString().padStart(2, '0').split('');
  const minutes = time.getMinutes().toString().padStart(2, '0').split('');

  // 5. Layout Styles
  const containerStyle = useMemo(() => ({
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    fontFamily: fontLoaded ? `"${FONT_NAME}", monospace` : 'monospace',
    opacity: fontLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in',
  }), [fontLoaded]);

  const rowStyle = {
    display: 'flex',
    gap: '1vmin',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @font-face {
            font-family: '${FONT_NAME}';
            src: url(${screwFont}) format('truetype');
            font-display: swap;
          }
        `}
      </style>

      <div style={rowStyle}>
        <Digit value={hours[0]} offset={textureOffsets[0]} />
        <Digit value={hours[1]} offset={textureOffsets[1]} />
      </div>
      <div style={rowStyle}>
        <Digit value={minutes[0]} offset={textureOffsets[2]} />
        <Digit value={minutes[1]} offset={textureOffsets[3]} />
      </div>
    </div>
  );
}