import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import torGif from '../../../../assets/images/2025/25-05/25-05-24/tor.gif';
import speedFont from '../../../../assets/fonts/2025/25-05-24-speed.ttf';

const NUM_PARTICLES = 100;

const Clock: React.FC = () => {
  // 1. Font Loading
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'speed',
      fontUrl: speedFont,
      options: { weight: 'normal', style: 'normal' }
    }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useSecondClock();
  const [timeString, setTimeString] = useState('');
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
    }))
  );

  // 3. Logic Helpers
  const updateTimeText = () => {
    const now = new Date();
    let hours = now.getHours() % 12 || 12;
    const mins = now.getMinutes().toString().padStart(2, '0');
    setTimeString(`${hours}${mins}`);
  };

  const getRandColor = () => {
    const rand = Math.random();
    if (rand < 0.4) return `rgb(${Math.random() * 50 + 90}, ${Math.random() * 40 + 50}, ${Math.random() * 30 + 30})`;
    if (rand < 0.7) return `rgb(${Math.random() * 30 + 10}, ${Math.random() * 30 + 10}, ${Math.random() * 30 + 10})`;
    return `rgb(${Math.random() * 40 + 60}, 80, 70)`;
  };

  useEffect(() => {
    updateTimeText();
    let animationFrame: number;
    let clockInterval = setInterval(updateTimeText, 60000);
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
          p.el.textContent = timeString[Math.floor(Math.random() * timeString.length)] || '0';
          p.el.style.color = getRandColor();
        }

        const normalizedHeight = 1 - p.baseHeight / 100;
        const radius = (3 + normalizedHeight * 20) + Math.sin(elapsed + p.wobblePhase) * 1.5;
        const wobble = Math.sin(elapsed * p.wobbleFreq + p.wobblePhase) * p.wobbleAmp;

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
        flashRef.current.style.backgroundColor = Math.random() > 0.5 ? 'white' : 'black';
        flashRef.current.style.opacity = '1';
        setTimeout(() => { if(flashRef.current) flashRef.current.style.opacity = '0' }, 50);
      }
      flashTimeout = setTimeout(runFlash, Math.random() * 2000 + 1000);
    };

    animate();
    runFlash();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(clockInterval);
      clearTimeout(flashTimeout);
    };
  }, [timeString]);

  return (
    <div className="tornado-clock">
      <style>{`
        @font-face { font-family: 'speed'; src: url(${speedFont}); }
        .tornado-clock {
          position: relative; width: 100vw; height: 100vh; overflow: hidden;
          background: radial-gradient(ellipse at center, #8d906e 0%, #eaf5a2 100%);
        }
        .tornado-clock__letter {
          position: absolute; top: 0; left: 0; pointer-events: none;
          will-change: transform; font-family: 'speed', sans-serif;
          font-size: 5vh;
        }
        .tornado-clock__bg {
          position: absolute; width: 100%; height: 100%; object-fit: cover;
          opacity: 0.3; filter: contrast(0.2) invert(1); z-index: 0;
        }
        .flash-overlay {
          position: fixed; inset: 0; pointer-events: none; 
          transition: opacity 0.1s; z-index: 100; opacity: 0;
        }
      `}</style>

      <img src={torGif} className="tornado-clock__bg" alt="" />
      
      {/* React renders the spans once; the useEffect animates them via refs */}
      {particles.current.map((p, i) => (
        <span 
          key={i} 
          ref={el => p.el = el} 
          className="tornado-clock__letter"
        >
          {timeString[Math.floor(Math.random() * timeString.length)]}
        </span>
      ))}

      <div ref={flashRef} className="flash-overlay" />
    </div>
  );
};

export default Clock;