import { useState, useEffect } from 'react';
import background from './swagr.webp';
import fontDate20251219 from './fa.ttf';

const styleInject = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'CustomFont';
      src: url('${fontDate20251219}') format('truetype');
    }
    .clock-container, .time-part {
      font-family: 'CustomFont', sans-serif;
    }
  `;
  document.head.appendChild(style);
};

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    styleInject();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const isLargeScreen = window.innerWidth > 768;

  useEffect(() => {
    const handleResize = () => setTime(new Date()); // Force re-render to recalculate layout
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
<<<<<<< HEAD
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Background with dark overlay filter */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity/value for desired darkness
          // Alternative options you can swap or combine:
          // backdropFilter: 'blur(4px)', // if you want a blur effect instead/additionally
          // background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
        }}
      />

      {/* Clock content - unaffected by the filter */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100dvh',
        }}
      >
        <div
          className="clock-container"
          style={{
            display: 'flex',
            flexDirection: isLargeScreen ? 'row' : 'column',
            alignItems: 'center',
            gap: isLargeScreen ? '2vw' : '4vh',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontSize: isLargeScreen ? '15vw' : '20vw',
            fontWeight: 'normal',
            letterSpacing: '0.5vw',
          }}
        >
          <div className="time-part" style={{ display: 'flex' }}>
            <span>{hours[0]}</span>
            <span>{hours[1]}</span>
          </div>
          {!isLargeScreen && <div style={{ height: '2vh' }}></div>}
          <div className="time-part" style={{ display: 'flex' }}>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
          </div>
          {!isLargeScreen && <div style={{ height: '2vh' }}></div>}
          <div className="time-part" style={{ display: 'flex' }}>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
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
>>>>>>> parent of dbec0f23 (x)
