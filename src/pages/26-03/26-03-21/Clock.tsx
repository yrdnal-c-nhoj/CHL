import React from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import shapesFont from '../../../assets/fonts/26-03-21-shapes.ttf?url';
import shapesBg from '../../../assets/images/26-03/26-03-21/shapes.webp';

const Clock: React.FC = () => {
  const time = useSecondClock();

  const pad = (n: number) => String(n).padStart(2, '0');
  const digits = (pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds())).split('');

  return (
    <div className="clock-wrapper">
      <div className="yellow-overlay"></div>
      <style>{`
        @font-face {
          font-family: 'ShapesFont';
          src: url(${shapesFont}) format('truetype');
        }
        
        :root, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .clock-wrapper {
          width: 100vw;
          height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
       }

       .clock-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            url(${shapesBg}),
            url(${shapesBg});
          background-size: 25% auto, 25% auto;
          background-position: 0 0, 12.5% 0;
          background-repeat: repeat, repeat;
          filter: grayscale(90%);
          z-index: -2;
       }

       .clock-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            // url(${shapesBg}),
            url(${shapesBg});
          background-size: 25% auto, 25% auto;
          background-position: 0 calc(25% / 2), 12.5% calc(25% / 2);
          background-repeat: repeat, repeat;
          filter: grayscale(30%) brightness(1.0) opacity(0.5) rotate(180deg);
          z-index: -2;
       }

       .clock-wrapper .yellow-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 0, 0.3);
          z-index: -1;
          pointer-events: none;
       }

        .clock-container {
          display: grid;
          /* Mobile: 2 columns, 3 rows (Total 6 digits) */
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          // width: 100vw;
          // height: 99dvh;
        }

        .digit {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5C8302;
          font-family: 'ShapesFont', monospace;
          
          /* Scaled to prevent clipping in a 3-row layout */
          font-size: 33.3vh; 
          line-height: 0.69;
          user-select: none;
          overflow: hidden;
        }

        /* Desktop View: Return to 6 digits in a single row */
        @media (min-width: 768px) {
          .clock-container {
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: 1fr;
          }
          .digit {
            font-size: 24vw;
            height: 100dvh;
          }
        }
      `}</style>

      <div className="clock-container">
        {digits.map((digit, index) => (
          <div key={index} className="digit">
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;