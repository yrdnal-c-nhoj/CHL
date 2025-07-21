import React, { useEffect, useState } from 'react';
import cunFont from './cun.ttf';
import bgMain from './cuf.jpg';
import bgOverlay from './cun1.webp';

const CuneiformClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#062bb4',
        margin: 0,
        overflow: 'hidden',
        fontFamily: 'cun, sans-serif',
        position: 'relative',
      }}
    >
      <style>{`
        @font-face {
          font-family: 'cun';
          src: url(${cunFont}) format('truetype');
        }

        :root {
          font-size: 2vh;
        }

        body {
          margin: 0;
        }

        .clock-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-align: center;
        }

        .new-clock {
          font-size: 8rem;
          background: linear-gradient(to bottom,
            #0b0b0a 1%,
            #f2b02c 4%,
            #0b0b0a 9%,
            #cfc09f 27%,
            #ffecb3 40%,
            #7c560a 81%,
            #e3d9c5 93%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1vw;
          
        }

        .bgimage {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translate(-50%, -50%) scale(1.3);
          transform-origin: center;
          z-index: 1;
          filter: sepia(0.7) contrast(0.2) saturate(2.5);
        }

        .bgimage2 {
          position: absolute;
          top: 50%;
          left: 50%;
          width: auto;
          height: auto;
          max-width: 70vw;
          max-height: 70vw;
          object-fit: cover;
          transform: translate(-50%, -50%) scale(1.5);
          transform-origin: center;
          z-index: 2;
          animation: slow-rotate 800s linear infinite;
          pointer-events: none;
        }

        @keyframes slow-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.5); }
        }
      `}</style>

      <img src={bgOverlay} className="bgimage2" alt="Overlay Background" />
      <img src={bgMain} className="bgimage" alt="Main Background" />

      <div className="clock-container">
        <div className="new-clock">{time}</div>
      </div>
    </div>
  );
};

export default CuneiformClock;