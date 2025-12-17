import React, { useEffect, useState, useMemo } from 'react';
import fontFile from './fa.ttf';
import backgroundImg from './swagr.webp';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Load font explicitly (prevents FOUT)
  useEffect(() => {
    const font = new FontFace('TodayFont', `url(${fontFile})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontReady(true);
    });
  }, []);

  // Update every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = useMemo(() => {
    const pad = (n) => n.toString().padStart(2, '0');
    return pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds());
  }, [time]);

  const digitToLetter = (d) => 'EcJpLhkMVB'[d];

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: "TodayFont";
            src: url(${fontFile}) format("truetype");
            font-display: block;
          }

          .clock-container {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
          }

          .digit-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 0.1vh;
            width: 100%;
            max-width: 90vw;
          }

          .digit {
            font-family: 'TodayFont';
            color: #1277EBFF;
            font-size: 30vh;
            text-align: center;
            line-height: 1;
            text-shadow:
            1px 0 0 #E2EDF0FF,
 -1px 0 0 #000,
  0 1px 0 #000,
  0 -1px 0 #000;
          }

          .bg-layer {
            position: fixed;
            inset: 0;
            background: url(${backgroundImg}) center/cover no-repeat;
            filter: contrast(0.3) brightness(1.6) saturate(2.7) hue-rotate(9deg);
            z-index: 1;
          }

          @media (max-width: 768px) and (orientation: portrait) {
            .digit-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 0.1vh;
            }
          }
        `}
      </style>

      <div className="bg-layer" />

      {/* 🔒 Gate rendering until font is ready */}
      {fontReady && (
        <main className="clock-container">
          <div className="digit-grid">
            {timeString.split('').map((char, i) => (
              <div key={i} className="digit">
                {digitToLetter(char)}
              </div>
            ))}
          </div>
        </main>
      )}
    </>
  );
};

export default DigitalClock;
