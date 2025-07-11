import React, { useEffect, useState, useRef } from 'react';
import KinaFont from './Kina.ttf';
import swurl from './swurl.gif';

const importantNumbers = [12, 3, 6, 9];

// Inject @font-face dynamically
const KinaFontStyle = () => (
  <style>{`
    @font-face {
      font-family: 'Kina';
      src: url(${KinaFont}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `}</style>
);

const Clock = () => {
  const clockRef = useRef(null);
  const [time, setTime] = useState(new Date());

  // Update time every animation frame for smooth second hand
  useEffect(() => {
    let animationFrameId;

    const update = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);


  const clockSizeVW = 100; // 100vw max 60rem via max-width in CSS
  const clockMaxRem = 60; // max 60rem


  const radiusVW = 40;

  return (
    <>
      <KinaFontStyle />
      <div
        style={{
          margin: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
          fontFamily: "'Kina', sans-serif",
        }}
      >
        {/* Background image */}
        <img
          src={swurl}
          alt="Swirling background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 0.5,
            filter: 'hue-rotate(290deg) contrast(200%) saturate(200%)',
            pointerEvents: 'none',
          }}
        />

        {/* Clock */}
        <div
          ref={clockRef}
          id="clock"
          style={{
            position: 'relative',
            width: '100vw',
            maxWidth: `${clockMaxRem}rem`,
            height: '100vw',
            maxHeight: `${clockMaxRem}rem`,
            overflow: 'hidden',
            animation: 'spin 60s linear infinite',
            zIndex: 10,
          }}
        >
          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '0.5rem',
              height: '0.5rem',
              backgroundColor: '#000',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
            }}
          />

          {/* Numbers */}
          {importantNumbers.map((num) => {
            // Calculate angle in radians
            // Adjusted so 12 is at top (angle = -Math.PI/2)
            const angle = ((num - 3) / 12) * 2 * Math.PI;

            // x and y multipliers for translation
            const x = Math.cos(angle);
            const y = Math.sin(angle);

            return (
              <div
                key={num}
                className="number"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  fontSize: '7rem',
                  color: '#f199c8',
                  textShadow:
                    '5px 5px #100f10, -2px -2px white, 6px 6px white',
                  fontFamily: "'Kina', sans-serif",
                  pointerEvents: 'none',
                  zIndex: 1,
                  opacity: 0.7,
                  transform: `translate(calc(${x} * ${radiusVW}vw), calc(${y} * ${radiusVW}vw)) translate(-50%, -50%)`,
                  userSelect: 'none',
                }}
              >
                {num}
              </div>
            );
          })}

          {/* Clock hands */}
          {/* Calculate angles for hands */}
          {(() => {
            const ms = time.getMilliseconds();
            const second = time.getSeconds() + ms / 1000;
            const minute = time.getMinutes() + second / 60;
            const hour = time.getHours() + minute / 60;

            const secondDeg = second * 6;
            const minuteDeg = minute * 6;
            const hourDeg = (hour % 12) * 30;

            return (
              <>
                {/* Hour hand */}
                <div
                  id="hour"
                  className="hand hour"
                  style={{
                    position: 'absolute',
                    bottom: '50%',
                    left: '50%',
                    width: '2rem',
                    height: '8rem',
                    backgroundColor: '#FB8906FF',
                    color: '#F87D0AFF',
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${hourDeg}deg)`,
                    zIndex: 4,
                  }}
                />

                {/* Minute hand */}
                <div
                  id="minute"
                  className="hand minute"
                  style={{
                    position: 'absolute',
                    bottom: '50%',
                    left: '50%',
                    width: '1rem',
                    height: '12rem',
                    backgroundColor: '#f0df6e',
                    color: '#f0df6e',
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
                    zIndex: 5,
                  }}
                />

                {/* Second hand */}
               <div
  id="second"
  className="hand second"
  style={{
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: '0.5rem',
    height: '150vh',   // <-- Use vh to extend beyond viewport height
    backgroundColor: '#ee0909',
    color: '#ee0909',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${secondDeg}deg)`,
    zIndex: 6,
  }}
/>

              </>
            );
          })()}
        </div>

        {/* Keyframes in style */}
        <style>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(-360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Clock;
