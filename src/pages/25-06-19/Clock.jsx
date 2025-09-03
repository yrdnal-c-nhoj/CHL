import React, { useEffect, useRef } from 'react';

const CmykClock = () => {
  const canvasRef = useRef(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const sectors = ['cyan', 'magenta', 'yellow'];

    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = now.getHours() % 12 + min / 60;

      const secondDeg = (sec / 60) * 360;
      const minuteDeg = (min / 60) * 360;
      const hourDeg = (hr / 12) * 360;

      const secondRad = ((secondDeg - 90) * Math.PI) / 180;
      const minuteRad = ((minuteDeg - 90) * Math.PI) / 180;
      const hourRad = ((hourDeg - 90) * Math.PI) / 180;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) * 0.7;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const angles = [secondRad, minuteRad, hourRad]
        .map((a) => (a + 2 * Math.PI) % (2 * Math.PI))
        .sort((a, b) => a - b);

      for (let i = 0; i < 3; i++) {
        const start = angles[i];
        const end =
          angles[(i + 1) % 3] <= start
            ? angles[(i + 1) % 3] + 2 * Math.PI
            : angles[(i + 1) % 3];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = sectors[i];
        ctx.fill();
      }

      const sh = document.querySelector('.second-hand');
      const mh = document.querySelector('.minute-hand');
      const hh = document.querySelector('.hour-hand');
      if (sh) sh.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      if (mh) mh.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      if (hh) hh.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);
  }, []);

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background: black;
        }

        .clock {
          position: fixed;
          top: 0;
          left: 0;
          height: 100dvh;
          width: 100vw;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: block;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          background-color: rgb(6, 0, 0);
          z-index: 2;
        }

        .hour-hand {
          width: 1rem;
          height: 230vh;
        }

        .minute-hand {
          width: 0.6rem;
          height: 240vh;
        }

        .second-hand {
          width: 0.3rem;
          height: 245vh;
        }

        .date-container {
          color: rgb(168, 154, 154);
          position: absolute;
          bottom: 0.5vh;
          left: 50%;
          transform: translateX(-50%);
          width: 98vw;
          display: flex;
          justify-content: center;
          font-size: 1.2rem;
          z-index: 6;
        }
      `}</style>

      <div className="clock">
        <canvas ref={canvasRef} />
        <div className="hand hour-hand" />
        <div className="hand minute-hand" />
        <div className="hand second-hand" />
        <div className="date-container"> {/* Optional date text can go here */}</div>
      </div>
    </>
  );
};

export default CmykClock;
