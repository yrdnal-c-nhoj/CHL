import React, { useEffect, useRef, useState } from 'react';

const StarsParallax = () => {
  const [stars, setStars] = useState({
    near: [],
    mid: [],
    far: []
  });

  useEffect(() => {
    const generateStars = (count, sizeMin, sizeMax, speedMultiplier) => {
      return Array.from({ length: count }, () => {
        const size = Math.random() * (sizeMax - sizeMin) + sizeMin;
        return {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: size,
          speed: size * speedMultiplier
        };
      });
    };

    setStars({
      near: generateStars(50, 0.1, 0.3, 1.0),
      mid: generateStars(100, 0.05, 0.2, 0.6),
      far: generateStars(150, 0.03, 0.1, 0.3)
    });

    const animateStars = () => {
      setStars((prev) => ({
        near: prev.near.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        })),
        mid: prev.mid.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        })),
        far: prev.far.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        }))
      }));
    };

    const interval = setInterval(animateStars, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      background: '#000000',
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 1
    }}>
      {stars.far.map((star, index) => (
        <div
          key={`far-${index}`}
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: '#ffffff',
            borderRadius: '50%',
            opacity: 0.4
          }}
        />
      ))}
      {stars.mid.map((star, index) => (
        <div
          key={`mid-${index}`}
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: '#ffffff',
            borderRadius: '50%',
            opacity: 0.6
          }}
        />
      ))}
      {stars.near.map((star, index) => (
        <div
          key={`near-${index}`}
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: '#ffffff',
            borderRadius: '50%',
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};

const Clock = () => {
  const faceRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8; // Reduced size to fit well
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
    const hourNumbers = ['🌕', '🌖', '🌗', '🌘', '🌙', '🌛', '🌚', '🌜', '🌙', '🌒', '🌓', '🌔'];

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

      faceCtx.beginPath();
      faceCtx.arc(0, 0, radius * 0.01, 0, 2 * Math.PI);
      faceCtx.fillStyle = 'white';
      faceCtx.fill();

      faceCtx.restore();
    };

    const drawHand = (ctx, value, max, length, width, color) => {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate((value / max) * 2 * Math.PI);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * length);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    };

    const startClock = () => {
      drawClockFace();

      const updateClock = () => {
        const now = new Date();
        const hours = now.getHours() % 12 + now.getMinutes() / 60 + now.getSeconds() / 3600;
        const minutes = now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000;
        const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

        drawHand(hourCtx, hours, 12, 0.5, 6, 'white');
        drawHand(minuteCtx, minutes, 60, 0.7, 4, 'white');
        drawHand(secondCtx, seconds, 60, 0.9, 2, 'silver');

        requestAnimationFrame(updateClock);
      };

      updateClock();
    };

    startClock();
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        background: 'transparent'
      }}
    >
      <canvas
        ref={faceRef}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 2,
        }}
      />
      <canvas
        ref={hourRef}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 5,
        }}
      />
      <canvas
        ref={minuteRef}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 4,
        }}
      />
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

const App = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <StarsParallax />
      <Clock />
    </div>
  );
};

export default App;