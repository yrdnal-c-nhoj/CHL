import React, { useMemo, useEffect } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import background from '@/assets/images/2025/25-12/25-12-21/cass.webp';
import backgroundImage from '@/assets/images/2025/25-12/25-12-21/tape.gif';
import FONT_PATH from '@/assets/fonts/2025/25-12-21-cas.ttf?url';

const Clock: React.FC = () => {
  const time = useClockTime();
  const fontFamily = 'CasFont_251221';

  const fontConfigs = useMemo(() => [
    {
      fontFamily,
      fontUrl: FONT_PATH
    }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const digitToLetter = (digit: number) => {
    const letters = ['0', 'G', 'b', 'W', 'z', 'u', 'v', 'w', 'a', 's'];
    return letters[digit] || digit;
  };

  const digitStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '3vh',
    textAlign: 'center',
    color: '#473803FF',
    textShadow: [
      // White shadow to the right (1px right, 0px down, 1px blur)
      '1px 0 1px rgba(255, 255, 255, 0.8)',
      // Black shadow to the left (-1px left, 0px down, 1px blur)
      '-1px 0 1px rgba(0, 0, 0, 0.8)',
    ].join(','),
    transform: 'rotate(90deg)',
    transformOrigin: 'center center',
    fontSize: '6vh',
    lineHeight: 1,
    WebkitUserSelect: 'none',
    userSelect: 'none',
    fontFamily: `${fontFamily}, sans-serif`,
    position: 'relative',
    zIndex: 1,
  };

  const formatWithLetters = (value: number): (string | number)[] =>
    value
      .toString()
      .padStart(2, '0')
      .split('')
      .map((d) => digitToLetter(parseInt(d, 10)));

  const timePartStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4vh',
  };

  const renderTimePart = (chars: (string | number)[]) => (
    <div style={timePartStyle}>
      {chars.map((char, i) => (
        <span key={i} style={digitStyle}>
          {char}
        </span>
      ))}
    </div>
  );

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '-100%',
    backgroundImage: `url(${background})`,
    backgroundSize: '400px auto',
    backgroundRepeat: 'repeat',
    opacity: 0.7,
    backgroundPosition: 'center center',
    filter: 'brightness(1.4) saturate(4.8) contrast(0.3) hue-rotate(-25deg)',
    animation: 'rotateGrid 360s linear infinite',
    transformOrigin: 'center center',
  };

  const clockData = useMemo(() => ({
    h: formatWithLetters(time.getHours()),
    m: formatWithLetters(time.getMinutes()),
    s: formatWithLetters(time.getSeconds()),
    iso: time.toISOString()
  }), [time]);

  return (
    <main style={containerStyle}>
      <style>{`
        @keyframes rotateGrid {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {/* 1. Background image - bottom layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'auto', // Maintain original aspect ratio
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center', // Center the tiling
          zIndex: 1,
        }}
      />

      {/* 3. Rotating grid - middle layer */}
      <div
        style={{
          ...backgroundStyle,
          zIndex: 3,
        }}
      />

      {/* 4. Clock - top layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <time
          dateTime={clockData.iso}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4vh',
          }}
        >
          {renderTimePart(clockData.h)}
          {renderTimePart(clockData.m)}
          {renderTimePart(clockData.s)}
        </time>
      </div>
    </main>
  );
};

export default Clock;
