import React, { useState, useEffect } from 'react';
import backgroundImage from '../../../assets/images/26-03/26-03-14/mother.webp';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 100); // changed to 100ms – smoother & lighter on CPU
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
            objectFit: 'none',
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
        background: '#000',
      }}
    >
      <ImageLayout />

      {/* Small Digital Clock - Upper Left Corner – now blurrier & semi-transparent */}
      <div
        style={{
          position: 'absolute',
          top: '5px',
          left: '20px',
          color: '#DFECD7',
          fontSize: '2vh',
          fontFamily: 'monospace',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: 0.8,                    // ← added
          filter: 'blur(0.6px)',           // ← added (0.4–0.8px usually gives a nice soft look)
          // Optional: you can experiment with these values too:
          // filter: 'blur(0.7px) brightness(1.05)',
        }}
      >
        {formattedTime}
      </div>
    </div>
  );
};

export default Clock;