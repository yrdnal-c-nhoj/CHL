import React, { useEffect, useRef, useState } from 'react';
import stickFont from './Stick.ttf'; // Local font in same folder

const SkewClock = () => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState({ hours: '', minutes: '' });
  const [skew, setSkew] = useState(0);
  const [stretch, setStretch] = useState(1);
  const targetSkew = useRef(0);
  const targetStretch = useRef(1);
  const currentColor = useRef('rgb(255,0,0)');
  const outlineColor = useRef('transparent');
  const currentTime = useRef('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getRandomVibrantColor = () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 100%, 50%)`;
    };

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours() % 12;
      const minutes = String(now.getMinutes()).padStart(2, '0');
      currentTime.current = `${hours}${minutes}`;
      setTime({ hours, minutes });
      currentColor.current = getRandomVibrantColor();
      outlineColor.current = getRandomVibrantColor();
      targetSkew.current = (Math.random() - 0.5) * 500;
      targetStretch.current = 0.6 + Math.random() * 0.8;
    };

    const drawText = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${canvas.height * 0.2}px 'skew-stick', sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      ctx.setTransform(
        stretch,
        skew * 0.01,
        skew * 0.01,
        1,
        canvas.width / 2,
        canvas.height / 2
      );

      ctx.lineWidth = 0.5 * canvas.height * 0.01;
      ctx.strokeStyle = outlineColor.current;
      ctx.strokeText(currentTime.current, 0, 0);

      ctx.fillStyle = currentColor.current;
      ctx.fillText(currentTime.current, 0, 0);
    };

    const animate = () => {
      setSkew((prev) => prev + (targetSkew.current - prev) * 0.1);
      setStretch((prev) => prev + (targetStretch.current - prev) * 0.1);
      drawText();
      requestAnimationFrame(animate);
    };

    const spinClock = () => {
      const container = document.querySelector('.skew-time-container');
      const rx = Math.random() * 360;
      const ry = Math.random() * 360;
      const rz = Math.random() * 360;
      container.style.transform += ` rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    updateClock();
    animate();
    const tick = setInterval(updateClock, 1000);
    const spin = setInterval(spinClock, 5000);

    return () => {
      clearInterval(tick);
      clearInterval(spin);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [skew, stretch]);

  return (
    <div className="skew-wrapper" style={{ fontFamily: 'skew-stick, sans-serif' }}>
      <style>{`
        @font-face {
          font-family: 'skew-stick';
          src: url(${stickFont}) format('truetype');
        }

        .skew-wrapper * {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .skew-wrapper {
          background: gainsboro;
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: relative;
          font-size: 1rem;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        }

        .skew-time-container {
          color: gainsboro;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 98vw;
          display: flex;
          justify-content: space-around;
          z-index: -1;
          transition: transform 0.5s ease;
        }

        .skew-title-container {
          color: #67ac87;
          text-shadow: #516a62 0.1rem 0 0;
          position: absolute;
          top: 0.3vh;
          left: 50%;
          transform: translateX(-50%);
          width: 98vw;
          display: flex;
          z-index: 6;
        }

        .skew-chltitle {
          font-family: 'Roboto Slab', serif;
          font-size: 2.8vh;
          position: absolute;
          top: 0.2vh;
          right: 1vw;
          letter-spacing: 0.1vh;
        }

        .skew-bttitle {
          font-family: 'Oxanium', serif;
          font-size: 2.8vh;
          font-style: italic;
          left: 0;
          position: relative;
          letter-spacing: -0.1vh;
          z-index: 15;
        }

        .skew-date-container {
          color: darkcyan;
          position: absolute;
          bottom: 0.5vh;
          left: 50%;
          transform: translateX(-50%);
          width: 98vw;
          display: flex;
          z-index: 6;
        }

        .skew-clockname {
          font-family: 'Oxanium', serif;
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          font-size: 4vh;
          line-height: 4vh;
        }

        .skew-dateleft,
        .skew-dateright {
          font-size: 3vh;
          font-family: 'Nanum Gothic Coding', monospace;
        }

        .skew-dateleft {
          position: relative;
          left: 0;
        }

        .skew-dateright {
          position: absolute;
          right: 0;
        }

        .skew-time {
          font-size: 6vh;
        }

        @media (min-width: 48rem) {
          .skew-time-container {
            flex-direction: row;
          }
          .skew-time {
            font-size: 8vh;
          }
        }

        @media (max-width: 47.9375rem) {
          .skew-time-container {
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `}</style>

      <div className="skew-title-container">
        <div className="skew-chltitle">Cubist Heart Laboratories</div>
        <div className="skew-bttitle">BorrowedTime</div>
      </div>

      <div className="skew-date-container">
        <a href="../bandaid/" className="skew-dateleft">04/25/25</a>
        <a href="../index.html" className="skew-clockname">Skew Clock</a>
        <a href="../coin/" className="skew-dateright">04/27/25</a>
      </div>

      <div className="skew-time-container">
        <div className="skew-time">{time.hours}</div>
        <div className="skew-time">{time.minutes}</div>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
};

export default SkewClock;
