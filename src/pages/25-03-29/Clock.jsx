import React, { useEffect, useRef } from 'react';
import orbFont from './orb.ttf'; // Local font

const NeonClock = () => {
  const clockRef = useRef(null);
  const ticksRef = useRef([]);
  const lastTickRef = useRef(-1);

  useEffect(() => {
    let animationFrameId;

    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const second = now.getSeconds() + ms / 1000;
      const minute = now.getMinutes() + second / 60;
      const hour = now.getHours() + minute / 60;

      document.getElementById('second').style.transform = `translateX(-50%) rotate(${second * 6}deg)`;
      document.getElementById('minute').style.transform = `translateX(-50%) rotate(${minute * 6}deg)`;
      document.getElementById('hour').style.transform = `translateX(-50%) rotate(${(hour % 12) * 30}deg)`;

      const tickIndex = Math.floor(second) % 60;
      if (lastTickRef.current !== tickIndex) {
        const tickToGlow = ticksRef.current[tickIndex];
        if (tickToGlow && !tickToGlow.classList.contains('glow')) {
          tickToGlow.classList.add('glow');
          setTimeout(() => tickToGlow.classList.remove('glow'), 4000);
        }
        lastTickRef.current = tickIndex;
      }

      animationFrameId = requestAnimationFrame(updateClock);
    };

    animationFrameId = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const renderTicks = () =>
    Array.from({ length: 60 }).map((_, i) => {
      const angle = i * 6 - 90;
      const rad = (angle * Math.PI) / 180;
      const tickX = 50 + 45 * Math.cos(rad);
      const tickY = 50 + 45 * Math.sin(rad);
      const isHour = i % 5 === 0;

      return (
        <div
          key={i}
          ref={(el) => (ticksRef.current[i] = el)}
          style={{
            position: 'absolute',
            width: isHour ? '0.5rem' : '0.3rem',
            height: isHour ? '2rem' : '1rem',
            background: isHour ? '#ff00ff' : '#ffff00',
            top: `${tickY}%`,
            left: `${tickX}%`,
            transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
            borderRadius: '0.3rem',
            boxShadow: isHour
              ? '0 0 1rem #ff00ff, 0 0 2rem #ff00ff, 0 0 3rem #ff00ff'
              : '0 0 0.6rem #ffff00, 0 0 1rem #ffff00, 0 0 2rem #ffff00',
            transition: 'transform 5s ease, box-shadow 0.3s ease',
          }}
        />
      );
    });

  const renderNumbers = () =>
    Array.from({ length: 12 }).map((_, i) => {
      const num = i + 1;
      const angle = num * 30 - 90;
      const rad = (angle * Math.PI) / 180;
      const numX = 50 + 39 * Math.cos(rad);
      const numY = 50 + 39 * Math.sin(rad);

      return (
        <div
          key={num}
          style={{
            position: 'absolute',
            width: '2rem',
            height: '2rem',
            textAlign: 'center',
            lineHeight: '2rem',
            color: '#00ffff',
            fontSize: '1.9rem',
            fontFamily: 'Orb, sans-serif',
            top: `${numY}%`,
            left: `${numX}%`,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 0 0.5rem #00ffff, 0 0 1rem #00ffff, 0 0 1.5rem #00ffff',
          }}
        >
          {num}
        </div>
      );
    });

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Orb';
            src: url(${orbFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
          }
        `}
      </style>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '85vh',
            height: '85vh',
            aspectRatio: '1 / 1',
            position: 'relative',
            fontFamily: 'Orb, sans-serif',
          }}
        >
          <div
            ref={clockRef}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, #111 30%, #000 100%)',
              boxShadow:
                '0 0 4rem #00ffff, 0 0 9rem #ff00ff, 0 0 16rem #00ffff, inset 0 0 3rem #00ffff, inset 0 0 8rem #ff00ff',
              border: '0.4rem solid #0ff',
              filter: 'drop-shadow(0 0 2rem #0ff) drop-shadow(0 0 3rem #f0f)',
            }}
          >
            <div
              style={{
                width: '1.6rem',
                height: '1.6rem',
                background: 'radial-gradient(circle, #ff00ff, #800080)',
                borderRadius: '50%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                animation: 'pulse 2s infinite ease-in-out',
                boxShadow:
                  '0 0 1.5rem #ff00ff, 0 0 3rem #ff00ff, 0 0 6rem #ff00ff, inset 0 0 1rem #ff00ff',
                zIndex: 10,
              }}
            />
            <div
              id="hour"
              style={{
                position: 'absolute',
                bottom: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: 'translateX(-50%) rotate(0deg)',
                borderRadius: '1rem',
                background: '#FD02C3FF',
                boxShadow:
                  '0 0 1rem #ff0040, 0 0 3rem #ff0040, 0 0 5rem #ff0040, inset 0 0 0.3rem #000',
                width: '0.6rem',
                height: '6rem',
                zIndex: 4,
              }}
            />
            <div
              id="minute"
              style={{
                position: 'absolute',
                bottom: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: 'translateX(-50%) rotate(0deg)',
                borderRadius: '1rem',
                background: '#00ff90',
                boxShadow:
                  '0 0 1rem #00ff90, 0 0 3rem #00ff90, 0 0 5rem #00ff90, inset 0 0 0.3rem #000',
                width: '0.4rem',
                height: '8rem',
                zIndex: 3,
              }}
            />
            <div
              id="second"
              style={{
                position: 'absolute',
                bottom: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: 'translateX(-50%) rotate(0deg)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                borderRadius: '1rem',
                background: '#32a6c3',
                boxShadow:
                  '0 0 1rem #32a6c3, 0 0 3rem #32a6c3, 0 0 5rem #32a6c3, inset 0 0 0.3rem #000',
                width: '0.3rem',
                height: '9rem',
                zIndex: 2,
              }}
            />
            {renderTicks()}
            {renderNumbers()}
          </div>
        </div>
      </div>
    </>
  );
};

export default NeonClock;
