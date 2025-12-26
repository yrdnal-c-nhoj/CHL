import { useState, useEffect } from 'react';
import background from './cass.webp';
import backgroundImage from './tape.gif'; // Use the same image for now, replace with your desired background image

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Load custom font
    const loadFont = async () => {
      try {
        const font = new FontFace('Haunt', 'url(/fonts/cas.ttf)');
        await font.load();
        document.fonts.add(font);
      } catch (error) {
        console.error('Failed to load Haunt font:', error);
      }
    };

    loadFont();

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const digitToLetter = (digit) => {
    const letters = ['0', 'G', 'b', 'W', 'z', 'u', 'v', 'w', 'a', 's'];
    return letters[digit] || digit;
  };

  const formatWithLetters = (value) =>
    value
      .toString()
      .padStart(2, '0')
      .split('')
      .map(d => digitToLetter(parseInt(d, 10)));

  const digitStyle = {
    display: 'inline-block',
    width: '3vh',
    textAlign: 'center',
    color: '#473803FF',
    textShadow: [
      // White shadow to the right (1px right, 0px down, 1px blur)
      '1px 0 1px rgba(255, 255, 255, 0.8)',
      // Black shadow to the left (-1px left, 0px down, 1px blur)
      '-1px 0 1px rgba(0, 0, 0, 0.8)'
    ].join(','),
    transform: 'rotate(90deg)',
    transformOrigin: 'center center',
    fontSize: '6vh',
    lineHeight: 1,
    WebkitUserSelect: 'none',
    userSelect: 'none',
    fontFamily: 'Haunt, sans-serif',
    position: 'relative',
    zIndex: 1
  };

  const timePartStyle = {
    display: 'flex',
    gap: '4vh'
  };

  const renderTimePart = (chars) => (
    <div style={timePartStyle}>
      {chars.map((char, i) => (
        <span key={i} style={digitStyle}>{char}</span>
      ))}
    </div>
  );

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundStyle = {
    position: 'absolute',
    inset: '-100%',
    backgroundImage: `url(${background})`,
    backgroundSize: '400px auto',
    backgroundRepeat: 'repeat',
    opacity: 0.7,
    backgroundPosition: 'center center',
    filter: 'brightness(1.4) saturate(4.8) contrast(0.3) hue-rotate(-25deg)',
    animation: 'rotateGrid 360s linear infinite',
    transformOrigin: 'center center'
  };

  const keyframesStyle = `
    @keyframes rotateGrid {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
  `;

  // Inject keyframes
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = keyframesStyle;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  return (
    <div style={containerStyle}>
      {/* 1. Background image - bottom layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'auto', // Maintain original aspect ratio
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center', // Center the tiling
          zIndex: 1,
        }}
      />

      {/* 2. Solid black overlay - middle layer */}
     

      {/* 3. Rotating grid - middle layer */}
      <div
        style={{
          ...backgroundStyle,
          zIndex: 3,
        }}
      />

      {/* 4. Clock - top layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4vh',
          }}
        >
          {renderTimePart(formatWithLetters(time.getHours()))}
          {renderTimePart(formatWithLetters(time.getMinutes()))}
          {renderTimePart(formatWithLetters(time.getSeconds()))}
        </div>
      </div>
    </div>
  );
}
