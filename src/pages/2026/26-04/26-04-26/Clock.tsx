import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import bgVideo from '@/assets/images/2026/26-04/26-04-26/jetson.mp4';
import jetFont from '@/assets/fonts/26-04-26-jet.ttf';

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

const Clock: React.FC = () => {
  const time = useClockTime();

  const fontConfigs = useMemo(() => [
    {
      fontFamily: 'Jet',
      fontUrl: jetFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds, ms, ampm } = useMemo(() => {
    let h = time.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // 0 should be 12
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    const ms = formatMs(time.getMilliseconds());
    return { hours: h.toString(), minutes: m, seconds: s, ms, ampm };
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

  const clockStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontFamily: 'Jet',
    fontWeight: 300,
    opacity: 0.8,
  };

  const digitStyle: React.CSSProperties = {
    fontSize: 'clamp(2rem, 8vw, 6rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
    // letterSpacing: '0.15em',
    textShadow: `
      0 0 10px rgba(255, 100, 50, 0.8),
      0 0 20px rgba(255, 100, 50, 0.6),
      0 0 40px rgba(255, 50, 100, 0.4),
      2px 2px 0px rgba(0, 0, 0, 0.8),
      -1px -1px 0px rgba(255, 255, 255, 0.3)
    `,
    WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)',
  };

  const msStyle: React.CSSProperties = {
    ...digitStyle,
  };

  const ampmStyle: React.CSSProperties = {
    ...digitStyle,
    fontSize: 'clamp(1.5rem, 6vw, 4rem)',
  };

  const digitBoxStyle: React.CSSProperties = {
    width: 'clamp(1.5rem, 7vw, 5rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const ampmBoxStyle: React.CSSProperties = {
    ...digitBoxStyle,
    width: 'clamp(2rem, 10vw, 6rem)',
    marginLeft: '0.5rem',
  };

  const clockWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '85vw',
    maxWidth: '800px',
    height: '15vh',
    minHeight: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        style={videoStyle}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
      <div style={clockWrapperStyle}>
        <div style={clockStyle}>
        <div style={digitBoxStyle}><span style={digitStyle}>{hours[0]}</span></div>
        {hours[1] && <div style={digitBoxStyle}><span style={digitStyle}>{hours[1]}</span></div>}
        <div style={digitBoxStyle}><span style={digitStyle}>{minutes[0]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{minutes[1]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{seconds[0]}</span></div>
        <div style={digitBoxStyle}><span style={digitStyle}>{seconds[1]}</span></div>
        <div style={digitBoxStyle}><span style={msStyle}>{ms[0]}</span></div>
        <div style={digitBoxStyle}><span style={msStyle}>{ms[1]}</span></div>
        <div style={digitBoxStyle}><span style={msStyle}>{ms[2]}</span></div>
        <div style={ampmBoxStyle}><span style={ampmStyle}>{ampm}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
