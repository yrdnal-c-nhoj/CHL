import React, { useMemo } from 'react';
import animalsVideo from '@/assets/images/2026/26-04/26-04-29/animals.mp4';
import { useClockTime } from '@/utils/clockUtils';

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
    position: 'relative',
    overflow: 'hidden',
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
  };

  const clockStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontFamily: 'monospace',
    fontWeight: 300,
    position: 'relative',
    zIndex: 1,
  };

  const digitStyle: React.CSSProperties = {
    fontSize: 'clamp(4rem, 15vw, 12rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
  };

  const separatorStyle: React.CSSProperties = {
    ...digitStyle,
  };

  return (
    <div style={containerStyle}>

      <video
        style={videoStyle}
        autoPlay
        loop
        muted
        playsInline
        src={animalsVideo}
      />
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