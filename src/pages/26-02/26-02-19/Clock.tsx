import React, { useState, useEffect } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import platFont from '../../../assets/fonts/26-02-19-plat.ttf';

const ImageDisplay: React.FC = () => {
  const [time, setTime] = useState(new Date());

  // Use standardized font loader
  const fontReady = useFontLoader('PlatFont', platFont, {
    timeout: 5000,
    fallback: true,
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time Calculations
  const mins = time.getMinutes();
  const hrs = time.getHours();
  const secs = time.getSeconds();
  const minDegrees = mins * 6;
  const hrDegrees = (hrs % 12) * 30 + mins * 0.5;
  const secDegrees = secs * 6;

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Logic to separate digits and AM/PM
  const [rawTime, amPm] = timeString.split(' ');
  const digits = rawTime.replace(/:/g, '').split('');
  const spacedAmPm = amPm.split('').join(' ');

  // Show content when font is ready
  if (!fontReady) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#112D1E',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ACA99F',
          fontFamily: 'sans-serif',
          fontSize: '1.5rem',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* BASE LAYOUT */
        .main-container {
          width: 100vw;
          height: 100dvh;
          background-color: #112D1E;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* DIGITAL SECTION */
        .digital-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center; /* Centers the digits-container */
          z-index: 10;
        }

        .digits-container {
          display: flex;
          justify-content: center;
          width: 100vw; /* Almost full width to maximize digit size */
          gap: 1vw;
        }

        .digit-box {
          font-family: 'PlatFont', sans-serif;
          /* 24vw ensures 4 digits + gaps stay within 100vw */
          font-size: 24vw; 
          color: #ACA99F;
          text-shadow: 0.9vw 0px 0px #B67423, -0.9vw 0px 0px #B67423, 
                       0px 0.9vw 0px #B67423, 0px -0.9vw 0px #B67423;
          line-height: 1.9;
          text-align: center;
          flex: 1; /* Allows digits to grow into available space */
        }

        .ampm-box {
          font-family: 'PlatFont', sans-serif;
          font-size: 18vw; /* Smaller than digits */
          color: #ACA99F;
          text-shadow: 0.9vw 0px 0px #B67423, -0.9vw 0px 0px #B67423, 
                       0px 0.9vw 0px #B67423, 0px -0.9vw 0px #B67423;
          align-self: flex-start;
          margin-left: 5vw; /* Flush left relative to the digits */
          margin-top: -1vh;
        }

        /* ANALOG SECTION */
        .analog-section {
          margin-top: 6vh;
          perspective: 1200px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .clock-face {
          width: 35vh;
          height: 35vh;
          border-radius: 50%;
          backgroundColor: #FFFEFA;
          border: 1.5vh solid #EAD534;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotateX(-25deg) rotateY(40deg);
          transform-style: preserve-3d;
          // box-shadow: 20px 20px 50px rgba(0,0,0,0.3);
        }

        /* DESKTOP OVERRIDES */
        @media (min-width: 600px) {
          .main-container {
            flex-direction: row;
            justify-content: space-between;
            padding: 5vw;
          }
          .digital-group { width: auto; align-items: flex-start; }
          .digits-container { width: auto; gap: 2vw; }
          .digit-box { font-size: 20vh; flex: none; }
          .ampm-box { font-size: 12vh; margin-left: 0; }
          .analog-section { position: absolute; bottom: 10vh; right: 10vh; margin-top: 0; }
          .clock-face { width: 55vh; height: 55vh; }
          
          /* Fix tick marks for larger desktop clock */
          .analog-section .clock-face div[style*="transform: rotate"] {
            transform-origin: 50% 27.25vh !important;
          }
          
          /* Fix hand origins for larger desktop clock */
          .analog-section .clock-face div:nth-child(13) {
            transform-origin: bottom center !important;
          }
          .analog-section .clock-face div:nth-child(14) {
            transform-origin: bottom center !important;
          }
          .analog-section .clock-face div:nth-child(15) {
            transform-origin: bottom center !important;
          }
          
          /* Larger main hour ticks for desktop */
          .analog-section .clock-face div[style*="width: '1.2vh'"] {
            width: 1.8vh !important;
            height: 5vh !important;
            left: calc(50% - 0.9vh) !important;
            background-color: #FF8C00 !important;    
          }
        }
      `}</style>

      <div className="main-container">
        {/* Digital Clock */}
        <div className="digital-group">
          <div className="digits-container">
            {digits.map((char, index) => (
              <div key={index} className="digit-box">
                {char}
              </div>
            ))}
          </div>
          <div className="ampm-box">{spacedAmPm}</div>
        </div>

        {/* Analog Clock */}
        <div className="analog-section">
          <div className="clock-face" style={{ backgroundColor: '#F1E9C2' }}>
            {/* Ticks */}
            {[...Array(12)].map((_, i) => {
              const isMainHour = [0, 3, 6, 9].includes(i);
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: isMainHour ? '1.2vh' : '0.8vh',
                    height: isMainHour ? '4vh' : '2vh',
                    backgroundColor: isMainHour ? '#B67423' : '#FFFFFF',
                    top: '0.5vh',
                    left:
                      'calc(50% - ' + (isMainHour ? '0.6vh' : '0.4vh') + ')',
                    transformOrigin: '50% 17.25vh',
                    transform: `rotate(${i * 30}deg)`,
                    borderRadius: '1vh',
                  }}
                />
              );
            })}

            {/* Hour Hand */}
            <div
              style={{
                ...handBase,
                height: '22%',
                width: '1.4vh',
                backgroundColor: '#2D312D',
                transform: `rotate(${hrDegrees}deg)`,
              }}
            />

            {/* Minute Hand */}
            <div
              style={{
                ...handBase,
                height: '35%',
                width: '0.8vh',
                backgroundColor: '#202220',
                transform: `rotate(${minDegrees}deg)`,
              }}
            />

            {/* Second Hand */}
            <div
              style={{
                ...handBase,
                height: '42%',
                width: '0.4vh',
                backgroundColor: '#B67423',
                transform: `rotate(${secDegrees}deg)`,
                transition: 'transform 0.1s cubic-bezier(0.4, 0.0, 0.2, 1)',
              }}
            />

            {/* Center Pin */}
            <div style={centerDot} />
          </div>
        </div>
      </div>
    </>
  );
};

const handBase = {
  position: 'absolute',
  bottom: '50%',
  transformOrigin: 'bottom center',
  borderRadius: '1vh',
  zIndex: 10,
};

const centerDot = {
  width: '2vh',
  height: '2vh',
  backgroundColor: '#4F594F',
  borderRadius: '50%',
  zIndex: 15,
};

export default ImageDisplay;
