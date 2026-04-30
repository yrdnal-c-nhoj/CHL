import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import bgVideo from '@/assets/images/2026/26-04/26-04-26/jetson.mp4';
import jetFont from '@/assets/fonts/2026/26-04-26-jet.ttf?url';

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const PLEIADES_POSITIONS = [
  { top: '25%', left: '50%' }, // Hour tens (Handle)
  { top: '42%', left: '35%' }, // Hour ones (Bowl Edge)
  { top: '40%', left: '65%' }, // Minute tens (Bowl Edge)
  { top: '45%', left: '50%' }, // Minute ones (Bowl Center)
  { top: '65%', left: '42%' }, // Second tens (Bowl Bottom)
  { top: '65%', left: '58%' }, // Second ones (Bowl Bottom)
] as const;

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

  const digits = useMemo(() => {
    let h = time.getHours();
    h = h % 12;
    h = h ? h : 12; // 0 should be 12
    const hStr = formatTime(h);
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return [...hStr.split(''), ...m.split(''), ...s.split('')];
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

  const digitStyle: React.CSSProperties = {
    fontFamily: 'Jet, monospace',
    fontSize: 'clamp(2rem, 8vw, 6rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
    textShadow: `
      0 0 10px rgba(255, 100, 50, 0.8),
      0 0 20px rgba(255, 100, 50, 0.6),
      0 0 40px rgba(255, 50, 100, 0.4),
      2px 2px 0px rgba(0, 0, 0, 0.8),
      -1px -1px 0px rgba(255, 255, 255, 0.3)
    `,
    WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)',
  };

  const digitBoxStyle: React.CSSProperties = {
    width: 'clamp(1.5rem, 7vw, 5rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  };

  const clockWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '85vw',
    maxWidth: '800px',
    height: '60vh',
    minHeight: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <main style={containerStyle}>
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
      <time style={clockWrapperStyle} dateTime={time.toISOString()}>
        {digits.map((digit, i) => (
          <div
            key={i}
            style={{
              ...digitBoxStyle,
              top: PLEIADES_POSITIONS[i].top,
              left: PLEIADES_POSITIONS[i].left,
            }}
          >
            <span style={digitStyle}>{digit}</span>
          </div>
        ))}
      </time>
    </main>
  );
};

export default Clock;
