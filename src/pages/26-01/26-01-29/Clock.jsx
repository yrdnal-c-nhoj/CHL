import React, { useState, useEffect, useMemo, memo } from 'react';


import backgroundGif3 from '../../../assets/images/26-01-29/ur.png';
import backgroundGif2 from '../../../assets/images/26-01-29/ur.gif';
import backgroundGif from '../../../assets/images/26-01-29/uranu.gif';
import tileOverlay from '../../../assets/images/26-01-29/u.webp';

// Memoized static hour images using backgroundGif2
const ClockUranus = memo(() => (
  <>
    {[...Array(12)].map((_, i) => {
      return (
        <div
          key={i}
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
          <div
            style={{
              width: 'min(33vw, 33vh)',
              height: 'min(33vw, 33vh)',
              backgroundImage: `url(${backgroundGif2})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              userSelect: 'none',
            }}
          />
        </div>
      );
    })}
  </>
));

const AnalogUranusClock = () => {
  const [now, setNow] = useState(() => new Date());
  const [bgRotation, setBgRotation] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let lastTime = Date.now();

    // Clock tick
    const timer = setInterval(() => setNow(new Date()), 1000);

    // Smooth background rotation - counterclockwise once per minute
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      // Rotate -6 degrees per second (counterclockwise)
      setBgRotation(prev => prev - (1 * deltaTime));
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      clearInterval(timer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

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
    backgroundImage: `url(${tileOverlay})`,
    // Change this line:
    backgroundSize: 'contain', 
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    opacity: 0.7,
    pointerEvents: 'none', // Good practice for overlays so they don't block clicks
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
            backgroundImage: `url(${backgroundGif3})`,
            backgroundSize: '50vh 50vh',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            filter: 'contrast(1.8) brightness(0.5) saturate(2.0)',
            zIndex: 5,
            opacity: 0.5,
          }}
        />
      {/* Clock face container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: 'min(110vw, 110vh)',
          height: 'min(110vw, 110vh)',
        }}
      >
        <ClockUranus />

        {/* Hour hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            transformOrigin: 'bottom center',
            width: 'min(2vw, 3px)',
            height: '24%',
            backgroundColor: '#085557C4',
            borderRadius: '10px',
            boxShadow: '0 0 2px #C2C7E6',
            zIndex: 5,
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
            width: 'min(1.5vw, 2px)',
            height: '45%',
            backgroundColor: '#021D1EC4',
            borderRadius: '10px',
            boxShadow: '0 0 2px #C4C8EF',
            zIndex: 5,
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
            zIndex: 1,
            opacity: 0.4,
            transform: `rotate(${bgRotation}deg)`,
            filter: ' contrast(0.8) brightness(1.8) saturate(0.0)',
          }}
        />
    </div>
  );
};

export default AnalogUranusClock;