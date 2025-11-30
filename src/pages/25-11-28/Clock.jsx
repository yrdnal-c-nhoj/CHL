import React, { useEffect, useState } from "react";
import backgroundImg from "./fr.jpg";
import fontUrl_20251128 from "./rococo.ttf";

export default function RococoDigitalClock() {
  const [now, setNow] = useState(new Date());
  const [morph, setMorph] = useState(0);        // global 5-second pulse
  const [ampmMorph, setAmpmMorph] = useState(0); // separate life for AM/PM

  useEffect(() => {
    const timeInterval = setInterval(() => setNow(new Date()), 1000);

    const morphInterval = setInterval(() => {
      setMorph(m => m + 1);
      setAmpmMorph(a => a + 1.337); // slightly different rhythm = more chaos
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(morphInterval);
    };
  }, []);

  let hours = now.getHours();
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  const rand = (seed) => {
    let x = Math.sin(seed) * 12345;
    return x - Math.floor(x);
  };

  // Digits distortion
  const distortLetter = (char, i) => {
    const s = (morph + i + char.charCodeAt(0)) * 13.37;
    return {
      transform: `
        rotate(${-50 + rand(s) * 100}deg)
        skewX(${-65 + rand(s + 1) * 130}deg)
        skewY(${-50 + rand(s + 2) * 100}deg)
        scale(${0.5 + rand(s + 3) * 1.3}, ${0.7 + rand(s + 4) * 0.9})
        translateY(${-4 + rand(s + 5) * 8}vh)
      `,
      transition: "transform 4.2s cubic-bezier(0.22, 0.88, 0.34, 0.98)",
    };
  };

  // Independent AM/PM distortion — lives its own pee-soaked rococo dream
  const distortAmpm = () => {
    const s = ampmMorph * 17.77;
    const r1 = rand(s);
    const r2 = rand(s + 1);
    const r3 = rand(s + 2);
    const r4 = rand(s + 3);
    return {
      transform: `
        rotate(${-40 + r1 * 80}deg)
        skewX(${-50 + r2 * 100}deg)
        scale(${0.8 + r3 * 1.1}, ${0.9 + r4 * 0.9})
        translate(${ -8 + r1 * 16 }vh, ${ -6 + r2 * 12 }vh)
      `,
      transition: "transform 4.6s cubic-bezier(0.15, 0.92, 0.32, 0.99)",
    };
  };

  return (
    <div style={{
      width: "100vw", height: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: "cover", backgroundPosition: "center",
      fontFamily: "'RococoBlob', serif",
      overflow: "hidden",
    }}>
      <style>{`
        @font-face {
          font-family: 'RococoBlob';
          src: url(${fontUrl_20251128}) format('truetype');
          font-weight: 800;
          font-display: swap;
        }
      `}</style>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6vh",
        padding: "8vh 10vh",
        borderRadius: "10vh",
        background: "linear-gradient(135deg, #f7c6d3 0%, #b7e4c7 100%)",
        transform: "translateX(-12vh) rotate(-4deg)",
      }}>
        {/* Time — breathing decadently */}
        <div style={{ display: "flex", alignItems: "center", gap: "1vh" }}>
          {timeStr.split("").map((char, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: char === ":" ? "12vh" : "14.5vh",
                fontWeight: 800,
                lineHeight: "0.88",
                color: "#111",
                ...(char === ":" 
                  ? { transform: "translateY(-3vh) rotate(-22deg) scale(1.4, 2.2)", transition: "transform 4.2s cubic-bezier(0.22, 0.88, 0.34, 0.98)" }
                  : distortLetter(char, i)
                ),
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* The sacred, independently drunken AM/PM */}
        <div style={{
          fontSize: "5.5vh",
          fontWeight: 900,
          background: "rgba(255,255,255,0.28)",
          padding: "2.5vh 5vh",
          borderRadius: "6vh",
          letterSpacing: "0.6vh",
          boxShadow: "inset 0 1vh 2vh rgba(255,255,255,0.4), 0 2vh 4vh rgba(0,0,0,0.2)",
          ...distortAmpm(),
        }}>
          {isPM ? "PM" : "AM"}
        </div>
      </div>
    </div>
  );
}