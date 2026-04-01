import React, { useEffect, useRef, useMemo } from 'react';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import bgVideo from '../../../../assets/images/2026/26-03/26-03-29/sunrise1.mp4';
import borderImage from '../../../../assets/images/2026/26-03/26-03-29/horse.webp';
import scarabImage from '../../../../assets/images/2026/26-03/26-03-29/scarab.webp';
import eastFont from '../../../../assets/fonts/26-03-29-east.ttf';
import styles from './Clock.module.css';

// --- Optimized Rain Overlay ---
const RainOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // willReadFrequently: false since we never call getImageData
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    // Debounced resize — avoids layout thrash during window drag
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Re-scatter drops to fit new dimensions
        drops.forEach(d => {
          d.x = Math.random() * canvas.width;
          d.y = Math.random() * canvas.height;
        });
      }, 100);
    };

    // Initial size (no debounce on first run)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', handleResize, { passive: true });

    const rainCount = 100;
    const drops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 25 + 10,
      speed: Math.random() * 12 + 8,
    }));

    // Pre-set shared stroke style once — never changes
    ctx.strokeStyle = 'rgba(156, 224, 241, 0.77)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);

      // Throttle to TARGET_FPS
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
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
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.rainCanvas} />;
};

// --- Main Clock Component ---
const Clock: React.FC = () => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);

  const fontConfigs = useMemo(() => [{ fontFamily: 'EastWind', fontUrl: eastFont }], []);
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  const fontFamily = fontsLoaded ? 'EastWind, Georgia, serif' : 'Georgia, serif';

  useEffect(() => {
    let frameId: number;
    // Track last integer second to skip hour/minute recalculation on sub-second frames
    let lastSecond = -1;
    let cachedHourDeg = 0;
    let cachedMinDeg = 0;

    const updateTime = (timestamp: number) => {
      frameId = requestAnimationFrame(updateTime);

      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const currentSecond = now.getSeconds();

      // Seconds hand updates every frame (smooth sweep)
      const secDeg = s * 6;
      if (secRef.current) {
        secRef.current.style.transform = `translate(-50%, -100%) rotate(${secDeg}deg)`;
      }

      // Hour and minute hands only need recalculation once per second
      if (currentSecond !== lastSecond) {
        lastSecond = currentSecond;
        const m = now.getMinutes() + s / 60;
        const h = (now.getHours() % 12) + m / 60;
        cachedMinDeg = m * 6;
        cachedHourDeg = h * 30;

        if (minRef.current) {
          minRef.current.style.transform = `translate(-50%, -100%) rotate(${cachedMinDeg}deg)`;
        }
        if (hourRef.current) {
          hourRef.current.style.transform = `translate(-50%, -100%) rotate(${cachedHourDeg}deg)`;
        }
      }
    };

    frameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const borderStyle: React.CSSProperties = useMemo(() => ({
    backgroundImage: `linear-gradient(rgba(255, 179, 0, 0.31), rgba(255, 179, 0, 0.31)), url(${borderImage})`,
    backgroundSize: 'auto 7vh',
    backgroundRepeat: 'repeat-x',
    filter: 'contrast(1.1) brightness(0.9) saturate(3.7)',
  }), []);

  const clockFace = useMemo(() => (
    <div className={styles.clockFace}>
      {(['xii','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi'] as const).map((numeral, i) => {
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
      <div className={styles.scarab} style={{ backgroundImage: `url(${scarabImage})` }} />
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
