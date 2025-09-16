import React, { useEffect, useRef } from 'react';
import myFontUrl from './rope.ttf'; // Font in the same folder
import backgroundImageUrl from './wes.webp'; // Animated GIF background
import hourHandImageUrl from './gunn.gif'; // Hour hand image
import minuteHandImageUrl from './gun.gif'; // Minute hand image
import secondHandImageUrl from './ggg.gif'; // Second hand image

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

    // pivotY: 0 = top of image, 1 = bottom
    const pivots = { hour: 1, minute: 1, second: 1 };

    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawClock();
    };

    // helper to draw a hand image with a pivot inside the image
    const drawHandImage = (img, scale, pivotYNormalized) => {
      const imgAspect = img.width / img.height || 1;
      let targetHeight = scale;
      let targetWidth = targetHeight * imgAspect;
      const pivotY = pivotYNormalized * targetHeight;
      ctx.drawImage(img, -targetWidth / 2, -pivotY, targetWidth, targetHeight);
    };






const drawClock = () => {
  if (!canvas) return;
  const now = new Date();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const radius = Math.min(width, height) / 3.5;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- Vignette overlay ---
  const vignette = ctx.createRadialGradient(
    centerX, centerY, radius * 1.1, // start bright center
    centerX, centerY, Math.max(width, height) * 0.7 // fade into dark at edges
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.75)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(centerX, centerY);

  // --- Numbers ---
  ctx.font = `${radius * 0.7}px MyClockFont`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const shadowLayers = [
    { offsetX: 1, offsetY: 1, color: '#C59D6DFF', blur: 0 },
    { offsetX: 2, offsetY: 2, color: '#DDB254FF', blur: 0 },
    { offsetX: 3, offsetY: 3, color: '#272523FF', blur: 0 },
    { offsetX: 4, offsetY: 4, color: '#150F08FF', blur: 0 },
  ];

  for (let num = 1; num <= 12; num++) {
    const angle = (num * Math.PI) / 6;
    const x = Math.cos(angle - Math.PI / 2) * (radius * 0.85);
    const y = Math.sin(angle - Math.PI / 2) * (radius * 0.85);

    shadowLayers.forEach(({ offsetX, offsetY, color, blur }) => {
      ctx.shadowColor = color;
      ctx.shadowOffsetX = offsetX;
      ctx.shadowOffsetY = offsetY;
      ctx.shadowBlur = blur;
      ctx.fillStyle = '#DDD3B1FF';
      ctx.fillText(num.toString(), x, y);
    });

    ctx.shadowColor = '#CBC8C8FF';
    ctx.fillStyle = '#261407FF';
    ctx.fillText(num.toString(), x, y);
  }

  // --- Hands ---
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const hourAngle = (Math.PI / 6) * hour + (Math.PI / 360) * minute;
  const minuteAngle = (Math.PI / 30) * minute + (Math.PI / 1800) * second;
  const secondAngle = (Math.PI / 30) * second;

  const hourLength = radius * 0.5;
  const minuteLength = radius * 0.7;
  const secondLength = radius * 0.9;

  // HOUR hand – aged iron
  ctx.save();
  ctx.rotate(hourAngle);
  ctx.shadowColor = '#2c1c0f';
  ctx.shadowBlur = 12;
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'brightness(0.8) contrast(2) sepia(0.6)';
  drawHandImage(hourHandImage, hourLength, pivots.hour);
  ctx.restore();

  // MINUTE hand – brass glow
  ctx.save();
  ctx.rotate(minuteAngle);
  ctx.shadowColor = '#d4a253';
  ctx.shadowBlur = 16;
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'brightness(1.1) contrast(1.2) sepia(0.4)';
  drawHandImage(minuteHandImage, minuteLength, pivots.minute);
  ctx.restore();

  // SECOND hand – ember copper
  ctx.save();
  ctx.rotate(secondAngle);
  ctx.shadowColor = '#ff6347';
  ctx.shadowBlur = 20;
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'brightness(1.4) contrast(1.5) sepia(0.5)';
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
