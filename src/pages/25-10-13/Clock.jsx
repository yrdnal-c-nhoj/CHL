import React, { useState, useEffect } from 'react';
import venusBackground from './disc.gif';
import venusSymbol from './disc.gif';
import font_20251008 from './stt.ttf';

const VenusClock = () => {
  const [time, setTime] = useState(new Date());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Inject font
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'VenusFont';
        src: url(${font_20251008}) format('woff2');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);

    // Fade in effect
    setTimeout(() => setLoaded(true), 100);

    // Update time
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      document.head.removeChild(style);
    };
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const clockNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: loaded ? `url(${venusBackground})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'opacity 1s ease-in',
      opacity: loaded ? 1 : 0,
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        width: '80vmin',
        height: '80vmin',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 180, 0.3), rgba(139, 69, 19, 0.2))',
        backdropFilter: 'blur(10px)',
        border: '0.5vmin solid rgba(255, 215, 180, 0.5)',
        boxShadow: '0 0 5vmin rgba(255, 215, 180, 0.4), inset 0 0 3vmin rgba(0, 0, 0, 0.3)'
      }}>
        {/* Center Venus symbol */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '10vmin',
          height: '10vmin',
          backgroundImage: `url(${venusSymbol})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.6,
          zIndex: 0
        }} />

        {/* Clock numbers */}
        {clockNumbers.map((num, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const radius = 32;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          return (
            <div key={num} style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: 'VenusFont, serif',
              fontSize: '4vmin',
              color: '#FFD7B4',
              textShadow: '0 0 1vmin rgba(255, 215, 180, 0.8)',
              fontWeight: 'bold',
              zIndex: 1
            }}>
              {num}
            </div>
          );
        })}

        {/* Hour hand */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1vmin',
          height: '20vmin',
          backgroundColor: '#FFD7B4',
          transformOrigin: 'top center',
          transform: `translate(-50%, 0) rotate(${hourAngle}deg)`,
          borderRadius: '1vmin',
          boxShadow: '0 0 1vmin rgba(255, 215, 180, 0.8)',
          zIndex: 2
        }} />

        {/* Minute hand */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '0.7vmin',
          height: '28vmin',
          backgroundColor: '#FFF5E1',
          transformOrigin: 'top center',
          transform: `translate(-50%, 0) rotate(${minuteAngle}deg)`,
          borderRadius: '0.7vmin',
          boxShadow: '0 0 1vmin rgba(255, 245, 225, 0.8)',
          zIndex: 3
        }} />

        {/* Second hand */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '0.3vmin',
          height: '32vmin',
          backgroundColor: '#FFB6C1',
          transformOrigin: 'top center',
          transform: `translate(-50%, 0) rotate(${secondAngle}deg)`,
          borderRadius: '0.3vmin',
          boxShadow: '0 0 0.5vmin rgba(255, 182, 193, 0.9)',
          zIndex: 4
        }} />

        {/* Center dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '2vmin',
          height: '2vmin',
          borderRadius: '50%',
          backgroundColor: '#FFD7B4',
          boxShadow: '0 0 1vmin rgba(255, 215, 180, 1)',
          zIndex: 5
        }} />
      </div>
    </div>
  );
};

export default VenusClock;