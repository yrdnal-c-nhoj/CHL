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
      className="cunei-wrapper"
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#062bb4',
        margin: 0,
        overflow: 'hidden',
        fontFamily: 'cunei-cun, sans-serif',
        position: 'relative',
      }}
    >
      <style>{`
        @font-face {
          font-family: 'cunei-cun';
          src: url(${cunFont}) format('truetype');
        }

        .cunei-wrapper {
          font-size: 2vh;
        }

        .cunei-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-align: center;
        }

        .cunei-clock {
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

        .cunei-bg-main {
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

        .cunei-bg-overlay {
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
          animation: cunei-slow-rotate 800s linear infinite;
          pointer-events: none;
        }

        @keyframes cunei-slow-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.5); }
        }
      `}</style>

      <img src={bgOverlay} className="cunei-bg-overlay" alt="Overlay Background" />
      <img src={bgMain} className="cunei-bg-main" alt="Main Background" />

      <div className="cunei-container">
        <div className="cunei-clock">{time}</div>
      </div>
    </div>
  );
};

export default CuneiformClock;
