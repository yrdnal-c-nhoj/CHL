import React, { useEffect, useRef } from 'react';
import bgImage from '../../../assets/images/25-05-07/water.webp';

const Clock = () => {
  const requestRef = useRef();

  const updateClock = () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondsDeg = ((seconds + ms / 1000) / 60) * 360;
    const minutesDeg = ((minutes + seconds / 60) / 60) * 360;
    const hoursDeg = ((hours % 12 + minutes / 60) / 12) * 360;

    const sHand = document.querySelector('.second-hand');
    const mHand = document.querySelector('.minute-hand');
    const hHand = document.querySelector('.hour-hand');
    const sweep = document.querySelector('.radar-sweep');

    if (sHand) sHand.style.transform = `translateX(-50%) rotate(${secondsDeg}deg)`;
    if (sweep) sweep.style.transform = `translate(-50%, -50%) rotate(${secondsDeg}deg)`;
    if (mHand) mHand.style.transform = `translateX(-50%) rotate(${minutesDeg}deg)`;
    if (hHand) hHand.style.transform = `translateX(-50%) rotate(${hoursDeg}deg)`;

    requestRef.current = requestAnimationFrame(updateClock);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <img src={bgImage} alt="background" className="full-page-image" />
      
      <div className="clock">
        <div id="radar">
          {/* The trailing glow effect */}
          <div className="radar-sweep"></div>
          
          <div className="clock-face">
            <div className="hand hour-hand"></div>
            <div className="hand minute-hand"></div>
            {/* <div className="hand second-hand"></div> */}
            {/* <div className="center"></div> */}
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --hand-color: #0bf226;
          --clock-gray: #1a1a1a; 
          --line-color: rgba(255, 255, 255, 0.1);
        }

        .full-page-image {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          filter: contrast(230%) brightness(50%);
          z-index: 1;
        }

        #radar {
          position: relative;
          width: 85vmin;
          aspect-ratio: 1;
          background-color: var(--clock-gray);
          border: 1vmin solid var(--clock-gray); 
          border-radius: 50%;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
        }

        /* Subtle Grid Overlay */
        #radar::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to bottom, transparent 49.8%, var(--line-color) 50%, transparent 50.2%),
            linear-gradient(to right, transparent 49.8%, var(--line-color) 50%, transparent 50.2%),
            repeating-radial-gradient(circle, transparent 0, transparent 9.8%, var(--line-color) 10%);
          z-index: 2;
          pointer-events: none;
        }

        /* The Sonar Trail */
        .radar-sweep {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          /* Starts transparent, ends at hand-color, sweeping backwards 90 degrees */
          background: conic-gradient(
            from -90deg at 50% 50%,
            rgba(11, 242, 38, 0) 270deg,
            rgba(11, 242, 38, 0.4) 360deg
          );
          z-index: 1;
          pointer-events: none;
        }

        .clock-face {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          background-color: var(--hand-color);
        }

        .hour-hand {
          width: 1.8vmin;
          height: 25%;
          border-radius: 2px;
        }

        .minute-hand {
          width: 1.2vmin;
          height: 38%;
          border-radius: 2px;
        }

      `}</style>
    </div>
  );
};

export default Clock;