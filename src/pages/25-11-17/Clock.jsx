import React, { useEffect, useRef, useState } from "react";
import bg1 from "./mars.webp";
import bg2 from "./mars1.gif";
import bg3 from "./mars1.gif";
import font2025_11_18 from "./mars.ttf";

export default function MarsDigitalClock() {
  const [time, setTime] = useState(new Date());
  const rafRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loop = () => {
      if (!mounted) return;
      setTime(new Date());
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const two = (n) => String(n).padStart(2, "0");

  const hoursStr = two(time.getHours());
  const minutesStr = two(time.getMinutes());
  const secondsStr = two(time.getSeconds());
  const msStr = two(Math.floor(time.getMilliseconds() / 10));

  const DigitBox = ({ children }) => (
    <div className="digitBox" style={styles.digitBox}>
      {children}
    </div>
  );

  const styles = {
    fontFace: `
      @font-face {
        font-family: 'ClockFont';
        src: url(${font2025_11_18}) format('truetype');
        font-display: swap;
      }
    `,
    root: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      fontFamily:
        "ClockFont, Inter, Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
      color: "rgba(25, 25, 25, 0.6)",
      overflow: "hidden",
      padding: "2vh",
      boxSizing: "border-box",
    },
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(185deg, #F80606FF, #D34C23FF)",
      zIndex: 0,
    },
    background1: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${bg1})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "hue-rotate(-20deg) saturate(1.8) contrast(1.8) brightness(1.2)",
      zIndex: 1,
    },
    background2: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${bg2})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 1,
    },
    background3: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${bg3})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      transform: "rotate(180deg)",
      zIndex: 1,
    },
    content: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: "2vh",
    },
    group: {
      display: "flex",
      flexDirection: "row",
      gap: "1vh",
    },
    digitBox: {
      width: "16vh",
      height: "16vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "23vh",
      lineHeight: 1,
      whiteSpace: "nowrap",
    },
  };

  return (
    <>
      <style>{styles.fontFace}</style>
      <style>{`
        @media (max-width: 768px) {
          .content {
            flex-direction: column !important;
          }
          .group {
            flex-direction: row;
          }
          .digitBox {
            font-size: 18vw !important;
            width: 18vw !important;
            height: 18vw !important;
          }
        }
      `}</style>

      <div style={styles.root}>
        {/* Gradient background */}
        <div style={styles.gradientBackground}></div>

        {/* Background layers */}
        <div style={styles.background1}></div>
        <div style={styles.background2}></div>
        <div style={styles.background3}></div>

        {/* Clock content */}
        <div className="content" style={styles.content}>
          <div className="group" style={styles.group}>
            <DigitBox>{hoursStr[0]}</DigitBox>
            <DigitBox>{hoursStr[1]}</DigitBox>
          </div>

          <div className="group" style={styles.group}>
            <DigitBox>{minutesStr[0]}</DigitBox>
            <DigitBox>{minutesStr[1]}</DigitBox>
          </div>

          <div className="group" style={styles.group}>
            <DigitBox>{secondsStr[0]}</DigitBox>
            <DigitBox>{secondsStr[1]}</DigitBox>
          </div>

          <div className="group" style={styles.group}>
            <DigitBox>{msStr[0]}</DigitBox>
            <DigitBox>{msStr[1]}</DigitBox>
          </div>
        </div>
      </div>
    </>
  );
}
