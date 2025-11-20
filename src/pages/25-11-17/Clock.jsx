import React, { useEffect, useRef, useState } from "react";
import bg1 from "./mars.webp";
import bg2 from "./mars1.gif";
import bg3 from "./mars1.gif";
import font2025_11_18 from "./mars.ttf";

export default function MarsDigitalClock() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const font = new FontFace("ClockFont", `url(${font2025_11_18})`, {
      style: "normal",
      weight: "400",
    });

    font
      .load()
      .then((loaded) => {
        if (cancelled) return;
        document.fonts.add(loaded);
        setFontLoaded(true);
      })
      .catch(() => {
        // In case of error, still show the clock with fallback font
        if (!cancelled) setFontLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      fontFamily:
        "ClockFont, Inter, Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
      overflow: "hidden",
      padding: "2vh",
      boxSizing: "border-box",
      opacity: fontLoaded ? 1 : 0,
      transition: "opacity 0.35s ease-out",
    },
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(188deg, #DF0623FF, #F35B0FFF)",
      zIndex: 0, // gradient behind everything
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
      // opacity: 0.3, // 60% opacity
    },
    background2: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${bg2})`,
  backgroundSize: "100% 100%",   // <— Stretch to fill container
  backgroundPosition: "center",
  opacity: 0.5,
  zIndex: 2,
},

background3: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${bg3})`,
  backgroundSize: "100% 100%",   // <— Stretch to fill container
  backgroundPosition: "center",
  transform: "rotate(180deg)",
  opacity: 0.5,
  zIndex: 3,
},

    content: {
      position: "relative",
      zIndex: 4, // above all backgrounds
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
      width: "11vh",
      height: "11vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13vh",
      color: "#EF2005FF",
      lineHeight: 1,
      whiteSpace: "nowrap",
textShadow: "-1px -1px 0 #040404FF, 1px 1px 0 #F7F8BFFF",
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
          .digitBox {
            font-size: 12vw !important;
            width: 12vw !important;
            height: 12vw !important;
          }
        }
      `}</style>

      <div style={styles.root}>
        <div style={styles.gradientBackground}></div>
        <div style={styles.background1}></div>
        <div style={styles.background2}></div>
        <div style={styles.background3}></div>

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
