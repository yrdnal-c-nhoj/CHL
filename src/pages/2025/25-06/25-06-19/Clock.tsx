import React, { useEffect, useMemo, useRef } from 'react';

import { useSmoothClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [];

const ClockComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const time = useSmoothClock();

  const { secondDeg, minuteDeg, hourDeg } = useMemo(() => {
    const ms = time.getMilliseconds();
    const sec = time.getSeconds() + ms / 1000;
    const min = time.getMinutes() + sec / 60;
    const hr = (time.getHours() % 12) + min / 60;

    return {
      secondDeg: sec * 6,
      minuteDeg: (min / 60) * 360,
      hourDeg: (hr / 12) * 360,
    };
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const sectors = ['cyan', 'magenta', 'yellow'];

    const draw = () => {

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
    };

    draw();
  }, [time, secondDeg, minuteDeg, hourDeg]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div
        className={`${styles.hand} ${styles.hourHand}`}
        style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
      />
      <div
        className={`${styles.hand} ${styles.minuteHand}`}
        style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
      />
      <div
        className={`${styles.hand} ${styles.secondHand}`}
        style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
      />
      <div className={styles.dateContainer}> {/* Optional date text can go here */}</div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_06_19';

export default MemoizedClock;
