import React, { useEffect } from 'react';
import camFont from './cam.otf';
import bg1 from './cam.webp';
import bg2 from './camr.webp';
import bg3 from './ca.webp';
import bg4 from './camer.webp';

const FStopClock = () => {
  useEffect(() => {
    const hourHand = document.getElementById('fstop-hourHand');
    const minuteHand = document.getElementById('fstop-minuteHand');
    const secondHand = document.getElementById('fstop-secondHand');

    const updateClock = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      hourHand.style.transform = `rotate(${(hr + min / 60) * 30}deg)`;
      minuteHand.style.transform = `rotate(${(min + sec / 60) * 6}deg)`;
      secondHand.style.transform = `rotate(${sec * 6}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const clock = document.querySelector('.fstop-clock');
    const customDigits = ['f/1.0', 'f/1.4', 'f/2.0', 'f/2.8', 'f/4.0', 'f/5.6', 'f/8.0', 'f/11', 'f/16', 'f/22', 'f/32', 'f/45'];
    const sharpIndices = [];
    while (sharpIndices.length < 6) {
      const randIndex = Math.floor(Math.random() * 12);
      if (!sharpIndices.includes(randIndex)) sharpIndices.push(randIndex);
    }

    for (let i = 1; i <= 12; i++) {
      const angle = (i / 12) * 2 * Math.PI;
      const x = 50 + 42 * Math.sin(angle);
      const y = 50 - 42 * Math.cos(angle);
      const num = document.createElement('div');
      const isSharp = sharpIndices.includes(i - 1);
      num.className = `fstop-number ${isSharp ? 'fstop-sharp' : ''}`;
      num.style.left = `${x}%`;
      num.style.top = `${y}%`;
      num.textContent = customDigits[i - 1];
      const randomDelay = Math.random() * 10;
      num.style.animation = `fstop-blurFocus${isSharp ? 'Sharp' : ''} 5s infinite ${randomDelay}s`;
      clock.appendChild(num);
    }
  }, []);

  return (
    <div className="fstop-wrapper" style={{
      margin: 0,
      background: '#111',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <style>{`
        @font-face {
          font-family: 'fstop-cam';
          src: url(${camFont}) format('opentype');
        }

        .fstop-wrapper {
          font-size: 2vh;
        }

        .fstop-clock {
          width: 80vw;
          height: 80vw;
          max-width: 80vh;
          max-height: 80vh;
          border-radius: 50%;
          position: relative;
          opacity: 0.6;
          z-index: 9;
        }

        .fstop-number {
          position: absolute;
          font-family: 'fstop-cam';
          font-size: 2rem;
          color: white;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #e0e0e0 0%, #f8f8f8 20%, #b0b0b0 50%, #f0f0f0 80%, #d0d0d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow:
            0 0 0.3rem #ffffffaa,
            0 0 0.6rem #ccccccaa,
            0 0 0.9rem #bbbbbb88;
        }

        .fstop-sharp {
          font-weight: 900;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow: none;
        }

        @keyframes fstop-blurFocus {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.3;
          }
        }

        @keyframes fstop-blurFocusSharp {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes fstop-blurFocusHour {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.5;
          }
        }

        @keyframes fstop-blurFocusMinute {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.5;
          }
        }

        @keyframes fstop-blurFocusSecond {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(3px);
            opacity: 0.7;
          }
        }

        .fstop-hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          border-radius: 0.3rem;
          background: linear-gradient(
            to top,
            #cccccc 0%,
            #eeeeee 25%,
            #8d8b8b 50%,
            #ffffff 75%,
            #888888 100%
          );
        }

        .fstop-hour {
          width: 1rem;
          height: 20%;
          animation: fstop-blurFocusHour 5s infinite;
        }

        .fstop-minute {
          width: 0.7rem;
          height: 30%;
          background: #ccc;
          animation: fstop-blurFocusMinute 3s infinite;
        }

        .fstop-second {
          width: 0.3rem;
          height: 40%;
          animation: fstop-blurFocusSecond 1s infinite;
        }

        .fstop-bgimage, .fstop-bgimage2, .fstop-bgimage3, .fstop-bgimage4 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          filter: brightness(120%);
        }

        .fstop-bgimage2 { z-index: 1; }
        .fstop-bgimage  { z-index: 2; opacity: 0.5; }
        .fstop-bgimage3 { z-index: 3; opacity: 0.4; }
        .fstop-bgimage4 { z-index: 4; opacity: 0.2; width: 104vw; }
      `}</style>

      <img src={bg4} className="fstop-bgimage4" alt="bg4" />
      <img src={bg3} className="fstop-bgimage3" alt="bg3" />
      <img src={bg1} className="fstop-bgimage" alt="bg1" />
      <img src={bg2} className="fstop-bgimage2" alt="bg2" />

      <div className="fstop-clock">
        <div className="fstop-hand fstop-hour" id="fstop-hourHand"></div>
        <div className="fstop-hand fstop-minute" id="fstop-minuteHand"></div>
        <div className="fstop-hand fstop-second" id="fstop-secondHand"></div>
      </div>
    </div>
  );
};

export default FStopClock;
