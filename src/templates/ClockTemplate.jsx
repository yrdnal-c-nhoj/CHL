/** @jsxImportSource react */
import React, { useState, useEffect, useRef, useMemo } from 'react';

/* =========================
   CONFIGURATION
========================= */

const UPDATE_INTERVAL = 1000; // Update frequency in ms
const FONT_LOAD_TIMEOUT = 2000; // Font loading timeout in ms

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

function useClock(updateInterval = UPDATE_INTERVAL) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return time;
}

function useFontLoader(fontUrl, fontName = 'CustomClockFont') {
  const [isFontReady, setIsFontReady] = useState(false);
  const fontLoadTimeoutRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadFont = async () => {
      try {
        // Create font face
        const font = new FontFace(fontName, `url(${fontUrl})`);
        await font.load();

        if (!mounted) return;

        document.fonts.add(font);
        await document.fonts.load(`1rem "${fontName}"`);

        if (mounted) setIsFontReady(true);
      } catch (error) {
        console.warn(`Failed to load font ${fontName}:`, error);
        if (mounted) setIsFontReady(true); // Continue without custom font
      }
    };

    if (fontUrl) {
      loadFont();

      // Fallback timeout
      fontLoadTimeoutRef.current = setTimeout(() => {
        if (mounted) setIsFontReady(true);
      }, FONT_LOAD_TIMEOUT);
    } else {
      setIsFontReady(true); // No font to load
    }

    return () => {
      mounted = false;
      if (fontLoadTimeoutRef.current) {
        clearTimeout(fontLoadTimeoutRef.current);
      }
    };
  }, [fontUrl, fontName]);

  return isFontReady;
}

function useImagePreload(imageUrl) {
  const [isImageReady, setIsImageReady] = useState(false);
  const imageLoadTimeoutRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) {
      setIsImageReady(true);
      return;
    }

    let mounted = true;
    const img = new Image();

    const handleLoad = () => {
      if (mounted) setIsImageReady(true);
    };

    const handleError = () => {
      console.warn(`Failed to load image: ${imageUrl}`);
      if (mounted) setIsImageReady(true);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = imageUrl;

    // Fallback timeout
    imageLoadTimeoutRef.current = setTimeout(() => {
      if (mounted) setIsImageReady(true);
    }, FONT_LOAD_TIMEOUT);

    return () => {
      mounted = false;
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
      }
    };
  }, [imageUrl]);

  return isImageReady;
}

/* =========================
   MAIN COMPONENT
========================= */

export default function ClockTemplate() {
  const time = useClock();

  // Uncomment and update for your assets
  // const isFontReady = useFontLoader(customFont, 'TemplateFont');
  // const isImageReady = useImagePreload(backgroundImage);

  const isFontReady = true; // Set to true when not using custom fonts
  const isImageReady = true; // Set to true when not using background images

  const { hours, minutes, seconds } = useMemo(
    () => getTimeDigits(time),
    [time],
  );
  const isReady = isFontReady && isImageReady;

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
    opacity: isReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const clockContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    // fontFamily: isFontReady ? "'TemplateFont', sans-serif" : 'sans-serif', // Uncomment for custom font
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
     LOADING STATE
  ========================= */

  if (!isReady) {
    return (
      <div
        style={{
          ...containerStyle,
          opacity: 1,
          backgroundColor: '#000',
        }}
      >
        <div style={{ ...digitStyle, color: '#333' }}>00:00:00</div>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div style={containerStyle}>
      {/* Uncomment for font loading */}
      {/* <style>{`
        @font-face {
          font-family: 'TemplateFont';
          src: url(${customFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style> */}

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
   - Font loading with fallbacks
   - Image preloading
   - Loading states with smooth transitions

4. **Responsive Design**:
   - Uses clamp() for fluid typography
   - viewport units (vw, vh, dvh)
   - Mobile-friendly scaling

5. **Error Handling**:
   - Timeout fallbacks for asset loading
   - Graceful degradation
   - Console warnings for debugging

6. **Code Organization**:
   - Clear section comments
   - Separated utilities and hooks
   - Configurable constants

To customize:
1. Update asset import paths
2. Modify colors and styles
3. Add your custom font names
4. Adjust timing and animation parameters
5. Add additional features (date, timezone, etc.)

Example with assets:
import backgroundImage from '../../../assets/images/26-01/26-01-01/fan.webp';
import customFont from '../../../assets/fonts/26-01-01-fan.otf';

const isFontReady = useFontLoader(customFont, 'MyClockFont');
const isImageReady = useImagePreload(backgroundImage);
*/
