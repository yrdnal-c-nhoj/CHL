import React, { useState, useEffect } from 'react';
import type { ClockTime } from '@/types/clock';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const digitColor = '#0A0A0B'; // Single variable to control color of digits and separators

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 10); // Update every 10ms for smooth milliseconds

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0');
    
    return { hours, minutes, seconds, milliseconds };
  };

  const { hours, minutes, seconds, milliseconds } = formatTime(time);

  const DigitBox: React.FC<{ digit: string }> = ({ digit }) => (
    <div
      style={{
        width: '40px',
        height: '50px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: digitColor,
        fontSize: '12vh',
        fontFamily: 'Metamorphous, monospace',
        textShadow: '2px 0px 0px rgba(255, 255, 255, 0.8)',
      }}
    >
      {digit}
    </div>
  );

  const Separator: React.FC = () => (
    <div
      style={{
        color: digitColor,
        fontSize: '12vh',
        fontFamily: 'Metamorphous, monospace',
        fontWeight: 'bold',
        margin: '0 4px',
        alignSelf: 'center',
        textShadow: '2px 0px 0px rgba(255, 255, 255, 0.8)',
      }}
    >
      :
    </div>
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle, #9DB1F6 0%, #61079A 100%)',
      }}
    >
      {/* Full screen background image */}
      <img
        src="/src/assets/images/26-03/26-03-17/plu.webp"
        alt="Full screen"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          objectFit: 'cover',
          zIndex: 1,
          filter: 'hue-rotate(230deg) saturate(1.5)',
        }}
      />
      
      {/* Tiled overlay image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: 'url(/src/assets/images/26-03/26-03-17/tile_bg.gif)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          zIndex: 2,
          opacity: 0.8,
          filter: 'hue-rotate(180deg) saturate(1.5)',
        }}
      />
      
      {/* Digital Clock */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        {/* Hours */}
        <DigitBox digit={hours[0] || '0'} />
        <DigitBox digit={hours[1] || '0'} />
        <Separator />
        
        {/* Minutes */}
        <DigitBox digit={minutes[0] || '0'} />
        <DigitBox digit={minutes[1] || '0'} />
        <Separator />
        
        {/* Seconds */}
        <DigitBox digit={seconds[0] || '0'} />
        <DigitBox digit={seconds[1] || '0'} />
        <Separator />
        
        {/* Milliseconds */}
        <DigitBox digit={milliseconds[0] || '0'} />
        <DigitBox digit={milliseconds[1] || '0'} />
      </div>
      
    
      
      {/* New top image overlay */}
      <img
        src="/src/assets/images/26-03/26-03-17/0001-0160-ezgif.com-optiwebp-1.webp"
        alt="Top overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '100vw',
          maxHeight: '100vh',
          zIndex: 4,
          pointerEvents: 'none',
          opacity: 0.5,
          filter: 'hue-rotate(270deg) saturate(1.5)',
        }}
      />
    </div>
  );
};

export default Clock;
