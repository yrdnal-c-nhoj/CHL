import React, { useState, useEffect } from 'react';
import type { ClockTime } from '@/types/clock';
import pluWebp from '../../../assets/images/26-03/26-03-17/plu.webp';
import tileBgGif from '../../../assets/images/26-03/26-03-17/tile_bg.gif';
import topImageWebp from '../../../assets/images/26-03/26-03-17/0001-0160-ezgif.com-optiwebp-1.webp';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const digitColor = '#0A0A0B'; // Single variable to control color of digits and separators
  
  // Check if mobile for responsive sizing
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
        width: isMobile ? '8vw' : '40px',
        height: isMobile ? '10vw' : '50px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: digitColor,
        fontSize: isMobile ? '12vw' : '8vh',
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
        fontSize: isMobile ? '6vw' : '8vh',
        fontFamily: 'Metamorphous, monospace',
        margin: isMobile ? '0 2vw' : '0 4px',
        alignSelf: 'center',
        textShadow: '2px 0px 0px rgba(255, 255, 255, 0.8)',
      }}
    >
      :
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes spinCounterclockwise {
            from { transform: translate(-50%, -50%) scaleX(-1) rotate(0deg); }
            to { transform: translate(-50%, -50%) scaleX(-1) rotate(360deg); }
          }
          
          .spinning-image {
            animation: spinCounterclockwise 60s linear infinite;
          }
        `}
      </style>
      
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
          background: 'radial-gradient(circle, #120910 0%, #0718B1 100%)',
        }}
      >
      {/* Full screen background image */}
      <img
        src={pluWebp}
        alt="Full screen"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          // opacity: 0.4,
          zIndex: 1,
          filter: 'hue-rotate(230deg) saturate(1.5)',
          transform: 'scaleX(-1)',
        }}
      />
      
      {/* Tiled overlay image */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${tileBgGif})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          zIndex: 2,
          opacity: 0.3,
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
          opacity: 0.5,
          zIndex: 3,
          padding: isMobile ? '10px 5px' : '20px',
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
      
    
      
      {/* New top image overlay - tiled from center */}
      <div
        className="spinning-image"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200vw',
          height: '200vh',
          backgroundImage: `url(${topImageWebp})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          zIndex: 4,
          pointerEvents: 'none',
          opacity: 0.5,
          filter: 'hue-rotate(270deg) saturate(1.5)',
          transform: 'translate(-50%, -50%) scaleX(-1)',
        }}
      />
    </div>
    </>
  );
};

export default Clock;
