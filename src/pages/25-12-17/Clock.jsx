import React, { useEffect, useState } from 'react';
import fontFile from './fa.ttf';
import backgroundImg from './swagr.webp';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Load font explicitly with better error handling
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('TodayFont', `url(${fontFile}) format('truetype')`);
        await font.load();
        document.fonts.add(font);
      } catch (error) {
        console.error('Failed to load font:', error);
      } finally {
        setFontReady(true);
      }
    };

    loadFont();
  }, []);

  // Update time every second
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
            .bg-layer {
              background-position: 70% 100%;
              background-size: cover;
            }
          }
        `}
      </style>
      <div className="bg-layer" />
      {/* 🔒 Gate rendering until font is ready */}
      {fontReady && (
        <main className="clock-container">
          <div style={{
            fontFamily: "'TodayFont', monospace",
            fontSize: '10vw',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            opacity: fontReady ? 1 : 0.7,
            transition: 'opacity 0.3s ease'
          }}>
            {`${hours}:${minutes}:${seconds}`}
          </div>
        </main>
      )}
    </>
  );
};

export default DigitalClock;