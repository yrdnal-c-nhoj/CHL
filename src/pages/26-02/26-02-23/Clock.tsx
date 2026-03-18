import React, { useState, useEffect } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import { useFontLoader } from '../../../utils/fontLoader';
import neptuneFont from '../../../assets/fonts/26-02-23-nep.ttf';
import nepBg from '../../../assets/images/26-02/26-02-23/nept.webp';
import loopBg from '../../../assets/images/26-02/26-02-23/swirl.gif';
import triBg from '../../../assets/images/26-02/26-02-23/tri.webp';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  // Load custom font
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'NeptuneFont';
        src: url('${neptuneFont}') format('truetype');
      }
    `;
    document.head.appendChild(style);

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      document.head.removeChild(style);
    };
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const DigitBox = ({ digit }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 5px',
      }}
    >
      <div
        style={{
          width: '5vh',
          height: '10vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '7vh',
          // fontWeight: 'bold',
          // textShadow: '0 0 10px #7FFFD4, 0 0 20px #40E0D0',
          background:
            'linear-gradient(45deg, #7FFFD4, #40E0D0, #00CED1, #7FFFD4)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation:
            'shimmer 3s ease-in-out infinite, aquaGlow 2s ease-in-out infinite alternate',
          fontFamily: 'NeptuneFont, monospace',
        }}
      >
        {digit}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 1. Tiled Background Layer (tri.webp) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${triBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px auto', // Adjust size of the triangles here

          zIndex: 0,
          animation: 'tileScroll 20s linear infinite',
        }}
      />

      {/* 2. Swirl Layer (loop.gif) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${loopBg})`,
          backgroundSize: '200% 200%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      {/* 3. Main Image Overlay (nep.webp) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${nepBg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 2,
          // opacity: 0.6,
        }}
      />

      {/* 4. Clock Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          opacity: 0.8,
          zIndex: 10, // Ensure clock is on top of all images
        }}
      >
        <DigitBox digit={hours[0]} />
        <DigitBox digit={hours[1]} />

        <DigitBox digit={minutes[0]} />
        <DigitBox digit={minutes[1]} />

        <DigitBox digit={seconds[0]} />
        <DigitBox digit={seconds[1]} />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes aquaGlow {
          0% {
            filter: brightness(1);
            transform: scale(1);
          }
          100% {
            filter: brightness(1.2);
            transform: scale(1.02);
          }
        }

        @keyframes tileScroll {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 -300px;
          }
        }
      `}</style>
    </div>
  );
};

export default DigitalClock;
