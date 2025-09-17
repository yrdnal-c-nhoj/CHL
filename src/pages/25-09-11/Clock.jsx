import React, { useState, useEffect } from 'react';
import medievalFont from './ren.ttf';
import backgroundImage from './ren.jpg';
import MedievalSVG from './MedievalSVG';

const MedievalBanner = () => {
  const [time, setTime] = useState(new Date());
  const [isReady, setIsReady] = useState(false);

  // keep clock ticking
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // preload font + background
  useEffect(() => {
    let fontLoaded = false;
    let imageLoaded = false;

    const checkReady = () => {
      if (fontLoaded && imageLoaded) setIsReady(true);
    };

    // load font using FontFace API
    const font = new FontFace('ClockFont', `url(${medievalFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      fontLoaded = true;
      checkReady();
    });

    // load background image
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

  if (!isReady) {
    // black screen until everything is loaded
    return (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          backgroundColor: 'black',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
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
          filter: 'brightness(1.7) saturate(0.1)',
          transform: 'scaleX(-1)',
        }}
      />

      {/* Medieval SVG */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: 0,
          width: '100vw',
          height: '125dvh',
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
          fontFamily: 'ClockFont, monospace',
          fontSize: '12dvh',
          background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFF8DC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em',
          textShadow: `
            0 0 5px #fff8dc,
            0 0 10px #FFD700,
            0 0 15px #FFA500,
            0 0 20px #FFD700
          `,
          animation: 'sparkle 1.5s infinite alternate',
        }}
      >
        {hours}{minutes}
      </div>

      {/* Sparkle animation */}
      <style>
        {`
          @keyframes sparkle {
            0% { text-shadow: 0 0 5px #fff8dc, 0 0 10px #FFD700, 0 0 15px #FFA500, 0 0 20px #FFD700; }
            50% { text-shadow: 0 0 10px #fff8dc, 0 0 20px #FFD700, 0 0 30px #FFA500, 0 0 40px #FFD700; }
            100% { text-shadow: 0 0 5px #fff8dc, 0 0 10px #FFD700, 0 0 15px #FFA500, 0 0 20px #FFD700; }
          }
        `}
      </style>
    </div>
  );
};

export default MedievalBanner;
