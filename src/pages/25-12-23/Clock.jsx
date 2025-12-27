import React, { useState, useEffect } from 'react';

// Font configuration
const FONT_FAMILY = 'ForgotFont';
const FONT_PATH = '/fonts/25-12-23-forgot.ttf';

const RefactoredCentricClock = () => {
  // Load custom font
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(FONT_FAMILY, `url(${FONT_PATH})`);
      try {
        await font.load();
        document.fonts.add(font);
      } catch (error) {
        console.error('Failed to load font:', error);
      }
    };
    
    loadFont();
  }, []);
  const [now, setNow] = useState(new Date());
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 16);
    return () => clearInterval(timer);
  }, []);

  const msInCycle = (Date.now() - startTime) % 70000;
  const isErasing = msInCycle < 60000;
  const isWaiting = msInCycle >= 60000 && msInCycle < 70000;

  const trueSeconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const trueMinutes = now.getMinutes() + trueSeconds / 60;
  const trueHours = (now.getHours() % 12) + trueMinutes / 60;

  const initialSecondAtStart = (new Date(startTime).getSeconds() + new Date(startTime).getMilliseconds() / 1000);
  const startAngle = initialSecondAtStart * 6;
  const sweepProgressDegrees = (msInCycle / 60000) * 360;
  const currentEraserAngle = (startAngle + sweepProgressDegrees) % 360;

  const clockOpacity = msInCycle > 68000 ? (msInCycle - 68000) / 2000 : 1;

  // Base style for centering anything within the clock face
  const absoluteCenter = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: `'${FONT_FAMILY}', monospace`,
    overflow: 'hidden',
  };

  const faceStyle = {
    width: '85vmin',
    height: '85vmin',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'relative',
    opacity: clockOpacity,
    transition: msInCycle < 500 ? 'none' : 'opacity 0.8s ease-in-out',
  };

  const handStyle = (angle, width, length, color, zIndex) => ({
    ...absoluteCenter,
    width: `${width}vmin`,
    height: `${length}vmin`,
    backgroundColor: color,
    // We translate back by -50% horizontally, and adjust the vertical transform 
    // to pivot from the bottom of the hand (the center of the clock)
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    transformOrigin: 'bottom center',
    zIndex: zIndex,
    borderRadius: '1vmin',
  });

  const tickContainerStyle = (i) => ({
    ...absoluteCenter,
    width: '100%',
    height: '100%',
    transform: `translate(-50%, -50%) rotate(${i * 6}deg)`,
    zIndex: 1,
  });

  const numberContainerStyle = (i) => ({
    ...absoluteCenter,
    width: '100%',
    height: '100%',
    transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
    zIndex: 2,
  });

  return (
    <div style={containerStyle}>
      <div style={faceStyle}>
        
        {/* Ticks - Centered by rotating full-size transparent containers */}
        {[...Array(60)].map((_, i) => (
          <div key={`tick-${i}`} style={tickContainerStyle(i)}>
            <div style={{
              margin: '0 auto',
              backgroundColor: 'black',
              width: i % 5 === 0 ? '0.6vmin' : '0.2vmin',
              height: i % 5 === 0 ? '4vmin' : '2vmin',
            }} />
          </div>
        ))}

        {/* Numbers - Positioned at the top of a full-rotation container */}
        {[...Array(12)].map((_, i) => (
          <div key={`num-${i + 1}`} style={numberContainerStyle(i + 1)}>
            <div style={{
              textAlign: 'center',
              marginTop: '4vmin', // Padding from the edge
              fontSize: '8vmin',
              color: 'blue',
              transform: `rotate(${(i + 1) * -30}deg)`, // Keep numbers upright
            }}>
              {i + 1}
            </div>
          </div>
        ))}

        {/* Hands */}
        <div style={handStyle(trueHours * 30, 2, 22, 'black', 3)} />
        <div style={handStyle(trueMinutes * 6, 1.2, 35, 'black', 4)} />

        {/* Eraser Mask */}
        <div style={{
          ...absoluteCenter,
          width: '101%', // Slight overlap to prevent sub-pixel gaps
          height: '101%',
          borderRadius: '50%',
          zIndex: 10,
          background: isWaiting 
            ? 'white' 
            : `conic-gradient(from ${startAngle}deg, white 0deg, white ${sweepProgressDegrees}deg, transparent ${sweepProgressDegrees}deg)`,
        }} />

        {/* Second Hand Eraser Edge */}
        {isErasing && (
          <div style={handStyle(currentEraserAngle, 0.2, 42.5, 'red', 11)} />
        )}

        {/* Center Pin - Perfectly Centered */}
        <div style={{
          ...absoluteCenter,
          width: '3vmin',
          height: '3vmin',
          backgroundColor: 'red',
          borderRadius: '50%',
          zIndex: 12,
          border: '0.5vmin solid white'
        }} />
      </div>
    </div>
  );
};

export default RefactoredCentricClock;