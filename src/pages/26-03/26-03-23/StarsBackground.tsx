import React, { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

const MAX_STARS = 1400;
const HUE = 217;

interface Star {
  orbitRadius: number;
  radius: number;
  orbitX: number;
  orbitY: number;
  timePassed: number;
  speed: number;
  alpha: number;
}

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create offscreen canvas for star gradient cache
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 100;
    starCanvas.height = 100;
    const starCtx = starCanvas.getContext('2d');
    if (!starCtx) return;

    const half = starCanvas.width / 2;
    const gradient = starCtx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.025, '#fff');
    gradient.addColorStop(0.1, `hsl(${HUE}, 61%, 33%)`);
    gradient.addColorStop(0.25, `hsl(${HUE}, 64%, 6%)`);
    gradient.addColorStop(1, 'transparent');

    starCtx.fillStyle = gradient;
    starCtx.beginPath();
    starCtx.arc(half, half, half, 0, Math.PI * 2);
    starCtx.fill();
    starCanvasRef.current = starCanvas;

    // Helper functions
    const random = (min: number, max?: number): number => {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      if (min > max) {
        [min, max] = [max, min];
      }
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const maxOrbit = (x: number, y: number): number => {
      const max = Math.max(x, y);
      return Math.round(Math.sqrt(max * max + max * max)) / 2;
    };

    // Initialize stars
    const initStars = () => {
      const w = canvas.width;
      const h = canvas.height;
      starsRef.current = [];

      for (let i = 0; i < MAX_STARS; i++) {
        const orbitRadius = random(maxOrbit(w, h));
        starsRef.current.push({
          orbitRadius,
          radius: random(60, orbitRadius) / 12,
          orbitX: w / 2,
          orbitY: h / 2,
          timePassed: random(0, MAX_STARS),
          speed: random(orbitRadius) / 50000,
          alpha: random(2, 10) / 10,
        });
      }
    };

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Animation loop
    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const stars = starsRef.current;
      const starCanvasImg = starCanvasRef.current;

      // Clear with transparent fill (let CSS background image show through)
      ctx.clearRect(0, 0, w, h);

      // Draw stars with lighter composite
      ctx.globalCompositeOperation = 'lighter';

      for (const star of stars) {
        const x = Math.sin(star.timePassed) * star.orbitRadius + star.orbitX;
        const y = Math.cos(star.timePassed) * star.orbitRadius + star.orbitY;
        const twinkle = random(10);

        if (twinkle === 1 && star.alpha > 0) {
          star.alpha -= 0.05;
        } else if (twinkle === 2 && star.alpha < 1) {
          star.alpha += 0.05;
        }

        ctx.globalAlpha = star.alpha;
        if (starCanvasImg) {
          ctx.drawImage(
            starCanvasImg,
            x - star.radius / 2,
            y - star.radius / 2,
            star.radius,
            star.radius
          );
        }
        star.timePassed += star.speed;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.starsCanvas} />;
};

export default StarsBackground;
