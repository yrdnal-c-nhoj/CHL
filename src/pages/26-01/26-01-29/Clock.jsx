import React, { useState, useEffect, useMemo, memo } from 'react';

import backgroundGif2 from '../../../assets/clocks/26-01-29/uu.gif';
import backgroundGif from '../../../assets/clocks/26-01-29/uranu.gif';
import tileOverlay from '../../../assets/clocks/26-01-29/uran.webp';
import customFontUrl from '../../../assets/fonts/26-01-29-ura.ttf';

// Memoized static hour letters (A, B, C, ..., L)
const ClockNumbers = memo(({ fontFamily }) => (
  <>
    {[...Array(12)].map((_, i) => {
      const letter = String.fromCharCode(65 + i); // A=65, B=66, etc.
      return (
        <div
          key={letter}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            // paddingTop: '2%',
            transform: `rotate(${i * 30}deg)`,
          }}
        >
          <span
            style={{
              fontSize: 'min(21vw, 21vh)',
              color: '#7A7EEF00',
              textShadow: '0 0 20x #DEF171',
              fontFamily,
              userSelect: 'none',
            }}
          >
            {letter}
          </span>
        </div>
      );
    })}
  </>
));

const AnalogUranusClock = () => {
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [bgRotation, setBgRotation] = useState(0);

  // Unique font family name (generated only once)
  const fontFamily = useMemo(
    () => `migrate-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  useEffect(() => {
    let mounted = true;
    let animationFrameId;
    let lastTime = Date.now();

    // Load custom font
    const loadFont = async () => {
      try {
        const font = new FontFace(fontFamily, `url(${customFontUrl})`);
        await font.load();
        document.fonts.add(font);
      } catch (err) {
        console.warn('Custom font failed to load', err);
      } finally {
        if (mounted) setReady(true);
      }
    };

    loadFont();

    // Clock tick
    const timer = setInterval(() => setNow(new Date()), 1000);

    // Smooth background rotation - counterclockwise once per minute
    const animate = () => {
      if (!mounted) return;
      
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      // Rotate -6 degrees per second (counterclockwise)
      setBgRotation(prev => prev - (6 * deltaTime));
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      clearInterval(timer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [fontFamily]);

  if (!ready) return null;

  // Time calculations
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourDeg   = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1; // slightly smoother

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#4DA7E8',
      }}
    >
      {/* Background + overlay layer – GPU forced */}
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          zIndex: 1,
          transform: 'translateZ(0)',
          willChange: 'transform',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
          >
                {/* Third background layer - add your image import and use here */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            backgroundImage: `url(${backgroundGif2})`,
            backgroundSize: '70px 70px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            opacity: 0.4,
          }}
        />
       
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            backgroundImage: `url(${tileOverlay})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.5,
          }}
        />
      
      </div>

      {/* Clock face container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: 'min(95vw, 95vh)',
          height: 'min(95vw, 95vh)',
        }}
      >
        <ClockNumbers fontFamily={fontFamily} />

        {/* Hour hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            transformOrigin: 'bottom center',
            width: 'min(1.8vw, 3px)',
            height: '24%',
            backgroundColor: '#8D98EAC6',
            borderRadius: '10px',
            boxShadow: '0 0 20px #C2C7E6',
            zIndex: 15,
          }}
        />

        {/* Minute hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
            transformOrigin: 'bottom center',
            width: 'min(1.2vw, 2px)',
            height: '45%',
            backgroundColor: '#8D98EADA',
            borderRadius: '10px',
            boxShadow: '0 0 20px #C4C8EF',
            zIndex: 15,
          }}
        />

       
          </div>
           <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            backgroundImage: `url(${backgroundGif})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            // opacity: 0.3,
            transform: `rotate(${bgRotation}deg)`,
            filter: ' contrast(0.8) brightness(2.8) saturate(0.0) hue-rotate(-30deg)',
          }}
        />
    </div>
  );
};

export default AnalogUranusClock;