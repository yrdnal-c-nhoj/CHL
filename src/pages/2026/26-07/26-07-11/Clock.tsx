import { useSecondClock } from '@/utils/hooks';
import { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

function DustMotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Mote {
      x = 0;
      y = 0;
      size = 0;
      speedX = 0;
      speedY = 0;
      alpha = 0;
      maxAlpha = 0;
      fadeSpeed = 0;
      phase = 0;
      swaySpeed = 0;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = -(Math.random() * 0.2 + 0.05);
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.phase = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.01 + 0.005;
      }

      update() {
        this.y += this.speedY;
        this.phase += this.swaySpeed;
        this.x += this.speedX + Math.sin(this.phase) * 0.1;

        if (this.y < 100) {
          this.alpha -= 0.005;
        } else if (this.alpha < this.maxAlpha) {
          this.alpha += this.fadeSpeed;
        }

        if (this.y < 0 || this.x < -10 || this.x > width + 10 || this.alpha <= 0) {
          this.reset(false);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 179, 110, ${Math.max(0, this.alpha)})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(241, 219, 186, 0.3)';
        ctx.fill();
      }
    }

    const motes = Array.from({ length: 45 }, () => new Mote());
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Keep shadows limited only to when drawing the active particles
      for (let i = 0; i < motes.length; i++) {
        motes[i].update();
        motes[i].draw();
      }
      ctx.shadowBlur = 0; 

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.dustCanvas} />
  );
}

export default function CurrentTimeClock() {
  const time = useSecondClock();
  
  const hours = time.getHours().toString();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeString = `*${hours}:${minutes}`;

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <DustMotes />
      
      <div className={styles.quoteContainer}>
        {/* Spanish Original */}
        <p className={styles.title}>
          "El tiempo es la sustancia de que estoy hecho. El tiempo es un río que me arrebata, pero yo soy el río; es un tigre que me destroza, pero yo soy el tigre; es un fuego que me consume, pero yo soy el fuego."*
        </p>
        <span className={`${styles.sansAccents} ${styles.spanishAuthor}`}>
          — Jorge Luis Borges, <span className={styles.italic}>Nueva refutación del tiempo</span>
        </span>

        {/* English Translation */}
        <p className={`${styles.title} ${styles.englishQuote}`}>
          "Time is the substance I am made of. Time is a river which sweeps me along, but I am the river; 
          it is a tiger which destroys me, but I am the tiger; it is a fire which consumes me, but I am the fire."*
        </p>
        <span className={`${styles.sansAccents} ${styles.englishAuthor}`}>
          — Jorge Luis Borges, <span className={styles.italic}>A New Refutation of Time</span>
        </span>
      </div>

      <div className={styles.clockPositioner}>
        <time dateTime={time.toISOString()} className={styles.digitalClock}>
          {timeString}
        </time>
      </div>
    </div>
  );
}