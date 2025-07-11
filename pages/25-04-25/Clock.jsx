import React, { useEffect, useRef, useState } from "react";
import bgImage from "./bad.png";
import handImage from "./59bf80e17a216d0b052f12e3.png";
import oswaldFont from "./Oswald.ttf";

const BandAidClock = () => {
  const clockRef = useRef(null);
  const [numbers, setNumbers] = useState([]);

  // // Inject font
  // useEffect(() => {
  //   const fontFace = new FontFace("Oswald", `url(${oswaldFont})`);
  //   fontFace.load().then((loaded) => {
  //     document.fonts.add(loaded);
  //   });
  // }, []);

  // Create numbers
  useEffect(() => {
    const updateNumbers = () => {
      const clock = clockRef.current;
      if (!clock) return;
      const clockWidth = clock.offsetWidth;
      const radius = clockWidth * 0.45;
      const numberSize = clockWidth * 0.1;
      const newNumbers = [];

      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        const x = radius * Math.sin(angle);
        const y = -radius * Math.cos(angle);
        newNumbers.push({
          value: i,
          style: {
            position: "absolute",
            left: `calc(50% + ${x}px - ${numberSize / 2}px)`,
            top: `calc(50% + ${y}px - ${numberSize / 2}px)`,
            fontFamily: "Oswald, sans-serif",
            fontSize: "13vw",
            color: "rgb(240, 7, 7)",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "3vw",
            zIndex: 5,
          },
        });
      }

      setNumbers(newNumbers);
    };

    updateNumbers();
    window.addEventListener("resize", updateNumbers);
    return () => window.removeEventListener("resize", updateNumbers);
  }, []);

  // Clock ticking
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const hourDeg = hours * 30 + minutes * 0.5;
      const minuteDeg = minutes * 6;
      const secondDeg = seconds * 6;

      const setRotation = (id, deg) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.transform = `translateX(-50%) rotate(${deg}deg)`;
        }
      };

      setRotation("hour", hourDeg);
      setRotation("minute", minuteDeg);
      setRotation("second", secondDeg);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);


console.log("BandAidClock rendered");



  return (
    <div style={{
      backgroundColor: "#deab34",
      height: "100vh",
      margin: 0,
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }}>
      <div
        className="clock-wrapper"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          zIndex: 7,
        }}
      >
        <div
          className="clock"
          ref={clockRef}
          style={{
            width: "70vw",
            height: "70vw",
            maxWidth: "50vh",
            maxHeight: "50vh",
            borderRadius: "50%",
            position: "relative",
            zIndex: 8,
          }}
        >
          <img
            src={handImage}
            id="hour"
            alt="Hour Hand"
            style={{
              position: "absolute",
              bottom: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              width: "40vw",
              height: "54vw",
              transform: "translateX(-50%)",
              zIndex: 8,
              opacity: 0.9,
            }}
          />
          <img
            src={handImage}
            id="minute"
            alt="Minute Hand"
            style={{
              position: "absolute",
              bottom: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              width: "12vw",
              height: "75vw",
              transform: "translateX(-50%)",
              zIndex: 8,
              opacity: 0.9,
              filter: "brightness(0.9) contrast(1.2)",
            }}
          />
          <img
            src={handImage}
            id="second"
            alt="Second Hand"
            style={{
              position: "absolute",
              bottom: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              width: "7.5vw",
              height: "80vw",
              transform: "translateX(-50%)",
              zIndex: 8,
              opacity: 0.9,
              filter: "brightness(1.1) contrast(0.9)",
            }}
          />
          {numbers.map((num, idx) => (
            <div key={idx} style={num.style}>{num.value}</div>
          ))}
        </div>
      </div>
      <img
        src={bgImage}
        alt="Background"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 4,
        }}
      />
    </div>
  );
};

export default BandAidClock;
