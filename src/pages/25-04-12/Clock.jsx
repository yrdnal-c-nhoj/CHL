import React, { useEffect, useState, useRef } from "react";
import angFont from "./ang.ttf";

const digitFontSizes = {
  0: "51vh",
  1: "46vh",
  2: "21vh",
  3: "28vh",
  4: "54vh",
  5: "51vh",
  6: "29vh",
  7: "55vh",
  8: "23vh",
  9: "20vh",
};

const mediaQueryFontSizes = {
  0: "33vh",
  1: "29vh",
  2: "26vh",
  3: "23vh",
  4: "21vh",
  5: "19vh",
  6: "17vh",
  7: "14vh",
};

const MagentaClock = () => {
  const [timeStr, setTimeStr] = useState(["", "", ""]);
  const [prevDigits, setPrevDigits] = useState(["", "", ""]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const animationTimeouts = useRef([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      hours = hours % 12 || 12; // 12-hour format, no leading zero

      const h = hours.toString(); // no padStart
      const m = minutes.toString().padStart(2, "0");
      const s = seconds.toString().padStart(2, "0");

      setTimeStr([h, m, s]);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 600);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];

    animationTimeouts.current.push(
      setTimeout(() => {
        setPrevDigits(timeStr);
      }, 300)
    );

    return () => animationTimeouts.current.forEach(clearTimeout);
  }, [timeStr]);

  const getFontSize = (digit) => {
    const n = parseInt(digit, 10);
    return isSmallScreen
      ? mediaQueryFontSizes[n] || "19vh"
      : digitFontSizes[n] || "19vh";
  };

  const bodyStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    margin: 0,
    backgroundColor: "#ff00ff",
    fontFamily: "AngFont, system-ui",
    fontStyle: "normal",
  };

  const clockStyle = {
    display: "flex",
    flexDirection: isSmallScreen ? "column" : "row",
    alignItems: "center",
  };

  const timeUnitStyle = {
    display: "flex",
    flexDirection: "row",
  };

  const digitBoxStyle = {
    width: isSmallScreen ? "15vw" : "13vh",
    height: isSmallScreen ? "18vh" : "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  const renderDigits = (str, unitIndex) =>
    str.split("").map((char, i) => {
      const animate =
        prevDigits[unitIndex] &&
        prevDigits[unitIndex][i] !== str[i];

      return (
        <div key={`${unitIndex}-${i}`} style={digitBoxStyle}>
          <span
            style={{
              position: "absolute",
              color: "#EB11E0FF",
              textShadow:
                "4rem 0rem #E71BCBFF, 6rem 0rem #ED0EC4FF, -4rem 0rem #ED0EC4FF, -6rem 0rem #ED0EC4FF",
              fontSize: getFontSize(char),
              animation: animate ? "fadeInOut 0.3s ease-in-out" : undefined,
              transformOrigin: "center",
              display: "inline-block",
            }}
          >
            {char}
          </span>
        </div>
      );
    });

  return (
    <div style={bodyStyle}>
      <div style={clockStyle}>
        <div style={timeUnitStyle}>{renderDigits(timeStr[0], 0)}</div>
        <div style={timeUnitStyle}>{renderDigits(timeStr[1], 1)}</div>
        <div style={timeUnitStyle}>{renderDigits(timeStr[2], 2)}</div>
      </div>

      <style>
        {`
        @font-face {
          font-family: 'AngFont';
          src: url(${angFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `}
      </style>
    </div>
  );
};

export default MagentaClock;
