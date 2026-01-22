import React, { useEffect, useRef, useState } from 'react';
import bgImage from '../../assets/clocks/26-01-19/hands.webp';

const COLORS = {
  bg: '#FFFFFF',
  secondHand: '#F1E206',
  mainHands: '#1E293B',
  border: '#330202',
};

// --- Physics Logic ---
const getDeviations = (s) => {
  const f = s % 1;
  return [
    Math.sin(f * Math.PI * 2) * 12,                // Slow Wiggle
    f < 0.2 ? f * 10 : (f < 0.5 ? 2 : 0),         // Jump Overshoot
    f < 0.7 ? -f * 8 : -5.6 + (f - 0.7) * 40,    // Elastic Stretch
    f > 0.4 && f < 0.6 ? 6 : 0,                   // Heavy Twitch
    f < 0.6 ? -10 : (f - 0.6) * 25                // Delayed Rush
  ];
};

const ComplexYellowHand = ({ style, className }) => (
  <div className={`hand-container ${className}`} style={style}>
    {/* Arrow head */}
    <div className="border arrow-head" />
    <div className="arrow-head fill" />
    {/* Main blade */}
    <div className="hand-blade" />
    {/* Tail & Ball */}
    <div className="hand-tail" />
    <div className="hand-tail-ball" />
  </div>
);

