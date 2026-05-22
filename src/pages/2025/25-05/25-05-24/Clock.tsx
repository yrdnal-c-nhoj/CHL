import React, { useEffect, useMemo, useRef } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import torGif from '@/assets/images/25_images/25-05/25-05-24/tor.gif';
import speedFont from '@/assets/fonts/25fonts/25-05-24-speed.ttf';
import styles from './Clock.module.css';

const NUM_PARTICLES = 100;

const Clock: React.FC = () => {
  // 1. Font Loading
  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'speed',
        fontUrl: speedFont,
        options: { weight: 'normal', style: 'normal' },
      },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useSecondClock();
  const flashRef = useRef<HTMLDivElement>(null);

  // 2. Initialize Particles (Ref-based to avoid re-renders during animation)
  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      el: null as HTMLSpanElement | null,
      angle: Math.random() * 2 * Math.PI,
      baseHeight: (i / NUM_PARTICLES) * 100, // in vh
      speed: Math.random() * 0.2 + 0.2,
      wobblePhase: Math.random() * 2 * Math.PI,
      wobbleFreq: Math.random() * 0.15 + 0.1,
      wobbleAmp: Math.random() * 2 + 1,
      secondaryWobblePhase: Math.random() * 2 * Math.PI,
      secondaryWobbleFreq: Math.random() * 0.2 + 0.05,
    })),
  );

  const timeString = useMemo(() => {
    const hours = currentTime.getHours() % 12 || 12;
    const mins = currentTime.getMinutes().toString().padStart(2, '0');
    return `${hours}${mins}`;
  }, [currentTime]);

  const getRandColor = () => {
    const rand = Math.random();
    if (rand < 0.4)
      return `rgb(${Math.random() * 50 + 90}, ${Math.random() * 40 + 50}, ${Math.random() * 30 + 30})`;
    if (rand < 0.7)
      return `rgb(${Math.random() * 30 + 10}, ${Math.random() * 30 + 10}, ${Math.random() * 30 + 10})`;
    return `rgb(${Math.random() * 40 + 60}, 80, 70)`;
  };

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const swayOffset = Math.sin(elapsed) * 5;

      particles.current.forEach((p) => {
        if (!p.el) return;

        p.angle += p.speed * 0.05;
        p.baseHeight -= p.speed * 0.5;

        // Reset particle when it goes off top
        if (p.baseHeight < -10) {
          p.baseHeight = 110;
          p.el.textContent =
            timeString[Math.floor(Math.random() * timeString.length)] || '0';
          p.el.style.color = getRandColor();
        }

        const normalizedHeight = 1 - p.baseHeight / 100;
        const radius =
          3 + normalizedHeight * 20 + Math.sin(elapsed + p.wobblePhase) * 1.5;
        const wobble =
          Math.sin(elapsed * p.wobbleFreq + p.wobblePhase) * p.wobbleAmp;

        const x = 50 + swayOffset + Math.cos(p.angle) * radius + wobble;
        const y = p.baseHeight;
        const scale = 0.5 + (p.baseHeight / 100) * 1.5;

        p.el.style.transform = `translate(${x}vw, ${y}vh) scale(${scale}) rotate(${p.angle * 50}deg)`;
        p.el.style.zIndex = Math.floor(scale * 10).toString();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    // Flash Loop
    let flashTimeout: NodeJS.Timeout;
    const runFlash = () => {
      if (flashRef.current) {
        flashRef.current.style.backgroundColor =
          Math.random() > 0.5 ? 'white' : 'black';
        flashRef.current.style.opacity = '1';
        setTimeout(() => {
          if (flashRef.current) flashRef.current.style.opacity = '0';
        }, 50);
      }
      flashTimeout = setTimeout(runFlash, Math.random() * 2000 + 1000);
    };

    animate();
    runFlash();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(flashTimeout);
    };
  }, [timeString]);

  return (
    <div className={styles.tornadoClock}>
      <img src={torGif} className={styles.tornadoClockBg} alt="" />

      {/* React renders the spans once; the useEffect animates them via refs */}
      {particles.current.map((p, i) => (
        <span key={i} ref={(el) => (p.el = el)} className={styles.tornadoClockLetter}>
          {timeString[Math.floor(Math.random() * timeString.length)]}
        </span>
      ))}

      <div ref={flashRef} className="flash-overlay" />
    </div>
  );
};

export default Clock;
