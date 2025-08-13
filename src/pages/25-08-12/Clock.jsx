import React, { useState, useEffect } from 'react';
import customFontUrl from './cubic.ttf'; // local font file in same folder

const faceColors = [
  'rgba(132, 87, 84, 0.75)',
  'rgba(113, 94, 107, 0.75)',
  'rgba(89, 34, 30, 0.75)',
  'rgba(137, 65, 47, 0.75)',
  'rgba(73, 23, 25, 0.75)',
  'rgba(148, 126, 77, 0.75)'
];

const BiteviteHexahedron = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    if (hours === 0) hours = 12;
    if (hours > 12) hours -= 12;
    return `${hours}${minutes.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime();

  // Scoped container styles
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#1F1504FF'
  };

  const perspectiveStyle = {
    position: 'relative',
    width: '25rem',
    height: '25rem',
    perspective: '290rem'
  };

  const cubeStyle = {
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    animation: 'biteviteRotate 120s infinite linear'
  };

  const baseFaceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(0.125rem)'
  };

  const timeDisplayStyle = {
    fontFamily: "'CustomHexFont', 'Courier New', monospace",
    fontSize: '9.5rem',
    background: 'linear-gradient(135deg, #5B3A1A 0%, #7A5230 40%, #3E2A15 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: `
      1px 1px 0 #3b2713,
      -1px -1px 1px #F0E4D5FF,
      2px 2px 2px rgba(0,0,0,0.6),
      -2px -2px 1px rgba(255,255,255,0.05),
      0 0 2px #EAE6E3FF,
      0 1px 3px rgba(0,0,0,0.8),
      0 -1px 2px rgba(255,255,255,0.05)
    `,
    filter: 'contrast(1.2) brightness(0.9)',
    letterSpacing: '0.01em'
  };

  const faceTransforms = {
    front: 'translateZ(12.5rem)',
    back: 'translateZ(-12.5rem) rotateY(180deg)',
    right: 'rotateY(90deg) translateZ(12.5rem)',
    left: 'rotateY(-90deg) translateZ(12.5rem)',
    top: 'rotateX(90deg) translateZ(12.5rem)',
    bottom: 'rotateX(-90deg) translateZ(12.5rem)'
  };

  return (
    <>
      {/* Scoped styles including @font-face */}
      <style jsx>{`
        @font-face {
          font-family: 'CustomHexFont';
          src: url(${customFontUrl}) format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        @keyframes biteviteRotate {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg) rotateZ(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg) rotateZ(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
      `}</style>

      <div style={containerStyle}>
        <div style={perspectiveStyle}>
          <div style={cubeStyle}>
           {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, i) => (
  <div
    key={face}
    style={{
      ...baseFaceStyle,
      transform: faceTransforms[face],
      backgroundColor: faceColors[i]
    }}
  >
    <div style={timeDisplayStyle}>{timeString}</div>

    {/* 3D edges */}
    {/* top edge */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '0.1rem',
      backgroundColor: 'black'
    }} />
    {/* bottom edge */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '0.1rem',
      backgroundColor: 'black'
    }} />
    {/* left edge */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '0.1rem',
      height: '100%',
      backgroundColor: 'black'
    }} />
    {/* right edge */}
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '0.1rem',
      height: '100%',
      backgroundColor: 'black'
    }} />
  </div>
))}

          </div>
        </div>
      </div>
    </>
  );
};

export default BiteviteHexahedron;