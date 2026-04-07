import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-03/clox.mp4';
import fontUrl from '@/assets/fonts/clox.ttf?url';

const formatTimeParts = (date: Date): string[] => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return [...hours, ':', ...minutes, ':', ...seconds];
};

const Clock: React.FC = () => {
  const time = useClockTime();
  const timeParts = formatTimeParts(time);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Clox', fontUrl: fontUrl }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    gap: 0,
  };

  const clockWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    mixBlendMode: 'difference',
    flexWrap: 'nowrap',
    marginBottom: '-8vw',
  };

  // Base style for both digits and colons
  const commonStyle: React.CSSProperties = {
    fontFamily: "'Clox', monospace",
    fontSize: '26vw',
    fontWeight: 'normal',
    color: '#ffffff',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    flexShrink: 0,
  };

  const digitStyle: React.CSSProperties = {
    ...commonStyle,
    // Digits have a set width that allows slight overlap
    width: '0.55em',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    width: '100vw',
    height: '25vh',
    pointerEvents: 'none',
    zIndex: 10,
    display: 'none',
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    objectFit: 'cover',
    zIndex: 0,
  };
  const clockRowsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  };

  const colonStyle: React.CSSProperties = {
    ...commonStyle,
    width: '0.15em',
    marginLeft: '-0.05em',
    marginRight: '-0.05em',
    zIndex: 1,
    alignSelf: 'flex-start',
    transform: 'translateY(-0.15em)',
  };

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow: hidden; background: #000; }
        @media (max-width: 768px) {
          .clock-container video { object-fit: contain; height: 50% !important; top: 25% !important; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
      
      <div style={containerStyle} className="clock-container">
        <video style={videoStyle} autoPlay loop muted playsInline src={backgroundVideo} />
        <div style={{...overlayStyle, top: 0, background: '#000000'}} className="mobile-overlay" />
        <div style={{...overlayStyle, bottom: 0, background: '#000000'}} className="mobile-overlay" />
        <div style={clockRowsWrapperStyle}>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`t5-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`t4-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`t3-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`t2-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`t1-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`mid-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`b1-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`b2-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`b3-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`b4-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
          <div style={clockWrapperStyle}>
            {timeParts.map((char, index) => (
              <span key={`b5-${index}`} style={char === ':' ? colonStyle : digitStyle}>{char}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Clock;