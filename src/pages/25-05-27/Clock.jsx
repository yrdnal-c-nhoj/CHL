import React, { useState, useEffect } from "react";
import dotsFont from "./dots.otf";         // Import custom font
import backgroundImage from "./dot.jpg"; // Import background image

function Clock() {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    hours = (hours % 12) || 12;
    hours = hours.toString();

    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTimeParts(time);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100dvh",
    width: "100vw",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "0.1rem" : "0.1rem",
    overflow: "hidden",
  };

  const unitStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "0.1rem",
    alignItems: "center",
    justifyContent: "center",
  };

  const digitBoxStyle = {
    width: "9rem",
    height: "9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11rem",
    fontFamily: "'dots', monospace",
    backgroundColor: "rgba(251, 148, 5, 0.1)",
    borderRadius: "0.2em",
    color: "rgb(4, 2, 109)",
    textShadow: `
      #f6320b 1px 1px 20px,
      #94f00b -1px 1px 20px,
      #f72808 1px -1px 20px,
      #a5f507 -1px -1px 20px
    `,
  };

  const renderTimeUnit = (value) => (
    <div style={unitStyle}>
      {[...value].map((digit, i) => (
        <div key={i} style={digitBoxStyle}>
          {digit}
        </div>
      ))}
    </div>
  );

  const globalStyle = `
    @font-face {
      font-family: 'dots';
      src: url(${dotsFont}) format('opentype');
    }

    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow: hidden;
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }
  `;

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
        {/* Static Background Layer */}
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            filter: "hue-rotate(50deg)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            opacity: 0.6, // Adjust to your preference
          }}
        />

        {/* Foreground Clock */}
        <div style={{ ...containerStyle, position: "relative", zIndex: 1 }}>
          {renderTimeUnit(hours)}
          {renderTimeUnit(minutes)}
          {renderTimeUnit(seconds)}
        </div>
      </div>
    </>
  );
}

export default Clock;
