import React, { useState, useEffect, useRef } from 'react';
import revolutionFont from './dec.ttf';
import lineFont from './french.ttf';
import hourHandImg from './fre.webp';
import minuteHandImg from './fren.webp';
import secondHandImg from './fren.png';
import backgroundImg from './fr.jpg'; // your background image

// --- Font Setup ---
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

// --- Styles ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    maxHeight: '100dvh',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: `url(${backgroundImg})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundColor: '#000000',
    transform: 'rotate(-2.5deg)',           // 2.5° counterclockwise
    transformOrigin: 'center center',
  },
  topDigits: {
    position: 'absolute',
    top:  '58%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '7.5vh',
    fontFamily: 'LineFont, sans-serif',
    zIndex: 20,
    display: 'flex',
    gap: '1vh',
    color: '#694006FF',
    textShadow: '0 0 0.5vh rgba(255,255,255,1), -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white',
  },
  dial: {
    position: 'relative',
    width: '90vmin',
    height: '90vmin',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,245,0.8)',
    border: '0.6vh solid #880000',           // FIXED
    boxShadow: '0 0 3vh rgba(0,0,0,0.7)',
    fontFamily: 'RevolutionaryClockFont, sans-serif',
    zIndex: 10,
  },
  handBase: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '0.2vh',
    filter: 'drop-shadow(1px 0 0 rgba(0,0,0,0.9))',
  },
};

const handConfig = [
  { img: hourHandImg,    size: ['12.8vh', '31vh'], zIndex: 5, getDeg: (h, m) => (h / 10) * 360 + (m / 10) },
  { img: minuteHandImg,  size: ['15.5vh', '40vh'], zIndex: 7, getDeg: (h, m, s) => (m / 100) * 360 + s / 100 },
  { img: secondHandImg,  size: ['14.3vh', '43vh'], zIndex: 9, opacity: 0.7, getDeg: (h, m, s) => (s / 100) * 360 },
];

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

  useEffect(() => {
    injectFont('revolution-font-style', fontFaceRevolution);
    injectFont('line-font-style', fontFaceLine);
  }, []);

  useEffect(() => {
    const animate = () => {
      setTime(new Date());
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Decimal time calculation
  const totalStandardSeconds =
    time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds() + time.getMilliseconds() / 1000;
  const totalDecimalSeconds = (totalStandardSeconds / 86400) * 100000;
  const decimalHours = Math.floor(totalDecimalSeconds / 10000);
  const decimalMinutes = Math.floor((totalDecimalSeconds % 10000) / 100);
  const decimalSeconds = totalDecimalSeconds % 100;

  const decimalHoursArray = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      {/* 1793 */}
      <div style={styles.topDigits}>
        {['1', '7', '9', '3'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Clock face */}
      <div style={styles.dial}>
        {/* Hour markers 1–10 */}
        {decimalHoursArray.map(hour => (
          <div
            key={hour}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `rotate(${(hour / 10) * 360}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '0vh',
                left: '50%',
                transform: `translateX(-50%) rotate(-${(hour / 10) * 360}deg)`,
                fontSize: '13vh',
                color: '#000080',
              }}
            >
              {hour}
            </div>
          </div>
        ))}

        {/* Hands */}
        {handConfig.map(({ img, size, zIndex, opacity = 1, getDeg }, i) => (
          <div
            key={i}
            style={{
              ...styles.handBase,
              width: size[0],
              height: size[1],
              zIndex,
              opacity,
              backgroundImage: `url(${img})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              transform: `translateX(-50%) rotate(${getDeg(decimalHours, decimalMinutes, decimalSeconds)}deg)`,
            }}
          />
        ))}

        <div style={styles.centerDot} />
      </div>
    </div>
  );
}