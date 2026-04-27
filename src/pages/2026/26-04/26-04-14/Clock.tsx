import React, { useMemo } from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';

// Asset imports
import bgVideo from '@/assets/images/2026/26-04/26-04-14/haumeas.mp4';
import overlayImage from '@/assets/images/2026/26-04/26-04-14/haumea.webp';

// Export assets for preloading
export { bgVideo, overlayImage };

const Clock: React.FC = () => {
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

  // Container
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  };

  // Video background
  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: '42%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: '80%',
    objectFit: 'cover',
  };

  // Overlay image
  const imageOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100vh',
    height: '100vw',
    objectFit: 'cover',
    pointerEvents: 'none',
    zIndex: 0,
    transform: 'translate(-50%, -50%) rotate(-90deg)',
    opacity: 0.15,
  };

  // Radial gradient overlay
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(95, 225, 56, 0.35) 0%, rgba(180, 156, 89, 0.38) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  };

  // Clock face
  const clockFaceStyle: React.CSSProperties = {
    position: 'relative',
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
    zIndex: 2,
  };

  // Number style
  const getNumberStyle = (x: number, y: number, rot: number): React.CSSProperties => ({
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${rot}deg)`,
    fontFamily: "'Hanalei', 'Arial Black', system-ui, fantasy",
    fontSize: '9vh',
    fontWeight: 400,
    color: '#e2725b',
    textShadow: `
      2px 2px 0 #1b4d3e,
      -2px -2px 0 #1b4d3e,
      2px -2px 0 #1b4d3e,
      -2px 2px 0 #1b4d3e,
      0 0 12px rgba(0, 0, 0, 0.9)
    `,
    userSelect: 'none',
    WebkitFontSmoothing: 'antialiased',
  });

  // Hand style generator
  const getHandStyle = (
    deg: number,
    width: string,
    height: string,
    bgColor: string,
    zIndex: number
  ): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    borderRadius: '50% 50% 0 0',
    width,
    height,
    backgroundColor: bgColor,
    zIndex,
    boxShadow: '0 0 8px rgba(255,255,255,0.3)',
  });

  // Center dot
  const centerDotStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '5%',
    height: '5%',
    backgroundColor: '#e2725b',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 0 12px #e2725b',
  };

  return (
    <main style={containerStyle}>
      {/* Font Face Definition */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Hanalei&display=swap');
          `,
        }}
      />

      {/* Background Video */}
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        style={videoStyle}
      />

      {/* Overlay Image */}
      <img
        src={overlayImage}
        alt=""
        style={imageOverlayStyle}
      />

      {/* Radial Gradient Overlay */}
      <div style={overlayStyle} />

      {/* Clock */}
      <time style={clockFaceStyle} dateTime={time.toISOString()}>
        {numbers.map((num) => {
          const angle = num * 30 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 38 * Math.cos(rad);
          const y = 50 + 38 * Math.sin(rad);
          const rot = angle + 90;

          return (
            <span
              key={num}
              style={getNumberStyle(x, y, rot)}
            >
              {num}
            </span>
          );
        })}

        {/* Hour Hand */}
        <div style={getHandStyle(hourDeg, '15%', '45%', '#ffffff45', 2)} />

        {/* Minute Hand */}
        <div style={getHandStyle(minDeg, '16%', '78%', '#ffffff44', 3)} />

        {/* Second Hand */}
        <div style={getHandStyle(secDeg, '1%', '242%', '#FFFFFF6E', 4)} />

        {/* Center Dot */}
        <div style={centerDotStyle} />
      </time>
    </main>
  );
};

export default Clock;