import React, { useEffect, useState } from 'react';
import horizonFontUrl from './hori.otf';
import layer1 from './images/4c558c5dbff1828f2b87582dc49526e8.gif';
import layer2 from './images/sdfwef.gif';
import layer3 from './images/ewfsdfsd.gif';

const HorizonClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      hours = hours % 12 || 12;
      setTime(`${hours}${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100dvh', margin: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Load custom font */}
      <style>
        {`
          @font-face {
            font-family: 'HorizonFont';
            src: url(${horizonFontUrl}) format('opentype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* Sky on top */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '50vh',
        background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)',
        zIndex: 0,
      }} />

      {/* Ground and layers on bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '50vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'column',
        zIndex: 1,
      }}>
        {/* Layer 1 */}
        <img src={layer1} alt="Layer 1" style={{ width: '100%', height: 'auto' }} />
        {/* Layer 2 */}
        <img src={layer2} alt="Layer 2" style={{ width: '100%', height: 'auto' }} />
        {/* Layer 3 */}
        <img src={layer3} alt="Layer 3" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Clock display */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        fontSize: '7rem',
        fontFamily: 'HorizonFont, sans-serif',
        background: 'linear-gradient(to bottom, rgb(136, 145, 95) 50%, rgb(78, 136, 183) 50%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        zIndex: 10,
        userSelect: 'none',
      }}>
        {time.padStart(4, ' ').split('').map((char, i) => (
          <span key={i} style={{ display: 'inline-block', minWidth: '2.5rem', textAlign: 'center' }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HorizonClock;
