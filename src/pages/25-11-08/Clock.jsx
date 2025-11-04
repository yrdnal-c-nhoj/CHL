import React, { useEffect, useState } from "react";
import bgImage from "./bi.gif"; // replace with your image

export default function PanicAnalogClock() {
  const [time, setTime] = useState(new Date());
  const [scattered, setScattered] = useState(false);

  const numbers = [...Array(12).keys()].map(i => i + 1);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => setTime(new Date()), 1000);

    // Scatter and reassemble every 3 seconds
    const scatterInterval = setInterval(() => {
      setScattered(true);
      setTimeout(() => setScattered(false), 1000); // explode for 1s
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(scatterInterval);
    };
  }, []);

  // Clock calculations
  const clockSize = 50; // vh
  const center = clockSize / 2;

  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourDeg = 30 * hour + minute / 2;
  const minuteDeg = 6 * minute;
  const secondDeg = 6 * second;

  // Random scatter offset
  const scatterOffset = () => scattered ? `${(Math.random() - 0.5) * 20}vh` : "0vh";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: "scaleX(-1)", // flip horizontally
      }}
    >
      <div
        style={{
          width: `${clockSize}vh`,
          height: `${clockSize}vh`,
          borderRadius: "50%",
          border: "0.5vh solid black",
          position: "relative",
          backgroundColor: "rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Numbers */}
        {numbers.map((n, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const radius = clockSize / 2 - 5;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <div
              key={n}
              style={{
                position: "absolute",
                left: `${center + x}vh`,
                top: `${center + y}vh`,
                transform: `translate(-50%, -50%) translate(${scatterOffset()}, ${scatterOffset()})`,
                transition: "transform 0.5s",
                fontSize: "3vh",
                fontWeight: "bold",
              }}
            >
              {n}
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          style={{
            position: "absolute",
            width: "0.5vh",
            height: `${clockSize / 4}vh`,
            backgroundColor: "black",
            top: `${center - clockSize / 4}vh`,
            left: `${center - 0.25}vh`,
            transformOrigin: "50% 100%",
            transform: `rotate(${hourDeg}deg) translate(${scatterOffset()}, ${scatterOffset()})`,
            transition: "transform 0.5s",
          }}
        />
        {/* Minute hand */}
        <div
          style={{
            position: "absolute",
            width: "0.3vh",
            height: `${clockSize / 3}vh`,
            backgroundColor: "black",
            top: `${center - clockSize / 3}vh`,
            left: `${center - 0.15}vh`,
            transformOrigin: "50% 100%",
            transform: `rotate(${minuteDeg}deg) translate(${scatterOffset()}, ${scatterOffset()})`,
            transition: "transform 0.5s",
          }}
        />
        {/* Second hand */}
        <div
          style={{
            position: "absolute",
            width: "0.2vh",
            height: `${clockSize / 2.5}vh`,
            backgroundColor: "red",
            top: `${center - clockSize / 2.5}vh`,
            left: `${center - 0.1}vh`,
            transformOrigin: "50% 100%",
            transform: `rotate(${secondDeg}deg) translate(${scatterOffset()}, ${scatterOffset()})`,
            transition: "transform 0.5s",
          }}
        />
      </div>
    </div>
  );
}
