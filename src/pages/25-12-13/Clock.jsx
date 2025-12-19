import React, { useState, useEffect, useRef } from 'react';
import bgImage from './roc.webp';
import rococoFont_251214 from './roc.ttf';

export default function RococoClock() {
  const [now, setNow] = useState(new Date());
  const containerRef = useRef(null);
  const animationRef = useRef();
  const digitsRef = useRef([]);

  // 1. Time Update (Every minute)
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 2. Format Data
  const hours = now.getHours();
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? 'pm' : 'am';
  const timeString = `${displayHours}${now.getMinutes().toString().padStart(2, '0')}${ampm}`;
  const digits = timeString.split('');

  // 3. High-Performance Animation Loop
  useEffect(() => {
    let lastTime = 0;
    const digitData = digits.map((_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 0.05,
    }));

    const animate = (timestamp) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;

      digitsRef.current.forEach((el, i) => {
        if (!el || !digitData[i]) return;

        const data = digitData[i];
        // Physics update
        data.x += data.vx * dt;
        data.y += data.vy * dt;
        data.rot += data.rotV * dt;

        // Bouncing logic
        if (Math.abs(data.x) > 15) data.vx *= -1;
        if (Math.abs(data.y) > 15) data.vy *= -1;

        // Dynamic Scaling (Pulse)
        const scale = 1 + Math.sin(timestamp * 0.002 + i) * 0.1;
        const floatY = Math.sin(timestamp * 0.001 + i) * 5;

        // Apply directly to DOM via CSS Variables for 60fps
        el.style.setProperty('--tx', `${data.x}vh`);
        el.style.setProperty('--ty', `${data.y + floatY}vh`);
        el.style.setProperty('--rot', `${data.rot}deg`);
        el.style.setProperty('--scale', scale);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [digits.length]); // Re-init physics only if number of digits change

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Roco Revival';
            src: url(${rococoFont_251214}) format('truetype');
          }

          .clock-container {
            height: 100vh; width: 100vw;
            display: flex; justify-content: center; align-items: center;
            background: black url(${bgImage}) no-repeat center center / cover;
            overflow: hidden; position: relative;
          }

          .rococo-digit {
            font-family: 'Roco Revival', serif;
            display: inline-block;
            position: relative;
            color: #D3C4C0FF;
            font-size: 15vw;
            margin: 0 1vw;
            will-change: transform;
            text-shadow: 
              2px 2px 4px rgba(255, 20, 147, 0.4),
              0 0 15px rgba(50, 205, 50, 0.3);
            /* This handles the heavy lifting */
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(var(--scale));
          }

          @media (max-width: 768px) {
            .rococo-digit { font-size: 20vw; }
            .clock-container { background-size: contain; }
          }
        `}
      </style>

      <div className="clock-container" ref={containerRef}>
        <div style={{ display: 'flex' }}>
          {digits.map((char, i) => (
            <div
              key={`${i}-${char}`}
              ref={el => (digitsRef.current[i] = el)}
              className="rococo-digit"
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}