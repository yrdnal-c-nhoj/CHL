import React, { useEffect, useRef, useState } from 'react';
import clockFont from '@/assets/fonts/26fonts/26-05-20.otf';

function formatTime(d: Date) {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function Clock() {
  const [isOpen, setIsOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const timeoutRef = useRef<number | null>(null);

  // Door animation cycle
  useEffect(() => {
    const openDoors = () => {
      setIsOpen(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, 2800); // slightly shorter than animation duration for snappier feel
    };

    openDoors();
    const intervalId = window.setInterval(openDoors, 6200);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // Clock ticking
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const styles: React.CSSProperties = {
    width: 400,
    aspectRatio: '1 / 1.32',
    overflow: 'hidden',
    position: 'relative',
    border: '16px solid hsl(193, 6%, 41%)',
    borderBottomColor: 'hsl(193, 9%, 28%)',
    boxShadow: '0 1.5em 2.375em -0.26em #0006',
    borderRadius: '4px', // subtle rounding
  };

  return (
    <>
      <style>{`
        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          min-block-size: 100vh;
          display: grid;
          place-content: center;
          font-family: "Google Sans", system-ui, sans-serif;
          background: hsl(193, 11%, 82%);
        }

        @font-face {
          font-family: "ClockFont";
          src: url("${clockFont}") format("opentype");
          font-display: swap;
        }

        .frame {
          display: grid;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          border-radius: 4px;
        }

        .frame::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 7;
          box-shadow: 0 10px 14px 8px #0005 inset;
          pointer-events: none;
        }

        .inside {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: hsl(193, 9%, 28%);
          color: #DBC5B3;
          font-size: 10vh;
          // font-weight: 700;
          letter-spacing: 0.08em;
        }

        .digital-clock {
          font-family: "ClockFont", monospace;
          user-select: none;
          text-shadow: 0 2px 4px #0008;
        }

        .doors {
          z-index: 5;
          display: grid;
          grid-template: "left right" 1fr / 1fr 1fr;
          position: relative;
        }

        .door {
          position: absolute;
          inset: 0;
          overflow: hidden;
          display: grid;
          transition: transform 920ms cubic-bezier(0.77, 0, 0.18, 1);
          will-change: transform;
          backface-visibility: hidden;
        }

        .door::after {
          content: "";
          position: absolute;
          inset: 0;
          background: hsl(193, 6%, 41%)
            linear-gradient(
              to bottom,
              #0007,
              18%,
              hsl(193, 6%, 65%) 30% 32%,
              hsl(193, 5%, 54%) 42%,
              #fff2 60%,
              hsl(193, 6%, 41%) 78% 80%,
              #0003
            );
          mix-blend-mode: multiply;
          filter: url(#brushedMetalEffect) invert(7%) contrast(105%);
        }

        .left-door {
          grid-area: left;
          transform-origin: left center;
          box-shadow: inset -3px 0 4px -1px #0007;
          border-inline-end: 1px solid hsl(193, 16%, 14%);
        }

        .right-door {
          grid-area: right;
          transform-origin: right center;
          box-shadow: inset 3px 0 4px -1px #0007;
          border-inline-start: 1px solid hsl(193, 16%, 14%);
        }

        .frame.is-open .left-door {
          transform: translateX(-72%);
        }

        .frame.is-open .right-door {
          transform: translateX(72%);
        }
      `}</style>

      {/* SVG Filter */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="brushedMetalEffect" x="0" y="0">
            <feComponentTransfer in="SourceGraphic" result="metal">
              <feFuncR type="gamma" amplitude="1.21" exponent="0.53" />
              <feFuncG type="gamma" amplitude="1.21" exponent="0.53" />
              <feFuncB type="gamma" amplitude="1.21" exponent="0.5" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="metal" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <section className={`frame${isOpen ? ' is-open' : ''}`} style={styles}>
        <div className="doors">
          <div className="door left-door" />
          <div className="door right-door" />
        </div>

        <div className="inside">
          <div className="digital-clock" aria-label={formatTime(now)}>
            {formatTime(now)}
          </div>
        </div>
      </section>
    </>
  );
}
