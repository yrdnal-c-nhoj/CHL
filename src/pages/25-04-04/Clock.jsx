import React, { useEffect, useRef, useState } from "react";
import castelImage from "./castel.jpg";
import viaFont from "./via.ttf"; // Make sure this path is correct

const toRoman = (num) => {
  const romanMap = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [value, numeral] of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result || "N";
};

// Inject @font-face dynamically
const fontStyle = document.createElement("style");
fontStyle.innerHTML = `
  @font-face {
    font-family: 'Via';
    src: url(${viaFont}) format('truetype');
  }
`;
document.head.appendChild(fontStyle);

function RomanClock() {
  const [time, setTime] = useState("");
  const [fade, setFade] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const newTime = `${toRoman(now.getHours())}:${toRoman(
        now.getMinutes()
      )}:${toRoman(now.getSeconds())}`;
      setFade(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setTime(newTime);
        setFade(false);
      }, 500);
    };

    updateClock();
    const interval = setInterval(updateClock, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={styles.container}>
      <img src={castelImage} alt="Background" style={styles.bgImage} />
      <div
        style={{
          ...styles.clock,
          opacity: fade ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {time}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Via', monospace",
    backgroundColor: "rgb(19, 4, 4)",
    position: "relative",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "blur(5px)",
    zIndex: 0,
  },
  clock: {
    color: "rgb(203, 227, 197)",
    fontSize: "3.5rem",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
};

export default RomanClock;
