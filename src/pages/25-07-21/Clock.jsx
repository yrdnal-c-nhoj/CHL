import React, { useEffect, useState } from 'react';
import anglerfishIdle from './anglerfish-gif_anglerfish_idle_swim.webp';
import anglerfishFuse from './Deep-Sea-Anglerfish-Fuse.webp';
import patternOverlay from './qsxwwd.webp';
import spinGif from './spin.gif';

const AnglerfishClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      hours = hours % 24;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours} ${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      height: '100dvh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#093063',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Overlays */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${anglerfishIdle})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '100% 100%',
        opacity: 0.9,
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${anglerfishFuse})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '100% 100%',
        opacity: 0.4,
        zIndex: 2,
      }} />
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${patternOverlay})`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center center',
        backgroundSize: '33% 33%',
        opacity: 0.4,
        zIndex: 4,
      }} />
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${spinGif})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        transform: 'scaleX(-1)',
        opacity: 0.3,
        zIndex: 5,
      }} />

      {/* Clock content */}
      <div style={{
        fontFamily: "'Barriecito', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
        fontSize: '14rem',
        whiteSpace: 'nowrap',
        background: 'linear-gradient(90deg, #369b91, #0e8c68, #711579)',
        backgroundSize: '75%',
        backgroundRepeat: 'no-repeat',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'animate 3s linear infinite',
        opacity: 0.3,
        zIndex: 9,
        position: 'relative',
      }}>
        {time}
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes animate {
            0% { background-position: -500%; }
            50% { background-position: 500%; }
            100% { background-position: 100%; }
          }

          @media (min-aspect-ratio: 1/1) {
            div[style*="Barriecito"] {
              font-size: calc(100vw / 5);
              transform: scaleY(calc(100vh / (10 * 1em)));
            }
          }

          @media (max-aspect-ratio: 1/1) {
            div[style*="Barriecito"] {
              font-size: calc(100vh / 5);
              transform: scaleX(calc(100vw / (10 * 1em)));
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnglerfishClock;
