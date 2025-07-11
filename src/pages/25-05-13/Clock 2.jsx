import React, { useEffect } from 'react';
import woodImg from './wood.jpg';
import tilesImg from './tiles.jpg';
import hydFont from './hyd.ttf';

const FlatClock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const second = now.getSeconds();
      const minute = now.getMinutes();
      const hour = now.getHours() % 12;

      const secDeg = second * 6;
      const minDeg = minute * 6 + second * 0.1;
      const hourDeg = hour * 30 + minute * 0.5;

      document.getElementById('second-hand').style.transform = `rotate(${secDeg}deg)`;
      document.getElementById('minute-hand').style.transform = `rotate(${minDeg}deg)`;
      document.getElementById('hour-hand').style.transform = `rotate(${hourDeg}deg)`;

      document.getElementById('clock-time').textContent = `Current time: ${now.toLocaleTimeString()}`;
    };

    const tick = () => {
      updateClock();
      requestAnimationFrame(tick);
    };

    tick();
  }, []);

  useEffect(() => {
    const container = document.getElementById('clock-numbers');
    for (let i = 1; i <= 12; i++) {
      const numEl = document.createElement('div');
      numEl.className = 'number';
      numEl.textContent = i;

      const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
      const radiusPercent = 42;
      const x = 50 + radiusPercent * Math.cos(angle);
      const y = 50 + radiusPercent * Math.sin(angle);

      numEl.style.left = `${x}%`;
      numEl.style.top = `${y}%`;

      container.appendChild(numEl);
    }
  }, []);

  return (
    <>
      <style>
        {`
        @font-face {
          font-family: 'hyd';
          src: url(${hydFont}) format('truetype');
        }
        body {
          margin: 0;
          height: 100vh;
          background: linear-gradient(to top, #000000 0%, #122346 100%);
          overflow: hidden;
          perspective: 1000px;
        }
        .scene {
          width: 100%;
          height: 90%;
          transform-style: preserve-3d;
        }
        .grid-plane {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100vw;
          height: 100vh;
          transform: translate(-50%, -50%) rotateX(75deg);
          background-image: url(${woodImg});
          background-size: 100% 100%;
          opacity: 0.7;
          filter: saturate(40%) contrast(190%);
          background-color: #d5caaf;
          z-index: 2;
        }
        .clock {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 95vw;
          height: 95vw;
          max-height: 95vh;
          max-width: 95vh;
          background-image: url(${tilesImg});
          background-size: 100% 100%;
          border: 1vw solid #d3ab0d;
          border-radius: 50%;
          transform: translate(-50%, -50%) rotateX(75deg) translateZ(1px);
          box-shadow: 0 3vh 5vh rgba(5, 6, 6, 0.3), 1px 1vh 1vh rgba(65, 33, 33);
          overflow: visible;
          z-index: 9;
          filter: contrast(110%) brightness(90%);
        }
        .hand {
          position: absolute;
          width: 50%;
          height: 0.7vh;
          top: 50%;
          left: 50%;
          transform-origin: left center;
          z-index: 5;
          transition: transform 0.1s linear;
        }
        .hour {
          width: 30%;
          height: 3vh;
          background: #067d79;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        }
        .minute {
          height: 1.8vh;
          background: #6c42ea;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
        }
        .second {
          height: 0.8vh;
          background: red;
          box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          transition: transform 0s;
        }
        .numbers {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transform: translateZ(5px);
          z-index: 10;
        }
        .number {
          position: absolute;
          font-family: 'hyd', 'Roboto Slab', sans-serif;
          font-size: 12vh;
          color: #393705;
          text-shadow: rgb(135, 55, 46) 1px 1px 1px;
          text-align: center;
          transform: translate(-50%, -50%);
          line-height: 1;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}
      </style>

      <div className="scene">
        <div className="grid-plane"></div>
        <div className="clock">
          <div className="numbers" id="clock-numbers"></div>
          <div className="hand hour" id="hour-hand"></div>
          <div className="hand minute" id="minute-hand"></div>
          <div className="hand second" id="second-hand"></div>
        </div>
      </div>
      <div className="sr-only" id="clock-time" aria-live="polite"></div>
    </>
  );
};

export default FlatClock;
