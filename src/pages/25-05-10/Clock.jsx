import { useEffect, useRef, useState } from 'react';
import michromaFont from './Michroma.ttf';
import economicaFont from './Economica.ttf';
import questrialFont from './Questrial.ttf';

const fonts = [
  "'michroma'",
  "'economica'",
  "'questrial'"
];

const getRand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getComplementaryColor = (r, g, b) => `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
const getTimeString = () => new Date().toLocaleTimeString('en-US', { hour12: false });

const throwTimeCharacters = (timeStr, throwContainer) => {
  let letterId = 0;
  const r = getRand(90, 255);
  const g = getRand(1, 255);
  const b = getRand(1, 200);
  const sharedColor = `rgb(${r},${g},${b})`;
  const compColor = getComplementaryColor(r, g, b);

  for (let i = 0; i < timeStr.length; i++) {
    const span = document.createElement('span');
    const x = getRand(0, 100); // percentage
    const size = getRand(1, 12);
    const gravityDuration = size >= 7 ? 1500 : 900;
    const y = getRand(0, 100);

    span.textContent = timeStr[i];
    span.style.position = 'absolute';
    span.style.left = `${x}vw`;
    span.style.top = `${y}vh`;
    span.style.fontSize = `${size}rem`;
    span.style.fontFamily = fonts[i % fonts.length];
    span.style.animationDuration = `${gravityDuration}ms`;
    span.style.color = sharedColor;
    span.style.textShadow = `0.5rem 0.5rem 0 ${compColor}`;
    span.id = `letter-${letterId++}`;
    span.className = `an-${getRand(1, 6)}`;
    throwContainer.current.appendChild(span);

    setTimeout(() => {
      span.style.transition = 'opacity 5s, transform 5s';
      span.style.opacity = '0';
      span.style.transform += ' scale(0.5)';
      setTimeout(() => span.remove(), 2000);
    }, 30000);
  }

  if (throwContainer.current.children.length > 300) {
    while (throwContainer.current.children.length > 150) {
      throwContainer.current.removeChild(throwContainer.current.firstChild);
    }
  }
};

const NumberTossClock = () => {
  const throwContainer = useRef(null);
  const [backgroundTime, setBackgroundTime] = useState(getTimeString());

  useEffect(() => {
    const fontStyles = `
      @font-face {
        font-family: 'michroma';
        src: url(${michromaFont}) format('truetype');
      }
      @font-face {
        font-family: 'economica';
        src: url(${economicaFont}) format('truetype');
      }
      @font-face {
        font-family: 'questrial';
        src: url(${questrialFont}) format('truetype');
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = fontStyles;
    document.head.appendChild(styleSheet);

    const updateBackgroundTime = setInterval(() => {
      setBackgroundTime(getTimeString());
    }, 1000);

    let animationFrame;
    const loop = () => {
      throwTimeCharacters(getTimeString(), throwContainer);
      animationFrame = setTimeout(() => requestAnimationFrame(loop), 2000);
    };

    loop();

    return () => {
      clearTimeout(animationFrame);
      clearInterval(updateBackgroundTime);
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.body}>
      <div style={styles.stationaryClock}>{backgroundTime}</div>
      <div ref={throwContainer} style={styles.throw}></div>
      <style>{animationStyles}</style>
    </div>
  );
};

const styles = {
  body: {
    height: '100dvh',
    width: '100vw',
    margin: 0,
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #f50ae1 0%, #ed5e0b 100%)',
    position: 'relative',
  },
  throw: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 1,
  },
  stationaryClock: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '12vw',
    fontFamily: 'Courier New',
    color: 'rgba(255, 255, 255, 0.08)',
    zIndex: 0,
    pointerEvents: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }
};

const animationStyles = `
  .an-1 {
    animation: throw-1-up 1200ms ease-out forwards, throw-1-down 750ms 1200ms ease-in forwards;
  }
  .an-2 {
    animation: throw-2-up 900ms ease-out forwards, throw-2-down 450ms 900ms ease-in forwards;
  }
  .an-3 {
    animation: throw-3-up 1300ms ease-out forwards, throw-3-down 1300ms 1300ms ease-in forwards;
  }
  .an-4 {
    animation: throw-4-up 1380ms ease-out forwards, throw-4-down 1130ms 1380ms ease-in forwards;
  }
  .an-5 {
    animation: throw-5-up 830ms ease-out forwards, throw-5-down 660ms 830ms ease-in forwards;
  }
  .an-6 {
    animation: throw-6-up 320ms ease-out forwards, throw-6-down 940ms 320ms ease-in forwards;
  }

  @keyframes throw-1-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-500%) rotate(720deg); }
  }
  @keyframes throw-1-down {
    0% { transform: translateY(-500%) rotate(720deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-2-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-300%) rotate(320deg); }
  }
  @keyframes throw-2-down {
    0% { transform: translateY(-300%) rotate(320deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-3-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-800%) rotate(600deg); }
  }
  @keyframes throw-3-down {
    0% { transform: translateY(-800%) rotate(600deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-4-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-850%) rotate(-550deg); }
  }
  @keyframes throw-4-down {
    0% { transform: translateY(-850%) rotate(-550deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-5-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-350%) rotate(200deg); }
  }
  @keyframes throw-5-down {
    0% { transform: translateY(-350%) rotate(200deg); }
    100% { transform: translateY(0%); }
  }

  @keyframes throw-6-up {
    0% { transform: translateY(0%) rotate(0deg); }
    100% { transform: translateY(-523%) rotate(300deg); }
  }
  @keyframes throw-6-down {
    0% { transform: translateY(-523%) rotate(300deg); }
    100% { transform: translateY(0%); }
  }
`;

export default NumberTossClock;
