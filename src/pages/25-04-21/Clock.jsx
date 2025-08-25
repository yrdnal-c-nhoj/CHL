import React, { useEffect, useRef } from 'react';

// Import images (same folder as component)
import hourHand from './hour.gif';
import minuteHand from './minute.gif';
import secondHand from './second.gif';
import bgImage from './pp.gif';   // spinning layers
import mainBackground from './peacock.webp'; // static full-screen background

export default function AnalogImageClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      if (hourRef.current) {
        hourRef.current.style.transform = `translate(-50%, -85%) rotate(${h * 30}deg)`;
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `translate(-50%, -85%) rotate(${m * 6}deg)`;
      }
      if (secondRef.current) {
        secondRef.current.style.transform = `translate(-50%, -85%) rotate(${s * 6}deg)`;
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="analog-clock">
      <style>{`
        .analog-clock {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: url(${mainBackground}) center/cover no-repeat; /* static background */
        }
        .background {
          position: absolute;
          inset: -5%;
          background: url(${bgImage}) center/cover no-repeat;
          z-index: 0;
        }
        .background.clockwise {
          animation: spin-cw 220s linear infinite;
          opacity: 0.6; /* opacity for clockwise layer */
        }
        .background.counter {
          animation: spin-ccw 220s linear infinite;
          opacity: 0.3; /* opacity for counter layer */
        }
        @keyframes spin-cw {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(-360deg) scale(1.5); }
        }
        .clock-face {
          position: relative;
          width: 80vmin;
          height: 80vmin;
          overflow: hidden;
          z-index: 1;
        }
        .hand {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 50% 85%;
          will-change: transform;
          filter: drop-shadow(0 0.3rem 0.5rem rgba(0,0,0,0.4));
          pointer-events: none;
        }
        .hour-hand { height: 11rem; z-index: 2; }
        .minute-hand { height: 13rem; z-index: 3; }
        .second-hand { height: 15rem; z-index: 4; }
        .center-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: radial-gradient(circle, #eee, #555);
          box-shadow: 0 0 1rem rgba(0,0,0,0.5);
          z-index: 5;
        }
      `}</style>

      {/* Background layers */}
      <div className="background clockwise" />
      <div className="background counter" />

      {/* Clock */}
      <div className="clock-face" aria-label="Analog clock">
        <img ref={hourRef} src={hourHand} alt="hour hand" className="hand hour-hand" />
        <img ref={minuteRef} src={minuteHand} alt="minute hand" className="hand minute-hand" />
        <img ref={secondRef} src={secondHand} alt="second hand" className="hand second-hand" />
        <div className="center-dot" />
      </div>
    </div>
  );
}
