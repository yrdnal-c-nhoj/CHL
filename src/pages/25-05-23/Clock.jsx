import React, { useEffect, useState } from 'react';
import backgroundImage from '../../assets/clocks/25-05-23/blank.jpg';
import crossFont from '../../assets/fonts/25-05-23-Cross.otf';

const CrossClock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Asset Preloading
    const sources = [backgroundImage];
    let loaded = 0;
    
    sources.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === sources.length) {
          setIsLoaded(true);
        }
      };
    });
  }, []);

  useEffect(() => {
    const font = new FontFace('Cross', `url(${crossFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
      setFontsLoaded(true);
    }).catch(() => {
      setFontsLoaded(true);
    });

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Show content after a short delay regardless
    const showTimeout = setTimeout(() => {
      setIsLoaded(true);
      setFontsLoaded(true);
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(showTimeout);
    };
  }, []);

  // Combined loading check
  const everythingLoaded = isLoaded && fontsLoaded;

  if (!everythingLoaded) {
    return (
      <div style={{ 
        height: '100dvh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#fff', 
        background: '#000'
      }}>
      </div>
    );
  }

  const getRandomBrightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 85%, 60%)`; // Good saturation and moderate lightness for actual colors
  };

  const formatTime = () => {
    let hours = time.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return {
      hours: String(hours),
      minutes: String(time.getMinutes()).padStart(2, '0'),
      seconds: String(time.getSeconds()).padStart(2, '0'),
      ampm,
    };
  };

  const { hours, minutes, seconds, ampm } = formatTime();

  const digitStyle = {
    display: 'inline-block',
    width: '0.4em',
    textAlign: 'center',
    transition: 'color 0.3s ease',
    userSelect: 'none',
    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
  };

  const unitStyle = {
    display: 'flex',
    gap: '0.1em',
    justifyContent: 'center',
  };

  const renderUnit = (value) => (
    <div style={unitStyle}>
      {value.split('').map((char, idx) => (
        <span key={idx} style={{ ...digitStyle, color: getRandomBrightColor() }}>
          {char}
        </span>
      ))}
    </div>
  );

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        fontFamily: 'Cross, sans-serif',
      }}
    >
      <style>
        {`
          body { margin: 0; padding: 0; overflow: hidden; background: '#000'; }
        
          /* Ensure smooth transitions */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        
          /* Hide content until ready */
          .clock-content {
            opacity: ${everythingLoaded ? 1 : 0};
            transition: opacity 0.1s ease-in-out;
          }
          
          @font-face {
            font-family: 'Cross';
            src: url(${crossFont}) format('opentype');
          }

          .clock-container {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            font-size: 12rem;
            z-index: 4;
            line-height: 0.7;
          }

          .am-pm {
            font-size: 0.001rem;
            color: transparent;
          }

          @media (max-width: 768px) {
            .clock-container {
              flex-direction: column;
              font-size: 12rem;
              gap: 1rem;
              align-items: center;
            }

            .am-pm {
              font-size: 0.001rem;
              color: transparent;
            }
          }
        `}
      </style>

      <div className="clock-content">
        <img
          src={backgroundImage}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />

        <div className="clock-container" style={{ position: 'relative', zIndex: 5 }}>
          {renderUnit(hours)}
          {renderUnit(minutes)}
          {renderUnit(seconds)}
          <div className="am-pm">{ampm}</div>
        </div>
      </div>
    </div>
  );
};

export default CrossClock;
