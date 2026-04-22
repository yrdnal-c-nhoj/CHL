import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import wobbleVideo from '@/assets/images/2026/26-04/26-04-19/wobble2.mp4';
import wobbleFont from '@/assets/fonts/26-04-19-wobble.ttf';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  useSuspenseFontLoader([{ fontFamily: 'Wobble', fontUrl: wobbleFont }]);
  const time = useClockTime();

  const { hours, minutes, ampm } = useMemo(() => {
    let h = time.getHours();
    const am = h < 12 ? 'AM' : 'PM';
    h = h % 12 || 12;
    const m = formatTime(time.getMinutes());
    return { hours: h.toString(), minutes: m, ampm: am };
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
    backgroundColor: '#FFFFFF',
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 'auto',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'cover',
    zIndex: 0,
  };

  const clockStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontFamily: 'Wobble, monospace',
    fontWeight: 300,
    position: 'relative',
    zIndex: 1,
  };

  const digitStyle: React.CSSProperties = {
    fontSize: 'clamp(2rem, 7vw, 6rem)',
    color: '#F5D20A',
    minWidth: '0.8em',
    lineHeight: 1,
  };

  const separatorStyle: React.CSSProperties = {
    ...digitStyle,

  };

  const ampmStyle: React.CSSProperties = {
    ...digitStyle,
    alignSelf: 'flex-end',
  };

  return (
    <div style={containerStyle}>
      <video
        src={wobbleVideo}
        style={videoStyle}
        autoPlay
        loop
        muted
        playsInline
      />

      <div style={clockStyle}>
        {hours.split('').map((digit, i) => (
          <span key={i} style={digitStyle}>{digit}</span>
        ))}
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{minutes[0]}</span>
        <span style={digitStyle}>{minutes[1]}</span>
        <span style={ampmStyle}>{ampm}</span>
      </div>
    </div>
  );
};

export default Clock;
