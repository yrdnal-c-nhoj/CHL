import React, { useState, useEffect } from 'react';

const fontVersion = "2026-03-11";
const FONT_NAME = `SpaceMono_${fontVersion}`;

const BorrowedTimeClock = () => {
  const [time, setTime] = useState(new Date());
  const [imageUrl, setImageUrl] = useState(`https://picsum.photos/800/600?sig=${Math.random()}`);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Update image every second
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
    overflow: 'hidden'
  };

  const imageStyle = {
    width: '85vmin',
    height: '60vmin',
    objectFit: 'cover',
    marginBottom: '4vh',
    border: '1px solid #F2F7F1',
    // filter: 'grayscale(50%) brightness(70%)',
    transition: 'opacity 0.3s ease-in-out'
  };

  const clockStyle = {
    fontFamily: `"${FONT_NAME}", "Space Mono", monospace`,
    fontSize: '12vmin', // Sized down slightly for monospace proportions
    color: '#F7E3E4',
    letterSpacing: '0.05em', // Monospaced fonts often benefit from a bit of breathing room
    fontWeight: '400',
    lineHeight: '1',
    textShadow: '0 0 15px rgba(255, 0, 15, 0.4)'
  };

  return (
    <>
      <style>
        {`
          /* Importing Space Mono from Google Fonts */
          @font-face {
            font-family: "${FONT_NAME}";
            src: url('https://fonts.gstatic.com/s/spacemono/v13/i74Mm-92S6pMwwYfKtRfRErv1zqx.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }

          body {
            margin: 0;
            padding: 0;
            background: #373939;
          }
        `}
      </style>
      
      <div style={containerStyle}>
        <img 
          key={imageUrl} 
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