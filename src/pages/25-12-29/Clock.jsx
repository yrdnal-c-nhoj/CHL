import React, { useState, useEffect, useMemo } from 'react';
import backgroundImage from '../../assets/clocks/25-12-29/shrine.webp'; // Correct path to the image

const DynamicClockComponent = () => {
  const [time, setTime] = useState(new Date());
  const [isReady, setIsReady] = useState(false);
  const [fontError, setFontError] = useState(false);

  // 1. Generate Unique Font Family Name
  const fontFamilyName = useMemo(() => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `Font_${today}_${randomStr}`;
  }, []);

  useEffect(() => {
    // 2. Inject @font-face and Global Styles
    const styleElement = document.createElement('style');
    styleElement.id = `style-${fontFamilyName}`;
    styleElement.innerHTML = `
      @font-face {
        font-family: '${fontFamilyName}';
        src: url('${new URL('../../assets/fonts/25-12-29-shrine.ttf', import.meta.url).href}') format('truetype');
        font-display: block;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
    `;
    document.head.appendChild(styleElement);

    // 3. Wait for Font Loading
    document.fonts.load(`1em ${fontFamilyName}`)
      .then(() => {
        // Successful load
        setIsReady(true);
      })
      .catch((err) => {
        console.error("Font failed to load:", err);
        setFontError(true);
        setIsReady(true); // Proceed with fallback font
      });

    // 4. Clock Interval
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 5. Cleanup on Unmount
    return () => {
      clearInterval(timer);
      const injectedStyle = document.getElementById(`style-${fontFamilyName}`);
      if (injectedStyle) injectedStyle.remove();
    };
  }, [fontFamilyName]);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = String(hours % 12 || 12).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    return `${h}${m}${ampm}`;
  };

  // Inline Styles
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: fontError ? 'sans-serif' : `'${fontFamilyName}'`,
    opacity: isReady ? 1 : 0,
    transition: 'opacity 0.125s ease-in', // 1/8 second fade-in
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: '46% 50%',
    backgroundRepeat: 'no-repeat',
    filter: 'contrast(0.7) brightness(0.9)',
    zIndex: 0,
    opacity: 1,
  };

  const overlayStyle = {
   
    textAlign: 'center',
    color: '#450B0B',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 10,
    position: 'relative',
  };

  const clockStyle = {
    fontSize: '10vh',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    color: 'white',
    textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
    borderRadius: '4px',
  };

  // Block rendering until ready (prevent FOUT)
  if (!isReady) return null;

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}>
        <div style={{...clockStyle, transform: 'rotate(180deg)'}}>
          {formatTime(time)}
        </div>
      </div>
      <div style={overlayStyle}>
        <div style={{...clockStyle, writingMode: 'vertical-lr'}}>
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default DynamicClockComponent;
