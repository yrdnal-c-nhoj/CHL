import React, { useEffect, useRef, useState } from 'react';

// Import images (same folder as component)
import hourHand from './hour.gif';
import minuteHand from './minute.gif';
import secondHand from './second.gif';
import bgImage from './pp.gif';   // spinning layer
import mainBackground from './p.jpg'; // static full-screen background
import overlayTopLeft from './Pea.gif';     // top-left overlay
import overlayBottomRight from './Pea2.gif'; // bottom-right overlay (different file)

export default function AnalogImageClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const rafRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track image loading
  useEffect(() => {
    const images = [hourHand, minuteHand, secondHand, bgImage, mainBackground, overlayTopLeft, overlayBottomRight];
    let loadedCount = 0;
    const totalImages = images.length;

    const handleImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === totalImages) {
        setIsLoaded(true);
      }
    };

    // Preload images
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Count even if an image fails to load
    });
  }, []);

  // Clock hand animation
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
    <div className={`analog-clock ${isLoaded ? 'loaded' : ''}`}>
      <style>{`
        .analog-clock {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: url(${mainBackground}) center/cover no-repeat;
          opacity: 0;
          transition: opacity 1s ease-in;
        }
        .analog-clock.loaded {
          opacity: 1;
        }
        .background {
          position: absolute;
          inset: -5%;
          background: url(${bgImage}) center/cover no-repeat;
          z-index: 0;
        }
        .background.clockwise {
          animation: spin-cw 290s linear infinite;
          opacity: 0.5;
        }
        .background.counter {
          animation: spin-ccw 290s linear infinite;
          opacity: 0.3;
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
          width: 90vmin; /* Increased to prevent clipping */
          height: 90vmin; /* Increased to prevent clipping */
          z-index: 1;
        }
        .hand {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 50% 85%;
          will-change: transform;
          opacity: 0.8;
          filter: drop-shadow(0 0.3rem 0.5rem rgba(0,0,0,0.4));
          pointer-events: none;
          width: auto;
          max-height: 100%; /* Ensure hands scale within clock face */
        }
        .hour-hand { height: 11rem; z-index: 2; }
        .minute-hand { height: 13rem; z-index: 3; }
        .second-hand { height: 15rem; z-index: 4; }
        .overlay {
          position: absolute;
          z-index: 10;
          width: 70vw;
          height: auto;
          opacity: 0.3;
          pointer-events: none;
        }
        .overlay.top-left {
          top: 0vh;
          left: 0vw;
        }
        .overlay.bottom-right {
          bottom: 0vh;
          right: 0vw;
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
      </div>

      {/* Overlay images */}
      <img src={overlayTopLeft} alt="top left overlay" className="overlay top-left" />
      <img src={overlayBottomRight} alt="bottom right overlay" className="overlay bottom-right" />
    </div>
  );
}