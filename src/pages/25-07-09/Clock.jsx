import React, { useEffect, useRef } from 'react';

const BlobClock = () => {
  const canvasRef = useRef(null);
  const digitStatesRef = useRef([]);
  const animationStartTimeRef = useRef(0);
  const currentTimeRef = useRef('');
  const animationDuration = 500;
  const gradientCycleDuration = 10000;

   const digitPaths = {
    '0': (x, y, w, h) => [
        ['moveTo', x + w * 0.1, y + h * 0.9],
        ['quadraticCurveTo', x - w * 0.2, y + h * 0.5, x + w * 0.1, y + h * 0.1],
        ['quadraticCurveTo', x + w * 0.5, y - h * 0.2, x + w * 0.9, y + h * 0.1],
        ['quadraticCurveTo', x + w * 1.2, y + h * 0.5, x + w * 0.9, y + h * 0.9],
        ['quadraticCurveTo', x + w * 0.5, y + h * 1.2, x + w * 0.1, y + h * 0.9],
        ['closePath']
    ],
    '1': (x, y, w, h) => [
        ['moveTo', x + w * 0.5, y + h],
        ['quadraticCurveTo', x + w * 0.4, y + h * 0.5, x + w * 0.5, y],
        ['quadraticCurveTo', x + w * 0.6, y - h * 0.2, x + w * 0.7, y],
        ['quadraticCurveTo', x + w * 0.6, y + h * 0.5, x + w * 0.7, y + h],
        ['closePath']
    ],
    '2': (x, y, w, h) => [
        ['moveTo', x + w * 0.15, y + h],
        ['quadraticCurveTo', x + w * 0.8, y + h, x + w * 0.85, y + h * 0.5],
        ['quadraticCurveTo', x + w * 0.9, y + h * 0.2, x + w * 0.5, y + h * 0.2],
        ['quadraticCurveTo', x + w * 0.2, y + h * 0.2, x + w * 0.15, y],
        ['lineTo', x + w * 0.9, y],
        ['closePath']
    ],
    '3': (x, y, w, h) => [
        ['moveTo', x + w * 0.2, y + h * 0.1],
        ['quadraticCurveTo', x + w * 0.7, y - h * 0.2, x + w * 0.85, y + h * 0.3],
        ['quadraticCurveTo', x + w * 0.6, y + h * 0.5, x + w * 0.85, y + h * 0.7],
        ['quadraticCurveTo', x + w * 0.7, y + h * 1.2, x + w * 0.2, y + h * 0.9],
        ['lineTo', x + w * 0.5, y + h * 0.5],
        ['lineTo', x + w * 0.2, y + h * 0.1],
        ['closePath']
    ],
    '4': (x, y, w, h) => [
        ['moveTo', x + w * 0.1, y + h * 0.6],
        ['lineTo', x + w * 0.1, y + h * 0.1],
        ['quadraticCurveTo', x + w * 0.5, y - h * 0.1, x + w * 0.9, y + h * 0.1],
        ['lineTo', x + w * 0.9, y + h],
        ['lineTo', x + w * 0.6, y + h],
        ['lineTo', x + w * 0.6, y + h * 0.6],
        ['closePath']
    ],
    '5': (x, y, w, h) => [
        ['moveTo', x + w * 0.85, y + h * 0.1],
        ['quadraticCurveTo', x + w * 0.2, y - h * 0.2, x + w * 0.1, y + h * 0.5],
        ['quadraticCurveTo', x + w * 0.6, y + h * 0.4, x + w * 0.9, y + h * 0.5],
        ['quadraticCurveTo', x + w * 1.1, y + h * 0.9, x + w * 0.5, y + h * 1.1],
        ['quadraticCurveTo', x + w * 0.2, y + h * 0.9, x + w * 0.2, y + h * 0.8],
        ['closePath']
    ],
    '6': (x, y, w, h) => [
        ['moveTo', x + w * 0.85, y + h * 0.1],
        ['quadraticCurveTo', x + w * 0.4, y - h * 0.2, x + w * 0.1, y + h * 0.5],
        ['quadraticCurveTo', x, y + h * 1.0, x + w * 0.5, y + h],
        ['quadraticCurveTo', x + w, y + h * 0.9, x + w * 0.7, y + h * 0.5],
        ['quadraticCurveTo', x + w * 0.5, y + h * 0.4, x + w * 0.2, y + h * 0.5],
        ['closePath']
    ],
    '7': (x, y, w, h) => [
        ['moveTo', x + w * 0.1, y + h * 0.1],
        ['quadraticCurveTo', x + w * 0.6, y - h * 0.2, x + w * 0.9, y + h * 0.1],
        ['lineTo', x + w * 0.6, y + h],
        ['quadraticCurveTo', x + w * 0.3, y + h * 1.1, x + w * 0.4, y + h],
        ['lineTo', x + w * 0.7, y + h * 0.3],
        ['lineTo', x + w * 0.1, y + h * 0.1],
        ['closePath']
    ],
    '8': (x, y, w, h) => [
        ['moveTo', x + w * 0.5, y + h * 0.5],
        ['quadraticCurveTo', x + w * 0.1, y, x + w * 0.5, y + h * 0.1],
        ['quadraticCurveTo', x + w * 0.9, y, x + w * 0.5, y + h * 0.5],
        ['quadraticCurveTo', x + w * 0.1, y + h, x + w * 0.5, y + h * 0.9],
        ['quadraticCurveTo', x + w * 0.9, y + h, x + w * 0.5, y + h * 0.5],
        ['closePath']
    ],
    '9': (x, y, w, h) => [
        ['moveTo', x + w * 0.1, y + h * 0.9],
        ['quadraticCurveTo', x + w * 0.4, y + h * 1.1, x + w * 0.9, y + h * 0.5],
        ['quadraticCurveTo', x + w * 1.1, y + h * 0.1, x + w * 0.5, y],
        ['quadraticCurveTo', x + w * 0.1, y + h * 0.2, x + w * 0.4, y + h * 0.5],
        ['quadraticCurveTo', x + w * 0.6, y + h * 0.6, x + w * 0.9, y + h * 0.5],
        ['closePath']
    ],
    ':': (x, y, w, h) => [
        ['ellipse', x + w * 0.5, y + h * 0.3, w * 0.2, h * 0.15, 0, 0, Math.PI * 2],
        ['ellipse', x + w * 0.5, y + h * 0.7, w * 0.2, h * 0.15, 0, 0, Math.PI * 2],
        ['closePath']
    ]
};

        

  const lerp = (start, end, t) => start + (end - start) * t;

  const normalizePaths = (p1, p2) => {
    const max = Math.max(p1.length, p2.length);
    while (p1.length < max) p1.push(p1[p1.length - 1]);
    while (p2.length < max) p2.push(p2[p2.length - 1]);
    return [p1, p2];
  };

  const createShiftingGradient = (ctx, x0, y0, x1, y1, hue, time) => {
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    const t = (time % gradientCycleDuration) / gradientCycleDuration;
    grad.addColorStop(0, `hsl(${(hue + t * 360) % 360}, 70%, 50%)`);
    grad.addColorStop(1, `hsl(${(hue + (t + 0.5) * 360) % 360}, 70%, 50%)`);
    return grad;
  };

  const drawPath = (ctx, path1, path2, t, gradient) => {
    const [p1, p2] = normalizePaths(path1, path2 || path1);
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.fillStyle = gradient;
    for (let i = 0; i < p1.length; i++) {
      const [cmd, ...args] = p1[i];
      const targetArgs = p2[i].slice(1);
      const interp = args.map((a, idx) => lerp(a, targetArgs[idx] ?? a, t));
      if (cmd === 'moveTo' || cmd === 'lineTo') ctx[cmd](...interp);
      else if (cmd === 'quadraticCurveTo') ctx.quadraticCurveTo(...interp);
      else if (cmd === 'ellipse') ctx.ellipse(...interp);
      else if (cmd === 'closePath') ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateClock = (timestamp) => {
      const now = new Date();
      let hrs = now.getHours();
      if (hrs > 12) hrs -= 12;
      if (hrs === 0) hrs = 12;
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      const timeStr = `${hrs}:${mins}:${secs}`;

      if (digitStatesRef.current.length === 0) {
        currentTimeRef.current = timeStr;
        digitStatesRef.current = timeStr.split('').map(d => ({ currentDigit: d, targetDigit: d, t: 1 }));
      }

      if (currentTimeRef.current !== timeStr) {
        animationStartTimeRef.current = timestamp;
        const newStates = timeStr.split('').map((d, i) => {
          const prev = digitStatesRef.current[i];
          return {
            currentDigit: prev?.currentDigit ?? d,
            targetDigit: d,
            t: prev?.currentDigit !== d ? 0 : 1
          };
        });
        digitStatesRef.current = newStates;
        currentTimeRef.current = timeStr;
      }

      const elapsed = timestamp - animationStartTimeRef.current;
      digitStatesRef.current.forEach(state => {
        if (state.t < 1) {
          state.t = Math.min(elapsed / animationDuration, 1);
          if (state.t >= 1) state.currentDigit = state.targetDigit;
        }
      });

      // Draw background
      const bgGrad = createShiftingGradient(ctx, 0, 0, canvas.width, canvas.height, 0, timestamp);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw digits
      const chars = timeStr.split('');
      const displayChars = chars[0] === '0' ? chars.slice(1) : chars;
      const digitW = canvas.width * 0.1;
      const digitH = canvas.height * 0.5;
      const spacing = digitW * 0.2;
      const totalW = displayChars.length * digitW + (displayChars.length - 1) * spacing;
      let x = (canvas.width - totalW) / 2;
      const y = canvas.height * 0.25;

      displayChars.forEach((char, i) => {
        const state = digitStatesRef.current[i + (chars[0] === '0' ? 1 : 0)];
        const path = digitPaths[state.currentDigit]?.(x, y, digitW, digitH) ?? [];
        const target = digitPaths[state.targetDigit]?.(x, y, digitW, digitH) ?? path;
        const grad = createShiftingGradient(ctx, x, y, x, y + digitH, 180 + i * 30, timestamp);
        drawPath(ctx, path, target, state.t, grad);
        x += digitW + spacing;
      });

      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div style={{
      backgroundColor: '#000',
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative',
      fontSize: '1.5vh',
    }}>

      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  );
};

export default BlobClock;
