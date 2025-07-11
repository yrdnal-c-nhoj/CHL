import React, { useEffect } from 'react';
import bananaGif from './banana.gif';
import spinningBanana from './yellow-spinning-banana.gif';
import hourHand from './baaa.png';
import minuteHand from './bana.png';
import secondHand from './ban.png';
import banFont from './Ban.ttf';

const BananaClock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const secondDeg = seconds * 6;
      const minuteDeg = minutes * 6 + seconds * 0.1;
      const hourDeg = hours * 30 + minutes * 0.5;

      document.getElementById('secondHand').style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
      document.getElementById('minuteHand').style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
      document.getElementById('hourHand').style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  // Create banana tiles dynamically
  const tileCount = 8 * 8;
  const tiles = Array.from({ length: tileCount }, (_, i) => (
    <img
      key={i}
      src={bananaGif}
      alt="banana tile"
      style={{
        width: '15vw',
        height: '15vw',
        objectFit: 'cover',
      }}
    />
  ));

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
        fontSize: '13px',
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Ban';
          src: url(${banFont}) format('truetype');
        }
      `}</style>

      {/* Background tiles */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 15vw)',
          gridAutoRows: '15vw',
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        {tiles}
      </div>

      {/* Clock hands and center */}
      <div
        className="clock"
        style={{
          position: 'absolute',
          top: '47%',
          left: '55%',
          width: '70vmin',
          height: '70vmin',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <img src={hourHand} alt="hour" className="hand hour-hand" id="hourHand"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '25%',
            height: '20%',
            transformOrigin: '50% 100%',
            zIndex: 3,
            filter: 'brightness(160%)',
          }}
        />
        <img src={minuteHand} alt="minute" className="hand minute-hand" id="minuteHand"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '28%',
            height: '40%',
            transformOrigin: '50% 100%',
            zIndex: 2,
            filter: 'contrast(150%)',
          }}
        />
        <img src={secondHand} alt="second" className="hand second-hand" id="secondHand"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '22%',
            height: '50%',
            transformOrigin: '50% 100%',
            zIndex: 4,
          }}
        />

        {/* Clock Numbers */}
        {[
          [12, '10%', '50%'],
          [1, '19%', '73%'],
          [2, '36%', '87%'],
          [3, '50%', '92%'],
          [4, '64%', '87%'],
          [5, '81%', '73%'],
          [6, '90%', '50%'],
          [7, '81%', '27%'],
          [8, '64%', '13%'],
          [9, '50%', '8%'],
          [10, '36%', '13%'],
          [11, '19%', '27%'],
        ].map(([num, top, left]) => (
          <div
            key={num}
            style={{
              position: 'absolute',
              top,
              left,
              fontFamily: 'Ban, sans-serif',
              color: 'rgb(247, 227, 6)',
              textShadow: '#af8704 0.5rem 0.5rem, #483909 -0.1rem -0.1rem',
              fontSize: '8rem',
              fontWeight: 'bold',
              opacity: 0.7,
              width: '10%',
              textAlign: 'center',
              transform: 'translate(-190%, -50%)',
            }}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          100% { transform: translate(-50%, -50%) rotate(-360deg) scale(1.5); }
        }
        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `}</style>
    </div>
  );
};

export default BananaClock;
