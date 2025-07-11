import React, { useEffect } from 'react';
import shinyFont from './Shiny.ttf';
import bgGif from './d7e781b32269a8a82b500c1a9dc97733-ezgif.com-optimize.gif';

const GoldenHourClock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      document.getElementById('hours').textContent = pad(now.getHours());
      document.getElementById('minutes').textContent = pad(now.getMinutes());
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'black',

        // Center horizontally & vertically
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Shiny';
          src: url(${shinyFont}) format('truetype');
        }

        body, html, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }

        .bgimage {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          filter: brightness(120%);
          transform: scaleX(-1);
        }

        .frame {
          position: relative;
          width: 70%;
          height: 70%;
          border: 1px solid white;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 10px rgba(237, 200, 18, 0.5);
          z-index: 1;
          margin: auto;
        }

        .clock {
          font-family: 'Shiny';
          color: #f8e9be;
          text-shadow: rgb(213, 102, 80) 1px 1px 1px;
          display: flex;
          font-size: 4rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .time-unit {
          width: 6rem;
          height: 6rem;
        }

        @media (max-width: 600px) {
          .clock {
            flex-direction: column;
          }

          .time-unit {
            width: 100%;
          }
        }

        .light {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1vh;
          height: 1vh;
          margin: -100px 0 0 -100px;
          background: #f4ebac;
          box-shadow:
            0 0 80px 30px rgb(247, 247, 169),
            0 0 40px 20px rgb(248, 245, 160);
          animation: lightwander 20s infinite ease-in-out,
                     lightbright 10s alternate infinite linear;
          border-radius: 9999px;
          z-index: 10;
          filter: brightness(200%);
        }

        .flare {
          position: absolute;
          border-radius: 9999px;
          animation: flarewander 25s infinite ease-in-out;
          z-index: 11;
        }

        .flare.one {
          margin: -100px 0 0 -100px;
          width: 200px;
          height: 200px;
          box-shadow:
            inset 0 0 60px 10px rgba(230, 230, 244, 0.2),
            0 0 40px 10px rgba(200, 200, 255, 0.2);
        }

        .flare.two {
          margin: -150px 0 0 -150px;
          width: 300px;
          height: 300px;
          box-shadow:
            inset 0 0 120px 10px rgba(180, 255, 180, 0.15),
            0 0 40px 5px rgba(180, 255, 180, 0.15);
        }

        .flare.three {
          margin: -400px 0 0 -400px;
          width: 800px;
          height: 800px;
          box-shadow:
            inset 0 0 80px 10px rgba(255, 60, 60, 0.3),
            0 0 40px 10px rgba(255, 60, 60, 0.3);
        }

        .flare.four {
          margin: 10% 0 0 10%;
          width: 200px;
          height: 200px;
          box-shadow:
            inset 0 0 160px 5px rgba(50, 255, 50, 0.25),
            0 0 60px 10px rgba(50, 255, 50, 0.25);
        }

        .flare.five {
          margin: -5% 0 0 -5%;
          width: 120px;
          height: 120px;
          box-shadow:
            inset 0 0 160px 5px rgba(255, 255, 100, 0.3),
            0 0 50px 10px rgba(255, 255, 100, 0.3);
        }

        .flare.six {
          margin: 15% 0 0 15%;
          width: 50px;
          height: 50px;
          box-shadow:
            inset 0 0 30px 10px rgba(100, 255, 255, 0.3),
            0 0 15px 3px rgba(100, 255, 255, 0.3);
        }

        @keyframes lightwander {
          0% { top: 50%; left: 50%; }
          20% { top: 55%; left: 45%; }
          40% { top: 52%; left: 60%; }
          60% { top: 48%; left: 40%; }
          80% { top: 53%; left: 50%; }
          100% { top: 50%; left: 50%; }
        }

        @keyframes flarewander {
          0% { top: 70%; left: 70%; }
          25% { top: 60%; left: 80%; }
          50% { top: 75%; left: 60%; }
          75% { top: 65%; left: 75%; }
          100% { top: 70%; left: 70%; }
        }

        @keyframes lightbright {
          0% {
            box-shadow:
              0 0 80px 30px rgba(255, 255, 220, 1),
              0 0 40px 20px rgba(255, 255, 255, 1);
          }
          50% {
            box-shadow:
              0 0 100px 40px rgba(255, 255, 240, 1),
              0 0 60px 30px rgba(255, 255, 255, 1);
          }
          100% {
            box-shadow:
              0 0 90px 35px rgba(255, 255, 230, 1),
              0 0 50px 25px rgba(255, 255, 255, 1);
          }
        }
      `}</style>

      <img src={bgGif} alt="Background" className="bgimage" />

      <div className="frame">
        <div className="clock">
          <div className="time-unit" id="hours">00</div>
          <div className="time-unit" id="minutes">00</div>
        </div>
      </div>

      <div className="light">
        <div className="flare one">
          <div className="flare two">
            <div className="flare five"></div>
            <div className="flare six"></div>
            <div className="flare three">
              <div className="flare four"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldenHourClock;
