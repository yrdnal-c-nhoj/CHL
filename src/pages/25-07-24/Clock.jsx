import React, { useEffect, useRef } from 'react';
import bgImage from './em.png';

const Clock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const hourNumbers = ['🎄', '🥇', '✌️', '🎶', '🍀', '⭐', '🀞', '🎰', '🎱', '🐈', '🎯', '⏸️'];

    const drawClock = () => {
      const now = new Date();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(radius, radius);

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
      ctx.fillStyle = 'transparent';
      ctx.fill();
      ctx.strokeStyle = 'transparent';
      ctx.stroke();

      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, -radius * 0.75);
        ctx.rotate(-angle);
        ctx.font = '3.5rem Times New Roman';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText(hourNumbers[i], 0, 0);
        ctx.restore();
      }

      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const drawHand = (value, max, length, width, color) => {
        ctx.save();
        ctx.rotate((value / max) * 2 * Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius * length);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
      };

      drawHand(hours + minutes / 60 + seconds / 3600, 12, 0.4, 0.6 * 16, 'white');
      drawHand(minutes + seconds / 60 + milliseconds / 60000, 60, 0.6, 0.3 * 16, 'white');
      drawHand(seconds + milliseconds / 1000, 60, 0.9, 0.1 * 16, 'white');

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.restore();
    };

    const interval = setInterval(drawClock, 50);
    drawClock();
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={bgImage}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '102%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          filter: 'contrast(60%)',
        }}
      />
      <canvas
        ref={canvasRef}
        width={(window.innerWidth * 0.6)}
        height={(window.innerWidth * 0.6)}
        style={{
          borderRadius: '50%',
          zIndex: 3,
        }}
      />
    </div>
  );
};

export default Clock;
