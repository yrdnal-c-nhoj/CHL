import React, { useState, useEffect } from "react";

// === Local assets ===
import bgImg from "./table.png";
import digit0 from "./0.jpg";
import digit1 from "./1.gif";
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

export default function DigitalImageClock() {
  const [time, setTime] = useState(new Date());
  const [prevDigits, setPrevDigits] = useState("");
  const [digitSize, setDigitSize] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    setPrevDigits(getAllDigits(new Date())); // initialize previous digits

    const interval = setInterval(() => {
      setPrevDigits(currentDigits);
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getAllDigits = (t) => {
    const hours = String(t.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(t.getMinutes()).padStart(2, "0");
    const seconds = String(t.getSeconds()).padStart(2, "0");
    return hours + minutes + seconds;
  };

  const currentDigits = getAllDigits(time);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate digit size after mount and on resize
  useEffect(() => {
    const calculateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (isMobile) {
        const sizeByWidth = vw / 2 - 1; // 2 digits per row minus gap
        const sizeByHeight = vh / 3 - 1; // 3 rows minus gap
        setDigitSize(Math.floor(Math.min(sizeByWidth, sizeByHeight)));
      } else {
        const sizeByWidth = vw / 6 - 1; // 6 digits in a row minus gaps
        const sizeByHeight = vh;
        setDigitSize(Math.floor(Math.min(sizeByWidth, sizeByHeight)));
      }
    };

    calculateSize();
    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, [isMobile]);

const containerStyle = {
  width: "100vw",
  height: "100dvh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${bgImg})`,
  backgroundSize: "cover", // <-- change from "contain" to "cover"
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};


  const clockWrapperStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
  };

  const groupStyle = {
    display: "flex",
    flexDirection: "row",
    gap: 0,
  };

  const digitStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "opacity 0.5s ease-in-out",
    opacity: 0.8, // <-- all digits at 0.8 opacity
  };

  if (digitSize === 0) return null;

  return (
    <div style={containerStyle}>
      <div style={clockWrapperStyle}>
        {[0, 2, 4].map((startIdx) => (
          <div key={startIdx} style={groupStyle}>
            {currentDigits
              .slice(startIdx, startIdx + 2)
              .split("")
              .map((digit, idx, arr) => (
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
                    src={digitMap[prevDigits[startIdx + idx]] || digitMap[digit]}
                    alt={prevDigits[startIdx + idx]}
                    style={{
                      ...digitStyle,
                    }}
                  />
                  <img
                    src={digitMap[digit]}
                    alt={digit}
                    style={{
                      ...digitStyle,
                    }}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
