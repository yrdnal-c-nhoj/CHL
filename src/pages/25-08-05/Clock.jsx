import React, { useEffect, useRef } from 'react';

const ClockGrid = () => {
  const canvasRef = useRef(null);
  const clockSize = 70;
  const numRows = 10;
  const numCols = 10;

  const drawClockFace = (ctx, x, y, radius) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#423D0AFF';
    ctx.fill();
    ctx.strokeStyle = '#100101FF';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let num = 1; num <= 12; num++) {
      const angle = (num * Math.PI) / 6;
      ctx.rotate(angle);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-angle);
      ctx.fillStyle = '#FAF8F8FF';
      ctx.font = `${radius * 0.6}px Georgia`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(angle);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-angle);
    }

    ctx.restore();

    return {
      x,
      y,
      radius,
    };
  };

  const drawClockHands = (ctx, x, y, radius, time) => {
    const hour = time.getHours() % 12 || 12;
    const minute = time.getMinutes();
    const second = time.getSeconds() + time.getMilliseconds() / 1000;

    ctx.save();
    ctx.translate(x, y);
    // Draw hour hand first (lowest z-index)
    drawHand(ctx, ((hour + minute / 60) * Math.PI) / 6, 600, radius * 0.1, '#A203D2FF');
    // Draw minute hand next (middle z-index)
    drawHand(ctx, ((minute + second / 60) * Math.PI) / 30, 600, radius * 0.1, '#46EF1CFF');
    // Draw second hand last (highest z-index)
    drawHand(ctx, (second * Math.PI) / 30, 600, radius * 0.1, '#F90810FF');
    ctx.restore();

    return {
      x,
      y,
      radius,
      hourAngle: ((hour + minute / 60) * Math.PI) / 6,
      minuteAngle: ((minute + second / 60) * Math.PI) / 30,
      secondAngle: (second * Math.PI) / 30,
      width: radius * 0.1,
    };
  };

  const drawHand = (ctx, pos, length, width, color) => {
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
    let clockFacesDrawn = false;
    let clocks = [];

    const drawClockFaces = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const totalGridWidth = numCols * clockSize;
      const totalGridHeight = numRows * clockSize;
      const offsetX = (canvas.width - totalGridWidth) / 2;
      const offsetY = (canvas.height - totalGridHeight) / 2;

      clocks = [];
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const x = col * clockSize + radius + offsetX;
          const y = row * clockSize + radius + offsetY;
        clocks.push(drawClockFace(ctx, x, y, radius));

        }
      }
      clockFacesDrawn = true;
    };

    const draw = () => {
      if (!clockFacesDrawn) {
        drawClockFaces();
      }

      const currentTime = new Date();
      // Clear only the areas where hands will be drawn
      clocks.forEach(({ x, y, radius }) => {
        ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
      });

      // Draw all clock faces first
      clocks.forEach(({ x, y, radius }) => {
        drawClockFace(ctx, x, y, radius);
      });

      // Then draw all hands to ensure they are on top
      clocks.forEach(({ x, y, radius }) => {
        drawClockHands(ctx, x, y, radius, currentTime);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      clockFacesDrawn = false;
      draw();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div role="img" aria-label="Grid of analog clocks displaying the current time">
      <canvas
        ref={canvasRef}
        style={{
          background: '#A9A5A5FF',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
      />
    </div>
  );
};

export default ClockGrid;