import React, { useEffect, useRef } from 'react';

const ClockGrid = () => {
  const canvasRef = useRef(null);
  const clockSize = 70;
  const numRows = 12;
  const numCols = 20;

  const drawClock = (ctx, x, y, radius, time) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#D2D4CEFF';
    ctx.fill();
    ctx.strokeStyle = '#F1EDEDFF';
    ctx.lineWidth = 0;
    ctx.stroke();
    for (let num = 1; num <= 12; num++) {
      const angle = (num * Math.PI) / 6;
      ctx.rotate(angle);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-angle);
      ctx.fillStyle = '#1D1D02FF';
      ctx.font = `${radius * 0.9}px Georgia`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(angle);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-angle);
    }
    ctx.restore();
    const hour = time.getHours() % 12;
    const minute = time.getMinutes();
    const second = time.getSeconds() + time.getMilliseconds() / 1000;
    return {
      x,
      y,
      hourAngle: ((hour + minute / 60) * Math.PI) / 6,
      minuteAngle: ((minute + second / 60) * Math.PI) / 30,
      secondAngle: (second * Math.PI) / 30,
      width: radius * 0.05,
    };
  };

  const drawHand = (ctx, pos, length, width, color = '#07A3A3FF') => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.rotate(pos);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const radius = clockSize / 2;

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = new Date();

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const gridCenterCol = Math.floor(numCols / 2);
      const gridCenterRow = Math.floor(numRows / 2);

      const offsetX = centerX - (gridCenterCol * clockSize + radius);
      const offsetY = centerY - (gridCenterRow * clockSize + radius);

      const clocks = [];
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const x = col * clockSize + radius + offsetX;
          const y = row * clockSize + radius + offsetY;
          const clockData = drawClock(ctx, x, y, radius * 0.9, now);
          clocks.push(clockData);
        }
      }

      clocks.forEach(({ x, y, hourAngle, minuteAngle, secondAngle, width }) => {
        ctx.save();
        ctx.translate(x, y);
        const infiniteLength = 10000;
        drawHand(ctx, hourAngle, infiniteLength, width, '#6AC509FF');
        drawHand(ctx, minuteAngle, infiniteLength, width, '#07A3A3FF');
        drawHand(ctx, secondAngle, infiniteLength, width * 0.7, '#F20909FF');
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ background: '#eee', position: 'fixed', top: 0, left: 0 }}
    />
  );
};

export default ClockGrid;