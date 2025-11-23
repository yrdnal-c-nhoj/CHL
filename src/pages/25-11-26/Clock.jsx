import { useState, useEffect } from 'react';
import backgroundImage from './app.webp';
import fontFile20251123 from './day.ttf';

const CurvedClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fontFace = new FontFace('CustomFont', `url(${fontFile20251123})`);
    fontFace.load().then((loadedFace) => {
      document.fonts.add(loadedFace);
    });

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours || 12; // 0 should be 12
    
    // French standard uses 'h' as separator
    return {
      hours: String(hours),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      ampm
    };
  };

  const { hours, minutes, seconds, ampm } = formatTime(time);
  const timeString = `${hours}h${minutes}:${seconds}`;

  // Distortion controls - adjust these values to change the curve/twist
  const distortionConfig = [
    { rotate: -8, skewY: 5, translateY: -0.5 },   // h
    { rotate: 5, skewY: -3, translateY: 0.8 },    // h
    { rotate: -3, skewY: 4, translateY: -0.3 },   // :
    { rotate: 7, skewY: -6, translateY: 0.6 },    // m
    { rotate: -5, skewY: 3, translateY: -0.4 },   // m
    { rotate: 4, skewY: -4, translateY: 0.5 },    // :
    { rotate: -6, skewY: 5, translateY: -0.6 },   // s
    { rotate: 8, skewY: -5, translateY: 0.7 },    // s
  ];

  const renderCharacter = (char, index) => {
    const config = distortionConfig[index % distortionConfig.length];
    
    const boxStyle = {
      display: 'inline-block',
      fontFamily: 'CustomFont, monospace',
      fontSize: '8vh',
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: '1vh 1.5vh',
      margin: '0 0.3vh',
      borderRadius: '1vh',
      transform: `rotate(${config.rotate}deg) skewY(${config.skewY}deg) translateY(${config.translateY}vh)`,
      boxShadow: '0 0.5vh 2vh rgba(0, 0, 0, 0.5)',
      transition: 'none',
      minWidth: char === ':' || char === 'h' ? '2vh' : '5vh',
      textAlign: 'center',
    };

    return (
      <span key={index} style={boxStyle}>
        {char}
      </span>
    );
  };

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  };

  const clockWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 0,
  };

  const ampmStyle = {
    display: 'inline-block',
    fontFamily: 'CustomFont, monospace',
    fontSize: '3vh',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '0.5vh 1vh',
    margin: '0 0 0 1vh',
    borderRadius: '0.5vh',
    transform: 'rotate(-4deg) translateY(2vh)',
    boxShadow: '0 0.5vh 2vh rgba(0, 0, 0, 0.5)',
  };

  return (
    <div style={containerStyle}>
      <div style={clockWrapperStyle}>
        {timeString.split('').map((char, index) => renderCharacter(char, index))}
        <span style={ampmStyle}>{ampm}</span>
      </div>
    </div>
  );
};

export default CurvedClock;