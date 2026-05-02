import React, { useMemo } from 'react';

import jetFont from '@/assets/fonts/2026/26-04-26-jet.ttf?url';
import bgVideo from '@/assets/images/2026/26-04/26-04-26/jetson.mp4';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
const formatTime = (num: number): string => num.toString().padStart(2, '0');
const Clock: React.FC = () => {
  const time = useClockTime();
  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'Jet',
        fontUrl: jetFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);
  const { displayHours, displayMinutes, displaySeconds, ampm } = useMemo(() => {
    const rawHours = time.getHours();
    const ampm = rawHours >= 12 ? 'PM' : 'AM';
    const h = rawHours % 12 || 12; // Convert to 12-hour format, 0 becomes 12
    return {
      displayHours: formatTime(h),
      displayMinutes: formatTime(time.getMinutes()),
      displaySeconds: formatTime(time.getSeconds()),
      ampm,
    };
  }, [time]);
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  };

  const baseDigitStyle: React.CSSProperties = {
    fontSize: 'clamp(2rem, 8vw, 6rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
  };

  const timeStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem', // Spacing between digit boxes and separators
    fontFamily: 'Jet',
  };

  const digitStyle: React.CSSProperties = {
    ...baseDigitStyle,
    textShadow: `
      0 0 10px rgba(255, 100, 50, 0.8),
      0 0 20px rgba(255, 100, 50, 0.6),
      0 0 40px rgba(255, 50, 100, 0.4),
      2px 2px 0px rgba(0, 0, 0, 0.8),
      -1px -1px 0px #fff
    `,
    WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)',
  };

  const separatorStyle: React.CSSProperties = {
    ...digitStyle, // Inherit all digit styles including shadow and stroke
    margin: '0 0.25rem', // Adjust margin
  };

  const ampmStyle: React.CSSProperties = {
    ...digitStyle, // Inherit all digit styles including shadow and stroke
    fontSize: 'clamp(1.5rem, 6vw, 4rem)', // Smaller for AM/PM
    marginLeft: '0.5rem',
  };

  const baseDigitBoxStyle: React.CSSProperties = {
    width: 'clamp(1.5rem, 7vw, 5rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const digitBoxStyle: React.CSSProperties = {
    ...baseDigitBoxStyle,
  };

  const ampmBoxStyle: React.CSSProperties = {
    ...baseDigitBoxStyle,
    width: 'clamp(2rem, 10vw, 6rem)', // Wider for AM/PM
    marginLeft: '0.5rem',
  };

  const clockWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '90vw',
    maxWidth: '800px',
    height: 'auto', // Let content define height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <main style={containerStyle}>
      <video src={bgVideo} autoPlay loop muted playsInline style={videoStyle} />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
      <div style={clockWrapperStyle}>
        <time style={timeStyle} dateTime={time.toISOString()}>
          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayHours[0]}</span>
          </div>
          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayHours[1]}</span>
          </div>
          <span style={separatorStyle}>:</span>
          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayMinutes[0]}</span>
          </div>
          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayMinutes[1]}</span>
          </div>
          <span style={separatorStyle}>:</span>
          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displaySeconds[0]}</span>
          </div>
          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displaySeconds[1]}</span>
          </div>
          <div style={ampmBoxStyle}>
            <span style={ampmStyle}>{ampm}</span>
          </div>
        </time>
      </div>
    </main>
  );
};

export default Clock;
