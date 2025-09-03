// Clock.jsx
import { useEffect, useState } from 'react';
import antFontUrl from './Ant.ttf';
import bg1 from "./ants.gif"; // tiling
import bg2 from "./ants1.gif"; // cover

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  return (
    <>
      <style>
        {`
        @font-face {
          font-family: 'Ant';
          src: url(${antFontUrl}) format('truetype');
        }

        body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100dvh;
          width: 100vw;
          background-color: rgb(255, 254, 254);
          position: relative;
          overflow: hidden;
        }

        .clock {
          width: 60vh;
          height: 60vh;
          max-width: 400px;
          max-height: 400px;
          min-width: 200px;
          min-height: 200px;
          border-radius: 50%;
          position: relative;
          z-index: 4;
        }

        .number {
          font-family: 'Ant', sans-serif;
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 22vh;
        }

        .number span {
          display: inline-block;
          transform: translateY(-17.5vw);
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          z-index: 10;
          transform: translateX(-50%);
        }

        .hour-hand {
          width: 0.5vw;
          height: 29vw;
          background-color: black;
          max-width: 8px;
          max-height: 80px;
          min-width: 4px;
          min-height: 40px;
        }

        .minute-hand {
          width: 0.4vw;
          height: 25vw;
          background-color: black;
          max-width: 6px;
          max-height: 100px;
          min-width: 3px;
          min-height: 50px;
        }

        .second-hand {
          width: 0.3vw;
          height: 50vw;
          background-color: rgb(9, 9, 9);
          max-width: 4px;
          max-height: 120px;
          min-width: 2px;
          min-height: 60px;
        }

        .center {
          width: 10px;
          height: 10px;
          background-color: black;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 11;
        }
      `}
      </style>

      <div className="container">
        {/* Backgrounds */}
        <div style={{
          backgroundImage: `url(${bg2})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1
        }} />
        <div style={{
          backgroundImage: `url(${bg1})`,
          backgroundRepeat: "repeat",
          backgroundSize: "35vh 45vh",
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 2
        }} />

        {/* Clock */}
        <div className="clock">
          {[...Array(12)].map((_, i) => {
            const angle = (i + 1) * 30;
            return (
              <div className="number" key={i} style={{ transform: `rotate(${angle}deg)` }}>
                <span style={{ color: 'black' }}>{i + 1}</span>
              </div>
            );
          })}
          <div className="hand hour-hand" style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
          <div className="hand minute-hand" style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} />
          <div className="hand second-hand" style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }} />
          <div className="center" />
        </div>

        {/* Content */}
      
      </div>
    </>
  );
};

export default Clock;
