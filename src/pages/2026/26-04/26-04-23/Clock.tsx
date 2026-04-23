import React, { useState, useEffect, useRef, Suspense } from 'react';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-23/sunflower.mp4';
import fontUrl from '@/assets/fonts/26-04-23.otf';
import { useFontLoader, ClockLoadingFallback } from '@/utils/fontLoader';

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

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
  backgroundColor: '#000',
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

const digitsContainerStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100dvh',
  // Using user-select: none prevents accidental highlighting while watching
  userSelect: 'none', 
};

const digitBoxStyle: React.CSSProperties = {
  fontSize: 'calc(100dvh / 10)', 
  fontWeight: 300,
  fontFamily: '"Clock26-04-23", monospace',
  color: '#FAEA10',
  textShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
  lineHeight: 0.85,
  fontVariantNumeric: 'tabular-nums',
};

const ClockInner: React.FC = () => {
  useFontLoader('Clock26-04-23', fontUrl);
  const [time, setTime] = useState<Date>(new Date());
  const requestRef = useRef<number>();

  const animate = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const h = formatTime(time.getHours());
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());
  const ms = formatMs(time.getMilliseconds());

  // Join them to treat the milliseconds as part of the sequence
  const allDigits = (h + m + s + ms).split('');

  return (
    <div style={containerStyle}>
      <video 
        style={videoStyle} 
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      <main style={digitsContainerStyle}>
        {allDigits.map((digit, index) => (
          <span key={index} style={digitBoxStyle}>
            {digit}
          </span>
        ))}
      </main>
    </div>
  );
};

const Clock: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

export default Clock;