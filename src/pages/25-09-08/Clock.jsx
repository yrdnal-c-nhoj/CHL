import React, { useEffect, useState } from "react";
import bgImage from "./orange.webp";
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
  const CLOCK_SIZE = 90;
  const CENTER = CLOCK_SIZE / 2;
  const IMG_RADIUS = CLOCK_SIZE * 0.42;
  const IMG_SIZE = CLOCK_SIZE * 0.2;
  const intenseShadow = "0 1.5vmin 3vmin rgba(0,0,0,1), 0 0 2vmin rgba(0,0,0,0.8)";

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
    return <div style={{ color: "white", fontSize: "2rem", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>Loading...</div>;
  }

  const hourImages = [img12, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
      aria-label={`Analog clock showing ${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
    >
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
      <div
        style={{
          width: `${CLOCK_SIZE}vmin`,
          height: `${CLOCK_SIZE}vmin`,
          maxWidth: "800px",
          maxHeight: "800px",
          borderRadius: "50%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {hourImages.map((img, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = CENTER + IMG_RADIUS * Math.sin(angle);
          const y = CENTER - IMG_RADIUS * Math.cos(angle);
          return (
            <div
              key={i}
              style={{
                width: `${IMG_SIZE}vmin`,
                height: `${IMG_SIZE}vmin`,
                position: "absolute",
                left: `${x - IMG_SIZE / 2}vmin`,
                top: `${y - IMG_SIZE / 2}vmin`,
                borderRadius: "50%",
                overflow: "hidden",
                border: `${CLOCK_SIZE * 0.0025}vmin solid white`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                boxShadow: intenseShadow,
              }}
            >
              <img
                src={img}
                alt={`Hour marker for ${i || 12}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          );
        })}
        {/* Hour hand */}
        <div
          style={{
            width: `${CLOCK_SIZE * 0.05}vmin`,
            height: `${CLOCK_SIZE * 0.29}vmin`,
            backgroundColor: "#B8C2F1FF",
            position: "absolute",
            top: `${CENTER - CLOCK_SIZE * 0.25}vmin`,
            left: `${CENTER - (CLOCK_SIZE * 0.02) / 2}vmin`,
            transformOrigin: `50% ${CLOCK_SIZE * 0.25}vmin`,
            transform: `rotate(${hourAngle}deg)`,
            borderRadius: "1vmin",
            zIndex: 2,
            boxShadow: intenseShadow,
          }}
        />
        {/* Minute hand */}
        <div
          style={{
            width: `${CLOCK_SIZE * 0.03}vmin`,
            height: `${CLOCK_SIZE * 0.42}vmin`,
            backgroundColor: "#B8C2F1FF",
            position: "absolute",
            top: `${CENTER - CLOCK_SIZE * 0.38}vmin`,
            left: `${CENTER - (CLOCK_SIZE * 0.01) / 2}vmin`,
            transformOrigin: `50% ${CLOCK_SIZE * 0.38}vmin`,
            transform: `rotate(${minuteAngle}deg)`,
            borderRadius: "1vmin",
            zIndex: 3,
            boxShadow: intenseShadow,
          }}
        />
        {/* Second hand */}
        <div
          style={{
            width: `${CLOCK_SIZE * 0.01}vmin`,
            height: `${CLOCK_SIZE * 0.5}vmin`,
            backgroundColor: "#B8C2F1FF",
            position: "absolute",
            top: `${CENTER - CLOCK_SIZE * 0.4}vmin`,
            left: `${CENTER - (CLOCK_SIZE * 0.005) / 2}vmin`,
            transformOrigin: `50% ${CLOCK_SIZE * 0.4}vmin`,
            transform: `rotate(${secondAngle}deg)`,
            borderRadius: "0.5vmin",
            zIndex: 4,
            boxShadow: intenseShadow,
          }}
        />
        {/* Center dot */}
        <div
          style={{
            width: `${CLOCK_SIZE * 0.05}vmin`,
            height: `${CLOCK_SIZE * 0.05}vmin`,
            backgroundColor: "#B8C2F1FF",
            position: "absolute",
            top: `${CENTER - (CLOCK_SIZE * 0.025)}vmin`,
            left: `${CENTER - (CLOCK_SIZE * 0.025)}vmin`,
            borderRadius: "50%",
            zIndex: 5,
            boxShadow: intenseShadow,
          }}
        />
      </div>
    </div>
  );
}