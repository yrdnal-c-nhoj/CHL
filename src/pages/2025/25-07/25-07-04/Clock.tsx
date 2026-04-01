import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useMultipleFontLoader } from '@/utils/fontLoader';
import kalFont from '@/assets/fonts/2025/25-07-04-kal.otf';
import bgImage from '@/assets/images/2025/25-07/25-07-04/7ZAx.webp';

/** * CONFIGURATION 
 * Defined outside to prevent re-allocation on every frame
 */
const SEGMENTS = 12;
const COLORS = [
  '#ff0040', '#045DF7FF', '#F9D108FF', '#00ff00',
  '#FC7B02FF', '#ff00ff', '#00bfff', '#ffffff',
  '#D0FF00FF', '#C12FFBFF', '#FAA404FF', '#12F5DBFF',
];

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef<number | null>(null);

  // 1. Font Loading Logic
  const fontConfigs = useMemo(() => [
    {
      fontFamily: 'kal',
      fontUrl: kalFont,
      options: { weight: 'normal', style: 'normal' }
    }
  ], []);
  
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  // 2. Optimized Animation Loop
  const animate = useCallback(() => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // 3. Loading State Guard
  if (!fontsLoaded) {
    return (
      <div style={loadingOverlayStyle}>
        Initializing Synchronicity...
      </div>
    );
  }

  // 4. Time Formatting
  const h = time.getHours();
  const hourText = (h % 12 || 12).toString().padStart(2, '0');
  const minuteText = time.getMinutes().toString().padStart(2, '0');
  const secondText = time.getSeconds().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const s = time.getSeconds();

  // 5. Segment Rendering Logic
  const renderRingSegments = (offset: number) => {
    return Array.from({ length: SEGMENTS }).map((_, i) => {
      const angle = i * (360 / SEGMENTS);
      const colorIndex = (i + s + offset) % COLORS.length;

      return (
        <React.Fragment key={i}>
          <div
            className="segment hour"
            style={{
              transform: `rotate(${angle}deg) translate(30vmin)`,
              color: COLORS[(colorIndex + 2) % COLORS.length],
            }}
          >
            {hourText}
          </div>
          <div
            className="segment minute"
            style={{
              transform: `rotate(${angle}deg) translate(20vmin)`,
              color: COLORS[(colorIndex + 4) % COLORS.length],
            }}
          >
            {minuteText}
          </div>
          <div
            className="segment second"
            style={{
              transform: `rotate(${angle}deg) translate(10vmin)`,
              color: COLORS[(colorIndex + 6) % COLORS.length],
            }}
          >
            {secondText}
          </div>
          <div
            className="segment ampm"
            style={{
              transform: `rotate(${angle}deg) translate(5vmin)`,
              color: COLORS[(colorIndex + 8) % COLORS.length],
            }}
          >
            {ampm}
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div style={containerStyle}>
      {/* Background Image Layer */}
      <img 
        decoding="async" 
        src={bgImage} 
        alt="background" 
        style={bgStyle} 
      />

    

      {/* Clock Layers */}
      <div className="kaleidoscope spin-cw">{renderRingSegments(0)}</div>
      <div className="kaleidoscope spin-ccw">{renderRingSegments(6)}</div>

      <style>{`
        @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        
        .kaleidoscope { 
          font-family: 'kal', sans-serif; 
          position: absolute; 
          inset: 0; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          z-index: 2; 
          pointer-events: none;
          perspective: 1000px;
        }
        
        .spin-cw { animation: spin-cw 60s linear infinite; opacity: 0.8; }
        .spin-ccw { animation: spin-ccw 120s linear infinite; opacity: 0.5; filter: blur(1px); }
        
        .segment { 
          position: absolute; 
          font-weight: 900; 
          mix-blend-mode: screen; 
          transition: color 0.8s ease, transform 0.5s ease-out; 
          font-size: 5rem; 
          white-space: nowrap;
          will-change: transform, color;
        }
        
        .minute { font-size: 3rem; opacity: 0.8; }
        .second { font-size: 1.5rem; opacity: 0.6; }
        .ampm { font-size: 0.7rem; letter-spacing: 1px; }

        @media (max-width: 768px) {
          .segment { font-size: 3rem; }
          .minute { font-size: 1.8rem; }
          .second { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
};

/**
 * STYLES
 */
const containerStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  background: 'black',
  height: '100dvh',
  width: '100vw',
  overflow: 'hidden',
  position: 'relative',
};

const bgStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100dvh',
  objectFit: 'cover',
  filter: 'brightness(180%) saturate(200%) hue-rotate(-190deg) blur(2px)',
  zIndex: 1,
  pointerEvents: 'none',
};

const headerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  display: 'flex',
  color: 'rgba(255,255,255,0.4)',
  zIndex: 6,
  fontSize: '0.8rem',
  fontFamily: 'monospace',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  paddingTop: '5px',
  pointerEvents: 'none',
};

const loadingOverlayStyle: React.CSSProperties = {
  background: 'black',
  height: '100dvh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#444',
  fontFamily: 'monospace',
  letterSpacing: '2px',
};

export default Clock;