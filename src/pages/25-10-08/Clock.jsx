import React, { useState, useEffect, useMemo, useCallback } from "react";

// === Local assets ===
import bgImg from "./table.png";
import digit0 from "./0.jpg";
import digit1 from "./1.webp";
import digit2 from "./2.png";
import digit3 from "./3.webp";
import digit4 from "./4.jpg";
import digit5 from "./5.webp";
import digit6 from "./6.jpg";
import digit7 from "./7.webp";
import digit8 from "./8.webp";
import digit9 from "./9.gif";

const digitMap = {
  "0": digit0,
  "1": digit1,
  "2": digit2,
  "3": digit3,
  "4": digit4,
  "5": digit5,
  "6": digit6,
  "7": digit7,
  "8": digit8,
  "9": digit9,
};

const getAllDigits = (t) => {
  const hours = String(t.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(t.getMinutes()).padStart(2, "0");
  const seconds = String(t.getSeconds()).padStart(2, "0");
  return hours + minutes + seconds;
};

export default function DigitalImageClock() {
  const [time, setTime] = useState(() => new Date());
  const [prevDigits, setPrevDigits] = useState(() => getAllDigits(new Date()));
  const [digitSize, setDigitSize] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  const currentDigits = useMemo(() => getAllDigits(time), [time]);

  const calculateSize = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isMobile) {
      const sizeByWidth = vw / 2 - 1;
      const sizeByHeight = vh / 3 - 1;
      setDigitSize(Math.floor(Math.min(sizeByWidth, sizeByHeight)));
    } else {
      const sizeByWidth = vw / 6 - 1;
      const sizeByHeight = vh;
      setDigitSize(Math.floor(Math.min(sizeByWidth, sizeByHeight)));
    }
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevDigits(getAllDigits(new Date()));
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    calculateSize();
    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, [calculateSize]);

  const containerStyle = useMemo(() => ({
    width: "100vw",
    height: "100dvh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }), []);

  const backgroundStyle = useMemo(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImg})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    filter: "contrast(0.6)",
    opacity: 0.5,
    zIndex: 0,
  }), []);

  const clockWrapperStyle = useMemo(() => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
    zIndex: 1,
  }), [isMobile]);

  const groupStyle = useMemo(() => ({
    display: "flex",
    flexDirection: "row",
    gap: 0,
  }), []);

  const digitStyle = useMemo(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "opacity 0.5s ease-in-out",
    opacity: 0.5,
  }), []);

  if (digitSize === 0) return null;

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      <div style={clockWrapperStyle}>
        {[0, 2, 4].map((startIdx) => (
          <div key={startIdx} style={groupStyle}>
            {currentDigits
              .slice(startIdx, startIdx + 2)
              .split("")
              .map((digit, idx, arr) => {
                const prevDigit = prevDigits[startIdx + idx];
                return (
                  <div
                    key={idx}
                    style={{
                      width: `${digitSize}px`,
                      height: `${digitSize}px`,
                      position: "relative",
                      marginRight:
                        !isMobile && idx !== arr.length - 1 ? "1px" : "0px",
                      marginBottom:
                        isMobile && idx !== arr.length - 1 ? "1px" : "0px",
                    }}
                  >
                    <img
                      src={digitMap[prevDigit] || digitMap[digit]}
                      alt={prevDigit}
                      style={digitStyle}
                    />
                    <img
                      src={digitMap[digit]}
                      alt={digit}
                      style={digitStyle}
                    />
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}