const ManyHandClock = () => {
  const clockRef = useRef(null);
  const [clockSize, setClockSize] = useState(90);
  
  // Logic state refs (to avoid re-renders)
  const stateRef = useRef({
    forgetful: { pos: 0, frozen: false, next: 0, frozenAt: 0 },
    sleepy: [
      { pos: 0, frozen: false, next: 0, shaking: false, start: 0 },
      { pos: 0, frozen: false, next: 0, shaking: false, start: 0 }
    ],
    panic: { state: 'normal', stuckAt: 0 }
  });

  useEffect(() => {
    const updateSize = () => {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      setClockSize((vmin / window.innerHeight) * 95);
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    let frameId;
    const runTick = () => {
      const now = new Date();
      const time = now.getTime();
      const sRaw = now.getSeconds() + now.getMilliseconds() / 1000;
      const baseRot = (sRaw / 60) * 360;
      
      const { forgetful, sleepy, panic } = stateRef.current;

      // 1. Forgetful Logic
      if (time > forgetful.next) {
        forgetful.frozen = !forgetful.frozen;
        if (forgetful.frozen) forgetful.frozenAt = baseRot;
        forgetful.next = time + Math.random() * 3000 + 1000;
      }

      // 2. Sleepy Logic
      sleepy.forEach((s, i) => {
        if (time > s.next) {
          if (s.frozen) { s.shaking = true; s.start = time; s.frozen = false; }
          else { s.frozen = true; s.at = baseRot; }
          s.next = time + Math.random() * 6000 + 2000;
        }
        if (s.shaking && time - s.start > 300) s.shaking = false;
        s.pos = s.frozen ? s.at : (s.shaking ? s.at + Math.sin(time * (0.05 + i * 0.01)) * 8 : baseRot);
      });

      // 3. Panic Logic
      const sec = now.getSeconds();
      if (sec < 6 && panic.state === 'normal') {
        panic.state = 'stuck';
        panic.stuckAt = (Math.random() * 3 + 1) * 6;
      }
      if (sec >= 7 && panic.state === 'stuck') panic.state = 'rushing';
      if (sec >= 15) panic.state = 'normal';

      let panicPos = baseRot;
      if (panic.state === 'stuck') panicPos = panic.stuckAt;
      else if (panic.state === 'rushing') panicPos = baseRot + 12 + Math.sin(time * 0.12) * 2.5;

      // Update DOM via CSS Variables
      if (clockRef.current) {
        const r = clockRef.current;
        r.style.setProperty('--h-rot', `${(((now.getHours() % 12) + now.getMinutes() / 60) / 12) * 360}deg`);
        r.style.setProperty('--m-rot', `${((now.getMinutes() + sRaw / 60) / 60) * 360}deg`);
        r.style.setProperty('--s-base', `${baseRot}deg`);
        r.style.setProperty('--s-tick', `${Math.floor(sRaw) * 6}deg`);
        r.style.setProperty('--s-forgetful', `${forgetful.frozen ? forgetful.frozenAt : baseRot}deg`);
        r.style.setProperty('--s-sleepy1', `${sleepy[0].pos}deg`);
        r.style.setProperty('--s-sleepy2', `${sleepy[1].pos}deg`);
        r.style.setProperty('--s-panic', `${panicPos}deg`);
        
        getDeviations(sRaw).forEach((dev, i) => {
          r.style.setProperty(`--dev-${i}`, `${baseRot + dev}deg`);
        });
      }

      frameId = requestAnimationFrame(runTick);
    };

    frameId = requestAnimationFrame(runTick);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div style={containerStyle}>
      <style>{dynamicStyles(clockSize)}</style>
      <div ref={clockRef} className="clock-face" style={{ width: `${clockSize}vh`, height: `${clockSize}vh` }}>
        
        {/* Main Hands */}
        <div className="main-hand hour" style={{ transform: `translateX(-50%) rotate(var(--h-rot))` }} />
        <div className="main-hand minute" style={{ transform: `translateX(-50%) rotate(var(--m-rot))` }} />

        {/* The Army */}
        <ComplexYellowHand className="forgetful" style={{ transform: `translateX(-50%) rotate(var(--s-forgetful))` }} />
        <ComplexYellowHand className="sleepy" style={{ transform: `translateX(-50%) rotate(var(--s-sleepy1))` }} />
        <ComplexYellowHand className="sleepy" style={{ transform: `translateX(-50%) rotate(var(--s-sleepy2))` }} />
        <ComplexYellowHand className="panicked" style={{ transform: `translateX(-50%) rotate(var(--s-panic))` }} />
        
        {[...Array(5)].map((_, i) => (
          <ComplexYellowHand key={i} style={{ transform: `translateX(-50%) rotate(var(--dev-${i}))`, opacity: 0.4 }} />
        ))}

        <ComplexYellowHand className="ticking" style={{ transform: `translateX(-50%) rotate(var(--s-tick))` }} />
        <ComplexYellowHand style={{ transform: `translateX(-50%) rotate(var(--s-base))` }} />

        <div className="center-dot" />
      </div>
    </div>
  );
};

// --- Styled Components Logic (extracted for cleanliness) ---

const containerStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  backgroundColor: '#FFFFFF',
  backgroundImage: `radial-gradient(circle at center, rgba(135, 168, 126, 0.6) 0%, rgba(123, 135, 87, 0.4) 100%), url(${bgImage})`,
  backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
};

const dynamicStyles = (size) => `
  .clock-face { position: relative; }
  .hand-container {
    position: absolute; bottom: 50%; left: 50%; width: ${size * 0.008}vh; height: 0;
    transform-origin: bottom center; z-index: 20; pointer-events: none;
  }
  .main-hand {
    position: absolute; bottom: 50%; left: 50%; background: ${COLORS.mainHands};
    transform-origin: bottom center; z-index: 10;
  }
  .hour { height: ${size * 0.25}vh; width: ${size * 0.015}vh; }
  .minute { height: ${size * 0.4}vh; width: ${size * 0.01}vh; }
  
  .arrow-head {
    position: absolute; bottom: ${size * 0.45}vh; left: 50%; transform: translateX(-50%);
    width: 0; height: 0; border-left: ${size * 0.08}vh solid transparent; border-right: ${size * 0.08}vh solid transparent;
  }
  .arrow-head.border { border-bottom: ${size * 0.08}vh solid ${COLORS.border}; margin-bottom: -1px; }
  .arrow-head.fill { border-bottom: ${size * 0.074}vh solid ${COLORS.secondHand}; z-index: 1; }

  .hand-blade {
    position: absolute; bottom: 0; left: 0; width: 100%; height: ${size * 0.4}vh;
    background: ${COLORS.secondHand}; border: ${size * 0.0015}vh solid ${COLORS.border};
    border-bottom: none; box-sizing: border-box;
  }
  .hand-tail {
    position: absolute; top: 0; left: 0; width: 100%; height: ${size * 0.15}vh;
    background: ${COLORS.secondHand}; border: ${size * 0.0015}vh solid ${COLORS.border};
    border-top: none; box-sizing: border-box;
  }
  .hand-tail-ball {
    position: absolute; top: ${size * 0.2}vh; left: 50%; transform: translateX(-50%);
    width: ${size * 0.04}vh; height: ${size * 0.04}vh; border-radius: 50%;
    background: ${COLORS.secondHand}; border: ${size * 0.0015}vh solid ${COLORS.border};
  }

  .forgetful { transition: transform 0.5s ease-out; z-index: 40; }
  .sleepy { transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 41; }
  .panicked { z-index: 150; }
  .ticking { transition: transform 0.15s cubic-bezier(0.2, 2, 0.4, 1); z-index: 90; }

  .center-dot {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: ${size * 0.02}vh; height: ${size * 0.02}vh;
    background: #EFD73C; border: 2px solid #000; border-radius: 50%; z-index: 200;
  }
`;

export default ManyHandClock;