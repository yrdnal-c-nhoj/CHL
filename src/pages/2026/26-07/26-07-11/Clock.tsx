import { useClockTime } from '@/utils/clockUtils';
import React, { useEffect, useRef } from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    background: 'radial-gradient(circle at center, #2d1a18 0%, #110912 100%)',
    color: '#f4ede2', 
    fontFamily: '"Playfair Display", "Georgia", serif',
    padding: '2vmin',
    boxSizing: 'border-box',
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.7) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  quoteContainer: {
    maxWidth: '800px',
    zIndex: 2,
    transform: 'translateY(-5vh)', 
  },
  title: {
    fontSize: 'clamp(1.1rem, 2.5vmin, 2.2rem)',
    fontWeight: '300',
    fontStyle: 'italic',
    lineHeight: '1.3',
    color: '#e2b36e', 
    textShadow: '0 2px 10px rgba(226, 179, 110, 0.15)',
    maxWidth: '90%',
    margin: '0 auto',
    letterSpacing: '0.05em',
  },
  // Added Inter font family style for modern sans-serif accents
  sansAccents: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    letterSpacing: '0.08em',
    textTransform: 'uppercase', // Often looks great for metadata like author/source
  },
  clockPositioner: {
    position: 'absolute',
    bottom: '5vmin',
    right: '5vmin',
    zIndex: 2,
    transform: 'rotate(-1.5deg)', 
  },
  digitalClock: {
    fontSize: 'clamp(2.5rem, 8vmin, 5rem)',
    letterSpacing: '0.05em',
    color: '#e86a43', 
    textShadow: `
      0 0 8px rgba(232, 106, 67, 0.4),
      0 0 20px rgba(226, 179, 110, 0.3),
      -4px 4px 0px rgba(17, 9, 18, 0.8)
    `,
    whiteSpace: 'nowrap',
  }
};

function DustMotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Mote {
      x!: number;
      y!: number;
      size!: number;
      speedX!: number;
      speedY!: number;
      alpha!: number;
      maxAlpha!: number;
      fadeSpeed!: number;
      phase!: number;
      swaySpeed!: number;

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
        ctx.shadowColor = 'rgba(226, 179, 110, 0.3)';
        ctx.fill();
      }
    }

    const motes = Array.from({ length: 45 }, () => new Mote());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = 0; 

      for (let i = 0; i < motes.length; i++) {
        const mote = motes[i];
        mote.update();
        mote.draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export default function CurrentTimeClock() {
  const time = useClockTime();
  
  const hours = time.getHours().toString();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeString = `*${hours}:${minutes}`;

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      
      <DustMotes />
      
      <div style={styles.quoteContainer}>
        {/* Spanish Original */}
        <p style={styles.title}>
          "El tiempo es la sustancia de que estoy hecho. El tiempo es un río que me arrebata, pero yo soy el río; es un tigre que me destroza, pero yo soy el tigre; es un fuego que me consume, pero yo soy el fuego."
        </p>
        <span style={{ 
          ...styles.sansAccents,
          display: 'block', 
          marginTop: '1.25rem', 
          fontSize: '0.75em', 
          fontWeight: '500',
          opacity: 0.85,
          color: '#e2b36e'
        }}>
          — Jorge Luis Borges, <span style={{ fontStyle: 'italic', textTransform: 'none' }}>Nueva refutación del tiempo</span>
        </span>

        {/* English Translation */}
        <p style={{ 
          ...styles.title, 
          marginTop: '2.5rem', 
          fontSize: 'clamp(0.9rem, 2vmin, 1.8rem)', 
          opacity: 0.75 
        }}>
          "Time is the substance I am made of. Time is a river which sweeps me along, but I am the river; 
          it is a tiger which destroys me, but I am the tiger; it is a fire which consumes me, but I am the fire."
        </p>
        <span style={{ 
          ...styles.sansAccents,
          display: 'block', 
          marginTop: '0.85rem', 
          fontSize: '0.65em', 
          fontWeight: '500',
          opacity: 0.7 
        }}>
          — Jorge Luis Borges, <span style={{ fontStyle: 'italic', textTransform: 'none' }}>A New Refutation of Time</span>
        </span>
      </div>

      <div style={styles.clockPositioner}>
        <time dateTime={time.toISOString()} style={styles.digitalClock}>
          {timeString}
        </time>
      </div>
    </div>
  );
}