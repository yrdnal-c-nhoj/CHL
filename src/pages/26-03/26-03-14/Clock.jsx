import React, { useState, useEffect } from 'react';
import backgroundImage from '../../../assets/images/26-03/26-03-14/mother.webp';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = (() => {
    let h = time.getHours();
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    const ms = time.getMilliseconds().toString().padStart(3, '0');
    const ampm = h >= 12 ? 'P.M.' : 'A.M.';
    h = h % 12 || 12;
    return `${h}:${m}:${s}.${ms} ${ampm}`;
  })();


  const ImageLayout = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000' }}>
      <img
        src={backgroundImage}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // 'none' keeps the image's original size
          objectFit: 'none', 
          // This forces the image to the top-left corner
          objectPosition: 'top left', 
        }}
      />
    </div>
  );
};


  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        background: '#000'
      }}
    >
      <ImageLayout />
      
      {/* Small Digital Clock - Upper Left Corner */}
      <div
        style={{
          position: 'absolute',
          top: '5px',
          left: '20px',
          color: '#DFECD7',
          fontSize: '2vh',
          fontFamily: 'monospace',
          // fontWeight: 'bold',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        {formattedTime}
      </div>
    </div>
  );
};

export default Clock;