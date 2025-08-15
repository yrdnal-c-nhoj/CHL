import { useState, useEffect } from 'react';
import font1 from './code.ttf';
import font2 from './bar.ttf';
import bgImage2 from './bgpo.webp';   // Bottom background
import bgImage from './wh.webp'; // Top background

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(interval);
  }, []);

  const formatTimeDigits = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    hours = hours % 12 || 12;

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    const ms = Math.floor(milliseconds / 10).toString().padStart(2, '0');

    return [...h, ...m, ...s, ...ms];
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `url(${bgImage2}), url(${bgImage})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center, center',
    backgroundRepeat: 'no-repeat, no-repeat',
  };

  const digitsContainer = {
    display: 'flex',
    transform: 'translateX(20%) translateY(80%)', // Move right 30%, down 20%
  };

  const digitStack = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
    margin: 0,
    padding: 0,
  };

  const digitStyle = (fontName, size) => ({
    fontSize: size,
    fontWeight: 'bold',
    color: '#275254FF', // dark brown ink
    textAlign: 'center',
    fontFamily: fontName,
    margin: 0,
    padding: 0,
    lineHeight: 1,
    letterSpacing: '0.05em', // slightly inconsistent spacing
    textShadow: `
      1px 0 #4a3a28, 
      -1px 0 #4a3a28, 
      0 1px #4a3a28, 
      0 -1px #4a3a28
    `, // "bleed" edges
    backgroundImage: 'url("./cardboard_texture.jpg")', // add local corrugated cardboard texture
    backgroundSize: 'cover',
    WebkitBackgroundClip: 'text',
    color: 'transparent', // shows texture through text
    filter: 'contrast(85%) brightness(95%)', // slightly faded print
  });

  const digits = formatTimeDigits(time);

  return (
    <div style={containerStyle}>
      <style>
        {`
          @font-face {
            font-family: 'CodeFont';
            src: url(${font1}) format('truetype');
          }
          @font-face {
            font-family: 'BarFont';
            src: url(${font2}) format('truetype');
          }
        `}
      </style>

      <div style={digitsContainer}>
        {digits.map((digit, index) => (
          <div key={index} style={digitStack}>
            <div style={digitStyle('BarFont', '0.5rem')}>{digit}</div>
            <div style={digitStyle('CodeFont', '4rem')}>{digit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}