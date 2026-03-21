import React, { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

const CmykClock: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const clockEl = clockRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const sectors = ['cyan', 'magenta', 'yellow'];

    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = (now.getHours() % 12) + min / 60;

      const secondDeg = (sec / 60) * 360;
      const minuteDeg = (min / 60) * 360;
      const hourDeg = (hr / 12) * 360;

      const secondRad = ((secondDeg - 90) * Math.PI) / 180;
      const minuteRad = ((minuteDeg - 90) * Math.PI) / 180;
      const hourRad = ((hourDeg - 90) * Math.PI) / 180;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) * 0.7;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const angles = [secondRad, minuteRad, hourRad]
        .map((a) => (a + 2 * Math.PI) % (2 * Math.PI))
        .sort((a, b) => a - b);

      for (let i = 0; i < 3; i++) {
        const start = angles[i];
        const end =
          angles[(i + 1) % 3] <= start
            ? angles[(i + 1) % 3] + 2 * Math.PI
            : angles[(i + 1) % 3];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = sectors[i];
        ctx.fill();
      }

      const sh = clockEl?.querySelector(`.${styles.secondHand}`) as HTMLElement;
      const mh = clockEl?.querySelector(`.${styles.minuteHand}`) as HTMLElement;
      const hh = clockEl?.querySelector(`.${styles.hourHand}`) as HTMLElement;
      if (sh) sh.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      if (mh) mh.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      if (hh) hh.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);
  }, []);

  return (
    <>
      <div className={styles.clock} ref={clockRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={`${styles.hand} ${styles.hourHand}`} />
        <div className={`${styles.hand} ${styles.minuteHand}`} />
        <div className={`${styles.hand} ${styles.secondHand}`} />
        <div className={styles.dateContainer}>
          {' '}
          {/* Optional date text can go here */}
        </div>
      </div>
    </>
  );
};

export default CmykClock;
