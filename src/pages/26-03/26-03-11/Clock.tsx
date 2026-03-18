import React, { useState, useEffect } from 'react';

const fontVersion = '2026-03-11';
const FONT_NAME = `XanhMono_${fontVersion}`;

const BorrowedTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [imageUrl, setImageUrl] = useState(
    `https://picsum.photos/800/600?sig=${Date.now()}`,
  );
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      // Fade out
      setOpacity(0);

      setTimeout(() => {
        setImageUrl(`https://picsum.photos/800/600?sig=${now.getTime()}`);
        setOpacity(1);
      }, 200);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date
      .toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/:/g, ' ');
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    padding:
      'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    boxSizing: 'border-box',
    gap: '2vmin',
  };

  const imageStyle = {
    width: 'min(75vmin, 75%)',
    height: 'min(56.25vmin, 37.5vh)',
    maxWidth: '500px',
    maxHeight: '375px',
    objectFit: 'cover',
    border: '1px solid #F2F7F1',
    transition: 'opacity 0.3s ease',
    opacity: opacity,
    flexShrink: 0,
  };

  const clockStyle = {
    fontFamily: `"${FONT_NAME}", "Xanh Mono", monospace`,
    fontSize: 'min(15vmin, 16vw)',
    color: '#F7E3E4',
    letterSpacing: '0.05em',
    fontWeight: '400',
    lineHeight: '1',
    textShadow: '0 0 15px rgba(255,0,15,0.4)',
    textAlign: 'center',
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Xanh+Mono:ital@0;1&display=swap');

        body {
          margin:0;
          padding:0;
          background:#676B6B;
          height:100dvh;
          width:100vw;
          overflow:hidden;
          -webkit-text-size-adjust:100%;
          -webkit-tap-highlight-color:transparent;
        }

        html{
          height:100dvh;
          width:100vw;
          overflow:hidden;
        }
      `}
      </style>

      <div style={containerStyle}>
        <img src={imageUrl} alt="Generative Stream" style={imageStyle} />

        <div style={clockStyle}>{formatTime(time)}</div>
      </div>
    </>
  );
};

export default BorrowedTimeClock;
