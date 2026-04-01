import { useEffect, useState } from 'react';
import gearsGif from '../../../../assets/images/2025/25-05/25-05-29/gears-13950_128.gif';
import watchFont from '../../../../assets/fonts/2025/25-05-29-watch.ttf?url';
import { Color } from 'three';

const Clock: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [hoursDigits, setHoursDigits] = useState<any>([]);
  const [minutesDigits, setMinutesDigits] = useState<any>([]);
  const [secondsDigits, setSecondsDigits] = useState<any>([]);
  const [vh, setVh] = useState<any>(window.innerHeight);

  // Load local font file
  useEffect(() => {
    const font = new FontFace('WatchFont', `url(${watchFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    }).catch(() => {
      // Font failed to load, will use fallback
    });
  }, []);

  // Character map for digits
  const charMap = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
  };

  const substituteDigit = (str) => str.split('').map((d) => charMap[d] || d);

  useEffect(() => {
    // Update vh on resize for mobile viewport issues
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const updateClock: React.FC = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setHoursDigits(substituteDigit(String(hours)));
      setMinutesDigits(substituteDigit(minutes));
      setSecondsDigits(substituteDigit(seconds));
    };

    updateClock(); // initial render
    setLoaded(true);
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Clock always visible - removed loading condition

  const backgroundStyle = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#0066cc', // Blue background
    backgroundImage: `url(${gearsGif})`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    pointerEvents: 'none',
  };

  return (
    <div
      style={{
        height: vh,
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Layers */}
      <div
        style={{
          ...backgroundStyle,
          backgroundSize: '22vw 18vw',
          opacity: 0.3,
          zIndex: 5,
        }}
      />
      <div
        style={{
          ...backgroundStyle,
          backgroundSize: '21vw 17vw',
          opacity: 0.35,
          zIndex: 4,
        }}
      />
      
      {/* Clock Styles */}
      <style>{`
        .clock {
          font-family: 'WatchFont', 'Orbitron', sans-serif !important;
          color: rgb(29, 2, 84);
          text-shadow: rgb(238, 87, 5) 1px 1px 0px, white -1px 0px 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 15vh;
          text-align: center;
          z-index: 10;
        }

        .unit { display: flex; flex-direction: column; }
        .value { display: flex; flex-direction: column; align-items: center; }
        .digit-box { display: inline-flex; justify-content: center; align-items: center; height: 3rem; user-select: none; }
        .divider { height: 1px; width: 30vw; background-color: rgb(52, 1, 77); margin: 0.5rem auto; }

        @media (max-width: 600px) {
          .clock { font-size: 12vh; }
          .digit-box { height: 9vh; }
          .divider { width: 50vw; }
        }
      `}</style>
      <div
        style={{
          ...backgroundStyle,
          backgroundSize: '20vw 16vw',
          opacity: 0.4,
          zIndex: 3,
        }}
      />

      {/* Clock */}
      <div className="clock">
        <div className="unit" id="hours">
          <div className="value">
            {hoursDigits.map((d, i) => (
              <span key={i} className="digit-box">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="divider"></div>
        <div className="unit" id="minutes">
          <div className="value">
            {minutesDigits.map((d, i) => (
              <span key={i} className="digit-box">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="divider"></div>
        <div className="unit" id="seconds">
          <div className="value">
            {secondsDigits.map((d, i) => (
              <span key={i} className="digit-box">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
