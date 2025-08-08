import React, { useEffect, useRef } from 'react';
import bgImage from './em.gif';
import hourHandImgSrc from './hand.gif';
import minuteHandImgSrc from './ha.gif';
import secondHandImgSrc from './had.gif';

const Clock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const size = Math.min(window.innerWidth, window.innerHeight) * 0.99;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      if (imagesLoaded === 3) {
        startClock();
      }
    };

    hourImg.onload = onLoad;
    minuteImg.onload = onLoad;
    secondImg.onload = onLoad;

    // Scale multipliers for tweaking sizes
    const hourScaleMultiplier = 1.2;   // 20% bigger
    const minuteScaleMultiplier = 1.0; // default size
    const secondScaleMultiplier = 0.8; // 20% smaller

    const drawHandImage = (img, value, max, length, scaleMultiplier = 1) => {
      ctx.save();
      ctx.rotate((value / max) * 2 * Math.PI);

      const imgWidth = img.width;
      const imgHeight = img.height;

      const scale = ((radius * length) / imgHeight) * scaleMultiplier;

      ctx.translate(0, -radius * length);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -imgWidth / 2, 0);

      ctx.restore();
    };

    const startClock = () => {
      const drawClock = () => {
        const now = new Date();

        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(radius, radius);

        // Transparent clock face (optional)
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.9, 0, 2 * Math.PI);
        ctx.fillStyle = 'transparent';
        ctx.fill();
        ctx.strokeStyle = 'transparent';
        ctx.stroke();

        // Draw hour emoji numbers
        for (let i = 0; i < 12; i++) {
          const angle = (i * 30) * Math.PI / 180;
          ctx.save();
          ctx.rotate(angle);
          ctx.translate(0, -radius * 0.65);
          ctx.rotate(-angle);

          ctx.font = '3.2rem Times New Roman';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.shadowColor = 'rgba(0, 0, 0, 1.0)';
          ctx.shadowBlur = 1;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          ctx.fillStyle = '#CB5206FF';
          ctx.fillText(hourNumbers[i], 0, 0);

          ctx.restore();
        }

        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        drawHandImage(hourImg, hours + minutes / 60 + seconds / 3600, 12, 0.3, hourScaleMultiplier);
        drawHandImage(minuteImg, minutes + seconds / 60 + milliseconds / 60000, 60, 0.5, minuteScaleMultiplier);
        drawHandImage(secondImg, seconds + milliseconds / 1000, 60, 0.6, secondScaleMultiplier);

        // Draw center circle
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.005, 0, 0.02 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.restore();
      };

      const interval = setInterval(drawClock, 50);
      drawClock();

      return () => clearInterval(interval);
    };

    return () => {
      // No interval to clear here as it's handled inside startClock
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
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: '50%',
          zIndex: 3,
          display: 'block',
        }}
      />
    </div>
  );
};

export default Clock;
