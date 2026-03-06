import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// Digit SVG paths as polygon/path data — each digit is a set of fragments
// Viewbox per digit: 0 0 100 150
const DIGIT_FRAGMENTS = {
  '0': [
    "M15,10 L85,10 L75,25 L25,25 Z",
    "M85,10 L95,20 L95,70 L80,55 L80,30 Z",
    "M80,55 L95,70 L95,130 L85,140 L75,125 L75,80 Z",
    "M15,140 L85,140 L75,125 L25,125 Z",
    "M5,130 L15,140 L25,125 L25,80 L20,55 Z",
    "M5,20 L15,10 L25,25 L25,70 L5,70 Z",
    "M5,70 L25,70 L20,80 L5,80 Z",
    "M75,70 L80,80 L95,80 L95,70 Z",
  ],
  '1': [
    "M50,10 L50,130 L60,140 L40,140 Z",
    "M50,10 L60,20 L60,40 L50,50 L40,40 L40,20 Z",
    "M40,50 L60,50 L60,70 L40,70 Z",
    "M50,70 L60,80 L60,100 L50,110 L40,100 L40,80 Z",
    "M40,110 L60,110 L60,130 L50,140 L40,130 Z",
  ],
  '2': [
    "M10,10 L90,10 L90,25 L20,25 Z",
    "M90,10 L100,20 L100,40 L90,50 L80,40 L20,40 Z",
    "M80,40 L90,50 L100,60 L100,80 L90,90 L80,80 Z",
    "M20,80 L80,80 L90,90 L100,100 L100,120 L90,130 L20,130 Z",
    "M10,130 L90,130 L100,140 L10,140 Z",
  ],
  '3': [
    "M10,10 L90,10 L90,25 L20,25 Z",
    "M90,10 L100,20 L100,40 L90,50 L80,40 L20,40 Z",
    "M20,40 L80,40 L90,50 L100,60 L100,80 L90,90 L80,80 Z",
    "M20,80 L80,80 L90,90 L100,100 L100,120 L90,130 L20,130 Z",
    "M10,130 L90,130 L100,140 L10,140 Z",
  ],
  '4': [
    "M10,40 L60,40 L50,50 L30,50 Z",
    "M60,10 L70,20 L70,120 L60,130 L50,120 L50,50 Z",
    "M50,50 L60,60 L60,80 L50,90 L40,80 L40,60 Z",
    "M40,60 L50,70 L50,90 L40,100 L30,90 L30,70 Z",
    "M60,120 L70,130 L70,140 L60,140 Z",
  ],
  '5': [
    "M90,10 L10,10 L20,25 L80,25 Z",
    "M10,10 L20,20 L20,40 L10,50 L10,70 L20,80 L80,80 Z",
    "M80,80 L20,80 L30,90 L90,90 L90,110 L80,120 L20,120 Z",
    "M10,130 L90,130 L90,140 L10,140 Z",
  ],
  '6': [
    "M90,10 L20,10 L10,25 L10,130 L20,140 L80,140 Z",
    "M20,80 L80,80 L90,90 L90,110 L80,120 L20,120 Z",
    "M10,25 L20,40 L20,70 L10,80 L10,70 Z",
    "M80,25 L90,35 L90,65 L80,75 L20,75 Z",
  ],
  '7': [
    "M10,10 L90,10 L90,25 L20,25 Z",
    "M90,10 L100,20 L100,40 L90,50 L80,40 L20,40 Z",
    "M80,40 L90,50 L100,60 L100,80 L90,90 L80,80 Z",
    "M20,80 L80,80 L90,90 L100,100 L100,120 L90,130 L20,130 Z",
    "M10,130 L90,130 L100,140 L10,140 Z",
  ],
  '8': [
    "M15,10 L85,10 L75,25 L25,25 Z",
    "M85,10 L95,20 L95,70 L80,55 L80,30 Z",
    "M80,55 L95,70 L95,130 L85,140 L75,125 L75,80 Z",
    "M15,140 L85,140 L75,125 L25,125 Z",
    "M5,130 L15,140 L25,125 L25,80 L20,55 Z",
    "M5,20 L15,10 L25,25 L25,70 L5,70 Z",
    "M5,70 L25,70 L20,80 L5,80 Z",
    "M75,70 L80,80 L95,80 L95,70 Z",
    "M20,75 L25,80 L75,80 L80,75 L75,70 L25,70 L20,75 Z",
  ],
  '9': [
    "M15,10 L85,10 L75,25 L25,25 Z",
    "M85,10 L95,20 L95,70 L80,55 L80,30 Z",
    "M80,55 L95,70 L95,130 L85,140 L75,125 L75,80 Z",
    "M15,140 L85,140 L75,125 L25,125 Z",
    "M5,130 L15,140 L25,125 L25,80 L20,55 Z",
    "M5,20 L15,10 L25,25 L25,70 L5,70 Z",
    "M5,70 L25,70 L20,80 L5,80 Z",
    "M75,70 L80,80 L95,80 L95,70 Z",
  ],
};

const ShatteringDigitClock = () => {
  const [time, setTime] = useState(new Date());
  const digitRefs = useRef([]);

  const createDigitFragments = useCallback((digit, index) => {
    const fragments = DIGIT_FRAGMENTS[digit] || DIGIT_FRAGMENTS['0'];
    return fragments.map((path, i) => (
      <path
        key={`${index}-${i}`}
        d={path}
        fill="#6EC8EF"
        stroke="#19A004"
        strokeWidth="2"
      />
    ));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate all digit fragments
    digitRefs.current.forEach((ref) => {
      if (!ref) return;
      
      const fragments = ref.querySelectorAll('path');
      
      // Create shatter animation
      gsap.fromTo(fragments, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1
      }, {
        x: () => (Math.random() - 0.5) * 200,
        y: () => (Math.random() - 0.5) * 200,
        rotation: () => (Math.random() - 0.5) * 720,
        scale: 0,
        opacity: 0,
        duration: 1.5,
        stagger: 0.02,
        ease: "power2.out",
        repeat: -1,
        repeatDelay: 2,
        onRepeat: () => {
          // Reset for next cycle
          gsap.set(fragments, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1
          });
        }
      });
    });
  }, [time]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).split('');
  };

  const timeDigits = formatTime(time);

  return (
    <div className="shattering-digit-clock">
      <style jsx>{`
        .shattering-digit-clock {
          background: #19A004;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2vw;
          font-family: 'Cormorant Garamond', serif;
        }

        .digit-container {
          width: 8vw;
          height: 12vw;
          position: relative;
        }

        .digit-svg {
          width: 100%;
          height: 100%;
        }

        .colon {
          font-size: 8vw;
          color: #6EC8EF;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(110, 200, 239, 0.3);
        }

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');
      `}</style>
      
      {timeDigits.map((digit, index) => {
        if (digit === ':') {
          return <div key={index} className="colon">:</div>;
        }
        
        return (
          <div 
            key={index} 
            className="digit-container"
            ref={(el) => (digitRefs.current[index] = el)}
          >
            <svg 
              className="digit-svg"
              viewBox="0 0 100 150"
              xmlSpace="preserve"
            >
              {createDigitFragments(digit, index)}
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default ShatteringDigitClock;
