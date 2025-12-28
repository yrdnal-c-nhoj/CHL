import React, { useState, useEffect } from 'react';

// Font configuration
const FONT_FAMILY = 'DateFont';
const FONT_PATH = '/fonts/hour.ttf';

const HourglassTimer = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [percentDayPassed, setPercentDayPassed] = useState(0);

  // Load custom font
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(FONT_FAMILY, `url(${FONT_PATH})`);
      try {
        await font.load();
        document.fonts.add(font);
        setFontLoaded(true);
      } catch (error) {
        console.error('Failed to load font:', error);
        setFontLoaded(true); // Continue with fallback font
      }
    };
    
    loadFont();
  }, []);

  useEffect(() => {
    const updateSand = () => {
      const now = new Date();
      const secondsInDay = 86400;
      const secondsPassed = 
        (now.getHours() * 3600) + 
        (now.getMinutes() * 60) + 
        now.getSeconds();
      
      setPercentDayPassed((secondsPassed / secondsInDay) * 100);
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

  // Using vh (viewport height) to ensure it never exceeds the screen height
  const bulbStyle = {
    position: 'relative',
    width: 'min(70vw, 45vh)', // Scales based on which dimension is smaller
    height: '45vh', 
    backgroundColor: 'rgba(2, 2, 2)',
    overflow: 'hidden',
  };

  const renderMarkings = (isTopBulb) => {
    const markers = [];
    // Hourly markings
    for (let i = 0; i <= 24; i += 2) {
      const position = (i / 24) * 100;
      const displayPos = isTopBulb ? (100 - position) : position;

      markers.push(
        <div key={i} style={{
          position: 'absolute',
          bottom: `${displayPos}%`,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
        }}>
          <div style={{ flex: 1, borderBottom: '1px solid #FD720FFF', opacity: 0.4 }} />
          <span style={{ 
            ...timeLabelStyle
          }}>
            {formatTimeLabel(i)}
          </span>
          <div style={{ flex: 1, borderBottom: '1px solid #FD720FFF', opacity: 0.4 }} />
        </div>
      );
    }
    return markers;
  };

  const sandColor = '#F5E1CEFF';
  
  // Update the time label style to use the custom font
  const timeLabelStyle = {
    fontSize: 'min(24px, 3.5vh)',  // Increased from 14px/2.2vh to 24px/3.5vh
    fontWeight: 'bold',
    padding: '0 8px',  // Slightly more padding to accommodate larger text
    textAlign: 'center',
    fontFamily: fontLoaded ? `'${FONT_FAMILY}', monospace` : 'monospace',
    letterSpacing: '1px',
    lineHeight: '1.2'  // Added for better vertical alignment
  };

  return (
    <div style={containerStyle}>
    
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* TOP BULB */}
        <div style={{ ...bulbStyle, clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
          {renderMarkings(true)}
          <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: `${100 - percentDayPassed}%`,
            backgroundColor: sandColor,
            transition: 'height 1s linear'
          }} />
        </div>

        {/* NECK */}
        <div style={{ 
          height: '2vh', 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          mixBlendMode: 'difference' 
        }}>
          <div style={{ width: '2px', height: '100%', backgroundColor: sandColor }} />
        </div>

        {/* BOTTOM BULB */}
        <div style={{ ...bulbStyle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
          {renderMarkings(false)}
          <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: `${percentDayPassed}%`,
            backgroundColor: sandColor,
            transition: 'height 1s linear'
          }} />
        </div>

      </div>

     
    </div>
  );
};

export default HourglassTimer;