import React, { useState, useEffect } from 'react';
import customFont from './anim.ttf';
import bgImage from './anim.jpg';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());
  const [isHorizontal, setIsHorizontal] = useState(window.innerWidth >= 768);
  const [fontLoaded, setFontLoaded] = useState(false); // <-- track font load

  useEffect(() => {
    // Load custom font before showing content
    const font = new FontFace('CustomClockFont', `url(${customFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true); // font is ready
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevTime(time);
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const handleResize = () => setIsHorizontal(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const pad = (num) => String(num).padStart(2, '0');
    return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
  };

  const current = formatTime(time);
  const previous = formatTime(prevTime);
  const replaceNine = (str) => str.replace(/9/g, 'q');

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: fontLoaded ? 'CustomClockFont' : 'sans-serif', // <-- fallback
    visibility: fontLoaded ? 'visible' : 'hidden', // hide until font ready
  };

  const rowStyle = { display: 'flex' };
  const digitBoxStyle = {
    padding: '1rem 1.2rem',
    fontSize: '6rem',
    minWidth: '4rem',
    minHeight: '4rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };
  const digitStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `
      linear-gradient(
        to bottom,
        rgba(20,20,20,0.9) 15%,  
        rgba(128,128,128,0.9) 40%,     
        rgba(128,128,128,0.9) 50%, 
        rgba(225,225,255,0.9) 85%,
        white 90%, 
        white 100%
      )
    `,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    opacity: 0.8,
  };

  const renderRow = (currentStr, previousStr, boxStyle) =>
    replaceNine(currentStr)
      .split('')
      .map((digit, idx) => (
        <div key={idx} style={{ ...boxStyle, position: 'relative' }}>
          <div style={digitStyle}>{digit}</div>
        </div>
      ));

  return (
    <div style={containerStyle}>
      {/* Hours */}
      <div style={rowStyle}>{renderRow(current.hours, previous.hours, digitBoxStyle)}</div>

      {/* Minutes */}
      <div style={rowStyle}>{renderRow(current.minutes, previous.minutes, digitBoxStyle)}</div>

      {/* Seconds */}
      <div style={rowStyle}>{renderRow(current.seconds, previous.seconds, digitBoxStyle)}</div>
    </div>
  );
};

export default DigitalClock;
