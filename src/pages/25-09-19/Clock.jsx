import React, { useEffect, useState } from "react";

// Import local font and images (same folder)
import customFont from "./cubic.ttf"; // Example font with date in variable
import bgImage from "./bg.gif"; // Example background

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Inline styles
  const styles = {
    "@font-face": {
      fontFamily: "CustomFont",
      src: `url(${customFont}) format("truetype")`,
    },
    container: {
      height: "100dvh", // DVH as requested
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "CustomFont, sans-serif",
    },
    clockBox: {
      display: "flex",
      gap: "1rem",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: "2rem",
      borderRadius: "2rem",
      fontSize: "5rem",
      color: "#fff",
    },
    digitBox: {
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      backgroundColor: "rgba(255,255,255,0.1)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minWidth: "3rem",
    },
  };

  // Split time into individual characters
  const timeChars = formatTime(time).split("");

  return (
    <div style={styles.container}>
      <div style={styles.clockBox}>
        {timeChars.map((char, index) => (
          <div key={index} style={styles.digitBox}>
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalClock;
