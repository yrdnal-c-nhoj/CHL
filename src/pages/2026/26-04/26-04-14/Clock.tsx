import React, { useMemo, useEffect } from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';

// Asset import for video and overlay image
import bgVideo from '@/assets/images/2026/26-04/26-04-14/haumeas.mp4';
import overlayImage from '@/assets/images/2026/26-04/26-04-14/haumea.webp';

const Clock: React.FC = () => {
  // 1. Inject Google Fonts stylesheet automatically on mount
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Hanalei&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      document.head.removeChild(fontLink); // Cleanup on unmount
    };
  }, []);

  const time = useMillisecondClock(16);
  const ms = time.getMilliseconds();

  const { secDeg, minDeg, hourDeg } = useMemo(() => {
    const s = time.getSeconds() + ms / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return {
      secDeg: s * 6,
      minDeg: m * 6,
      hourDeg: h * 30,
    };
  }, [time, ms]);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div style={containerStyle}>
      <video src={bgVideo} autoPlay loop muted playsInline style={videoStyle} />

      {/* Overlay image on top of video */}
      <img src={overlayImage} alt="" style={imageOverlayStyle} />

      {/* Radial gradient overlay - covers background only */}
      <div style={overlayStyle} />

      <div style={clockFaceStyle}>
        {numbers.map((num) => {
          const angle = num * 30 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 38 * Math.cos(rad);
          const y = 50 + 38 * Math.sin(rad);

          return (
            <span
              key={num}
              style={{
                ...numberStyle,
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
              }}
            >
              {num}
            </span>
          );
        })}

        <Hand deg={hourDeg} width="8%" length="25%" color="#FFFFFF45" z={2} />
        <Hand deg={minDeg} width="6%" length="38%" color="#FFFFFF44" z={3} />
        <Hand deg={secDeg} width="4%" length="242%" color="#DF886F" z={4} />

        <div style={centerDotStyle} />
      </div>
    </div>
  );
};

// --- Hand Component & Styles (Remain the same) ---
interface HandProps { deg: number; width: string; length: string; color: string; z: number; }
const Hand: React.FC<HandProps> = ({ deg, width, length, color, z }) => (
  <div style={{
    position: 'absolute', bottom: '50%', left: '50%', width, height: length,
    backgroundColor: color, transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`, zIndex: z, borderRadius: '50%',
  }} />
);

const containerStyle: React.CSSProperties = {
  width: '100vw', height: '100dvh', display: 'flex', justifyContent: 'center',
  alignItems: 'center', backgroundColor: '#000', position: 'relative', overflow: 'hidden',
};
const videoStyle: React.CSSProperties = {
  position: 'absolute', width: 'auto', height: '100%', objectFit: 'contain',
};
const imageOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  pointerEvents: 'none',
  zIndex: 0,
  transform: 'rotate(-90deg)',
  opacity: 0.3,
  zIndex: 4,
};
const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(circle at center,  rgba(95, 225, 56, 0.35) 0%, rgba(180, 156, 89, 0.38) 100%)',
  pointerEvents: 'none',
  zIndex: 1,
};
const clockFaceStyle: React.CSSProperties = {
  position: 'relative', width: '55vh', height: '100vh', borderRadius: '50%',
};
const numberStyle: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  fontFamily: "'Hanalei', cursive",
  fontSize: '9vh',
  color: '#E2725B',
  textShadow: '2px 2px 0 #1B4D3E, -2px -2px 0 #1B4D3E, 2px -2px 0 #1B4D3E, -2px 2px 0 #1B4D3E, 0 0 8px rgba(0,0,0,0.8)',
};
const centerDotStyle: React.CSSProperties = {
  position: 'absolute', top: '50%', left: '50%', width: '152px', height: '42px',
  backgroundColor: '#FFFFFF51', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 10,
};

export default Clock;