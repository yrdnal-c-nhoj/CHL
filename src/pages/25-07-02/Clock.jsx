import React, { useEffect, useRef } from 'react';
import bakFont from './bak.ttf';
import backgroundGif from './bk.gif';

export default function Clock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);
  const numberRefs = useRef([]);

  useEffect(() => {
    // --- Load font first, then add ---
    const font = new FontFace('bak', `url(${bakFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      document.body.classList.add('font-loaded');
    });

    // --- Clock update loop ---
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      const secondDeg = (seconds / 60) * 360;
      const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
      const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDeg}deg)`;

      numberRefs.current.forEach((number) => {
        const numberAngle = parseFloat(number.getAttribute('data-angle'));
        const angleDiff = Math.abs(secondDeg - numberAngle);
        const isNear = angleDiff < 5 || angleDiff > 355;

        if (isNear && !number.classList.contains('spin')) {
          number.classList.add('spin');
          setTimeout(() => {
            number.classList.remove('spin');
            number.style.transform = `translate(-50%, -50%) scaleX(-1)`;
          }, 5000);
        }
      });
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  // --- Layout Styles ---
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f4d4d',
    overflow: 'hidden',
  };

  const clockStyle = {
    position: 'relative',
    width: '70vh',
    height: '70vh',
    borderRadius: '50%',
    transform: 'scaleX(-1)',
    perspective: '1000px',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const handStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
  };

  const numbers = [
    { top: '10%', left: '50%', angle: 0, label: '12' },
    { top: '15.86%', left: '74.13%', angle: 30, label: '1' },
    { top: '30.86%', left: '85.86%', angle: 60, label: '2' },
    { top: '50%', left: '90%', angle: 90, label: '3' },
    { top: '69.14%', left: '85.86%', angle: 120, label: '4' },
    { top: '84.14%', left: '74.13%', angle: 150, label: '5' },
    { top: '90%', left: '50%', angle: 180, label: '6' },
    { top: '84.14%', left: '25.87%', angle: 210, label: '7' },
    { top: '69.14%', left: '14.14%', angle: 240, label: '8' },
    { top: '50%', left: '10%', angle: 270, label: '9' },
    { top: '30.86%', left: '14.14%', angle: 300, label: '10' },
    { top: '15.86%', left: '25.87%', angle: 330, label: '11' },
  ];

  return (
    <div style={containerStyle}>
      {/* Background */}
      <img
        src={backgroundGif}
        alt="background"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          transform: 'scale(1.2)',
          transformOrigin: 'center center',
        }}
      />

      {/* Clock */}
      <div className="clock" style={clockStyle}>
        <div
          ref={hourRef}
          className="hand hour-hand"
          style={{ ...handStyle, width: '0.4rem', height: '6rem', background: '#634a05' }}
        ></div>
        <div
          ref={minuteRef}
          className="hand minute-hand"
          style={{ ...handStyle, width: '0.3rem', height: '8rem', background: '#b97c03' }}
        ></div>
        <div
          ref={secondRef}
          className="hand second-hand"
          style={{ ...handStyle, width: '0.2rem', height: '9rem', background: 'rgb(148, 3, 3)' }}
        ></div>

        {/* Center dot */}
        <div
          style={{
            width: '2rem',
            height: '2rem',
            background: '#cda343',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scaleX(-1)',
            zIndex: 3,
          }}
        ></div>

        {/* Numbers */}
        {numbers.map(({ top, left, angle, label }, i) => (
          <div
            key={label}
            ref={(el) => (numberRefs.current[i] = el)}
            className="number"
            data-angle={angle}
            style={{
              position: 'absolute',
              top,
              left,
              fontSize: '2.5rem',
              fontFamily: 'bak, sans-serif',
              textAlign: 'center',
              color: 'hsl(274, 96%, 18%)',
              textShadow: '#F63409FF 1px 1px',
              lineHeight: '2rem',
              transform: 'translate(-50%, -50%) scaleX(-1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Embedded CSS for spin animation */}
      <style>
        {`
          body { visibility: hidden; }
          body.font-loaded { visibility: visible; }

          @keyframes spin3D {
            0% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            }
            50% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(720deg) rotateY(720deg) rotateZ(720deg);
            }
            100% {
              transform: translate(-50%, -50%) scaleX(-1) rotateX(1440deg) rotateY(1440deg) rotateZ(1440deg);
            }
          }

          .number.spin {
            animation: spin3D 5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          }
        `}
      </style>
    </div>
  );
}
