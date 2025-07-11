import { useEffect, useState } from 'react';
import airFontUrl from './air.ttf';
import stampImg from './stamp.png';
import stamp2Img from './stamp2.png';
import stamp3Img from './stamp3.png';
import frameImg from './frame.jpg';

// Inject @font-face via JS
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(`
  @font-face {
    font-family: 'air';
    src: url(${airFontUrl}) format('truetype');
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
`);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

const styles = {
  body: {
    color: 'rgb(84, 82, 176)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: 0,
    overflow: 'hidden',
    position: 'relative',
    fontFamily: 'air'
  },
  clock: {
    display: 'flex',
    zIndex: 3
  },
  digitBox: {
    width: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '8rem',
    boxSizing: 'border-box'
  },
  colon: {
    width: '1rem',
    height: '7rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '7rem'
  },
  jostle: {
    animation: 'bounceJostle 10s infinite ease-in-out'
  },
  bgimage: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '85%',
    width: '95%',
    zIndex: 1
  },
  stamp: {
    position: 'absolute',
    top: '2rem',
    right: '9.6rem',
    width: '6rem',
    height: '4rem',
    transformOrigin: 'center center',
    zIndex: 2,
    animationDelay: '0.4s'
  },
  stamp2: {
    position: 'absolute',
    top: '4.9rem',
    right: '3rem',
    width: '5rem',
    height: '4rem',
    transformOrigin: 'center center',
    zIndex: 2,
    animationDelay: '0.8s'
  },
  stamp3: {
    position: 'absolute',
    top: '2.5rem',
    right: '3.3rem',
    width: '7rem',
    height: '3rem',
    transformOrigin: 'center center',
    zIndex: 2
  }
};

export default function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '');
  const format = ['digit', 'digit', 'colon', 'digit', 'digit', 'colon', 'digit', 'digit'];
  const timeParts = [...timeStr];
  let i = 0;

  return (
    <div style={styles.body}>
      <img src={frameImg} style={{ ...styles.bgimage, ...styles.jostle, animationDelay: '0.2s' }} />
      <img src={stamp3Img} style={{ ...styles.stamp3, ...styles.jostle }} />
      <img src={stamp2Img} style={{ ...styles.stamp2, ...styles.jostle }} />
      <img src={stampImg} style={{ ...styles.stamp, ...styles.jostle }} />

      <div style={styles.clock}>
        {format.map((type, idx) => {
          if (type === 'colon') {
            return (
              <div key={idx} style={{ ...styles.colon, ...styles.jostle }}>
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
