import React, { useEffect, useState } from "react";

// Import images for 12 hours
import img1 from "./1.jpg";
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

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clockSize = 90; // size of the clock in vmin
  const center = clockSize / 2;
  const imgRadius = clockSize * 0.42; // distance from clock center to image center
  const imgSize = clockSize * 0.14; // size of hour images

  const images = [img12, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

  // Calculate hand rotations
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30; // 360/12 = 30deg per hour
  const minuteAngle = (minutes + seconds / 60) * 6; // 360/60 = 6deg per minute
  const secondAngle = seconds * 6; // optional second hand

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#166611",
      }}
    >
      <div
        style={{
          width: `${clockSize}vmin`,
          height: `${clockSize}vmin`,
          borderRadius: "50%",
          position: "relative",
        }}
      >
        {/* Hour images */}
        {images.map((img, i) => {
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
              }}
            >
              <img
                src={img}
                alt={`hour-${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          style={{
            width: `${clockSize * 0.02}vmin`,
            height: `${clockSize * 0.25}vmin`,
            backgroundColor: "white",
            position: "absolute",
            top: `${center - clockSize * 0.25}vmin`,
            left: `${center - (clockSize * 0.02) / 2}vmin`,
            transformOrigin: `50% ${clockSize * 0.25}vmin`,
            transform: `rotate(${hourAngle}deg)`,
            borderRadius: "1vmin",
            zIndex: 2,
          }}
        />

        {/* Minute hand */}
        <div
          style={{
            width: `${clockSize * 0.01}vmin`,
            height: `${clockSize * 0.38}vmin`,
            backgroundColor: "white",
            position: "absolute",
            top: `${center - clockSize * 0.38}vmin`,
            left: `${center - (clockSize * 0.01) / 2}vmin`,
            transformOrigin: `50% ${clockSize * 0.38}vmin`,
            transform: `rotate(${minuteAngle}deg)`,
            borderRadius: "1vmin",
            zIndex: 3,
          }}
        />

        {/* Optional second hand */}
        <div
          style={{
            width: `${clockSize * 0.005}vmin`,
            height: `${clockSize * 0.4}vmin`,
            backgroundColor: "red",
            position: "absolute",
            top: `${center - clockSize * 0.4}vmin`,
            left: `${center - (clockSize * 0.005) / 2}vmin`,
            transformOrigin: `50% ${clockSize * 0.4}vmin`,
            transform: `rotate(${secondAngle}deg)`,
            borderRadius: "0.5vmin",
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
}
