import { useSecondClock } from '@/utils/hooks';
import { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

// --- Constants for DustMotes Animation ---
const MOTE_CONFIG = {
  COUNT: 45,
  MIN_SIZE: 0.5,
  SIZE_VARIANCE: 1.5,
  MIN_VERTICAL_SPEED: 0.05,
  VERTICAL_SPEED_VARIANCE: 0.2,
  HORIZONTAL_SPEED_VARIANCE: 0.15,
  MIN_ALPHA: 0.1,
  ALPHA_VARIANCE: 0.4,
  MIN_FADE_SPEED: 0.002,
  FADE_SPEED_VARIANCE: 0.005,
  MIN_SWAY_SPEED: 0.005,
  SWAY_SPEED_VARIANCE: 0.01,
  SWAY_MAGNITUDE: 0.1,
  FADE_OUT_Y_THRESHOLD: 100, // Y-coordinate to start fading out at the top
  FADE_OUT_SPEED: 0.005,
  SHADOW_BLUR: 4,
  SHADOW_COLOR: 'rgba(241, 219, 186, 0.3)',
  FILL_STYLE: 'rgba(226, 179, 110, %ALPHA%)',
};

// --- Mote Class Definition ---
// Moved outside the component for better code organization and to prevent re-declaration.
class Mote {
  x = 0; y = 0; size = 0; speedX = 0; speedY = 0;
  alpha = 0; maxAlpha = 0; fadeSpeed = 0; phase = 0; swaySpeed = 0;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.reset(true);
  }

  reset(init = false) {
    this.x = Math.random() * this.canvasWidth;
    this.y = init ? Math.random() * this.canvasHeight : this.canvasHeight + 10;
    this.size = Math.random() * MOTE_CONFIG.SIZE_VARIANCE + MOTE_CONFIG.MIN_SIZE;
    this.speedX = (Math.random() - 0.5) * MOTE_CONFIG.HORIZONTAL_SPEED_VARIANCE;
    this.speedY = -(Math.random() * MOTE_CONFIG.VERTICAL_SPEED_VARIANCE + MOTE_CONFIG.MIN_VERTICAL_SPEED);
    this.alpha = 0;
    this.maxAlpha = Math.random() * MOTE_CONFIG.ALPHA_VARIANCE + MOTE_CONFIG.MIN_ALPHA;
    this.fadeSpeed = Math.random() * MOTE_CONFIG.FADE_SPEED_VARIANCE + MOTE_CONFIG.MIN_FADE_SPEED;
    this.phase = Math.random() * Math.PI * 2;
    this.swaySpeed = Math.random() * MOTE_CONFIG.SWAY_SPEED_VARIANCE + MOTE_CONFIG.MIN_SWAY_SPEED;
  }

  update() {
    this.y += this.speedY;
    this.phase += this.swaySpeed;
    this.x += this.speedX + Math.sin(this.phase) * MOTE_CONFIG.SWAY_MAGNITUDE;

    if (this.y < MOTE_CONFIG.FADE_OUT_Y_THRESHOLD) {
      this.alpha -= MOTE_CONFIG.FADE_OUT_SPEED;
    } else if (this.alpha < this.maxAlpha) {
      this.alpha += this.fadeSpeed;
    }

    if (this.y < 0 || this.x < -10 || this.x > this.canvasWidth + 10 || this.alpha <= 0) {
      this.reset(false);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    const fillStyle = MOTE_CONFIG.FILL_STYLE.replace('%ALPHA%', String(Math.max(0, this.alpha)));
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
}

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

    const motes = Array.from({ length: MOTE_CONFIG.COUNT }, () => new Mote(width, height));
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Set shadow properties once before the loop for better performance.
      ctx.shadowBlur = MOTE_CONFIG.SHADOW_BLUR;
      ctx.shadowColor = MOTE_CONFIG.SHADOW_COLOR;

      for (let i = 0; i < motes.length; i++) {
        motes[i].update();
        motes[i].draw(ctx);
      }

      // Reset shadow blur after drawing all motes.
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