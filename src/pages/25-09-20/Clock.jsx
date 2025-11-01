import React, { useEffect, useRef, useMemo } from 'react';
import orbFont from './orb.ttf'; // Local font file

const COLORS = {
  hourTick: '#ff00ff',
  minuteTick: '#ffff00',
  number: '#00ffff',
  hourHand: '#32a6c3',
  minuteHand: '#00ff90',
  secondHand: '#FD02C3FF',
  background: '#000',
  clockBorder: '#0ff',
  centerDot: '#ff00ff',
  centerDotGradient: '#800080',
};

const SIZES = {
  clock: 'clamp(30vw, 50vh, 80vh)',
  hourHand: { width: '0.6rem', height: '5rem' },
  minuteHand: { width: '0.4rem', height: '7rem' },
  secondHand: { width: '0.3rem', height: '8.5rem' },
  centerDot: '1.6rem',
  hourTick: { width: '0.5rem', height: '2rem' },
  minuteTick: { width: '0.3rem', height: '1rem' },
  number: { width: '2rem', height: '2rem', fontSize: '1.9rem' },
};

const NeonClock = () => {
  const clockRef = useRef(null);
  const ticksRef = useRef([]);
  const lastTickRef = useRef(-1);
  const timeRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const second = now.getSeconds() + ms / 1000;
      const minute = now.getMinutes() + second / 60;
      const hour = now.getHours() + minute / 60;

      const hourEl = document.getElementById('hour');
      const minuteEl = document.getElementById('minute');
      const secondEl = document.getElementById('second');
      if (hourEl && minuteEl && secondEl) {
        hourEl.style.transform = `translateX(-50%) rotate(${(hour % 12) * 30}deg)`;
        minuteEl.style.transform = `translateX(-50%) rotate(${minute * 6}deg)`;
        secondEl.style.transform = `translateX(-50%) rotate(${second * 6}deg)`;
      }

      if (timeRef.current) {
        timeRef.current.textContent = now.toLocaleTimeString();
      }

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

  const renderTicks = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = i * 6 - 90;
      const rad = (angle * Math.PI) / 180;
      const tickX = 50 + 45 * Math.cos(rad);
      const tickY = 50 + 45 * Math.sin(rad);
      const isHour = i % 5 === 0;

      return (
        <div
          key={i}
          ref={(el) => (ticksRef.current[i] = el)}
          className={`tick ${isHour ? 'hour-tick' : 'minute-tick'}`}
          style={{
            position: 'absolute',
            top: `${tickY}%`,
            left: `${tickX}%`,
            transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
          }}
        />
      );
    });
  }, []);

  const renderNumbers = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const num = i + 1;
      const angle = num * 30 - 90;
      const rad = (angle * Math.PI) / 180;
      const numX = 50 + 39 * Math.cos(rad);
      const numY = 50 + 39 * Math.sin(rad);

      return (
        <div
          key={num}
          className="number"
          style={{
            position: 'absolute',
            top: `${numY}%`,
            left: `${numX}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {num}
        </div>
      );
    });
  }, []);

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Orb';
            src: url(${orbFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          .neon-clock {
            width: 100vw;
            height: 100dvh;
            background-color: ${COLORS.background};
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .clock-container {
            width: ${SIZES.clock};
            height: ${SIZES.clock};
            aspect-ratio: 1 / 1;
            position: relative;
            font-family: 'Orb', sans-serif;
          }

          .clock-face {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle at center, #111 30%, ${COLORS.background} 100%);
            box-shadow: 0 0 4rem ${COLORS.number}, 0 0 9rem ${COLORS.hourTick}, 0 0 16rem ${COLORS.number},
                        inset 0 0 3rem ${COLORS.number}, inset 0 0 8rem ${COLORS.hourTick};
            border: 0.4rem solid ${COLORS.clockBorder};
            filter: drop-shadow(0 0 2rem ${COLORS.clockBorder}) drop-shadow(0 0 3rem ${COLORS.hourTick});
          }

          .center-dot {
            width: ${SIZES.centerDot};
            height: ${SIZES.centerDot};
            background: radial-gradient(circle, ${COLORS.centerDot}, ${COLORS.centerDotGradient});
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            box-shadow: 0 0 1.5rem ${COLORS.centerDot}, 0 0 3rem ${COLORS.centerDot}, 0 0 6rem ${COLORS.centerDot},
                        inset 0 0 1rem ${COLORS.centerDot};
            z-index: 10;
          }

          .pulse {
            animation: neon-pulse 2s infinite ease-in-out;
          }

          @keyframes neon-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: bottom center;
            border-radius: 1rem;
            transition: transform 0.05s linear;
          }

          .hour-hand {
            width: ${SIZES.hourHand.width};
            height: ${SIZES.hourHand.height};
            background: ${COLORS.hourHand};
            z-index: 4;
          }

          .minute-hand {
            width: ${SIZES.minuteHand.width};
            height: ${SIZES.minuteHand.height};
            background: ${COLORS.minuteHand};
            z-index: 3;
          }

          .second-hand {
            width: ${SIZES.secondHand.width};
            height: ${SIZES.secondHand.height};
            background: ${COLORS.secondHand};
            z-index: 2;
            will-change: transform;
            backface-visibility: hidden;
          }

          .tick {
            position: absolute;
            border-radius: 0.3rem;
            transition: transform 5s ease, box-shadow 0.3s ease;
          }

          .hour-tick {
            width: ${SIZES.hourTick.width};
            height: ${SIZES.hourTick.height};
            background: ${COLORS.hourTick};
            box-shadow: 0 0 1rem ${COLORS.hourTick}, 0 0 2rem ${COLORS.hourTick}, 0 0 3rem ${COLORS.hourTick};
          }

          .minute-tick {
            width: ${SIZES.minuteTick.width};
            height: ${SIZES.minuteTick.height};
            background: ${COLORS.minuteTick};
            box-shadow: 0 0 0.6rem ${COLORS.minuteTick}, 0 0 1rem ${COLORS.minuteTick}, 0 0 2rem ${COLORS.minuteTick};
          }

          .glow {
            box-shadow: 0 0 1.5rem ${COLORS.minuteTick}, 0 0 3rem ${COLORS.minuteTick}, 0 0 6rem ${COLORS.minuteTick} !important;
          }

          .number {
            position: absolute;
            width: ${SIZES.number.width};
            height: ${SIZES.number.height};
            text-align: center;
            line-height: ${SIZES.number.height};
            color: ${COLORS.number};
            font-size: ${SIZES.number.fontSize};
            font-family: 'Orb', sans-serif;
            text-shadow: 0 0 0.5rem ${COLORS.number}, 0 0 1rem ${COLORS.number}, 0 0 1.5rem ${COLORS.number};
          }

          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
          }

          @media (prefers-reduced-motion: reduce) {
            .pulse {
              animation: none;
            }
          }
        `}
      </style>
      <div
        className="neon-clock"
        role="img"
        aria-label="Analog neon clock displaying the current time"
      >
        <div className="clock-container">
          <div ref={clockRef} className="clock-face">
            <div className="pulse center-dot" />
            <div id="hour" className="hand hour-hand" />
            <div id="minute" className="hand minute-hand" />
            <div id="second" className="hand second-hand" />
            {renderTicks}
            {renderNumbers}
            <div className="sr-only" aria-live="polite" ref={timeRef}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeonClock;