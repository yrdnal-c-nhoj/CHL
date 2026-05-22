import React, { useState, useEffect } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

// Explicit module-based imports for the background
import gifOne from '@/assets/images/26_images/26-01/26-01-12/tic.webp';
import gifTwo from '@/assets/images/26_images/26-01/26-01-12/tic2.gif';
import gifThree from '@/assets/images/26_images/26-01/26-01-12/tic3.gif';
import gifFour from '@/assets/images/26_images/26-01/26-01-12/tic4.gif';
import customFont from '@/assets/fonts/26fonts/26-01-09-26-01-12-tic.ttf?url';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'CustomClockFont',
    fontUrl: customFont,
  },
];

export const BackgroundGrid = ({ children }) => {
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState<boolean>(false);

  // Use standardized font loader
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    // Preload all background images
    const images = [gifOne, gifTwo, gifThree, gifFour];
    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    let mounted = true;

    Promise.all([...imagePromises])
      .then(() => {
        if (mounted) setIsBackgroundLoaded(true);
      })
      .catch((err) => {
        console.error('Resource loading failed', err);
        if (mounted) setIsBackgroundLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: 0,
    backgroundColor: '#000',
    zIndex: 1,
    opacity: isBackgroundLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    touchAction: 'manipulation',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  const gridItemStyle = {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover', // Changed to cover for a more seamless grid
    backgroundRepeat: 'no-repeat',
  };

  const gridCells = Array.from({ length: 16 }).map((_, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const imageIndex = (row + col) % 4;

    const backgroundImages = [gifOne, gifTwo, gifThree, gifFour];
    const backgroundImage = backgroundImages[imageIndex];

    return (
      <div
        key={index}
        style={{
          ...gridItemStyle,
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
    );
  });

  return (
    <>
      <div style={containerStyle}>{gridCells}</div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: isBackgroundLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {children}
      </div>
    </>
  );
};