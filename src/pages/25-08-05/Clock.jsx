import React, { useEffect, useRef } from 'react';

const ClockGrid = () => {
  const faceCanvasRef = useRef(null);
  const handsCanvasRef = useRef(null);
  const numRows = 10;
  const numCols = 10;

  const getClockSize = () => {
    const maxWidthSize = window.innerWidth / numCols;
    const maxHeightSize = window.innerHeight / numRows;
    return Math.floor(Math.min(maxWidthSize, maxHeightSize)); // fits both directions
  };

  const drawClockFace = (ctx, x, y, radius) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#625A03FF';
    ctx.fill();
    ctx.strokeStyle = '#100101FF';
    ctx.lineWidth = 3;
    ctx.stroke();

    for (let num = 1; num <= 12; num++) {
      const angle = (num * Math.PI) / 6;
      ctx.rotate(angle);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-angle);
      ctx.fillStyle = '#FAF8F8FF';
      ctx.font = `${radius * 0.7}px Georgia`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(angle);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-angle);
    }

    ctx.restore();
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
    const faceCanvas = faceCanvasRef.current;
    const handsCanvas = handsCanvasRef.current;
    const faceCtx = faceCanvas.getContext('2d');
    const handsCtx = handsCanvas.getContext('2d');

    let animationFrameId;
    let clockSize = getClockSize();
    let radius = clockSize / 2;
    let clocks = [];

    const drawFaces = () => {
      faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);

      const totalGridWidth = numCols * clockSize;
      const totalGridHeight = numRows * clockSize;
      const offsetX = (faceCanvas.width - totalGridWidth) / 2;
      const offsetY = (faceCanvas.height - totalGridHeight) / 2;

      clocks = [];
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const x = col * clockSize + radius + offsetX;
          const y = row * clockSize + radius + offsetY;
          clocks.push({ x, y, radius });
          drawClockFace(faceCtx, x, y, radius);
        }
      }
    };

    const draw = () => {
      handsCtx.clearRect(0, 0, handsCanvas.width, handsCanvas.height);

      const currentTime = new Date();
      const hour = currentTime.getHours() % 12 || 12;
      const minute = currentTime.getMinutes();
      const second = currentTime.getSeconds() + currentTime.getMilliseconds() / 1000;

      const handLength = clockSize * 12; // proportional long hands

      clocks.forEach(({ x, y, radius }) => {
        handsCtx.save();
        handsCtx.translate(x, y);
        drawHand(handsCtx, (second * Math.PI) / 30, handLength, radius * 0.1, '#F90810FF'); // Second
        drawHand(handsCtx, ((hour + minute / 60) * Math.PI) / 6, handLength, radius * 0.1, '#14E809FF'); // Hour
        drawHand(handsCtx, ((minute + second / 60) * Math.PI) / 30, handLength, radius * 0.1, '#893CF6FF'); // Minute
        handsCtx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const resizeCanvases = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      faceCanvas.width = width;
      faceCanvas.height = height;
      handsCanvas.width = width;
      handsCanvas.height = height;

      clockSize = getClockSize();
      radius = clockSize / 2;

      drawFaces();
      draw();
    };

    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvases);
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="Grid of analog clocks displaying the current time"
      style={{ position: 'relative', width: '100vw', height: '100vh' }}
    >
      <canvas
        ref={faceCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#A9A5A5FF',
          zIndex: 1,
          display: 'block',
        }}
      />
      <canvas
        ref={handsCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 2,
          display: 'block',
        }}
      />
    </div>
  );
};

export default ClockGrid;
