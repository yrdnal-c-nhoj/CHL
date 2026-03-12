import React, { useState, useEffect } from 'react';

const fontVersion = "2026-03-11";
const FONT_NAME = `XanhMono_${fontVersion}`;

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
    height: '100dvh', // Use dynamic viewport height for better mobile support
    backgroundColor: '#000',
    overflow: 'hidden',
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    minHeight: '-webkit-fill-available', // Fallback for older browsers
    boxSizing: 'border-box'
  };

  const imageStyle = {
    width: 'min(85vmin, 85%)',
    height: 'min(60vmin, 40vh)',
    maxWidth: '600px',
    maxHeight: '400px',
    objectFit: 'cover',
    marginBottom: '3vmin',
    border: '1px solid #F2F7F1',
    // filter: 'grayscale(50%) brightness(70%)',
    transition: 'opacity 0.3s ease-in-out'
  };

  const clockStyle = {
    fontFamily: `"${FONT_NAME}", "Xanh Mono", monospace`,
    fontSize: 'min(12vmin, 8vw)', // More responsive sizing
    color: '#F7E3E4',
    letterSpacing: '0.05em', // Monospaced fonts often benefit from a bit of breathing room
    fontWeight: '400',
    lineHeight: '1',
    textShadow: '0 0 15px rgba(255, 0, 15, 0.4)',
    textAlign: 'center'
  };

  return (
    <>
      <style>
        {`
          /* Importing Xanh Mono from Google Fonts */
          @import url('https://fonts.googleapis.com/css2?family=Xanh+Mono:ital@0;1&display=swap');

          body {
            margin: 0;
            padding: 0;
            background: #373939;
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
          }
          
          html {
            height: 100dvh;
            width: 100vw;
            overflow: hidden;
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