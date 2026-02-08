import React, { useState, useEffect, useRef } from 'react';

// === Local assets ===
import bg1 from '../../../assets/clocks/26-01-01/fan.gif';
import myFontUrl from '../../../assets/fonts/26-01-01-fan.otf';

const InvertedClock = () => {
  const [time, setTime] = useState(new Date());
  const secondHandRef = useRef(null);
  const minHandRef = useRef(null);
  const hourHandRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      const ms = now.getMilliseconds();
      const seconds = now.getSeconds() + ms / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() + minutes / 60;

      // Note: Added -90 to the degree calculation to account for 
      // the CSS 'right: 50%' starting position (which points to 9 o'clock)
      const secondsDegrees = (seconds / 60) * 360 - 90;
      const minsDegrees = (minutes / 60) * 360 - 90;
      const hourDegrees = (hours / 12) * 360 - 90;

      if (secondHandRef.current) secondHandRef.current.style.transform = `translateY(-50%) rotate(${secondsDegrees}deg)`;
      if (minHandRef.current) minHandRef.current.style.transform = `translateY(-50%) rotate(${minsDegrees}deg)`;
      if (hourHandRef.current) hourHandRef.current.style.transform = `translateY(-50%) rotate(${hourDegrees}deg)`;
    }, 50);
    return () => clearInterval(t);
  }, []);

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000',
    display: 'flex',        // Added for layout centering
    alignItems: 'center',    // Centers vertically
    justifyContent: 'center', // Centers horizontally
  };

  const bgMediaStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bg1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
      filter: 'grayscale(1) brightness(1.2) sepia(1) hue-rotate(-50deg) saturate(9)',
    // filter: 'contrast(1.7)', // Add contrast and brightness filters to background only
  };

  const clockOverlayStyle = {
    position: 'relative',   // Relative to the flex container
    zIndex: 1,
    mixBlendMode: 'difference',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
  };

  const clockFaceStyle = {
    position: 'relative',
    width: '50vh', // Larger container to accommodate numbers without clipping
    height: '50vh',
  };

  const handBaseStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: 'white',
    transformOrigin: '0% 50%', // Rotate from the center of the clock
    borderRadius: '10px',
  };

  const numberStyle = (i) => {
    // Math.PI / 6 = 30 degrees per number
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 18; // Reduced distance from center in vh to move digits closer
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return {
      position: 'absolute',
      top: `calc(50% + ${y}vh)`,
      left: `calc(50% + ${x}vh)`,
      transform: 'translate(-50%, -50%)',
      fontFamily: 'MyFontScoped, sans-serif',
      fontSize: '7vh',
      color: 'white',
      lineHeight: 1,
      userSelect: 'none',
    };
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @font-face {
          font-family: 'MyFontScoped';
          src: url(${myFontUrl}) format('truetype');
        }
      `}</style>

      <div style={bgMediaStyle} />

      <div style={clockOverlayStyle}>
        <div style={clockFaceStyle}>
          {/* Numbers 1-12 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <div key={num} style={numberStyle(num)}>
              {num}
            </div>
          ))}

          {/* Hands centered with transformOrigin at the center of the face */}
          <div 
            ref={hourHandRef} 
            style={{ ...handBaseStyle, width: '18vh', height: '2vh', zIndex: 10 }} 
          />
          <div 
            ref={minHandRef} 
            style={{ ...handBaseStyle, width: '24vh', height: '1.2vh', zIndex: 11 }} 
          />
          <div 
            ref={secondHandRef} 
            style={{ ...handBaseStyle, width: '28vh', height: '0.4vh', zIndex: 12 }} 
          />
          
          {/* Optional: Center Pin to hide the joint */}
           <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '2vh',
            height: '2vh',
            borderRadius: '50%',
            backgroundColor: 'white',
            zIndex: 15
          }} /> 
        </div>
      </div>
    </div>
  );
};

export default InvertedClock;