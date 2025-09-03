import React, { useEffect, useState } from 'react';
import braiFont from './brai.ttf'; // Ensure this path is correct and processed by your bundler

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => n.toString().padStart(2, '0');

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  const styleTag = `
    @font-face {
      font-family: 'brai';
      src: url(${braiFont}) format('truetype');
    }

    .clock {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100dvh;
      width: 100vw;
      font-family: 'brai', sans-serif;
      text-align: center;
      gap: 4vw;
      flex-direction: row;
      animation: backgroundFade 22s ease-in-out infinite;
    }

    .time-part {
      font-size: 10vw;
      animation: textFade 22s ease-in-out infinite;
    }

    .label {
      font-size: 3vw;
      margin-top: 1vh;
    }

    .segment {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @keyframes textFade {
      0%   { color: #FCFEDCFF; }
      50%  { color: #100649FF; }
      100% { color: #FCFEDCFF; }
    }

    @keyframes backgroundFade {
      0%   { background: #100649FF; }
      50%  { background: #FCFEDCFF; }
      100% { background: #100649FF; }
    }

    @media (max-width: 768px) {
      .clock {
        flex-direction: column;
        gap: 2vh;
      }
      .time-part {
        font-size: 12vh;
      }
      .label {
        font-size: 4vh;
      }
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div 
        className="clock" 
        role="timer" 
        aria-live="polite" 
        aria-label={`Current time is ${hours} hours, ${minutes} minutes, and ${seconds} seconds`}
      >
        <div className="segment">
          <div className="time-part">{hours}</div>
        
        </div>
        <div className="segment">
          <div className="time-part">{minutes}</div>
     
        </div>
        <div className="segment">
          <div className="time-part">{seconds}</div>
       
        </div>
      </div>
    </>
  );
};

export default Clock;
