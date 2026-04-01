import React, { useMemo } from 'react';
import { useClockTime } from '../../../utils/hooks';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
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
    backgroundColor: '#111',
    margin: 0,
    padding: 0,
  };

  const clockStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontFamily: 'monospace',
    fontWeight: 300,
  };

  const digitStyle: React.CSSProperties = {
    fontSize: 'clamp(4rem, 15vw, 12rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
  };

  const separatorStyle: React.CSSProperties = {
    ...digitStyle,
    opacity: 0.6,
    animation: 'blink 1s infinite',
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
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{minutes[0]}</span>
        <span style={digitStyle}>{minutes[1]}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{seconds[0]}</span>
        <span style={digitStyle}>{seconds[1]}</span>
      </div>
    </div>
  );
};

export default Clock;
