import React, { useMemo, useState, useEffect } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import catFont from '@/assets/fonts/26-04-15-cat.ttf';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const time = useClockTime();
  const [catUrl, setCatUrl] = useState(`https://cataas.com/cat?t=${time.getTime()}`);

  // Load the local cat font for this date
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'CatClock', fontUrl: catFont }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // Update the cat image every second
  useEffect(() => {
    setCatUrl(`https://cataas.com/cat?t=${time.getTime()}`);
  }, [time]);

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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    margin: 0,
    padding: 0,
    gap: '2rem',
  };

  const catBoxStyle: React.CSSProperties = {
    width: 'min(80vw, 600px)',
    height: 'min(45vh, 400px)',
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    border: '2px solid #333',
    overflow: 'hidden',
    backgroundColor: '#222',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const catImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const clockStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontFamily: 'monospace',
    fontWeight: 300,
  };

  const digitBoxStyle: React.CSSProperties = {
    width: '4.9em',
    height: '1.4em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: '0.15em',
    border: '2px solid #333',
  };

  const digitStyle: React.CSSProperties = {
    fontFamily: 'CatClock, monospace',
    fontSize: 'clamp(3rem, 12vw, 10rem)',
    color: '#fff',
    fontWeight: 400,
    lineHeight: 1,
  };

  const separatorBoxStyle: React.CSSProperties = {
    width: '0.8em',
    height: '1.4em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };


  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
      <div style={catBoxStyle}>
        <img 
          src={catUrl} 
          alt="Random Cat" 
          style={catImageStyle} 
        />
      </div>
      <div style={clockStyle}>
        <div style={digitBoxStyle}><span style={digitStyle}>{hours[0]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{hours[1]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{minutes[0]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{minutes[1]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{seconds[0]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{seconds[1]}</span></div>
      </div>
    </div>
  );
};

export default Clock;
