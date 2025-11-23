import { useState, useEffect } from 'react';
import backgroundImg from './app.webp';
import font2025_11_23 from './day.ttf';

// Create blob URL and inject @font-face
let fontBlobUrl = null;
let styleSheet = null;

const DigitBox = ({ children, twist = 0, curve = 0, scaleX = 1, scaleY = 1 }) => {
  const distortStyle = {
    display: 'inline-block',
    fontFamily: '"DigitalBlobFont", monospace',
    fontSize: '12vh',
    color: '#0ff',
    // textShadow: '0 0 20px #0ff, 0 0 40px #0ff, 0 0 80px #0ff',
    background: 'rgba(0, 255, 255, 0.1)',
    padding: '2vh 1.5vw',
    margin: '0.5vh',
    borderRadius: '3vh',
    transform: `rotate(${twist}deg) skew(${curve}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
    boxShadow: 'inset 0 0 30px rgba(0, 255, 255, 0.4), 0 0 30px rgba(0, 255, 255, 0.6)',
    border: '2px solid rgba(0, 255, 255, 0.5)',
    lineHeight: '1',
  };

  return <span style={distortStyle}>{children}</span>;
};

export default function DigitalClock() {
  const [time, setTime] = useState('');
  const [twistString, setTwistString] = useState('50, -40, 60, -35');
  const [curveString, setCurveString] = useState('-70, 60, -80, 70');
  const [scaleXString, setScaleXString] = useState('1.5, 0.7, 1.8, 0.6');
  const [scaleYString, setScaleYString] = useState('0.5, 1.6, 0.8, 1.4');

  const maxChars = 9;
  const [distortedTwists, setDistortedTwists] = useState(new Array(maxChars).fill(0));
  const [distortedCurves, setDistortedCurves] = useState(new Array(maxChars).fill(0));
  const [distortedScaleXs, setDistortedScaleXs] = useState(new Array(maxChars).fill(1));
  const [distortedScaleYs, setDistortedScaleYs] = useState(new Array(maxChars).fill(1));
  const [isDistorting, setIsDistorting] = useState(false);
  const [distortProgress, setDistortProgress] = useState(0);
  const [animationStartTime, setAnimationStartTime] = useState(0);

  useEffect(() => {
    // Fetch font and create blob URL
    fetch(font2025_11_23)
      .then(res => res.blob())
      .then(blob => {
        fontBlobUrl = URL.createObjectURL(blob);
        styleSheet = document.createElement('style');
        styleSheet.textContent = `
          @font-face {
            font-family: "DigitalBlobFont";
            src: url("${fontBlobUrl}") format("truetype");
            font-display: swap;
          }
        `;
        document.head.appendChild(styleSheet);
      });

    
    
    const updateClock = () => {
  const now = new Date();
  let hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes();

  // Remove the 'h' and 'm' markers and colons — use space-separated time
  const formatted = `${hours} ${minutes.toString().padStart(2, '0')}`;
  setTime(formatted);
};
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    
    return () => {
      clearInterval(interval);
      if (fontBlobUrl) URL.revokeObjectURL(fontBlobUrl);
      if (styleSheet) styleSheet.remove();
    };
  }, []);

  useEffect(() => {
    const generateRandom = () => {
      const newTwists = new Array(maxChars).fill().map(() => Math.random() * 180 - 90);
      const newCurves = new Array(maxChars).fill().map(() => Math.random() * 180 - 90);
      const newScaleXs = new Array(maxChars).fill().map(() => Math.random() * 2.5 + 0.5);
      const newScaleYs = new Array(maxChars).fill().map(() => Math.random() * 2.5 + 0.5);
      setDistortedTwists(newTwists);
      setDistortedCurves(newCurves);
      setDistortedScaleXs(newScaleXs);
      setDistortedScaleYs(newScaleYs);
    };

    const startDistort = () => {
      generateRandom();
      setIsDistorting(true);
      setAnimationStartTime(Date.now());
    };

    const firstTimer = setTimeout(startDistort, 2000);
    const interval = setInterval(startDistort, 7000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isDistorting) {
      const animate = () => {
        const progress = Math.min(1, (Date.now() - animationStartTime) / 3000);
        setDistortProgress(progress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsDistorting(false);
          setDistortProgress(0);
        }
      };
      animate();
    }
  }, [isDistorting, animationStartTime]);

  const parseNumbers = (str) => str.split(',').map(s => parseFloat(s.trim()) || 0);

  const characters = time.split('');

  const twistValues = parseNumbers(twistString);
  const curveValues = parseNumbers(curveString);
  const scaleXValues = parseNumbers(scaleXString);
  const scaleYValues = parseNumbers(scaleYString);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        imageRendering: '-webkit-optimize-contrast',
      }}
    >

      <div style={{ textAlign: 'center' }}>
        {characters.map((char, i) => {
          if (char === ' ') {
            return <span key={i} style={{ display: 'inline-block', width: '4vw' }} />;
          }

          return (
            <DigitBox
              key={i}
              twist={twistValues[i % twistValues.length] || 0}
              curve={curveValues[i % curveValues.length] || 0}
              scaleX={scaleXValues[i % scaleXValues.length] || 1}
              scaleY={scaleYValues[i % scaleYValues.length] || 1}
            >
              {char}
            </DigitBox>
          );
        })}
      </div>

      <div style={{ marginTop: '5vh' }}>
        {''.split('').map((c, i) => (
          <DigitBox
            key={`sub${i}`}
            twist={30 + i * 5}
            curve={-25 + i * 3}
            scaleX={1.4}
            scaleY={0.7}
          >
            {c}
          </DigitBox>
        ))}
      </div>
    </div>
  );
}
