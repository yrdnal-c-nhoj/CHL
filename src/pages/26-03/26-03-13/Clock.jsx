import React, { useState, useEffect } from 'react';
import veniceFont from '../../../assets/fonts/26-03-13-venice.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'P.M.' : 'A.M.';
    h = h % 12 || 12; // Convert to 12-hour format, 0 becomes 12
    return `${h}:${m} ${ampm}`;
  };

  const createVideoTiles = () => {
    const tiles = [];
    const tileWidth = 560;
    const tileHeight = 315;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate center position in pixels
    const centerPixelX = screenWidth / 2;
    const centerPixelY = screenHeight / 2;
    
    // Calculate how many tiles needed in each direction from center
    const tilesLeft = Math.ceil(centerPixelX / tileWidth) + 1;
    const tilesRight = Math.ceil((screenWidth - centerPixelX) / tileWidth) + 1;
    const tilesUp = Math.ceil(centerPixelY / tileHeight) + 1;
    const tilesDown = Math.ceil((screenHeight - centerPixelY) / tileHeight) + 1;
    
    // Start from center (0,0) and work outward
    for (let row = -tilesUp; row <= tilesDown; row++) {
      for (let col = -tilesLeft; col <= tilesRight; col++) {
        // Calculate position relative to center
        const x = centerPixelX + (col * tileWidth);
        const y = centerPixelY + (row * tileHeight);
        
        tiles.push(
          <iframe
            key={`${row}-${col}`}
            className="video-tile"
            src="https://www.youtube.com/embed/EO_1LWqsCNE?autoplay=1&mute=1&loop=1&playlist=EO_1LWqsCNE&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0&hl=en&enablejsapi=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{
              position: 'absolute',
              top: `${y}px`,
              left: `${x}px`,
              width: `${tileWidth}px`,
              height: `${tileHeight}px`,
              transform: 'translate(-50%, -50%)', // Center each tile on its position
            }}
          />
        );
      }
    }
    return tiles;
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'VeniceFont';
        src: url('${veniceFont}') format('truetype');
        font-display: swap;
      }
      @keyframes venice-rainbow {
        0%, 100% {
          background-position: 0% 50%;
          filter: drop-shadow(0 0 15px rgba(255,105,180,0.8)) drop-shadow(0 0 30px rgba(0,255,255,0.6));
        }
        25% {
          background-position: 25% 50%;
          filter: drop-shadow(0 0 20px rgba(255,0,255,0.8)) drop-shadow(0 0 40px rgba(255,215,0,0.6));
        }
        50% {
          background-position: 50% 50%;
          filter: drop-shadow(0 0 25px rgba(0,255,0,0.8)) drop-shadow(0 0 50px rgba(255,69,0,0.6));
        }
        75% {
          background-position: 75% 50%;
          filter: drop-shadow(0 0 20px rgba(255,215,0,0.8)) drop-shadow(0 0 40px rgba(138,43,226,0.6));
        }
      }
      .venice-clock {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      .venice-clock.loaded {
        opacity: 1;
      }
      .video-tile {
        position: absolute;
        top: 0;
        left: 0;
        width: 560px;
        height: 315px;
        border: none;
        outline: none;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
    `;
    document.head.appendChild(style);

    // Preload the font
    const font = new FontFace('VeniceFont', `url('${veniceFont}') format('truetype')`);
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    }).catch(() => {
      // Fallback if font fails to load
      setFontLoaded(true);
    });

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#000'
    }}>
      {createVideoTiles()}
      <div className={`venice-clock ${fontLoaded ? 'loaded' : ''}`} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'VeniceFont, monospace',
        fontSize: 'clamp(3rem, 10vw, 8rem)',
        color: '#ffffff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.5)',
        zIndex: 10,
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.2em'
      }}>
        <div style={{
          fontSize: 'clamp(3rem, 10vw, 8rem)',
          textShadow: '3px 3px 6px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,215,0,0.3)',
          background: 'linear-gradient(45deg, #ffffff, #ffd700, #ff69b4, #00ffff, #ff1493, #00ff00, #ff4500, #9400d3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))'
        }}>
          {formatTime(time).split(' ')[0]}
        </div>
        <div style={{
          fontSize: 'clamp(3rem, 10vw, 8rem)',
          textShadow: '3px 3px 6px rgba(0,0,0,0.8), 0 0 30px rgba(255,105,180,0.8), 0 0 60px rgba(0,255,255,0.6), 0 0 90px rgba(255,215,0,0.4), 0 0 120px rgba(138,43,226,0.3)',
          background: 'linear-gradient(90deg, #ff1493, #ff69b4, #ff00ff, #00ffff, #00ff00, #ffff00, #ff4500, #ff1493, #9400d3, #4b0082, #ff1493)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.2em',
          fontWeight: '900',
          transform: 'scaleY(1.2)',
          filter: 'drop-shadow(0 0 15px rgba(255,105,180,0.8)) drop-shadow(0 0 30px rgba(0,255,255,0.6))',
          animation: 'venice-rainbow 3s ease-in-out infinite'
        }}>
          {formatTime(time).split(' ')[1]}
        </div>
      </div>
    </div>
  );
};

export default Clock;
