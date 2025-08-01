import React, { useEffect, useRef } from 'react';
import backgroundImage from './bad.png'; // your custom background
import boldFont from './Oswald-Bold.ttf'; // Oswald bold version

const MyClock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('MyFont', `url(${boldFont})`);
    font.load().then(() => {
      document.fonts.add(font);
      drawClock();
    });

    const drawClock = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const update = () => {
        const now = new Date();
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;
        const r = Math.min(w, h) / 3; // controls clock size

        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.fillStyle = '#FA0820FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${r * 0.6}px MyFont`; // using bold font file

        for (let i = 1; i <= 12; i++) {
          const angle = (i * Math.PI) / 6;
          ctx.save();
          ctx.rotate(angle);
          ctx.translate(0, -r * 0.85);
          ctx.fillText(i, 0, 0);
          ctx.restore();
        }

        const hour = now.getHours() % 12;
        const minute = now.getMinutes();
        const second = now.getSeconds();

        const drawHand = (angle, length, width, color) => {
          ctx.beginPath();
          ctx.lineWidth = width;
          ctx.strokeStyle = color;
          ctx.moveTo(0, 0);
          ctx.rotate(angle);
          ctx.lineTo(0, -length);
          ctx.stroke();
          ctx.rotate(-angle);
        };

        drawHand((Math.PI / 6) * hour + (Math.PI / 360) * minute, r * 0.5, r * 0.05, '#f00');
        drawHand((Math.PI / 30) * minute + (Math.PI / 1800) * second, r * 0.75, r * 0.03, '#f00');
        drawHand((Math.PI / 30) * second, r * 0.85, r * 0.01, '#f00');

        ctx.restore();
        requestAnimationFrame(update);
      };

      update();
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: `url(${backgroundImage}) center/cover no-repeat`,
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default MyClock;
