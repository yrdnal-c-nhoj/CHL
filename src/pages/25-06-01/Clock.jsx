import { useEffect, useState } from 'react';
import airFontUrl from './air.ttf';
import stampImg from './stamp.png';
import stamp2Img from './stamp2.png';
import stamp3Img from './stamp3.png';
import frameImg from './frame.jpg';

// Inject @font-face with fallback and enhanced media queries
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(`
  @font-face {
    font-family: 'air';
    src: url(${airFontUrl}) format('truetype');
    font-display: swap;
  }

  @keyframes bounceJostle {
    0%, 10%, 20%, 90%, 100% {
      transform: translate(0, 0) rotate(0);
    }
    5%   { transform: translate(1px, -1.5px) rotate(0.3deg); }
    12%  { transform: translate(-1.2px, 1.2px) rotate(-0.25deg); }
    18%  { transform: translate(1.5px, 0.8px) rotate(0.2deg); }
    25%  { transform: translate(-1px, -1px) rotate(-0.2deg); }
    40%  { transform: translate(0.5px, 0.3px) rotate(0.1deg); }
    55%  { transform: translate(0, 0) rotate(0); }
    70%  { transform: translate(-1.2px, 1.2px) rotate(0.25deg); }
    75%  { transform: translate(1.5px, -1.5px) rotate(-0.3deg); }
    82%  { transform: translate(-0.7px, 1px) rotate(0.15deg); }
  }

  @media (max-width: 600px) {
    .stamp { top: 1vh; right: 5vw; width: 4rem; height: 2.5rem; }
    .stamp2 { top: 3vh; right: 2vw; width: 3rem; height: 2.5rem; }
    .stamp3 { top: 1.5vh; right: 2vw; width: 4rem; height: 2rem; }
    .bgimage { maxHeight: 80dvh; maxWidth: 90vw; }
    .digitBox { fontSize: 4rem; width: 1.5rem; }
    .colon { fontSize: 4rem; width: 0.8rem; height: 4rem; }
    .clock { margin-top: 15vh; } /* Increased margin for smaller screens */
  }

  @media (max-width: 400px) {
    .stamp { top: 0.5vh; right: 3vw; width: 3rem; height: 2rem; }
    .stamp2 { top: 2vh; right: 1vw; width: 2.5rem; height: 2rem; }
    .stamp3 { top: 1vh; right: 1vw; width: 3rem; height: 1.5rem; }
    .bgimage { maxHeight: 75dvh; maxWidth: 85vw; }
    .digitBox { fontSize: 3rem; width: 1.2rem; }
    .colon { fontSize: 3rem; width: 0.6rem; height: 3rem; }
    .clock { margin-top: 20vh; } /* Further increased margin for very small screens */
  }
`);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

const styles = {
  body: {
    color: 'rgb(84, 82, 176)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100dvh',
    width: '100vw',
    margin: 0,
    overflow: 'visible', // Changed to 'visible' to ensure no clipping of the image
    position: 'relative',
    fontFamily: 'air, Arial, sans-serif',
    boxSizing: 'border-box',
  },
  clock: {
    display: 'flex',
    zIndex: 10,
    marginTop: '10vh', // Prevent overlap with stamps
  },
  digitBox: {
    width: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '8rem',
    boxSizing: 'border-box',
  },
  colon: {
    width: '1rem',
    height: '7rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '7rem',
  },
  jostle: {
    animation: 'bounceJostle 10s infinite ease-in-out',
    willChange: 'transform',
  },
  bgimage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Center the image
    maxHeight: '90dvh',
    maxWidth: '90vw',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain', // Ensure no clipping
    zIndex: 1,
    // Removed jostle animation to isolate centering issue
  },
  stamp: {
    position: 'absolute',
    top: '2rem',
    right: '9.6rem',
    width: '6rem',
    height: '4rem',
    transformOrigin: 'center center',
    zIndex: 5,
    animationDelay: '0.4s',
  },
  stamp2: {
    position: 'absolute',
    top: '4.9rem',
    right: '3rem',
    width: '5rem',
    height: '4rem',
    transformOrigin: 'center center',
    zIndex: 5,
    animationDelay: '0.8s',
  },
  stamp3: {
    position: 'absolute',
    top: '2.5rem',
    right: '3.3rem',
    width: '7rem',
    height: '3rem',
    transformOrigin: 'center center',
    zIndex: 5,
  },
};

export default function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '');
  const format = ['digit', 'digit', 'colon', 'digit', 'digit', 'colon', 'digit', 'digit'];
  const timeParts = [...timeStr];
  let i = 0;

  return (
    <div style={styles.body} role="timer" aria-live="polite">
      <img src={frameImg} alt="Background frame" style={styles.bgimage} />
      <img src={stamp3Img} alt="Stamp 3" style={{ ...styles.stamp3, ...styles.jostle }} />
      <img src={stamp2Img} alt="Stamp 2" style={{ ...styles.stamp2, ...styles.jostle }} />
      <img src={stampImg} alt="Stamp 1" style={{ ...styles.stamp, ...styles.jostle }} />
      <div style={styles.clock}>
        {format.map((type, idx) => {
          if (type === 'colon') {
            return (
              <div key={idx} style={{ ...styles.colon, ...styles.jostle }} aria-hidden="true">
                :
              </div>
            );
          }
          return (
            <div key={idx} style={{ ...styles.digitBox, ...styles.jostle }}>
              {timeParts[i++]}
            </div>
          );
        })}
      </div>
    </div>
  );
}