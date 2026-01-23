import React, { useEffect, useState } from "react";

// Digit color mapping
const digitStyles = {
  '0': { bg: '#0E51FAFF', color: '#F87E04FF' },
  '1': { bg: '#FA0820FF', color: '#2F9B04FF' },
  '2': { bg: '#F7FF06FF', color: '#A205C2FF' },
  '3': { bg: '#2F9B04FF', color: '#FA0820FF' },
  '4': { bg: '#FC8004FF', color: '#0E51FAFF' },
  '5': { bg: '#A205C2FF', color: '#F7FF06FF' },
  '6': { bg: '#141313FF', color: '#F4F2F2FF' },
  '7': { bg: '#F4F2F2FF', color: '#141313FF' },
  '8': { bg: '#966105FF', color: '#F92FB9FF' },
  '9': { bg: '#F92FB9FF', color: '#966105FF' },
};

// Load Google Font dynamically
const loadFont = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Asset&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

export default function StripeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    loadFont();
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time
    .toLocaleTimeString("en-GB", { hour12: false })
    .replace(/:/g, "");

  // Container style
  const containerStyle = {
    display: "flex",
    flexDirection: "column", // stack stripes vertically
    width: "100vw",
    height: "100dvh",
    margin: 0,
    padding: 0,
    fontFamily: "'Asset', monospace",
    fontWeight: "bold",
  };

  // Stripe style function
  const getStripeStyle = (char) => ({
    flex: 1, // each stripe takes equal vertical space
    width: "100vw", // full viewport width
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "8vh",
    fontWeight: "bold",
    transition: "all 0.5s ease",
    backgroundColor: digitStyles[char].bg,
    color: digitStyles[char].color,
  });

  return (
    <div style={containerStyle}>
      {timeStr.split("").map((char, idx) => (
        <div key={idx} style={getStripeStyle(char)}>
          {char}
        </div>
      ))}
    </div>
  );
}
