import React, { useState, useEffect } from 'react';
import futurBg from '../../../assets/images/26-02/26-02-24/futur.jpg';

const ImageDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    // Add fonts-loading class initially
    document.documentElement.classList.add('fonts-loading');

    // 1. Load Google Fonts with improved FOUC prevention
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Anton&family=Josefin+Sans:wght@400;700&family=Krona+One&family=Roboto+Mono:wght@400;700&family=Playfair+Display:wght@400;700&family=Oswald:wght@400;700&family=Merriweather:wght@400;700&family=Bebas+Neue&display=swap";
    fontLink.rel = "stylesheet";
    fontLink.media = "print"; // Initially load as print to avoid FOUC
    fontLink.onload = function() {
      // Switch to all media after load to apply fonts
      this.media = "all";
      // Remove fonts-loading class to show content
      document.documentElement.classList.remove('fonts-loading');
      setFontsReady(true);
    };
    document.head.appendChild(fontLink);

    // 2. Fallback timeout in case font loading fails
    const fallbackTimeout = setTimeout(() => {
      document.documentElement.classList.remove('fonts-loading');
      fontLink.media = "all";
      setFontsReady(true);
    }, 1000);

    // 3. THE TICKER: Update state every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimeout);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
    };
  }, []);

  if (!fontsReady) {
    return (
      <div style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        fontFamily: 'monospace',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  // --- Robust Time Logic ---
  const rawHours = time.getHours();
  const amPm = rawHours >= 12 ? 'PM' : 'AM';
  const displayHours = (rawHours % 12 || 12).toString().padStart(2, '0');
  const displayMinutes = time.getMinutes().toString().padStart(2, '0');
  const displaySeconds = time.getSeconds().toString().padStart(2, '0');
  
  // Array of exactly 6 digits: [H, H, M, M, S, S]
  const digits = [
    ...displayHours.split(''), 
    ...displayMinutes.split(''), 
    ...displaySeconds.split('')
  ];

  // --- Visual Layout Mapping ---
  const positions = [
    { top: '8%', left: '10%', rotate: '-15deg', fontSize: 'clamp(2rem, 8vw, 6rem)', font: "'Krona One'" },      // H1
    { top: '25%', left: '22%', rotate: '30deg', fontSize: 'clamp(11rem, 44vw, 22rem)', font: "'Anton'" },     // H2
    { top: '72%', left: '35%', rotate: '-18deg', fontSize: 'clamp(24rem, 64vw, 30rem)', font: "'Playfair Display'" }, // M1
    { top: '80%', left: '75%', rotate: '25deg', fontSize: 'clamp(2.5rem, 9vw, 7rem)', font: "'Oswald'" },      // M2
    { top: '15%', left: '75%', rotate: '-35deg', fontSize: 'clamp(5rem, 16vw, 12rem)', font: "'Merriweather'" },  // S1
    { top: '40%', left: '80%', rotate: '44deg', fontSize: 'clamp(7.5rem, 31vw, 12rem)', font: "'Roboto Mono'" }, // S2
  ];

  return (
    <div style={containerStyle}>
      <style>{`
        .fonts-loading * {
          opacity: 0 !important;
        }
      `}</style>
      <div style={backgroundStyle} />
      <div style={redOverlayStyle} />
      
      {/* Clock digits - show immediately with fallback fonts */}
      {digits.map((char, index) => (
        <div
          key={`${index}-${char}`} // char in key ensures React treats a number change as a new element for transitions
          style={{
            ...digitBox,
            position: 'absolute',
            top: positions[index].top,
            left: positions[index].left,
            transform: `translate(-50%, -50%) rotate(${positions[index].rotate})`,
            fontFamily: `${positions[index].font}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`,
            fontSize: positions[index].fontSize,
            zIndex: 10,
          }}
        >
          {char}
        </div>
      ))}

      {/* AM / PM Logic */}
      <div style={{ ...amPmStyle, bottom: '20%', right: '5%', fontSize: '15vw', fontFamily: '"Josefin Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', transform: 'rotate(-50deg)' }}>
        {amPm[0]}
      </div>
      <div style={{ ...amPmStyle, bottom: '10%', right: '10%', fontSize: '4vw', fontFamily: '"Bebas Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', transform: 'rotate(10deg)' }}>
        {amPm[1]}
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
};

const backgroundStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${futurBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'brightness(2.5) contrast(0.6) grayscale(100%)',
  zIndex: 0
};

const redOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(249, 9, 9, 0.7)',
  mixBlendMode: 'multiply', // Creates a professional "printed" look
  zIndex: 1
};

const digitBox = {
  color: 'black',
  pointerEvents: 'none',
  userSelect: 'none',
  lineHeight: 0.8,
  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Adds a tiny "bounce" to number changes
};

const amPmStyle = {
  position: 'absolute',
  color: 'black',
  zIndex: 10,
};

export default ImageDisplay;