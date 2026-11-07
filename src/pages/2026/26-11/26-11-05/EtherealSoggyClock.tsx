import React, { useRef, useEffect } from 'react';
import { useClock } from '../../utils/hooks/useClock';
import { useSuspenseFontLoader } from '../../utils/fontLoader';
import { ClockStyle } from '../../types/clock';

const EtherealSoggyClock: React.FC = () => {
  const time = useClock();
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  const fontConfigs = [
    {
      fontFamily: 'EtherealFont',
      fontUrl: 'path/to/ethereal-font.ttf',
    },
  ];

  useSuspenseFontLoader(fontConfigs);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * container.clientWidth,
        y: Math.random() * container.clientHeight,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random(),
      });
    }

    const render = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const ctx = container.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, container.clientWidth, container.clientHeight);

      ctx.font = '48px EtherealFont';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(hours, container.clientWidth / 2, container.clientHeight / 2 - 20);
      ctx.fillText(minutes, container.clientWidth / 2, container.clientHeight / 2 + 20);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.opacity -= 0.01;

        if (particle.opacity <= 0) {
          particle.opacity = 1;
          particle.x = Math.random() * container.clientWidth;
          particle.y = Math.random() * container.clientHeight;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(render);
    };
  }, []);

  return (
    <div ref={containerRef} style={styles.container}>
      <canvas style={styles.canvas} />
    </div>
  );
};

const styles: ClockStyle = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
};

export default EtherealSoggyClock;
