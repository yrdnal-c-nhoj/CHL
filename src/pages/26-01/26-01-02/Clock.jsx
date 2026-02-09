import React, { useState, useEffect } from 'react';
import fontFile from '../../../assets/fonts/26-01-02-cram.ttf';
import backgroundImage from '../../../assets/clocks/26-01-02/brick.webp';

const StretchedClock = () => {
  const [time, setTime] = useState(new Date());
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
  const [fontReady, setFontReady] = useState(false);
  const [bgReady, setBgReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Load font & background to avoid FOUC
  useEffect(() => {
    let cancelled = false;

    document.fonts
      .load("1em 'Cram260102'")
      .then(() => !cancelled && setFontReady(true))
      .catch(() => !cancelled && setFontReady(true));

    const img = new Image();
    const done = () => !cancelled && setBgReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = backgroundImage;
    const timeout = setTimeout(done, 1200);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: isLargeScreen ? 'row' : 'column',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    backgroundColor: '#C9C7AF',
    opacity: fontReady && bgReady ? 1 : 0,
    visibility: fontReady && bgReady ? 'visible' : 'hidden',
    transition: 'opacity 0.35s ease',
  };

  const segmentStyle = {
    position: 'relative', // Required for the absolute pseudo-element background
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const textStyle = {
    position: 'relative', // Ensures text stays above the background layer
    zIndex: 2,
    color: '#FFD505',
    fontFamily: 'Cram260102, sans-serif',
    lineHeight: '1',
    fontSize: isLargeScreen ? '25vw' : '35dvh',
    transform: 'scale(1.2, 1.5)',
    width: '100%',
    textAlign: 'center',
    userSelect: 'none',
    textShadow: '2px 2px 10px rgba(0,0,0,0.2), 1vh 1vh 0px #FF00FF',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @font-face {
          font-family: 'Cram260102';
          src: url(${fontFile}) format('truetype');
        }

        body { margin: 0; padding: 0; }

        /* The background layer with the filter applied */
        .filtered-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(0.8) contrast(3.9) saturate(0.6);
          z-index: 1;
        }
      `}</style>
      
      {/* Hours Section */}
      <div style={segmentStyle} className="filtered-bg">
        <div style={textStyle}>
          {hours}
        </div>
      </div>

      {/* Minutes Section */}
      <div style={segmentStyle} className="filtered-bg">
        <div style={textStyle}>
          {minutes}
        </div>
      </div>
    </div>
  );
};

export default StretchedClock;
