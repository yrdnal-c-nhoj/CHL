import React, { useEffect, useRef, useState } from 'react';
import stickFont from './Stick.ttf'; // Local font file in same folder

const SkewClock = () => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState({ digits: ['0','0','0','0'], colors: ['white','white','white','white'] });
  const [skew, setSkew] = useState(0);
  const [stretch, setStretch] = useState(1);
  const targetSkew = useRef(0);
  const targetStretch = useRef(1);
  const outlineColor = useRef('white');

  const getRandomVibrantColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours() % 12;
      if (hours === 0) hours = 12;
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const digits = `${hours}${minutes}`.padStart(4, '0').split('');
      const colors = digits.map(() => getRandomVibrantColor());
      setTime({ digits, colors });

      outlineColor.current = getRandomVibrantColor();
      targetSkew.current = (Math.random() - 0.5) * 500;
      targetStretch.current = 0.6 + Math.random() * 0.8;
    };

    const drawText = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.font = `${canvas.height * 0.2}px 'skew-stick', sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const spacing = canvas.width * 0.15;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      time.digits.forEach((digit, i) => {
        const x = centerX + (i - 1.5) * spacing + (Math.random() - 0.5) * 10;
        const y = centerY + (Math.random() - 0.5) * 10;

        ctx.setTransform(
          stretch,
          skew * 0.01,
          skew * 0.01,
          1,
          x,
          y
        );

        ctx.strokeStyle = outlineColor.current;
        ctx.lineWidth = 0.5 * canvas.height * 0.01;
        ctx.strokeText(digit, 0, 0);

        ctx.fillStyle = time.colors[i] || 'white';
        ctx.fillText(digit, 0, 0);
      });

      ctx.restore();
    };

    const animate = () => {
      setSkew(prev => prev + (targetSkew.current - prev) * 0.1);
      setStretch(prev => prev + (targetStretch.current - prev) * 0.1);
      drawText();
      requestAnimationFrame(animate);
    };

    const spinClock = () => {
      const container = document.querySelector('.skew-time-container');
      if (container) {
        const rx = Math.random() * 360;
        const ry = Math.random() * 360;
        const rz = Math.random() * 360;
        container.style.transform = `translate(-50%, -50%) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.fonts.load(`1rem 'skew-stick'`).then(() => {
      updateClock();
      animate();
    }).catch(() => {
      console.warn("Font failed to load");
      updateClock();
      animate();
    });

    const tick = setInterval(updateClock, 1000);
    const spin = setInterval(spinClock, 5000);

    return () => {
      clearInterval(tick);
      clearInterval(spin);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [time]);

  return (
    <div className="skew-wrapper" style={{ fontFamily: 'skew-stick, sans-serif' }}>
      <style>{`
        @font-face {
          font-family: 'skew-stick';
          src: url(${stickFont}) format('truetype');
        }

        .skew-wrapper, .skew-wrapper * {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .skew-wrapper {
          background: black;
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        }

        .skew-time-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          transition: transform 0.5s ease;
        }
      `}</style>

      <div className="skew-time-container" />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SkewClock;
