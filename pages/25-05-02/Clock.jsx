
import { useEffect, useRef, useState } from 'react';
import './styles.css';
import fwImage from './fw.gif';
import giphyImage from './giphy (11).gif';
import gif84298 from './84298.gif';

function getRandomBrightColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 50%)`;
}

function getRandomFontSize() {
  return `${Math.floor(Math.random() * 2.5) + 3.75}rem`; // 60px to 100px converted to rem (assuming 16px base)
}

function getRandomExplosionVector() {
  const dx = `${(Math.random() - 0.5) * 25}vw`; // 400px converted to vw (assuming 1920px viewport width)
  const dy = `${(Math.random() - 0.5) * 25}vh`; // 400px converted to vh (assuming 1080px viewport height)
  const rot = `${Math.random() * 1440 - 720}deg`;
  return { dx, dy, rot };
}

function App() {
  const [timeString, setTimeString] = useState(
    new Date().toLocaleTimeString('en-US', { hour12: false })
  );
  const clockRef = useRef(null);

  useEffect(() => {
    const showClock = () => {
      const now = new Date();
      const newTimeString = now.toLocaleTimeString('en-US', { hour12: false });
      setTimeString(newTimeString);

      if (clockRef.current) {
        clockRef.current.style.animation = 'none';
        clockRef.current.offsetWidth; // Force reflow
        clockRef.current.style.animation = 'riseUp 1.5s ease-out forwards';

        setTimeout(() => {
          const digits = clockRef.current.children;
          for (const digit of digits) {
            digit.style.animation = 'explodeWild 1.5s ease-out forwards';
          }
        }, 1500);
      }
    };

    // Run once on load
    showClock();
    // Repeat every 5s
    const interval = setInterval(showClock, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <img src={fwImage} className="bgimage" alt="Fireworks background 1" />
      <img src={giphyImage} className="bgimage" alt="Fireworks background 2" />
      <img src={gif84298} className="bgimage" alt="Fireworks background 3" />
      <div ref={clockRef} className="clock">
        {timeString.split('').map((char, index) => {
          const { dx, dy, rot } = getRandomExplosionVector();
          return (
            <span
              key={index}
              className="digit"
              style={{
                color: getRandomBrightColor(),
                fontSize: getRandomFontSize(),
                '--dx': dx,
                '--dy': dy,
                '--rot': rot,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default App;