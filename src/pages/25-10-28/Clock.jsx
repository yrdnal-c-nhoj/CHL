import React, { useEffect, useState, useMemo } from "react";

// Load images for each digit folder with multiple file types
const digitImagesFolders = {
  0: Object.values(import.meta.glob("./digits/0/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  1: Object.values(import.meta.glob("./digits/1/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  2: Object.values(import.meta.glob("./digits/2/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  3: Object.values(import.meta.glob("./digits/3/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  4: Object.values(import.meta.glob("./digits/4/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  5: Object.values(import.meta.glob("./digits/5/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  6: Object.values(import.meta.glob("./digits/6/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  7: Object.values(import.meta.glob("./digits/7/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  8: Object.values(import.meta.glob("./digits/8/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
  9: Object.values(import.meta.glob("./digits/9/*.{png,jpg,jpeg,gif,webp}", { eager: true })),
};

// Shuffle array and take first N items
const getRandomImages = (images, count = 10) => {
  if (!images || images.length === 0) return [];
  const shuffled = [...images].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, images.length)).map(img => img.default || img);
};

export default function DigitClock() {
  const [timeDigits, setTimeDigits] = useState([]);
  const [digitIndices, setDigitIndices] = useState([0, 0, 0, 0, 0, 0]); // Track which image to show for each position

  // Preload 10 random images TOTAL (not per digit) once at component mount
  // Map each digit 0-9 to one of these 10 images
  const preloadedImages = useMemo(() => {
    const imageMapping = {};
    
    // For each digit 0-9, pick one random image from that digit's folder
    for (let digit = 0; digit <= 9; digit++) {
      const images = digitImagesFolders[digit];
      if (images && images.length > 0) {
        const randomImg = images[Math.floor(Math.random() * images.length)];
        imageMapping[digit] = randomImg.default || randomImg;
      }
    }
    
    return imageMapping;
  }, []);

  const getTimeDigits = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    hours = hours % 12 || 12; // Convert 0 → 12

    const hDigits = [...String(hours)].map(Number); 
    const mDigits = [...String(minutes).padStart(2, "0")].map(Number);
    const sDigits = [...String(seconds).padStart(2, "0")].map(Number);

    return [...hDigits, ...mDigits, ...sDigits];
  };

  // Update time every second
  useEffect(() => {
    const tick = () => {
      const newDigits = getTimeDigits();
      setTimeDigits((prevDigits) => {
        // Update indices only for positions where digit changed
        setDigitIndices((prevIndices) => {
          const newIndices = [...prevIndices];
          newDigits.forEach((digit, idx) => {
            if (prevDigits[idx] !== digit) {
              // Digit changed, increment to next random image
              newIndices[idx] = (prevIndices[idx] + 1) % 10;
            }
          });
          return newIndices;
        });
        return newDigits;
      });
    };
    
    tick(); // initial set
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get the image for a specific digit at a specific position
  const getImageForPosition = (digit, positionIndex) => {
    return preloadedImages[digit] || "";
  };

  // Split digits into hours, minutes, seconds
  const hoursDigits = timeDigits.slice(0, timeDigits.length - 4);
  const minutesDigits = timeDigits.slice(timeDigits.length - 4, timeDigits.length - 2);
  const secondsDigits = timeDigits.slice(timeDigits.length - 2);

  // --- Styles ---
  const container = {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#767A76FF",
    color: "#fff",
    fontFamily: "sans-serif",
    padding: "1rem",
    position: "relative",
    top: "-3vh",
  };

  const clockStyle = {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    justifyContent: "center",
  };

  const timeSection = {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
  };

  const imgStyle = {
    width: "20vh",
    height: "20vh",
    objectFit: "cover",
    // borderRadius: "0.5vh",
    boxShadow: "0 0 1.5vh rgba(0,0,0,0.6)",
    transition: "transform 0.5s ease-out",
  };

  return (
    <div style={container}>
      <style>{`
        @media (max-width: 768px) {
          .clock-container {
            flex-direction: column !important;
          }
        }
      `}</style>
      <div className="clock-container" style={clockStyle}>
        <div style={timeSection}>
          {hoursDigits.map((digit, idx) => (
            <img
              key={idx}
              src={getImageForPosition(digit, idx)}
              alt={`Digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>
        <div style={timeSection}>
          {minutesDigits.map((digit, idx) => (
            <img
              key={idx + hoursDigits.length}
              src={getImageForPosition(digit, idx + hoursDigits.length)}
              alt={`Digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>
        <div style={timeSection}>
          {secondsDigits.map((digit, idx) => (
            <img
              key={idx + hoursDigits.length + minutesDigits.length}
              src={getImageForPosition(digit, idx + hoursDigits.length + minutesDigits.length)}
              alt={`Digit ${digit}`}
              style={imgStyle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}