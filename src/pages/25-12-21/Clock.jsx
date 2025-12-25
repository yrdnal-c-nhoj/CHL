import { useState, useEffect } from 'react';
import background from './cass.jpg';

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
    filter: 'drop-shadow(0 0.4vh 0.3vh rgba(220, 222, 220))',
    transform: 'rotate(90deg)',
    transformOrigin: 'center center',
    fontSize: '6vh',
    lineHeight: 1,
    WebkitUserSelect: 'none',
    userSelect: 'none',
    fontFamily: 'Haunt, sans-serif'
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
    backgroundSize: '300px auto',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
    filter: 'brightness(1.4) saturate(1.2) contrast(0.8) hue-rotate(-25deg)',
    animation: 'rotateGrid 360s linear infinite',
    transformOrigin: 'center center'
  };

  const keyframesStyle = `
    @keyframes rotateGrid {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
  `;

  // Inject keyframes into a style element
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = keyframesStyle;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100dvh',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4vh'
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
