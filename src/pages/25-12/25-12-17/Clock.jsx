import { useState, useEffect } from 'react';
import background from '../../../assets/images/25-12-17/swagr.webp';
import FONT_PATH from '../../../assets/fonts/facexxxx.ttf?url';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontFamilyName = 'ClockComponentFont';

  useEffect(() => {
    // Create a style element for the font-face
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontFamilyName}';
        src: url(${FONT_PATH}) format('truetype');
        font-display: swap;
        font-weight: 400;
        font-style: normal;
      }
    `;
    
    // Add the style to the document head
    document.head.appendChild(style);
    
    // Check if font is loaded
    const checkFont = async () => {
      try {
        await document.fonts.load(`12px "${fontFamilyName}"`);
        setFontLoaded(true);
      } catch (err) {
        console.warn('Custom font failed to load, falling back to system font', err);
        setFontLoaded(true);
      }
    };
    
    checkFont();
    
    // Cleanup function to remove the style element
    return () => {
      document.head.removeChild(style);
    };
  }, [fontFamilyName]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setTime(new Date()); // Trigger re-render to recalculate layout
      setIsLargeScreen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const digitToLetter = (digit) => {
    const letters = ['E', 'c', 'J', 'h', 'L', 'M', 'p', 'k', 'V', 'B'];
    return letters[digit] || digit;
  };

  const formatWithLetters = (timeValue) => {
    return timeValue
      .toString()
      .padStart(2, '0')
      .split('')
      .map(d => digitToLetter(parseInt(d, 10)));
  };

  const hours = formatWithLetters(time.getHours());
  const minutes = formatWithLetters(time.getMinutes());
  const seconds = formatWithLetters(time.getSeconds());

  const digitStyle = {
    display: 'inline-block',
    width: '0.9em',
    textAlign: 'center',
    color: '#070809FF',
    filter: 'drop-shadow(1px 2px 0  #D862F2FF)',
    fontFamily: fontLoaded ? `${fontFamilyName}, monospace` : 'monospace',
    opacity: fontLoaded ? 1 : 0.8,
    transition: 'opacity 0.3s ease',
    fontSize: 'inherit',
    fontWeight: 'normal',
    lineHeight: 1,
    letterSpacing: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    textShadow: 'none',
    background: 'transparent',
    border: 'none',
    padding: 0,
    margin: 0
  };

  const timePartStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const renderTimePart = (chars) => (
    <div style={timePartStyle}>
      {chars.map((char, i) => (
        <span key={i} style={digitStyle}>
          {char}
        </span>
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
    inset: 0,
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(1.6) saturate(2) contrast(2.8) hue-rotate(-155deg)'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 123, 253, 0.4)'
  };

  const clockContainerStyle = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'white',
    fontSize: isLargeScreen ? '15vw' : '20vh',
    fontFamily: fontLoaded ? `${fontFamilyName}, monospace` : 'monospace',
    opacity: fontLoaded ? 1 : 0.8,
    transition: 'opacity 0.3s ease',
    fontWeight: 'normal',
    lineHeight: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: isLargeScreen ? '0.1vh' : '0.5vh',
    letterSpacing: '0.3vh',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />
      <div style={overlayStyle} />
      <div style={clockContainerStyle}>
        {renderTimePart(hours)}
        {renderTimePart(minutes)}
        {renderTimePart(seconds)}
      </div>
    </div>
  );
}
