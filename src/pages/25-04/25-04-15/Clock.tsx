import React, { useEffect, useState, useRef } from 'react';
import { useMultiAssetLoader } from '../../../utils/assetLoader';
import { useFontLoader } from '../../../utils/fontLoader';
import horizonFontUrl from '../../../assets/fonts/25-04-15-hori.otf';
import layer2 from '../../../assets/images/25-04/25-04-15/4c558c5dbff1828f2b87582dc49526e8.gif';
import sdfwef from '../../../assets/images/25-04/25-04-15/sdfwef.webp';
import layer1 from '../../../assets/images/25-04/25-04-15/ewfsdfsd.webp';

const HorizonClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const componentId = useRef(`horizon-clock-${Date.now()}`);
  const fontName = `HorizonClockFont-${componentId.current}`;

  // Scoped font loading
  useEffect(() => {
    const loadFont = async () => {
      try {
        const fontFace = new FontFace(fontName, `url(${horizonFontUrl})`);
        await fontFace.load();
        document.fonts.add(fontFace);
        setFontLoaded(true);
      } catch (error) {
        console.warn('Font failed to load, using fallback:', error);
        setFontLoaded(false);
      }
    };

    loadFont();

    // Cleanup font on unmount
    return () => {
      for (const font of document.fonts) {
        if (font.family === fontName) {
          document.fonts.delete(font);
          break;
        }
      }
    };
  }, [fontName]);

  useEffect(() => {
    const updateClock: React.FC = () => {
      try {
        const now = new Date();
        const rawHours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = rawHours >= 12 ? 'PM' : 'AM';
        const displayHours = rawHours % 12 || 12;
        setTime(`${displayHours}:${minutes} ${ampm}`);
      } catch (err) {
        console.error('Clock update error:', err);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#333',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          @font-face {
            font-family: '${fontName}';
            src: url('${horizonFontUrl}') format('opentype');
          }
        `}
      </style>

      {/* 1. Background Sky/Ground Split */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '50%',
          background: '#87CEEB',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '50%',
          background: '#E0F7FA',
          zIndex: 1,
        }}
      />

      {/* 2. Clock - Centered on Horizon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: '100%',
          textAlign: 'center',
          fontFamily: fontLoaded ? `${fontName}, Arial, sans-serif` : 'Arial, sans-serif',
          fontSize: '15vw',
          color: 'white',
          backgroundImage:
            'linear-gradient(to bottom, #88915F 50%, #4E88B7 50%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {time}
      </div>

      {/* LAYER 1: Top half, taking up exactly 15% height */}
      <img
        decoding="async"
        loading="lazy"
        src={layer1}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          zIndex: 5,
          objectFit: 'cover',
          filter: 'hue-rotate(20deg) saturate(120%)',
        }}
        alt=""
      />

      {/* LAYER 2: Bottom half, 50% height, 0.5 opacity */}
      <img
        decoding="async"
        loading="lazy"
        src={layer2}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          zIndex: 7,
          opacity: 0.5,
          // objectFit: 'cover',
          filter: ' saturate(120%)',
        }}
        alt=""
      />

      {/* LAYER 3: Bottom half, 50% height, 0.5 opacity */}
      <img
        decoding="async"
        loading="lazy"
        src={sdfwef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          zIndex: 6,
          opacity: 0.9,
          // objectFit: 'cover'
        }}
        alt=""
      />
    </div>
  );
};

export default HorizonClock;
