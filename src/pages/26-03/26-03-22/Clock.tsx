import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import skyImage from '../../../assets/images/26-03/26-03-22/sky.webp';
import balloonFont from '../../../assets/fonts/26-03-22-balloon.ttf?url';

const balloonColors = ['#FF2D2D', '#D4F904', '#32CD32', '#FFCC01FF', '#FF8C00', '#FF1493', '#FF4500', '#9A6BF9'];

// Shuffled once to ensure colors stay consistent for the session
const staticShuffledColors = [...balloonColors].sort(() => Math.random() - 0.5);

interface BalloonDigitProps {
  char: string;
  color: string;
}

const BalloonDigit = memo(({ char, color }: BalloonDigitProps) => {
  // Physics generated once per mount - no more "isPopping" state
  const p = useRef({
    floatSpeed: 3 + Math.random() * 2,
    floatAmplitude: 12 + Math.random() * 10,
    driftSpeed: 4 + Math.random() * 3,
    driftAmplitude: 3 + Math.random() * 1,
    rockSpeed: 2 + Math.random() * 2,
    rockAmplitude: 3 + Math.random() * 3,
    scaleSpeed: 2.5 + Math.random() * 1.5,
    scaleMin: 0.94,
    scaleMax: 1.06,
    delay: Math.random() * -20,
    baseOffsetY: Math.random() * 20 - 10,
    baseOffsetX: Math.random() * 15 - 7.5,
  }).current;

  if (char === ' ') return <span style={{ margin: '0 0.25em' }}>&nbsp;</span>;

  return (
    <span style={{ 
      display: 'inline-block', 
      transform: `translate(${p.baseOffsetX}px, ${p.baseOffsetY}px)`,
      margin: '0 4px',
    }}>
      <span style={{
        display: 'inline-block',
        animation: `balloonFloat ${p.floatSpeed}s ease-in-out infinite alternate`,
        animationDelay: `${p.delay}s`,
        ['--float-amp' as any]: `${p.floatAmplitude}px`,
      }}>
        <span style={{
          display: 'inline-block',
          animation: `balloonDrift ${p.driftSpeed}s ease-in-out infinite alternate`,
          animationDelay: `${p.delay}s`,
          ['--drift-amp' as any]: `${p.driftAmplitude}px`,
        }}>
          <span style={{
            display: 'inline-block',
            animation: `balloonRock ${p.rockSpeed}s ease-in-out infinite alternate`,
            animationDelay: `${p.delay}s`,
            ['--rock-amp' as any]: `${p.rockAmplitude}deg`,
          }}>
            <span 
              className="balloon-string"
              style={{
                display: 'inline-block',
                color: color,
                textShadow: '4px 4px 8px rgba(0,0,0,0.3), -1px -1px 2px rgba(255,255,255,0.2)',
                animation: `balloonBreathe ${p.scaleSpeed}s ease-in-out infinite alternate`,
                animationDelay: `${p.delay}s`,
                ['--scale-min' as any]: p.scaleMin,
                ['--scale-max' as any]: p.scaleMax,
                willChange: 'transform',
              }}
            >
              {char}
            </span>
          </span>
        </span>
      </span>
    </span>
  );
});

const VIPParallaxClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(':', ''); 
    };

    // Set initial time
    setTime(formatTime());

    const timer = setInterval(() => {
      const nextTime = formatTime();
      // Crucial: Only update state if the string actually changes (once per minute)
      // This prevents the "jumping" caused by 1-second re-renders
      setTime(prev => (prev !== nextTime ? nextTime : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const styles = useMemo(() => (
    <style>
      {`
        @font-face {
          font-family: 'Balloon';
          src: url(${balloonFont}) format('truetype');
        }

        @keyframes scrollUp {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }

        @keyframes balloonFloat {
          0% { transform: translateY(calc(var(--float-amp) * -1)); }
          100% { transform: translateY(var(--float-amp)); }
        }

        @keyframes balloonDrift {
          0% { transform: translateX(calc(var(--drift-amp) * -6)); }
          100% { transform: translateX(var(--drift-amp)); }
        }

        @keyframes balloonRock {
          0% { transform: rotate(calc(var(--rock-amp) * -3)); }
          100% { transform: rotate(var(--rock-amp)); }
        }

        @keyframes balloonBreathe {
          0% { transform: scale(var(--scale-min)); }
          100% { transform: scale(var(--scale-max)); }
        }

        .stage {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #87CEEB;
        }

        .layer {
          position: absolute;
          width: 100%;
          height: 200%;
          top: 0;
          left: 0;
        }

        .bg {
          background: url("${skyImage}") center/cover;
          animation: scrollUp 60s linear infinite;
        }

        .fg {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          opacity: 0.8;
          animation: scrollUp 25s linear infinite;
          z-index: 2;
        }

        .glass-tile {
          font-family: 'Balloon', sans-serif;
          font-size: clamp(4rem, 15vw, 12rem);
          text-align: center;
          user-select: none;
          filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.63));
        }

        .balloon-string { position: relative; }
        .balloon-string::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 85%;
          width: 2px;
          height: 100px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0));
          transform: translateX(-50%);
          z-index: -1;
        }
      `}
    </style>
  ), []);

  // Helper to render digits with consistent coloring
  const renderDigits = (offset: number) => {
    return time.split('').map((char, index) => (
      <BalloonDigit 
        key={`${offset}-${index}`} 
        char={char} 
        color={staticShuffledColors[(index + offset) % staticShuffledColors.length]} 
      />
    ));
  };

  return (
    <>
      {styles}
      <div className="stage">
        <div className="layer bg" aria-hidden="true" />
        <div className="layer fg">
          <time className="glass-tile">{renderDigits(0)}</time>
          <time className="glass-tile">{renderDigits(2)}</time>
          <time className="glass-tile">{renderDigits(4)}</time>
        </div>
      </div>
    </>
  );
};

export default VIPParallaxClock;