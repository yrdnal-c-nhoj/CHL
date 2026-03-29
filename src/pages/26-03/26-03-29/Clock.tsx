import React, { useEffect, useRef } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import bgVideo from '../../../assets/images/26-03/26-03-29/sunrise.mp4';
import borderImage from '../../../assets/images/26-03/26-03-29/horse.webp';
import eastFont from '../../../assets/fonts/26-03-29-east.ttf';
import styles from './Clock.module.css';

// --- Rain Overlay Sub-Component ---
const RainOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const rainCount = 120;
    const drops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 25 + 10,
      speed: Math.random() * 15 + 10,
      opacity: Math.random() * 0.4 + 0.1
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(135, 206, 250, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      });

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
  const time = useSecondClock();

  const fontConfigs = [
    {
      fontFamily: 'EastWind',
      fontUrl: eastFont,
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const fontFamily = fontsLoaded ? 'EastWind, Georgia, serif' : 'Georgia, serif';

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = (((hours % 12) + minutes / 60) / 12) * 360;

  const borderColor = 'rgba(255, 179, 0, 0.52)';
  const borderFilter = ' contrast(1.3) brightness(0.9)';

  const borderStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${borderColor}, ${borderColor}), url(${borderImage})`,
    backgroundSize: 'auto 7vh',
    backgroundRepeat: 'repeat-x',
    filter: borderFilter,
  };

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
        <div className={styles.clockFace}>
          {['xii', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi'].map((numeral, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const radius = 42;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const rotation = i * 30;
            return (
              <div
                key={numeral}
                className={styles.numeral}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  fontFamily,
                }}
              >
                {numeral}
              </div>
            );
          })}

          <div
            className={styles.hourHand}
            style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)` }}
          />
          <div
            className={styles.minuteHand}
            style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)` }}
          />
          <div
            className={styles.secondHand}
            style={{ transform: `translate(-50%, -100%) rotate(${secondAngle}deg)` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Clock;