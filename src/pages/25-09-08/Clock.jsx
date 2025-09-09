import React, { useEffect, useState } from "react";
import bgImage from "./orange.webp"; // background
import img1 from "./1.webp";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";
import img7 from "./7.jpg";
import img8 from "./8.jpg";
import img9 from "./9.jpg";
import img10 from "./10.jpg";
import img11 from "./11.jpg";
import img12 from "./12.webp";

export default function ImageAnalogClock() {
  const [time, setTime] = useState(new Date());
  const [loaded, setLoaded] = useState(false);

  const images = [bgImage, img12, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === images.length) setLoaded(true);
      };
      img.onerror = () => {
        // If any image fails, we still proceed
        loadedCount += 1;
        if (loadedCount === images.length) setLoaded(true);
      };
    });
  }, []);

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!loaded) {
    return null; // or a loader div if you prefer
  }

  const clockSize = 90; 
  const center = clockSize / 2;
  const imgRadius = clockSize * 0.42;
  const imgSize = clockSize * 0.2;
  const hourImages = [img12, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const intenseShadow = "0 1.5vmin 3vmin rgba(0,0,0,1), 0 0 2vmin rgba(0,0,0,0.8)";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.6) contrast(2.2)",
          zIndex: 0,
        }}
      />

      {/* Clock */}
      <div
        style={{
          width: `${clockSize}vmin`,
          height: `${clockSize}vmin`,
          borderRadius: "50%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {hourImages.map((img, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = center + imgRadius * Math.sin(angle);
          const y = center - imgRadius * Math.cos(angle);
          return (
            <div
              key={i}
              style={{
                width: `${imgSize}vmin`,
                height: `${imgSize}vmin`,
                position: "absolute",
                left: `${x - imgSize / 2}vmin`,
                top: `${y - imgSize / 2}vmin`,
                borderRadius: "50%",
                overflow: "hidden",
                border: `${clockSize * 0.0025}vmin solid white`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                boxShadow: intenseShadow,
              }}
            >
              <img
                src={img}
                alt={`hour-${i}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          style={{
            width: `${clockSize * 0.05}vmin`,
            height: `${clockSize * 0.29}vmin`,
 backgroundColor: "#B8C2F1FF",
                      position: "absolute",
            top: `${center - clockSize * 0.25}vmin`,
            left: `${center - (clockSize * 0.02) / 2}vmin`,
            transformOrigin: `50% ${clockSize * 0.25}vmin`,
            transform: `rotate(${hourAngle}deg)`,
            borderRadius: "1vmin",
            zIndex: 2,
            boxShadow: intenseShadow,
          }}
        />

        {/* Minute hand */}
        <div
          style={{
            width: `${clockSize * 0.03}vmin`,
            height: `${clockSize * 0.42}vmin`,
            backgroundColor: "#B8C2F1FF",
            position: "absolute",
            top: `${center - clockSize * 0.38}vmin`,
            left: `${center - (clockSize * 0.01) / 2}vmin`,
            transformOrigin: `50% ${clockSize * 0.38}vmin`,
            transform: `rotate(${minuteAngle}deg)`,
            borderRadius: "1vmin",
            zIndex: 3,
            boxShadow: intenseShadow,
          }}
        />

        {/* Second hand */}
        <div
          style={{
            width: `${clockSize * 0.01}vmin`,
            height: `${clockSize * 0.5}vmin`,
            backgroundColor: "#B8C2F1FF",
            position: "absolute",
            top: `${center - clockSize * 0.4}vmin`,
            left: `${center - (clockSize * 0.005) / 2}vmin`,
            transformOrigin: `50% ${clockSize * 0.4}vmin`,
            transform: `rotate(${secondAngle}deg)`,
            borderRadius: "0.5vmin",
            zIndex: 4,
            boxShadow: intenseShadow,
          }}
        />
      </div>
    </div>
  );
}
