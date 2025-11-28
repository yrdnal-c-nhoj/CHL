import React, { useState, useEffect } from 'react';
import revolutionFont from "./french.ttf"; 
import backgroundImg from "./fr.jpg";      
import hourHandImg from "./fre.webp";      
import minuteHandImg from "./fren.webp";   
import secondHandImg from "./fren.png";   
import { ObjectSpaceNormalMap } from 'three';

// --- Font Setup Variables ---
const today = new Date();
const dateString = today.toISOString().split('T')[0].replace(/-/g, '_');
const fontImports = {};
const importedFont = `url("${revolutionFont}") format('truetype')`;
const fontVariableName = `font_${dateString}`;
fontImports[fontVariableName] = importedFont;

// @font-face string definition
const fontFaceStyle = `@font-face {
    font-family: 'RevolutionaryClockFont';
    src: ${fontImports[fontVariableName]};
    font-weight: normal;
    font-style: normal;
}`;

export default function Clock() {
  const [time, setTime] = useState(new Date());

  // Inject custom font
  useEffect(() => {
      const styleTagId = 'custom-font-style';
      if (!document.getElementById(styleTagId)) {
          const style = document.createElement('style');
          style.id = styleTagId;
          style.innerHTML = fontFaceStyle;
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
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  };

  const backgroundStyle = {
    position: 'absolute',
    top: '-5%', 
    left: '50%',
    transform: 'translateX(-50%) rotate(-3deg)',
    width: '110vw',
    height: '110vh',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  };

  const clockDialStyle = {
    position: 'relative',
    width: '50vh',
    height: '50vh',
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
    height: '19vh',
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
    height: '25vh',
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
    height: '24vh',
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
                fontSize: '8.5vh',
                color: '#000080',
                textShadow: '0 0 0.5vh rgba(255, 255, 255, 0.8)',
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
