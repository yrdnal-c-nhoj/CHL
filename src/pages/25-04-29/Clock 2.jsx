import { useEffect, useRef, useState } from 'react';
import bangFont from './bang.ttf';
import fwImage from './fw.gif';
import giphyImage from './giphy (11).gif';
import gif84298 from './84298.gif';


// Define font-face in a global CSS module
const styles = `
  @font-face {
    font-family: 'bang';
    src: url(${bangFont}) format('truetype');
  }

  html, body {
    font-family: 'bang', sans-serif;
    margin: 0;
    padding: 0;
    background: rgb(9, 9, 9);
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .bgimage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    filter: saturate(1.3);
    animation: pulse 3s infinite alternate ease-in-out;
  }

  @keyframes pulse {
    from {
      transform: scale(1);
      opacity: 0.6;
    }
    to {
      transform: scale(1.03);
      opacity: 0.75;
    }
  }

  .clock {
    display: flex;
    position: relative;
    z-index: 50;
    opacity: 0;
    animation: fadeIn 2s ease-out forwards;
  }

  .digit {
    font-weight: bold;
    will-change: transform, opacity;
  }

  @keyframes riseUp {
    0% {
      transform: translateY(100vh);
    }
    100% {
      transform: translateY(-70vh);
    }
  }

  @keyframes explodeWild {
    0% {
      opacity: 1;
      transform: scale(1) translate(0, 0) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: scale(5) translate(var(--dx), var(--dy)) rotate(var(--rot));
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

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
  const [timeString, setTimeString] = useState('');
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

    // Play audio
    audioRef.current.muted = false;
    audioRef.current.play().catch((e) => console.error('Audio play failed:', e));

    return () => {
      clearInterval(interval);
      audioRef.current.pause();
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
      <audio ref={audioRef} autoPlay playsInline />
    </div>
  );
}

export default App;