import React, { useEffect, useState } from "react";

// Import font and background image from the same folder
import customFontUrl from "./flag.ttf";
import backgroundImg from "./g.webp";

const CLOCK_FONT_FAMILY = "DigitalClockFont__Scoped";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Watch for screen resize → switch between vertical & horizontal
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Format into array [HH, MM, SS]
  const formatTimeParts = (date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return [h, m, s];
  };

  const [h, m, s] = formatTimeParts(time);

  const styles = {
    "@font-face": `
      @font-face {
        font-family: '${CLOCK_FONT_FAMILY}';
        src: url(${customFontUrl}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `,
    container: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: CLOCK_FONT_FAMILY,
    },
    clock: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      fontSize: isMobile ? "8rem" : "10rem",
      color: "white",
      textShadow: "0 0 2rem rgba(0,0,0,0.7)",
      gap: isMobile ? "0" : "2rem", // no space on phone, spaces on laptop
      lineHeight: isMobile ? "8rem" : "normal",
      alignItems: "center",
    },
  };

  return (
    <div style={styles.container}>
      <style>{styles["@font-face"]}</style>
      <div style={styles.clock}>
        <span>{h}</span>
        <span>{m}</span>
        <span>{s}</span>
      </div>
    </div>
  );
};

export default DigitalClock;
