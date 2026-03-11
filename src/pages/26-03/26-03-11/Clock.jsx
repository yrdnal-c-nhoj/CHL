import React, { useState, useEffect } from 'react';

const fontVersion = "2026-03-11";
const FONT_NAME = `AbrilFatface_${fontVersion}`;

const BorrowedTimeClock = () => {
  const [time, setTime] = useState(new Date());
  const [imageUrl, setImageUrl] = useState(`https://picsum.photos/800/600?sig=${Math.random()}`);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Update image every second to match your original intent, 
      // but adding a cache-buster sig to ensure it's "new" time.
      setImageUrl(`https://picsum.photos/800/600?sig=${now.getTime()}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }).replace(/:/g, ' ');
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    overflow: 'hidden',
    transition: 'background-color 0.5s ease'
  };

  const imageStyle = {
    width: '85vmin',
    height: '60vmin',
    objectFit: 'cover',
    marginBottom: '4vh',
    border: '0.1vmin solid #333',
    transition: 'opacity 0.3s ease-in-out', // Smoothes the swap
    filter: 'grayscale(30%) brightness(80%)'
  };

  const clockStyle = {
    fontFamily: `"${FONT_NAME}", "Abril Fatface", serif`,
    fontSize: '15vmin',
    color: '#ff000f',
    letterSpacing: '-0.02vw',
    fontWeight: '400',
    lineHeight: '1',
    textShadow: '0 0 20px rgba(255, 0, 15, 0.3)'
  };

  return (
    <>
      <style>
        {`
          /* We define the font name to match your FONT_NAME variable exactly */
          @font-face {
            font-family: "${FONT_NAME}";
            src: url('https://fonts.gstatic.com/s/abrilfatface/v19/z76dPrpfSFFBeS29z4MeQ06XYS-d.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }

          body {
            margin: 0;
            padding: 0;
            background: #000;
          }
        `}
      </style>
      
      <div style={containerStyle}>
        <img 
          key={imageUrl} // Key forces React to treat new URL as a new element for transitions
          src={imageUrl} 
          alt="Generative Stream" 
          style={imageStyle} 
        />
        <div style={clockStyle}>
          {formatTime(time)}
        </div>
      </div>
    </>
  );
};

export default BorrowedTimeClock;