import React, { useState, useEffect } from 'react';
import futurBg from '../../../assets/images/26-02/26-02-24/futur.jpg';

const ImageDisplay = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1. Inject Google Fonts via Link tag for better browser support
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Anton&family=Josefin+Sans:wght@400;700&family=Krona+One&family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&family=Roboto+Mono:wght@400;700&family=Playfair+Display:wght@400;700&family=Oswald:wght@400;700&family=Merriweather:wght@400;700&family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // 2. Wait for fonts to actually be ready to prevent "Layout Shift"
    fontLink.onload = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => setFontLoaded(true));
      } else {
        // Fallback for older browsers
        setTimeout(() => setFontLoaded(true), 500);
      }
    };

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
    };
  }, []);

  // Time Formatting: "02:45:30 PM"
  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const [rawTime, amPm] = timeString.split(' ');
  const allDigits = rawTime.split(''); // e.g., ["0", "2", ":", "4", "5", ":", "3", "0"]
  const digits = allDigits.filter(char => char !== ':'); // Remove colons: ["0", "2", "4", "5", "3", "0"]
  const amPmLetters = amPm ? amPm.split('') : [];

  if (!fontLoaded) {
    return (
      <div style={{ 
        background: '#000', 
        height: '100dvh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'sans-serif' 
      }}>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Background Image Layer */}
      <div style={backgroundStyle} />
      
      {/* Red Overlay Layer */}
      <div style={redOverlayStyle} />
      
      {/* Clock Content Layer */}
      {digits.map((char, index) => {
        // Define positions for each digit (no colons)
        const positions = [
          { top: '8%', left: '4%', rotate: '-15deg', fontSize: 'clamp(2rem, 8vw, 6rem)' },  // H1
          { top: '25%', left: '15%', rotate: '30deg', fontSize: 'clamp(11rem, 44vw, 22rem)' },   // H2
          { top: '75%', left: '35%', rotate: '-18deg', fontSize: 'clamp(24rem, 64vw, 30rem)' }, // M1
          { top: '80%', left: '70%', rotate: '25deg', fontSize: 'clamp(2.5rem, 9vw, 7rem)' },   // M2
          { top: '8%', left: '70%', rotate: '-35deg', fontSize: 'clamp(5rem, 16vw, 12rem)' },    // S1
          { top: '30%', left: '70%', rotate: '44deg', fontSize: 'clamp(7.5rem, 31vw, 12rem)' },   // S2
        ];

        const pos = positions[index] || { top: '50%', left: '50%', rotate: '0deg', fontSize: 'clamp(5rem, 20vw, 12rem)' };

        // Font Mapping Logic - each digit gets unique font
        let fontFamily;
        if (index === 0) fontFamily = "'Krona One', sans-serif"; // H1
        else if (index === 1) fontFamily = "'Anton', sans-serif"; // H2
        else if (index === 2) fontFamily = "'Playfair Display', serif"; // M1
        else if (index === 3) fontFamily = "'Oswald', sans-serif"; // M2
        else if (index === 4) fontFamily = "'Merriweather', serif"; // S1
        else if (index === 5) fontFamily = "'Roboto Mono', monospace"; // S2
        else fontFamily = "'Space Mono', monospace"; // fallback

        return (
          <div
            key={`${index}-${char}`}
            style={{
              ...digitBox,
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: `translate(-50%, -50%) rotate(${pos.rotate})`,
              fontFamily,
              fontSize: pos.fontSize,
              zIndex: 10, // Ensure digits appear above overlay
            }}
          >
            {char}
          </div>
        );
      })}

      {/* AM/PM - Corner Characters */}
      {amPmLetters[0] && (
        <div style={{
          ...digitBox,
          position: 'absolute',
          bottom: '20vh',
          right: '1px',
          fontSize: 'clamp(15rem, 33vw, 18rem)',
          fontFamily: '"Josefin Sans", sans-serif',
          transform: 'rotate(-50deg)',
          zIndex: 10, // Ensure AM/PM appears above overlay
        }}>
          {amPmLetters[0]}
        </div>
      )}

      {amPmLetters[1] && (
        <div style={{
          ...digitBox,
          position: 'absolute',
          bottom: '50px',
          right: '50px',
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          fontFamily: '"Bebas Neue", cursive',
          transform: 'rotate(10deg)',
          zIndex: 10, // Ensure AM/PM appears above overlay
        }}>
          {amPmLetters[1]}
        </div>
      )}
    </div>
  );
};

// --- Styles ---

const containerStyle = {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: '#f0f0f0' // Fallback
};

const backgroundStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${futurBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  filter: 'brightness(2.8) contrast(0.4)',
  zIndex: 0
};

const redOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(249, 9, 9, 0.64)', // Red overlay with 30% opacity
  zIndex: 1
};

const digitBox = {
  fontSize: 'clamp(3rem, 10vw, 8rem)',
  color: 'rgb(0, 0, 0)',
  padding: '10px',
  minWidth: '1.2em',
  textAlign: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
  userSelect: 'none'
};

export default ImageDisplay;