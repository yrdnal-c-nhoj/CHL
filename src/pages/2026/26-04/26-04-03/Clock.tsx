import React from 'react';
import { useClockTime } from '@/utils/clockUtils';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-03/clox.mp4';
import fontUrl from '@/assets/fonts/clox.ttf?url';

const formatTimeParts = (date: Date): string[] => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return [...hours, ':', ...minutes, ':', ...seconds];
};

const Clock: React.FC = () => {
  const time = useClockTime();
  const timeParts = formatTimeParts(time);
  const rows = ['t5', 't4', 't3', 't2', 't1', 'mid', 'b1', 'b2', 'b3', 'b4', 'b5'];

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Clox';
          src: url('${fontUrl}') format('truetype');
          font-display: block;
        }
        
        /* 1. Ensure the container has NO isolation and NO background */
        .clock-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: #000; /* Fallback for video load */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* 2. Apply mix-blend-mode to the entire wrapper */
        .clock-content-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          mix-blend-mode: difference; /* This forces everything inside to blend with the video */
        }

        .clock-row {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: -8vw;
          white-space: nowrap;
        }

        .clock-char {
          font-family: 'Clox', monospace;
          font-size: 26vw;
          color: #ffffff; /* Must be pure white to fully invert background colors */
          line-height: 1;
          text-align: center;
          display: inline-block;
        }

        .digit { width: 0.55em; }
        .colon { 
          width: 0.15em; 
          margin: 0 -0.05em; 
          transform: translateY(-0.15em); 
        }
      `}</style>
      
      <div className="clock-container">
        <video 
          className="background-video"
          autoPlay 
          loop 
          muted 
          playsInline 
          src={backgroundVideo} 
        />

        <div className="clock-content-wrapper">
          {rows.map((rowId) => (
            <div key={rowId} className="clock-row">
              {timeParts.map((char, index) => (
                <span 
                  key={`${rowId}-${index}`} 
                  className={`clock-char ${char === ':' ? 'colon' : 'digit'}`}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Clock;