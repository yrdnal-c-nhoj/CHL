import React, { useState, useEffect } from 'react';

const HourglassTimer = () => {
  const [percentDayPassed, setPercentDayPassed] = useState(0);

  useEffect(() => {
    const updateSand = () => {
      const now = new Date();
      const totalSecondsInDay = 86400;
      const secondsPassed = 
        (now.getHours() * 3600) + 
        (now.getMinutes() * 60) + 
        now.getSeconds();
      
      // Calculate how much sand should be in the bottom (0 to 100)
      setPercentDayPassed((secondsPassed / totalSecondsInDay) * 100);
    };

    updateSand();
    const interval = setInterval(updateSand, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inline Style Objects to avoid leakage
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 0,
    overflow: 'hidden',
    fontFamily: 'sans-serif'
  };

  const frameStyle = {
    position: 'relative',
    width: '30vw',
    height: '60vh',
    border: '0.5vh solid #d4af37',
    borderRadius: '2vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1vh'
  };

  const glassBulbStyle = {
    position: 'relative',
    width: '100%',
    height: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)', // Top Bulb Shape
    overflow: 'hidden'
  };

  const bottomBulbStyle = {
    ...glassBulbStyle,
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', // Bottom Bulb Shape
  };

  const topSandStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: `${100 - percentDayPassed}%`,
    backgroundColor: '#edc9af',
    transition: 'height 1s linear'
  };

  const bottomSandStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: `${percentDayPassed}%`,
    backgroundColor: '#edc9af',
    transition: 'height 1s linear'
  };

  const streamStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0.5vw',
    height: '10%',
    backgroundColor: '#edc9af',
    zIndex: 2,
    display: percentDayPassed < 100 ? 'block' : 'none'
  };

  const timeLabelStyle = {
    color: '#d4af37',
    marginTop: '2vh',
    fontSize: '2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={frameStyle}>
        {/* Top Bulb */}
        <div style={glassBulbStyle}>
          <div style={topSandStyle} />
        </div>

        {/* Falling Sand Stream */}
        <div style={streamStyle} />

        {/* Bottom Bulb */}
        <div style={bottomBulbStyle}>
          <div style={bottomSandStyle} />
        </div>
      </div>

     
      
   
    </div>
  );
};

export default HourglassTimer;