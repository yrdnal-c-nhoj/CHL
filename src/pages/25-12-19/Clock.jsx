import React, { useState, useEffect } from 'react';
import sandTexture from './sand.webp';

const FONT_FAMILY = 'DateFont';
const FONT_PATH = '/fonts/hour.ttf';

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
    if (h === 0 || h === 24) return "12AM";
    if (h === 12) return "12PM";
    return h > 12 ? `${h - 12}PM` : `${h}AM`;
  };

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#502956FF',
    margin: 0,
    padding: '1vh',
    boxSizing: 'border-box',
    fontFamily: fontLoaded ? `'${FONT_FAMILY}', monospace` : 'monospace',
    color: '#C8C5C2FF',
    overflow: 'hidden'
  };

  const bulbStyle = {
    position: 'relative',
    width: 'min(70vw, 45vh)',
    height: '45vh',
    backgroundColor: 'rgba(2, 2, 2, 0.9)',
    overflow: 'hidden',
  };

  // Sand style with texture
  const sandStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundImage: `url(${sandTexture})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat',
    transition: 'height 1s linear',
    backgroundColor: '#F5E1CEFF', // Fallback color in case image fails to load
    backgroundBlendMode: 'multiply',
    opacity: 0.9
  };

  const timeLabelStyle = {
    fontSize: 'min(24px, 3.5vh)',
    fontWeight: 'bold',
    padding: '0 10px',
    textAlign: 'center',
    fontFamily: fontLoaded ? `'${FONT_FAMILY}', monospace` : 'monospace',
    letterSpacing: '1px',
    lineHeight: '1.2',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '4px',
  };

  // Render hour markings for top bulb
  // 12AM at top (0%) descending to 12AM next day at bottom (100%)
  const renderTopBulbMarkings = () => {
    const markers = [];
    for (let hour = 0; hour <= 24; hour += 2) {
      const topPosition = (hour / 24) * 100;
      
      markers.push(
        <div
          key={hour}
          style={{
            position: 'absolute',
            top: `${topPosition}%`,
            left: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            mixBlendMode: 'difference',
            transform: 'translateY(-50%)',
          }}
        >
          <div style={{ flex: 1, borderBottom: '1px solid #FD720FFF', opacity: 0.4 }} />
          <span style={timeLabelStyle}>{formatTimeLabel(hour)}</span>
          <div style={{ flex: 1, borderBottom: '1px solid #FD720FFF', opacity: 0.4 }} />
        </div>
      );
    }
    return markers;
  };

  // Render hour markings for bottom bulb
  // 12AM at bottom (100%) ascending to 12AM next day at top (0%)
  const renderBottomBulbMarkings = () => {
    const markers = [];
    for (let hour = 0; hour <= 24; hour += 2) {
      const bottomPosition = (hour / 24) * 100;
      
      markers.push(
        <div
          key={hour}
          style={{
            position: 'absolute',
            bottom: `${bottomPosition}%`,
            left: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            mixBlendMode: 'difference',
            transform: 'translateY(50%)',
          }}
        >
          <div style={{ flex: 1, borderBottom: '1px solid #FD720FFF', opacity: 0.4 }} />
          <span style={timeLabelStyle}>{formatTimeLabel(hour)}</span>
          <div style={{ flex: 1, borderBottom: '1px solid #FD720FFF', opacity: 0.4 }} />
        </div>
      );
    }
    return markers;
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* TOP BULB */}
        <div style={{ ...bulbStyle, clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
          {renderTopBulbMarkings()}
          <div
            style={{
              ...sandStyle,
              height: `${100 - percentDayPassed}%`,
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              backgroundPosition: 'bottom'
            }}
          />
        </div>

        {/* NECK */}
        <div style={{
          height: '2vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mixBlendMode: 'difference'
        }}>
          <div style={{ width: '3px', height: '100%', backgroundColor: '#F5E1CEFF' }} />
        </div>

        {/* BOTTOM BULB */}
        <div style={{ ...bulbStyle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
          {renderBottomBulbMarkings()}
          <div
            style={{
              ...sandStyle,
              height: `${percentDayPassed}%`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              backgroundPosition: 'top'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HourglassTimer;