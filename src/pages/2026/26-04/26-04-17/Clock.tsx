import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useFontLoader } from '@/utils/fontLoader';
import backgroundImage from '@/assets/images/2026/26-04/26-04-17/tati.webp';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  useFontLoader(
    'Space Grotesk',
    'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2'
  );
  const time = useClockTime();

  const { hours, minutes, seconds } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    margin: 0,
    padding: 0,
  };

  const clockStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.2rem',
    alignItems: 'center',
    fontFamily: '"Space Grotesk", monospace',
    fontWeight: 300,
  };

  const digitStyle: React.CSSProperties = {
    fontSize: 'clamp(4rem, 15vw, 12rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
    textShadow: `
      0 0 10px rgba(255,255,255,0.8),
      0 0 20px rgba(255,255,255,0.6),
      0 0 40px rgba(255,255,255,0.4),
      0 0 80px rgba(255,255,255,0.2),
      0 2px 10px rgba(0,0,0,0.5)
    `,
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
      <div style={clockStyle}>
        <span style={digitStyle}>{hours[0]}</span>
        <span style={digitStyle}>{hours[1]}</span>
        <span style={digitStyle}>{minutes[0]}</span>
        <span style={digitStyle}>{minutes[1]}</span>
        <span style={digitStyle}>{seconds[0]}</span>
        <span style={digitStyle}>{seconds[1]}</span>
      </div>
    </div>
  );
};

export default Clock;
