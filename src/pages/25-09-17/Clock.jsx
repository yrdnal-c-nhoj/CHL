import React, { useState, useEffect } from 'react';
import backgroundImage from './crush.jpg'; // Replace with your actual background image path
import fontFile from './crush.ttf'; // Replace with your actual font file path

// Helper function to pad numbers with leading zero
const pad = (n) => n.toString().padStart(2, '0');

// Component
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  // Inject @font-face dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${fontFile}) format('truetype');
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
        font-variation-settings: 'wght' 400; /* Default; can vary based on time/date if desired */
      }
    `;
    document.head.appendChild(style);

    // Preload font
    document.fonts.load('10rem CustomClockFont').then(() => {
      setIsLoaded(true);
    }).catch((err) => {
      console.error('Font loading error:', err);
      setIsLoaded(true); // Fallback to loaded state
    });

    // Cleanup on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time
  const hours = pad(time.getHours() % 12 || 12);
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  if (!isLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: 'black',
          zIndex: 9999,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        fontFamily: 'CustomClockFont, sans-serif',
        fontVariationSettings: '"wght" 400',
      }}
    >
      {/* Background image with filter */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(300%) hue-rotate(-240deg)', // Apply filter only to background
          zIndex: 1,
        }}
      />
      {/* Clock content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2, // Ensure clock text is above the filtered background
        }}
      >
        {/* Hours - Upper left at 17°, split into two boxes */}
        <div
          style={{
            position: 'absolute',
            top: '1vh',
            left: '2rem',
            transform: 'rotate(23deg)',
            transformOrigin: 'left center',
            fontSize: '23vh',
            color: '#F65427FF', // Pink for first hour digit
            opacity: '0.9',
            whiteSpace: 'nowrap',
          }}
        >
          {hours[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '16vh',
            left: '10rem', // Offset for second digit
            transform: 'rotate(-20deg)',
            transformOrigin: 'left center',
            fontSize: '29vh',
            color: '#F112C8FF', // Orange for second hour digit
            opacity: '0.8',
            whiteSpace: 'nowrap',
          }}
        >
          {hours[1]}
        </div>

        {/* Minutes - Center lower left at -27°, split into two boxes */}
        <div
          style={{
            position: 'absolute',
            top: '33vh',
            left: '4rem',
            transform: 'rotate(27deg) translateY(50%)',
            fontSize: '33vh',
            color: '#07DFDFFF', // Green for first minute digit
            opacity: '0.9',
            whiteSpace: 'nowrap',
            textAlign: 'left',
          }}
        >
          {minutes[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '55vh',
            left: '3rem', // Offset for second digit
            transform: 'rotate(-67deg) translateY(50%)',
            fontSize: '33vh',
            color: '#F0F406FF', // Cyan for second minute digit
            // opacity: '0.8',
            whiteSpace: 'nowrap',
            textAlign: 'left',
          }}
        >
          {minutes[1]}
        </div>

        {/* Seconds - Upper right at -52°, split into two boxes */}
        <div
          style={{
            position: 'absolute',
            top: '1vh',
            right: '28vw', // Offset for first digit
            transform: 'rotate(52deg)',
            transformOrigin: 'right center',
            fontSize: '33vh',
            color: '#EB0CC5FF', // Pink for first second digit
            opacity: '0.7',
            whiteSpace: 'nowrap',
          }}
        >
          {seconds[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '3vh',
            right: '5vw',
            transform: 'rotate(-22deg)',
            transformOrigin: 'right center',
            fontSize: '23vh',
            color: '#AEF606FF', // Yellow for second second digit
            opacity: '0.8',
            whiteSpace: 'nowrap',
          }}
        >
          {seconds[1]}
        </div>

        {/* AM/PM - Bottom right at 22°, split into two boxes */}
        <div
          style={{
            position: 'absolute',
            top: '61vh',
            right: '5vw', // Offset for first character (A or P)
            transform: 'rotate(-6deg)',
            transformOrigin: 'left bottom',
            fontSize: '23vh',
            color: '#7A73E5FF', // Purple for first AM/PM character
            opacity: '0.7',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          {ampm[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '78vh',
            right: '3vw',
            transform: 'rotate(22deg)',
            transformOrigin: 'left bottom',
            fontSize: '19vh',
            color: '#E50AD6FF', // Deep pink for second AM/PM character
            opacity: '0.8',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          {ampm[1]}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;