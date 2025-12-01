import React, { useState, useEffect, useRef } from 'react';
import revolutionFont from './dec.ttf';
import lineFont from './french.ttf';
import hourHandImg from './fre.webp';
import minuteHandImg from './fren.webp';
import secondHandImg from './fren.png';
import backgroundImg from './fr.jpg';

// --- Inject Fonts ---
const injectFont = (id, fontFace) => {
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = fontFace;
    document.head.appendChild(style);
  }
};

const fontFaceRevolution = `
  @font-face {
    font-family: 'RevolutionaryClockFont';
    src: url(${revolutionFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const fontFaceLine = `
  @font-face {
    font-family: 'LineFont';
    src: url(${lineFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

  useEffect(() => {
    injectFont('revolution-font-style', fontFaceRevolution);
    injectFont('line-font-style', fontFaceLine);
  }, []);

  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      requestRef.current = requestAnimationFrame(tick);
    };
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Decimal time
  const secs = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds() + time.getMilliseconds() / 1000;
  const decimalTotal = (secs / 86400) * 100000;
  const decimalHours = Math.floor(decimalTotal / 10000);
  const decimalMinutes = Math.floor((decimalTotal % 10000) / 100);
  const decimalSeconds = decimalTotal % 100;

  const hours10 = Array.from({ length: 10 }, (_, i) => i + 1);

  // Responsive dial size — never overflows
  const dialSize = `min(86vw, 86vh, 500px)`;

  const styles = {
    container: {
      position: 'fixed',
      inset: 0,
      margin: 0,
      padding: 0,
      background: `url(${backgroundImg}) center/cover no-repeat #000`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      fontFamily: 'sans-serif',
    },
    rotatedBg: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: 'rotate(-2.5deg)',
      transformOrigin: 'center center',
    },
    content: {
      position: 'relative',
      width: dialSize,
      height: dialSize,
      maxWidth: '95vw',
      maxHeight: '95dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: '4vh', // extra breathing room at bottom on phones
    },
    dial: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 245, 0.88)',
      border: '0.6vh solid #B50909FF',
      boxShadow: '0 0 4vh rgba(0,0,0,0.8)',
      fontFamily: 'RevolutionaryClockFont, sans-serif',
    },
    topDigits: {
      position: 'absolute',
      top: '55%',                    // moved up — no longer near bottom
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '0.8vh',
      fontFamily: 'LineFont, sans-serif',
      fontSize: 'clamp(2.5rem, 7vw, 6rem)',
      color: '#694006',
      textShadow: '0 0 1.5vh white, 0 0 3px white',
      zIndex: 30,
      pointerEvents: 'none',
    },
    handBase: {
      position: 'absolute',
      left: '50%',
      bottom: '50%',
      transformOrigin: 'bottom center',
      filter: 'drop-shadow(0.4vh 0.4vh 0.6vh rgba(0,0,0,0.7))',
    },
    hourNumber: {
      position: 'absolute',
      top: '4%',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: 'clamp(2rem, 9vw, 7rem)',
      color: '#000080',
      pointerEvents: 'none',
    },
  };

  const hands = [
    { img: hourHandImg,   size: ['11vh', '27vh'], zIndex: 5,  getDeg: (h,m) => (h/10)*360 + m/10 },
    { img: minuteHandImg, size: ['13vh', '35vh'], zIndex: 7,  getDeg: (h,m,s) => (m/100)*360 + s/100 },
    { img: secondHandImg, size: ['12vh', '38vh'], zIndex: 9,  opacity: 0.75, getDeg: (h,m,s) => (s/100)*360 },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.rotatedBg}>
        <div style={styles.content}>
          {/* 1793 */}
          <div style={styles.topDigits}>
            {['1', ' ', '7', ' ', '9', ' ', '3'].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* Clock Face */}
          <div style={styles.dial}>
            {/* Hour Numbers 1–10 */}
            {hours10.map(h => (
              <div
                key={h}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${ (h/10)*360 }deg)`,
                }}
              >
                <div style={{
                  ...styles.hourNumber,
                  transform: `translateX(-50%) rotate(${ -(h/10)*360 }deg)`,
                }}>
                  {h}
                </div>
              </div>
            ))}

            {/* Hands */}
            {hands.map(({ img, size, zIndex, opacity = 1, getDeg }, i) => (
              <div
                key={i}
                style={{
                  ...styles.handBase,
                  width: size[0],
                  height: size[1],
                  zIndex,
                  opacity,
                  background: `url(${img}) center/100% 100% no-repeat`,
                  transform: `translateX(-50%) rotate(${getDeg(decimalHours, decimalMinutes, decimalSeconds)}deg)`,
                }}
              />
            ))}

            {/* Center dot */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '1.2vh',
              height: '1.2vh',
              background: '#333',
              border: '0.3vh solid white',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}