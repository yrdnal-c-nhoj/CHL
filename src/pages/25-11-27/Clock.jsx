import React, { useState, useEffect } from 'react';
import revolutionFont from "./french.ttf"; 
import lineFont from './dec.ttf';
import backgroundImg from "./fr.jpg";      
import hourHandImg from "./fre.webp";      
import minuteHandImg from "./fren.webp";   
import secondHandImg from "./fren.png";   

// --- Font Setup ---
const fontFaceRevolution = `
  @font-face {
    font-family: 'RevolutionaryClockFont';
    src: url(${revolutionFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const fontFaceLine = `
  @font-face {
    font-family: 'LineFont';
    src: url(${lineFont}) format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

export default function Clock() {
  const [time, setTime] = useState(new Date());

  // Inject fonts into document head
  useEffect(() => {
      const styleTagIdRev = 'revolution-font-style';
      if (!document.getElementById(styleTagIdRev)) {
          const style = document.createElement('style');
          style.id = styleTagIdRev;
          style.innerHTML = fontFaceRevolution;
          document.head.appendChild(style);
      }

      const styleTagIdLine = 'line-font-style';
      if (!document.getElementById(styleTagIdLine)) {
          const style = document.createElement('style');
          style.id = styleTagIdLine;
          style.innerHTML = fontFaceLine;
          document.head.appendChild(style);
      }
  }, []);

  // Update time
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 100);
    return () => clearInterval(timerId);
  }, []);

  // --- Decimal Time Calculation ---
  const totalStandardSeconds = 
    time.getHours() * 3600 + 
    time.getMinutes() * 60 + 
    time.getSeconds() + 
    time.getMilliseconds() / 1000;

  const totalStandardSecondsInDay = 86400;
  const timeRatio = totalStandardSeconds / totalStandardSecondsInDay;
  const totalDecimalSeconds = timeRatio * 100000;

  const decimalHours = Math.floor(totalDecimalSeconds / 10000);
  const decimalMinutes = Math.floor((totalDecimalSeconds % 10000) / 100);
  const decimalSeconds = totalDecimalSeconds % 100;

  const secondDeg = (decimalSeconds / 100) * 360; 
  const minuteDeg = (decimalMinutes / 100) * 360 + (secondDeg / 100);
  const hourDeg = (decimalHours / 10) * 360 + (minuteDeg / 10);

  // --- Styles ---
  const clockContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh', // Use standard vh with better mobile handling
    maxHeight: '100dvh', // Fallback for dynamic viewport
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  };

  const backgroundStyle = {
    position: 'absolute',
    top: '-11%',
    left: '52%',
    transform: 'translateX(-50%) rotate(-2.5deg)',
    width: '110vw',
    height: '110vh',
    maxHeight: '110dvh',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  };

  const clockDialStyle = {
    position: 'relative',
    width: 'min(50vh, 50dvh)',
    height: 'min(50vh, 50dvh)',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '0.6vh solid #880000',
    boxShadow: '0 0 3vh rgba(0, 0, 0, 0.7)',
    fontFamily: 'RevolutionaryClockFont, sans-serif',
    zIndex: 10,
  };

  const centerDotStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '0.2vh',
    height: '0.2vh',
    borderRadius: '50%',
    backgroundColor: '#333',
    zIndex: 10,
    border: '0.2vh solid white',
  };

  const handBaseStyle = {
    position: 'absolute',
    left: '50%', 
    bottom: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '0.2vh',
    filter: 'drop-shadow(1px 0 0 rgba(0,0,0,0.9))',
  };

  const hourHandStyle = {
    ...handBaseStyle,
    width: '5.8vh',
    height: '22vh',
    zIndex: 5,
    backgroundImage: `url(${hourHandImg})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: `translateX(-50%) rotate(${hourDeg}deg)`,
  };

  const minuteHandStyle = {
    ...handBaseStyle,
    width: '7.5vh',
    height: '27vh',
    zIndex: 7,
    backgroundImage: `url(${minuteHandImg})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
  };

  const secondHandStyle = {
    ...handBaseStyle,
    width: '9.3vh',
    height: '25vh',
    zIndex: 9,
    opacity: 0.7,
    backgroundImage: `url(${secondHandImg})`,
    backgroundSize: '100% 100%', 
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: `translateX(-50%) rotate(${secondDeg}deg)`,
  };

  const decimalHoursArray = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div style={clockContainerStyle}>
      <div style={backgroundStyle}></div> {/* Rotated background */}
      
      {/* Top digits with LineFont */}
      <div style={{
        position: 'absolute',
        top: '2vh',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '8.5vh',
        fontFamily: 'LineFont, sans-serif', // ← new font applied
        zIndex: 20,
        display: 'flex',
        gap: '1vh',
      }}>
        {['1', '7', '9', '3'].map((digit, index) => (
          <span
            key={index}
            style={{
              color: '#030303FF',
              textShadow: '0 0 0.5vh rgba(255, 255, 255), -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white',
            }}
          >
            {digit}
          </span>
        ))}
      </div>

      {/* Clock Dial */}
      <div style={clockDialStyle}>
        {/* Hour Markers */}
        {decimalHoursArray.map(hour => (
          <div 
            key={hour} 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `rotate(${(hour / 10) * 360}deg)`,
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '1vh', 
                left: '50%',
                transform: `translateX(-50%) rotate(${-(hour / 10) * 360}deg)`, 
                fontSize: '12vh',
                color: '#000080',
              }}
            >
              {hour}
            </div>
          </div>
        ))}
        {/* Hands */}
        <div style={hourHandStyle} />
        <div style={minuteHandStyle} />
        <div style={secondHandStyle} />
        <div style={centerDotStyle} />
      </div>
    </div>
  );
}
