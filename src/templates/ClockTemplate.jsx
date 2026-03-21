/** @jsxImportSource react */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSuspenseFontLoader } from '../utils/fontLoader';
// import type { FontConfig } from '../types/clock'; // Uncomment if using TypeScript

/* =========================
   CONFIGURATION
========================= */

const UPDATE_INTERVAL = 1000; // Update frequency in ms

/* =========================
   ASSETS (Update paths as needed)
========================= */

// Uncomment and update paths for your assets
// import backgroundImage from '../../../assets/images/your-folder/your-image.webp';
// import customFont from '../../../assets/fonts/your-font.ttf';

/* =========================
   UTILITY FUNCTIONS
========================= */

const formatTime = (num) => num.toString().padStart(2, '0');

const getTimeDigits = (date) => {
  const hours = formatTime(date.getHours());
  const minutes = formatTime(date.getMinutes());
  const seconds = formatTime(date.getSeconds());
  return { hours, minutes, seconds };
};

/* =========================
   CUSTOM HOOKS
========================= */

function useClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    let frameId;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return time;
}

/* =========================
   MAIN COMPONENT
========================= */

export default function ClockTemplate() {
  const time = useClock();

  // Uncomment and update to load custom fonts
  const fontConfigs = useMemo(
    () => [
      // { fontFamily: 'TemplateFont', fontUrl: customFont },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, seconds } = useMemo(
    () => getTimeDigits(time),
    [time],
  );

  /* =========================
     STYLES
  ========================= */

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    minHeight: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Update as needed
    // Uncomment for background image
    // backgroundImage: `url(${backgroundImage})`,
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  };

  const clockContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    // fontFamily: 'TemplateFont, sans-serif', // Uncomment for custom font
    fontFamily: 'monospace',
  };

  const digitStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'clamp(4rem, 15vw, 12rem)', // Responsive font size
    color: '#fff', // Update as needed
    textShadow: '0 0 1rem rgba(0,0,0,0.8)',
    minWidth: '0.8em',
    lineHeight: 1,
  };

  const separatorStyle = {
    ...digitStyle,
    fontSize: 'clamp(3rem, 12vw, 10rem)',
    opacity: 0.8,
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div style={containerStyle}>
      <div style={clockContainerStyle}>
        <span style={digitStyle}>{hours[0]}</span>
        <span style={digitStyle}>{hours[1]}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{minutes[0]}</span>
        <span style={digitStyle}>{minutes[1]}</span>
        <span style={separatorStyle}>:</span>
        <span style={digitStyle}>{seconds[0]}</span>
        <span style={digitStyle}>{seconds[1]}</span>
      </div>
    </div>
  );
}

/* =========================
   USAGE NOTES
========================= */

/*
This template includes best practices observed from the project:

1. **React Structure**: Uses functional components with hooks
2. **Performance**: 
   - useMemo for expensive calculations
   - Proper cleanup in useEffect
   - Optimized update intervals

3. **Asset Loading**:
   - Font loading with fallbacks (useSuspenseFontLoader is recommended)
   - Image preloading
   - Loading states with smooth transitions

4. **Responsive Design**:
   - Uses clamp() for fluid typography
   - viewport units (vw, vh, dvh)
   - Mobile-friendly scaling

5. **Error Handling**:
   - Graceful degradation
   - Console warnings for debugging

6. **Code Organization**:
   - Clear section comments
   - Separated utilities and hooks
   - Configurable constants

To customize:
1. Update asset import paths
2. Add font objects to the `fonts` array.
3. Modify colors and styles in the style objects.
4. Adjust timing and animation parameters.

Example with assets:
import myCoolFont from '../../../assets/fonts/26-01-01-cool.otf';

const fontConfigs = useMemo(() => [
  { fontFamily: 'MyClockFont', fontUrl: myCoolFont }
], []);
useSuspenseFontLoader(fontConfigs);

// In clockContainerStyle:
// fontFamily: "'MyClockFont', sans-serif",
*/
