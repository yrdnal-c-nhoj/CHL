import React, { useEffect, useRef } from 'react';
import myFontUrl from './rope.ttf'; // Font in the same folder
import backgroundImageUrl from './wes.webp'; // Animated GIF background
import hourHandImageUrl from './gunn.gif'; // Hour hand image in the same folder
import minuteHandImageUrl from './gun.gif'; // Minute hand image in the same folder
import secondHandImageUrl from './ggg.gif'; // Second hand image in the same folder

const AnalogClock = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load images
    const hourHandImage = new Image();
    hourHandImage.src = hourHandImageUrl;
    const minuteHandImage = new Image();
    minuteHandImage.src = minuteHandImageUrl;
    const secondHandImage = new Image();
    secondHandImage.src = secondHandImageUrl;

    // Load custom font
    const font = new FontFace('MyClockFont', `url(${myFontUrl})`);
    const loadResources = Promise.all([
      font.load(),
      new Promise((resolve) => { hourHandImage.onload = resolve; }),
      new Promise((resolve) => { minuteHandImage.onload = resolve; }),
      new Promise((resolve) => { secondHandImage.onload = resolve; }),
    ]);

    // pivotY: 0 = pivot at top of image, 0.5 = center, 1 = bottom
    const pivots = {
      hour: 1,
      minute: 1,
      second: 1,
    };

    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      // set backing store size
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      // set CSS size
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      // normalize drawing so 1 unit = 1 CSS pixel
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawClock();
    };

    // helper to draw a hand image with a pivot inside the image
    const drawHandImage = (img, scale, pivotYNormalized) => {
      const imgAspect = img.width / img.height || 1;
      let targetHeight = scale; // desired pixel height (CSS px)
      let targetWidth = targetHeight * imgAspect;

      const pivotY = pivotYNormalized * targetHeight;

      // draw so pivot point sits at (0,0)
      ctx.drawImage(img, -targetWidth / 2, -pivotY, targetWidth, targetHeight);
    };

    const drawClock = () => {
      if (!canvas) return;
      const now = new Date();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const radius = Math.min(width, height) / 4.5;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Move origin to center of clock
      ctx.translate(centerX, centerY);

      ctx.font = `${radius * 0.5}px MyClockFont`;
      ctx.fillStyle = '#8B4513'; // base rope color
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const shadowLayers = [
        { offsetX: 1, offsetY: 1, color: '#5a3e1b', blur: 0 },
        { offsetX: 2, offsetY: 2, color: '#4d3316', blur: 0 },
        { offsetX: 3, offsetY: 3, color: '#3f2710', blur: 0 },
        { offsetX: 4, offsetY: 4, color: '#33210c', blur: 0 },
      ];

      for (let num = 1; num <= 12; num++) {
        const angle = (num * Math.PI) / 6;
        const x = Math.cos(angle - Math.PI / 2) * (radius * 0.85);
        const y = Math.sin(angle - Math.PI / 2) * (radius * 0.85);

        // Draw shadows from furthest to closest
        shadowLayers.forEach(({ offsetX, offsetY, color, blur }) => {
          ctx.shadowColor = color;
          ctx.shadowOffsetX = offsetX;
          ctx.shadowOffsetY = offsetY;
          ctx.shadowBlur = blur;
          ctx.fillText(num.toString(), x, y);
        });

        // Draw main text on top, no shadow
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#8B4513';
        ctx.fillText(num.toString(), x, y);
      }

      const hour = now.getHours() % 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();

      // HOUR hand with filter
      ctx.save();
      ctx.filter = 'brightness(0.7) contrast(1.9)';
      const hourAngle = ((Math.PI / 6) * hour) + ((Math.PI / 360) * minute);
      ctx.rotate(hourAngle);
      const hourLength = radius * 0.5;
      drawHandImage(hourHandImage, hourLength, pivots.hour);
      ctx.restore();

      // MINUTE hand with filter
      ctx.save();
      ctx.filter = 'brightness(1.0) contrast(0.9)';
      const minuteAngle = ((Math.PI / 30) * minute) + ((Math.PI / 1800) * second);
      ctx.rotate(minuteAngle);
      const minuteLength = radius * 0.7;
      drawHandImage(minuteHandImage, minuteLength, pivots.minute);
      ctx.restore();

      // SECOND hand with filter
      ctx.save();
      ctx.filter = 'brightness(1.3) contrast(1.3)';
      const secondAngle = (Math.PI / 30) * second;
      ctx.rotate(secondAngle);
      const secondLength = radius * 0.9;
      drawHandImage(secondHandImage, secondLength, pivots.second);
      ctx.restore();

      ctx.restore();
    };

    loadResources.then(([loadedFont]) => {
      document.fonts.add(loadedFont);
      resizeCanvas();
    });

    window.addEventListener('resize', resizeCanvas);
    const interval = setInterval(drawClock, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ display: 'block', isolation: 'isolate' }}
      />
    </div>
  );
};

export default AnalogClock;
