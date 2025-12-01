import React, { useState, useEffect, useRef } from 'react';
import revolutionFont from './dec.ttf';
import lineFont from './french.ttf';
import hourHandImg from './fre.webp';
import minuteHandImg from './fren.webp';
import secondHandImg from './fren.png';
import backgroundImg from './fr.jpg';

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
    time.getHours() * 3600 +
    time.getMinutes() * 60 +
    time.getSeconds() +
    time.getMilliseconds() / 1000;

  const totalDecimalSeconds = (totalStandardSeconds / 86400) * 100000;
  const decimalHours = Math.floor(totalDecimalSeconds / 10000);
  const decimalMinutes = Math.floor((totalDecimalSeconds % 10000) / 100);
  const decimalSeconds = totalDecimalSeconds % 100;

  const decimalHoursArray = Array.from({ length: 10 }, (_, i) => i + 1);

  // --- Responsive Styles ---
  const dialSize = "min(90vw, 90vh)"; // makes dial max size without clipping

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#000",
    },
    innerContainer: {
      transform: "rotate(-2.5deg)",
      transformOrigin: "center center",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    topDigits: {
      position: "absolute",
      top: "60%",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "1vh",
      fontFamily: "LineFont, sans-serif",
      fontSize: "clamp(2rem, 6vh, 7rem)", // scales smoothly
      zIndex: 20,
      color: "#694006FF",
      textShadow:
        "0 0 1vh rgba(255,255,255,1), 0 0 1px white, 0 0 2px white",
    },

    dial: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: dialSize,
      height: dialSize,
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,245,0.85)",
      border: "0.6vh solid #880000",
      boxShadow: "0 0 3vh rgba(0,0,0,0.7)",
      fontFamily: "RevolutionaryClockFont, sans-serif",
      zIndex: 10,
    },

    handBase: {
      position: "absolute",
      left: "50%",
      bottom: "50%",
      transformOrigin: "bottom center",
      filter: "drop-shadow(0.3vh 0 0 rgba(0,0,0,0.8))",
    },

    hourNumber: {
      position: "absolute",
      top: "2%",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "clamp(1rem, 8vh, 8rem)", // responsive hour numbers
      color: "#000080",
    },
  };

  const handConfig = [
    {
      img: hourHandImg,
      size: ["12vh", "28vh"],
      zIndex: 5,
      getDeg: (h, m) => (h / 10) * 360 + m / 10,
    },
    {
      img: minuteHandImg,
      size: ["14vh", "36vh"],
      zIndex: 7,
      getDeg: (h, m, s) => (m / 100) * 360 + s / 100,
    },
    {
      img: secondHandImg,
      size: ["13vh", "39vh"],
      zIndex: 9,
      opacity: 0.7,
      getDeg: (h, m, s) => (s / 100) * 360,
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        {/* 1793 */}
        <div style={styles.topDigits}>
          {["1"," ", "7"," ", "9"," ", "3"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

      {/* Clock Dial */}
      <div style={styles.dial}>
        {/* Hour markers 1–10 */}
        {decimalHoursArray.map((hour) => (
          <div
            key={hour}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transform: `rotate(${(hour / 10) * 360}deg)`,
            }}
          >
            <div
              style={{
                ...styles.hourNumber,
                transform: `translateX(-50%) rotate(-${
                  (hour / 10) * 360
                }deg)`,
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
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              transform: `translateX(-50%) rotate(${getDeg(
                decimalHours,
                decimalMinutes,
                decimalSeconds
              )}deg)`,
            }}
          />
        ))}
        </div>
      </div>
    </div>
  );
}
