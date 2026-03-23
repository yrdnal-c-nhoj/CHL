import React from 'react';
import pluWebp from '../../../assets/images/26-03/26-03-17/plu.webp';
import tileBgGif from '../../../assets/images/26-03/26-03-17/tile_bg.gif';
import topImageWebp from '../../../assets/images/26-03/26-03-17/0001-0160-ezgif.com-optiwebp-1.webp';
import { useMillisecondClock } from '../../../utils/useSmoothClock';

const Clock: React.FC = () => {
  const time = useMillisecondClock();
  const digitColor = '#5D0DA8';
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
        fontSize: isMobile ? '16vw' : '10vh',
        fontFamily: 'Metamorphous, monospace',
        textShadow: '1px 9px 0px rgb(255, 255, 255)',
      }}
    >
      {digit}
    </div>
  );

  const Separator: React.FC = () => (
    <div
      style={{
        color: digitColor,
        fontSize: isMobile ? '8vw' : '10vh',
        fontFamily: 'Metamorphous, monospace',
        margin: isMobile ? '0 1vw' : '0 2px',
        alignSelf: 'center',
        textShadow: '2px 4px 0px rgb(255, 255, 255)',
      }}
    >
      :
    </div>
  );

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            overflow: hidden;
            height: 100%;
            width: 100%;
          }
          
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
          height: '100dvh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
          background: 'radial-gradient(circle, #120910 0%, #0718B1 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          WebkitOverflowScrolling: 'touch',
        }}
      >
      <img
        src={pluWebp}
        alt="Full screen"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          objectFit: 'cover',
          opacity: 0.9,
          zIndex: 7,
          filter: 'hue-rotate(220deg) saturate(2.5) contrast(2.5)',
          transform: 'scaleX(-1)',
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${tileBgGif})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          zIndex: 2,
          opacity: 0.3,
          filter: 'hue-rotate(180deg) saturate(1.5)',
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.5,
          zIndex: 6,
          padding: isMobile ? '5px 3px' : '10px',
        }}
      >
        <DigitBox digit={hours[0] || '0'} />
        <DigitBox digit={hours[1] || '0'} />
        <Separator />
        
        <DigitBox digit={minutes[0] || '0'} />
        <DigitBox digit={minutes[1] || '0'} />
        <Separator />
        
        <DigitBox digit={seconds[0] || '0'} />
        <DigitBox digit={seconds[1] || '0'} />
        <Separator />
        
        <DigitBox digit={milliseconds[0] || '0'} />
        <DigitBox digit={milliseconds[1] || '0'} />
      </div>
      
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
          filter: 'hue-rotate(270deg) saturate(1.5)',
          transform: 'translate(-50%, -50%) scaleX(-1)',
        }}
      />
    </div>
    </>
  );
};

export default Clock;
