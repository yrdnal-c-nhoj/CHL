import React, { useState, useEffect } from 'react';
// Import your images as before
import scorpImage from '../../../assets/images/25-05-02/sand.webp';
import hourHandImage from '../../../assets/images/25-05-02/giphy1-ezgif.com-rotate(1).gif';
import minuteHandImage from '../../../assets/images/25-05-02/giphy1-ezgif.com-rotate(2).gif';
import secondHandImage from '../../../assets/images/25-05-02/giphy1-ezgif.com-rotate(3).gif';
import fontFile from '../../../assets/fonts/25-05-02-scorp.ttf';

// Generate unique font name once, outside the component
const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
const uniqueFontName = `Font_${dateStr}_${randomStr}`;

export default function Clock() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Use the pre-generated unique font name
    const fontUrl = fontFile;

    // Create FontFace and load it
    const font = new FontFace(uniqueFontName, `url(${fontUrl})`);
    font.load().then(loaded => {
      document.fonts.add(loaded);
      console.log(`${uniqueFontName} loaded successfully`);
      setFontLoaded(true);
    }).catch((err) => {
      console.error('Font loading failed:', err);
      // Fallback to true so the app doesn't stay blank forever
      setFontLoaded(true); 
    });

    // Clock Animation Logic
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const jitter = () => Math.random() * 2 - 1;
      const secondDeg = seconds * 6 + jitter() * 0.3;
      const minuteDeg = minutes * 6 + seconds / 10 + jitter() * 0.02;
      const hourDeg = hours * 30 + minutes / 2 + jitter() * 0.005;

      const secondScale = 1 + Math.sin(seconds * Math.PI / 30) * 0.05;
      const minuteScale = 1 + Math.sin(minutes * Math.PI / 30) * 0.03;
      const hourScale = 1 + Math.sin(hours * Math.PI / 6) * 0.02;

      const secondHand = document.querySelector('.second-hand');
      const minuteHand = document.querySelector('.minute-hand');
      const hourHand = document.querySelector('.hour-hand');

      if (secondHand) {
        secondHand.style.transform = `translate(-50%, -50%) rotate(${secondDeg}deg) scaleY(${secondScale})`;
      }
      if (minuteHand) {
        minuteHand.style.transform = `translate(-50%, -50%) rotate(${minuteDeg}deg) scaleY(${minuteScale})`;
      }
      if (hourHand) {
        hourHand.style.transform = `translate(-50%, -50%) rotate(${hourDeg}deg) scaleY(${hourScale})`;
      }
    };

    const interval = setInterval(updateClock, 50);
    updateClock();
    return () => {
      clearInterval(interval);
      // Font cleanup is handled automatically when component unmounts
      // No need to manually remove from document.fonts
    };
  }, []);

  // Block rendering until font is ready
  if (!fontLoaded) return null;

  const numbers = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    rotation: i * 30,
  }));

  return (
    <div style={{
      margin: 0, 
      background: 'rgb(9,9,9)', 
      width: '100vw', 
      height: '100dvh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      overflow: 'hidden'
    }}>
      <img
        src={scorpImage}
        alt="Background"
        style={{
          position: 'absolute',
          width: '100vh',
          height: '100vw',
          opacity: 0.7,
          transform: 'translate(-50%, -50%) rotate(90deg)',
          left: '50%',
          top: '50%',
          objectFit: 'cover'
        }}
      />

      <div style={{ position: 'relative', width: '90vmin', height: '90vmin' }}>
        {numbers.map((num) => (
          <div
            key={num.value}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              fontSize: '16.5vmin',
              color: '#c5c53e',
              fontFamily: uniqueFontName, // Using the pre-generated unique name
              textShadow: '#09f745 0.1rem 0.1rem, #080808 -0.1rem 0.1rem',
              transform: `rotate(${num.rotation}deg)`,
            }}
          >
            <div
              className="clock-number"
              style={{
                position: 'absolute',
                width: '100%',
                top: '5%',
              }}
            >
              {num.value}
            </div>
          </div>
        ))}

        {/* Hour Hand */}
        <div
          className="hour-hand"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transformOrigin: 'center',
            zIndex: 4,
          }}
        >
          <img
            src={hourHandImage}
            alt="Hour Hand"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Minute Hand */}
        <div
          className="minute-hand"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transformOrigin: 'center',
            zIndex: 5,
          }}
        >
          <img
            src={minuteHandImage}
            alt="Minute Hand"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Second Hand */}
        <div
          className="second-hand"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transformOrigin: 'center',
            zIndex: 6,
          }}
        >
          <img
            src={secondHandImage}
            alt="Second Hand"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}
