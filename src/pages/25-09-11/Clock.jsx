import React, { useState, useEffect } from 'react';
import medievalFont from './ren.ttf';
import backgroundImage from './ren.jpg';
import MedievalSVG from './MedievalSVG';

const MedievalBanner = () => {
  const [time, setTime] = useState(new Date());
  const [isReady, setIsReady] = useState(false);

  // Clock ticking
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Preload font, background image, and optionally SVG
  useEffect(() => {
    let fontLoaded = false;
    let imageLoaded = false;

    const checkReady = () => {
      if (fontLoaded && imageLoaded) setIsReady(true);
    };

    // Load font
    const font = new FontFace('ClockFont_25_09_18', `url(${medievalFont})`);
    font.load().then(() => {
      document.fonts.add(font); // Make sure it’s usable in the page
      fontLoaded = true;
      checkReady();
    });

    // Load background image
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      imageLoaded = true;
      checkReady();
    };
  }, []);

  const formatTime = (date) => {
    const hours = (date.getHours() % 12 || 12).toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);

  // Show nothing until everything is loaded
  if (!isReady) return null;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'black', // fallback while rendering
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          transform: 'scaleX(-1)', // <-- flips horizonta
          filter: 'brightness(1.7) saturate(0.1)',
        }}
      />

      {/* Medieval SVG */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100dvh',
          zIndex: 2,
        }}
      >
        <MedievalSVG />
      </div>

      {/* Centered Clock */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12dvh',
          background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFF8DC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em',
          textShadow: `
            0 0 0.5rem #fff8dc,
            0 0 1rem #FFD700,
            0 0 1.5rem #FFA500,
            0 0 2rem #FFD700
          `,
          animation: 'sparkle 1.5s infinite alternate',
          fontFamily: 'ClockFont_25_09_18, monospace',
        }}
      >
        <style>
          {`
            @keyframes sparkle {
              0% { text-shadow: 0 0 0.5rem #fff8dc, 0 0 1rem #FFD700, 0 0 1.5rem #FFA500, 0 0 2rem #FFD700; }
              50% { text-shadow: 0 0 1rem #fff8dc, 0 0 2rem #FFD700, 0 0 3rem #FFA500, 0 0 4rem #FFD700; }
              100% { text-shadow: 0 0 0.5rem #fff8dc, 0 0 1rem #FFD700, 0 0 1.5rem #FFA500, 0 0 2rem #FFD700; }
            }
          `}
        </style>
        {hours}{minutes}
      </div>
    </div>
  );
};

export default MedievalBanner;
