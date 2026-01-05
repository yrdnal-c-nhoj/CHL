import React, { useState, useEffect } from 'react';
import fontFile from '../../assets/fonts/26-01-02-cram.ttf';

const StretchedClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);

  // Responsive logic: 
  // We use a CSS Media Query via a JS constant to handle the layout switch
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: isLargeScreen ? 'row' : 'column',
    overflow: 'hidden',
    backgroundColor: '#000', // Black background for high contrast
    margin: 0,
    padding: 0,
  };

  const segmentStyle = {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const textStyle = {
    color: '#f222ff',
    fontFamily: 'Cram260102, sans-serif',
    fontWeight: '900',
    lineHeight: '1',
    // These units ensure the font scales with the viewport
    fontSize: isLargeScreen ? '30vw' : '40dvh',
    // This forces the "stretch" effect to fill the container
    transform: 'scale(1.2, 1.5)', 
    width: '100%',
    textAlign: 'center',
    userSelect: 'none',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @font-face {
          font-family: 'Cram260102';
          src: url(${fontFile}) format('truetype');
        }
      `}</style>
      {/* Hours Section */}
      <div style={segmentStyle}>
        <div style={textStyle}>
          {hours}
        </div>
      </div>

      {/* Minutes Section */}
      <div style={segmentStyle}>
        <div style={textStyle}>
          {minutes}
        </div>
      </div>
    </div>
  );
};

export default StretchedClock;