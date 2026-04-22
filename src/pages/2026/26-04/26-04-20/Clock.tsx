import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import bgImg from '@/assets/images/2026/26-04/26-04-20/bstream.gif';

export const assets = [bgImg];

const Clock: React.FC = () => {
  const time = useClockTime();

  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const h = time.getHours() % 12;
    const m = time.getMinutes();
    const s = time.getSeconds();
    return {
      hourDeg: (h * 30) + (m * 0.5),
      minuteDeg: m * 6,
      secondDeg: s * 6,
    };
  }, [time]);

  const size = 'min(80vw, 80vh)';

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  };

  const bgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  };

  const clockFaceStyle: React.CSSProperties = {
    width: size,
    height: size,
    position: 'relative',
    zIndex: 1,
  };

  const handStyle = (deg: number, length: string, width: string, color: string): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height: length,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    borderRadius: '2px',
    boxShadow: '13px 0 4px #EC0B0B',
  });

  const centerDotStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
  };

  return (
    <div style={containerStyle}>
      <div style={bgStyle} />
      <div style={clockFaceStyle}>
        <div style={handStyle(hourDeg, '25%', '6px', '#fff')} />
        <div style={handStyle(minuteDeg, '35%', '4px', '#ccc')} />
        <div style={handStyle(secondDeg, '40%', '2px', '#ff3366')} />
        <div style={centerDotStyle} />
      </div>
    </div>
  );
};

export default Clock;
