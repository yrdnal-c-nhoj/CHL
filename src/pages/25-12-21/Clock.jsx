// ---  GEMINI   
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Imports ---   GEMINI   

// 1. Background Image Import (assuming 'background.jpg' is in the same folder)
import backgroundImage from './app.webp'; // or .png, .webp etc.

// 2. Font Import with date variable (Vite handles the blob URL via import)
// The variable name must contain today's date (November 23, 2025)
import font_2025_11_23 from './day.ttf'; 

// --- Custom Font Definition ---
const fontFaceStyle = `@font-face {
  font-family: 'DigitalDistortion';
  src: url('${font_2025_11_23}') format('woff2');
  font-weight: normal;
  font-style: normal;
}`;

// Helper to inject the font-face style globally since inline styles can't do @font-face
const injectFontFace = () => {
  if (!document.getElementById('digital-distortion-font')) {
    const style = document.createElement('style');
    style.id = 'digital-distortion-font';
    style.textContent = fontFaceStyle;
    document.head.appendChild(style);
  }
};

// Inject the font on component load
injectFontFace();

// --- Clock Component ---

/**
 * CurvyClock Component
 * Displays a digital clock with individually styled, distorted, and curved characters.
 */
const CurvyClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId); // Cleanup
  }, []);

  // --- Time Formatting ---
  const formatTime = useCallback((date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // 12-hour format, no leading zeros
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // French standard separators: 'h' for hours/minutes, 'm' for minutes/seconds
    // I will use simple colons as the common standard is more readable unless explicitly enforced
    // For this example, I'll use a space and a colon for a unique look and better distortion control.
    // e.g., '10: 35: 59 PM'
    return {
      H: String(hours),
      M: String(minutes).padStart(2, '0'),
      S: String(seconds).padStart(2, '0'),
      AMPM: ampm
    };
  }, []);

  const { H, M, S, AMPM } = useMemo(() => formatTime(time), [time, formatTime]);

  // Create an array of all display characters (H, M, S, AMPM plus separators)
  // Display structure: H: M: S AM/PM
  const displayCharacters = [
    ...H.split(''), 
    'sep1', // Separator 1 (colon)
    ...M.split(''), 
    'sep2', // Separator 2 (colon)
    ...S.split(''), 
    'sep3', // Separator 3 (space)
    ...AMPM.split('')
  ];

  // --- Custom Distortion Settings ---
  // These objects define the unique distortion for each logical element (H, M, S, AMPM)
  // They are applied to the parent box of each character/separator.
  const distortionSettings = {
    // Hour digits (H)
    H: { 
      transform: 'rotate(-5deg) skewX(5deg) scale(1.1)', 
      position: 'relative', top: '-1vh', 
      color: '#ff4d4d' // Redish
    },
    // Separator 1 (:)
    sep1: { 
      transform: 'rotate(10deg) scaleY(1.3)', 
      color: '#ffffff',
      fontSize: '8vh' // Taller separator
    }, 
    // Minute digits (M)
    M: { 
      transform: 'rotate(15deg) skewY(-5deg) scale(0.9)', 
      position: 'relative', top: '1vh', 
      color: '#4dff4d' // Greenish
    },
    // Separator 2 (:)
    sep2: { 
      transform: 'rotate(-10deg) scale(1.1)', 
      color: '#ffffff',
      fontSize: '7vh' // Smaller separator
    },
    // Second digits (S)
    S: { 
      transform: 'rotate(-20deg) skewX(-10deg) scale(1.2)', 
      position: 'relative', top: '-2vh', 
      color: '#5E5EEEFF' // Bluish
    },
    // Separator 3 (AM/PM space)
    sep3: {
      transform: 'scale(0.8)',
      color: 'transparent',
      width: '1vw'
    },
    // AM/PM indicator
    AMPM: { 
      transform: 'rotate(5deg) skewX(2deg) scale(1.05)', 
      position: 'relative', top: '0.5vh', 
      color: '#ffff4d', // Yellowish
      fontSize: '4vh' // Smaller text
    }
  };

  // Function to determine the style key for a character based on its index and value
  const getStyleKey = useCallback((index, value) => {
    if (value === 'sep1') return 'sep1';
    if (value === 'sep2') return 'sep2';
    if (value === 'sep3') return 'sep3';

    // The logic below identifies which part of the time (H, M, S, AMPM) the character belongs to.
    const hLen = H.length;
    const mLen = M.length;
    const sLen = S.length;
    
    if (index < hLen) return 'H'; // Hours
    if (index === hLen) return 'sep1'; 
    if (index > hLen && index <= hLen + mLen + 1) return 'M'; // Minutes
    if (index === hLen + mLen + 2) return 'sep2';
    if (index > hLen + mLen + 2 && index <= hLen + mLen + sLen + 3) return 'S'; // Seconds
    if (index === hLen + mLen + sLen + 4) return 'sep3';
    
    return 'AMPM'; // AM/PM
  }, [H, M, S]);
  
  // --- Inline Styles for Scoping and Layout ---

  // 1. Overall Container (View Height/Width, Background)
  const containerStyle = useMemo(() => ({
    minHeight: '100vh', 
    minWidth: '100vw', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Background Image
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // Scoping for distortion visibility (no overflow)
    overflow: 'hidden', 
    fontFamily: 'sans-serif' // Fallback
  }), []);

  // 2. Clock Display Area
  const clockContainerStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: '2vh',
    backdropFilter: 'blur(5px) brightness(0.7)', // Visual Scoping/Leakage Avoidance
    borderRadius: '2vh',
    border: '0.5vh solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 5vh rgba(0, 0, 0, 0.8)',
  }), []);

  // 3. Style for each Character Box (to be distorted)
  const characterBoxBaseStyle = useMemo(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '10vw', // Use viewport width for responsive boxes
    height: '15vh', // Use viewport height
    margin: '0 0.5vw',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Distinct box for each
    borderRadius: '1vh',
    transition: 'transform 0.5s ease-out', // Smooth transition for visual effect
  }), []);

  // 4. Style for the Character itself
  const characterBaseStyle = useMemo(() => ({
    fontFamily: 'DigitalDistortion, monospace',
    fontSize: '12vh',
    fontWeight: 'bold',
    textShadow: '0 0 1vh rgba(255, 255, 255, 0.5)',
    color: '#ffffff',
  }), []);

  // --- Render ---
  return (
    <div style={containerStyle}>
      <div style={clockContainerStyle}>
        {displayCharacters.map((charOrSep, index) => {
          const styleKey = getStyleKey(index, charOrSep);
          const customDistortion = distortionSettings[styleKey];
          
          // Determine the actual character to display
          let charToDisplay;
          if (charOrSep === 'sep1' || charOrSep === 'sep2') {
            charToDisplay = ':';
          } else if (charOrSep === 'sep3') {
            charToDisplay = ' ';
          } else {
            charToDisplay = charOrSep;
          }
          
          // Combine base style with custom distortion style for the box
          const finalBoxStyle = {
            ...characterBoxBaseStyle,
            ...customDistortion,
            // Ensure no style leakage by having distinct box styles
            backgroundColor: customDistortion.backgroundColor || characterBoxBaseStyle.backgroundColor 
          };

          // Combine base style with custom color/size for the character text
          const finalCharStyle = {
            ...characterBaseStyle,
            color: customDistortion.color || characterBaseStyle.color,
            fontSize: customDistortion.fontSize || characterBaseStyle.fontSize,
          };

          return (
            // Each character/separator is in its own box
            <div key={index} style={finalBoxStyle}>
              <span style={finalCharStyle}>
                {charToDisplay}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurvyClock;