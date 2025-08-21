import React, { useEffect, useRef } from 'react';
import bgImage from './em.gif';
import hourHandImgSrc from './hand.gif';
import minuteHandImgSrc from './ha.gif';
import secondHandImgSrc from './had.gif';

const Clock = () => {
  const faceRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.99;
    const dpr = window.devicePixelRatio || 1;

    const createCanvasContext = (ref) => {
      const canvas = ref.current;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    };

    const faceCtx = createCanvasContext(faceRef);
    const hourCtx = createCanvasContext(hourRef);
    const minuteCtx = createCanvasContext(minuteRef);
    const secondCtx = createCanvasContext(secondRef);

    const radius = size / 2;
    const hourNumbers = ['🎄', '🥇', '✌️', '🎶', '🍀', '⭐', '🀞', '🎰', '🎱', '🐈', '🎯', '⏸️'];

    const hourImg = new Image();
    hourImg.src = hourHandImgSrc;
    const minuteImg = new Image();
    minuteImg.src = minuteHandImgSrc;
    const secondImg = new Image();
    secondImg.src = secondHandImgSrc;

    let imagesLoaded = 0;
    const onLoad = () => {
      imagesLoaded += 1;
      if (imagesLoaded === 3) startClock();
    };

    hourImg.onload = onLoad;
    minuteImg.onload = onLoad;
    secondImg.onload = onLoad;

    // Draw static clock face once
    const drawClockFace = () => {
      faceCtx.save();
      faceCtx.translate(radius, radius);

      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        faceCtx.save();
        faceCtx.rotate(angle);
        faceCtx.translate(0, -radius * 0.65);
        faceCtx.rotate(-angle);

        faceCtx.font = '3.2rem Times New Roman';
        faceCtx.textAlign = 'center';
        faceCtx.textBaseline = 'middle';

        faceCtx.shadowColor = 'rgba(0,0,0,1.0)';
        faceCtx.shadowBlur = 1;
        faceCtx.shadowOffsetX = 2;
        faceCtx.shadowOffsetY = 2;

        faceCtx.fillStyle = '#CB5206FF';
        faceCtx.fillText(hourNumbers[i], 0, 0);

        faceCtx.restore();
      }

      // Center circle
      faceCtx.beginPath();
      faceCtx.arc(0, 0, radius * 0.01, 0, 2 * Math.PI);
      faceCtx.fillStyle = 'white';
      faceCtx.fill();

      faceCtx.restore();
    };

    const drawHandImage = (ctx, img, value, max, length, scaleMultiplier = 1) => {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate((value / max) * 2 * Math.PI);

      const scale = ((radius * length) / img.height) * scaleMultiplier;
      ctx.translate(0, -radius * length);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2, 0);

      ctx.restore();
    };

    const startClock = () => {
      drawClockFace();

      const updateClock = () => {
        const now = new Date();
        const hours = now.getHours() % 12 + now.getMinutes() / 60 + now.getSeconds() / 3600;
        const minutes = now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000;
        const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

        drawHandImage(hourCtx, hourImg, hours, 12, 0.3, 1.2);
        drawHandImage(minuteCtx, minuteImg, minutes, 60, 0.6, 1.0);
        drawHandImage(secondCtx, secondImg, seconds, 60, 0.8, 0.8);

        requestAnimationFrame(updateClock);
      };

      updateClock();
    };
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
        background: 'black',
      }}
    >
      {/* Background */}
      <img
        src={bgImage}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          filter: 'contrast(60%)',
        }}
      />

      {/* Clock Face (numbers + center) */}
      <canvas
        ref={faceRef}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 2,
        }}
      />

      {/* Hour Hand */}
      <canvas
        ref={hourRef}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 5,
        }}
      />

      {/* Minute Hand */}
      <canvas
        ref={minuteRef}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 4,
        }}
      />

      {/* Second Hand */}
      <canvas
        ref={secondRef}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 5,
        }}
      />
    </div>
  );
};

export default Clock;
