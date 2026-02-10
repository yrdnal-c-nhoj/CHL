import React, { useState, useEffect } from 'react';
import sandTexture from '../../../assets/images/25-12-19/sand.webp';

const FONT_FAMILY = 'DateFont';
import FONT_PATH from '../../../assets/fonts/hour.ttf?url';

const HourglassTimer = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [percentDayPassed, setPercentDayPassed] = useState(0);

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(FONT_FAMILY, `url(${FONT_PATH})`);
      try {
        await font.load();
        document.fonts.add(font);
        setFontLoaded(true);
      } catch (error) {
        console.error('Failed to load font:', error);
        setFontLoaded(true);
      }
    };
    loadFont();
  }, []);

  useEffect(() => {
    const updateSand = () => {
      const now = new Date();
      const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      setPercentDayPassed((secondsPassed / 86400) * 100);
    };

    updateSand();
    const interval = setInterval(updateSand, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeLabel = (h) => {
    if (h === 0 || h === 24) return "12";
    if (h === 12) return "12";
    return h > 12 ? `${h - 12}` : `${h}`;
  };

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#382938FF',
    margin: 0,
    padding: '1vh',
    boxSizing: 'border-box',
    fontFamily: fontLoaded ? `'${FONT_FAMILY}', monospace` : 'monospace',
    color: '#C8C5C2FF',
    overflow: 'hidden',
    opacity: fontLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    pointerEvents: fontLoaded ? 'auto' : 'none'
  };

  const bulbStyle = {
    position: 'relative',
    width: 'min(70vw, 45vh)',
    height: '48vh',
    backgroundColor: ' #B8CCDAFF',
    overflow: 'hidden',
  };

  const sandStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundImage: `url(${sandTexture})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat',
    transition: 'height 1s linear',
    // backgroundColor: '#F5E1CEFF',
    backgroundBlendMode: 'multiply',
    // opacity: 0.9,
    backgroundPosition: 'bottom',
    zIndex: 5,
    filter: 'contrast(0.8) brightness(1.3) saturate(1.3)'
  };

  const timeLabelStyle = {
    fontSize: 'min(26px, 3.9vh)',
    // fontWeight: 'bold',
    padding: '0 5px',
    textAlign: 'center',
    fontFamily: fontLoaded ? `'${FONT_FAMILY}', monospace` : 'monospace',
    letterSpacing: '0.1px',
    lineHeight: '1.2',
    // backgroundColor: 'rgba(40,0,0)',
    borderRadius: '4px',
  };

  const bulbMarkings = Array.from({ length: 13 }, (_, i) => i * 2);

  const renderBulbMarkings = (isTopBulb) => {
    return bulbMarkings.map(hour => {
      const position = (hour / 24) * 100;
      return (
        <div key={hour} style={{
          position: 'absolute',
          [isTopBulb ? 'top' : 'bottom']: `${position}%`,
          left: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          transform: `translateY(${isTopBulb ? '-50%' : '50%'})`,
        }}>
          <div style={{ flex: 1, borderBottom: '1px solid #EA3D54FF', opacity: 0.9 }} />
          <span style={{ ...timeLabelStyle, zIndex: 20 }}>{formatTimeLabel(hour)}</span>
          <div style={{ flex: 1, borderBottom: '1px solid #EA3D54FF', opacity: 0.9 }} />
        </div>
      );
    });
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes flow {
          0% { background-position: 0 0; }
          100% { background-position: 0 50px; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TOP BULB */}
        <div style={{ ...bulbStyle, clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
          <div style={{ ...sandStyle, height: `${100 - percentDayPassed}%` }} />
          {renderBulbMarkings(true)}
        </div>

        {/* DYNAMIC NECK & STREAM */}
        <div style={{
          height: '1vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'visible'
        }}>
          {/* The constant stream of falling sand */}
          <div style={{
            width: '4px',
            height: '46vh', // Reaches into the bottom bulb
            position: 'absolute',
            top: 0,
            backgroundImage: `url(${sandTexture})`,
            backgroundSize: '10px 50px',
            backgroundColor: '#ECE7E1FF',
            backgroundBlendMode: 'multiply',
            animation: 'flow 0.5s linear infinite',
            zIndex: 1,

    filter: 'contrast(0.8) brightness(1.3) saturate(1.3)'

            // boxShadow: '0 0 5px rgba(245, 225, 206, 0.9)'
          }} />
        </div>

        {/* BOTTOM BULB */}
        <div style={{ ...bulbStyle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
          <div style={{ ...sandStyle, height: `${percentDayPassed}%` }} />
          {renderBulbMarkings(false)}
        </div>

      </div>
    </div>
  );
};

export default HourglassTimer;
