import React, { useEffect } from 'react';
import bardImg from './bard.webp';
import barrsImg from './barrs.webp';
import berFont from './ber.otf';

const BarrelrollClock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const second = now.getSeconds();
      const minute = now.getMinutes();
      const hour = now.getHours();

      const secondDeg = second * 6;
      const minuteDeg = minute * 6 + second * 0.1;
      const hourDeg = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

      document.getElementById('second').style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      document.getElementById('minute').style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      document.getElementById('hour').style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000',
      fontSize: '1rem',
    }}>
      <style>{`
        @font-face {
          font-family: 'ber';
          src: url(${berFont}) format('opentype');
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
        }

        .spin-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 380vw;
          height: 280vh;
          transform-origin: center;
          animation: spin 60s linear infinite;
          transform: translate(-50%, -50%);
        }

        .half {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
        }

        .left {
          left: 0;
        }

        .right {
          right: 0;
        }

        .half img {
          position: absolute;
          width: 200%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9) contrast(1.4);
        }

        .left img {
          transform: rotate(-90deg);
          left: 0;
        }

        .right img {
          transform: rotate(-90deg);
          right: 0;
        }

        .center-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0.3vw;
          height: 100%;
          background: rgb(128, 126, 126);
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes counterspin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        .clock {
          position: absolute;
          font-family: 'ber', sans-serif;
          top: 50%;
          left: 50%;
          width: 100vmin;
          height: 100vmin;
          border: 0.3vw solid rgb(128, 126, 126);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          animation: counterspin 60s linear infinite;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          background: rgb(128, 126, 126);
          z-index: 12;
        }

        .hour {
          width: 0.4vw;
          height: 30%;
        }

        .minute {
          width: 0.4vw;
          height: 50%;
        }

        .second {
          width: 0vw;
          height: 45%;
          background: red;
        }

        .number {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8vmin;
          height: 8vmin;
          line-height: 8vmin;
          text-align: center;
          font-size: 1.5rem;
          font-family: 'ber', Arial, sans-serif;
          color: rgb(128, 126, 126);
          z-index: 13;
          transform: translate(-50%, -50%) rotate(calc(30deg * var(--i))) translateY(-42vmin) rotate(calc(-30deg * var(--i)));
        }



     
      `}</style>

    

      <div className="container">
        <div className="spin-wrapper">
          <div className="half left">
            <img src={bardImg} alt="Left Image" />
          </div>
          <div className="half right">
            <img src={barrsImg} alt="Right Image" />
          </div>
          <div className="center-line"></div>
        </div>

        <div className="clock" id="clock">
          {[...Array(12)].map((_, i) => (
            <div className="number" key={i} style={{ '--i': i + 1 }}>{i + 1}</div>
          ))}

          <div className="hand hour" id="hour"></div>
          <div className="hand minute" id="minute"></div>
          <div className="hand second" id="second"></div>
        </div>
      </div>
    </div>
  );
};

export default BarrelrollClock;
