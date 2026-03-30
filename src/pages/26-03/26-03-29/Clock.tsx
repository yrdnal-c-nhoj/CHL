import React, { useEffect, useRef, useMemo } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import bgVideo from '../../../assets/images/26-03/26-03-29/sunrise1.mp4';
import borderImage from '../../../assets/images/26-03/26-03-29/horse.webp';
import eastFont from '../../../assets/fonts/26-03-29-east.ttf';
import styles from './Clock.module.css';

// --- Optimized Rain Overlay ---
const RainOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); // Optimization hint
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    const rainCount = 100;
    const drops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 25 + 10,
      speed: Math.random() * 12 + 8,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Batch all lines into a single path for performance
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(156, 224, 241, 0.77)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      for (let i = 0; i < rainCount; i++) {
        const d = drops[i];
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);

        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      }
      ctx.stroke(); 
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.rainCanvas} />;
};

// --- Main Clock Component ---
const Clock: React.FC = () => {
  // Refs for direct DOM updates to avoid React re-renders
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);

  const fontConfigs = [{ fontFamily: 'EastWind', fontUrl: eastFont }];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  const fontFamily = fontsLoaded ? 'EastWind, Georgia, serif' : 'Georgia, serif';

  useEffect(() => {
    let frameId: number;

    const updateTime = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      // Update styles directly on the DOM nodes
      if (secRef.current) secRef.current.style.transform = `translate(-50%, -100%) rotate(${s * 6}deg)`;
      if (minRef.current) minRef.current.style.transform = `translate(-50%, -100%) rotate(${m * 6}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `translate(-50%, -100%) rotate(${h * 30}deg)`;

      frameId = requestAnimationFrame(updateTime);
    };

    frameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Memoize static background styles
  const borderStyle: React.CSSProperties = useMemo(() => ({
    backgroundImage: `linear-gradient(rgba(255, 179, 0, 0.31), rgba(255, 179, 0, 0.31)), url(${borderImage})`,
    backgroundSize: 'auto 7vh',
    backgroundRepeat: 'repeat-x',
    filter: 'contrast(1.1) brightness(0.9) saturate(3.7)',
  }), []);

  // Memoize the clock face so it NEVER re-renders after the initial load
  const clockFace = useMemo(() => (
    <div className={styles.clockFace}>
      {['xii', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi'].map((numeral, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const radius = 42;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return (
          <div
            key={numeral}
            className={styles.numeral}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
              fontFamily,
            }}
          >
            {numeral}
          </div>
        );
      })}
      <div ref={hourRef} className={styles.hourHand} />
      <div ref={minRef} className={styles.minuteHand} />
      <div ref={secRef} className={styles.secondHand} />
    </div>
  ), [fontFamily]);

  return (
    <div className={styles.container}>
      <video autoPlay muted loop playsInline className={styles.videoBg}>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <RainOverlay />

      <div className={styles.borderTop} style={borderStyle} />
      <div className={styles.borderBottom} style={borderStyle} />
      <div className={styles.borderLeft} style={borderStyle} />
      <div className={styles.borderRight} style={borderStyle} />

      <div className={styles.clockDisplay}>
        {clockFace}
      </div>
    </div>
  );
};

export default Clock;