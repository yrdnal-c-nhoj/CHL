import React, { useEffect, useState } from "react";
import rainFont from "./adj.ttf";
import skyFont from "./aaa.ttf";

export default function SkyClock() {
  const [localTime, setLocalTime] = useState("");
  const [skyGradient, setSkyGradient] = useState("");
  const [clouds, setClouds] = useState([]);
  const [stars, setStars] = useState([]);
  const [skyPhrase, setSkyPhrase] = useState("");
  const [inverseColor, setInverseColor] = useState("#fff");

  useEffect(() => {
    updateTime();
    setSkyPhrase(getSkyDescription());
    
    const interval = setInterval(() => {
      updateTime();
      setSkyPhrase(getSkyDescription());
    }, 1000);

    setClouds(Array.from({ length: 7 }, () => createCloud()));
    const cloudInterval = setInterval(() => {
      setClouds(prev => [...prev, createCloud()]);
    }, 5000);

    setStars(createStars(80));

    return () => {
      clearInterval(interval);
      clearInterval(cloudInterval);
    };
  }, []);

  function updateTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeDecimal = hour + minute / 60;

    setLocalTime(`${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}`);

    let gradient = "#000";
    if (timeDecimal >= 0 && timeDecimal < 3)
      gradient = "linear-gradient(to bottom, #3D0E33 0%, #371D38 30%, #0c1445 60%, #2D3F05 100%)";
    else if (timeDecimal >= 3 && timeDecimal < 4)
      gradient = "linear-gradient(to bottom, #990360 0%, #6B1259 33%, #371D38 70%, #0c1445 100%)";
    else if (timeDecimal >= 4 && timeDecimal < 6)
      gradient = "linear-gradient(to bottom, #3D2386 0%, #3A245C 40%, #8F730B 70%, #920626 100%)";
    else if (timeDecimal >= 6 && timeDecimal < 7)
      gradient = "linear-gradient(to bottom, #578CE0 0%, #94DFEC 40%, #FAB719 70%, #EE4618 100%)";
    else if (timeDecimal >= 7 && timeDecimal < 9)
      gradient = "linear-gradient(to bottom, #4facfe 0%, #00f2fe 40%, #e0c3fc 70%, #f9f586 100%)";
    else if (timeDecimal >= 9 && timeDecimal < 11)
      gradient = "linear-gradient(to bottom, #87CEFA 0%, #B0E0E6 40%, #E0FFFF 70%, #F0FFF0 100%)";
    else if (timeDecimal >= 11 && timeDecimal < 12)
      gradient = "linear-gradient(to bottom, #ADD8E6 0%, #E0FFFF 40%, #F0FFF0 70%, #FFFACD 100%)";
    else if (timeDecimal >= 12 && timeDecimal < 14)
      gradient = "linear-gradient(to bottom, #00BFFF 0%, #87CEFA 40%, #B0E0E6 70%, #F0F8FF 100%)";
    else if (timeDecimal >= 14 && timeDecimal < 16.33)
      gradient = "linear-gradient(to bottom, #FFD700 0%, #FFA500 40%, #FF8C00 70%, #FF7F50 100%)";
    else if (timeDecimal >= 16.33 && timeDecimal < 17)
      gradient = "linear-gradient(to bottom, #f7b733 0%, #fc4a1a 40%, #dd2476 70%, #833ab4 100%)";
    else if (timeDecimal >= 17 && timeDecimal < 19.15)
      gradient = "linear-gradient(to bottom, #C3347C 0%, #A539AB 40%, #4C2969 70%, #0D0713 100%)";
    else if (timeDecimal >= 19.15 && timeDecimal < 22)
      gradient = "linear-gradient(to bottom, #A64B9A 0%, #633192 40%, #2a0845 70%, #000010 100%)";
    else
      gradient = "linear-gradient(to bottom, #6B1259 0%, #371D38 30%, #0c1445 60%, #223003 100%)";

    setSkyGradient(gradient);

    // Invert the main color for elements
    const hexMatch = gradient.match(/#([0-9a-fA-F]{6})/);
    if (hexMatch) {
      const hex = hexMatch[1];
      const r = 255 - parseInt(hex.substr(0, 2), 16);
      const g = 255 - parseInt(hex.substr(2, 2), 16);
      const b = 255 - parseInt(hex.substr(4, 2), 16);
      setInverseColor(`rgb(${r},${g},${b})`);
    }
  }

  function createCloud() {
    const id = Date.now() + Math.random();
    const size = Math.random() * 30 + 20;
    const top = Math.random() * 60 + 10;
    const duration = Math.random() * 40 + 25;
    return { id, size, top, duration };
  }

  function createStars(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 0.2 + 0.5,
      delay: Math.random() * 3,
    }));
  }

  function getSkyDescription() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeDecimal = hour + minute / 60;

    const adjectives1 = ["ethereally and","transcendently and","deeply and","profoundly and","vividly and","endlessly and","vastly and","infinitely and","boundlessly and","atmospherically and"];
    const adjectives2_day = ["luminously","shimmeringly","dazzlingly","glowingly","glisteningly","sparklingly","gleamingly","brightly","splendidly","lustrously","majesticly","wonderously","magically","beautifully","exquisitely","vibrantly"];
    const adjectives2_night = ["glimmeringly","shimmeringly","sparklingly","enigmatically","romantically","sweetly","dreamily","softly","fleetingly","nocturnally","tenderly","incandescently","twinklingly","gently","sublimely","delicately","divinely","enchantingly","rapturously","entrancingly"];
    const adjectives2_twilight = ["hazily","gently","warmly","glowingly","enigmatically","tenderly","resplendently","softly","fleetingly","tenderly","incandescently","sparklingly","twinklingly","sweetly","gently","sublimely","delicately","divinely","enchantingly","rapturously","entrancingly"];
    const adjectives3 = ["blissful","gleeful","brilliant","harmonious","serene","splendid","tranquil","enchanted","peaceful","jubilant","exuberant","effervescent","buoyant","lighthearted","euphoric","cheerful","delightful","joy-suffused","mirthful"];

    const adjectives2 =
      hour >= 7 && hour < 17
        ? adjectives2_day
        : hour >= 4 && hour < 7 || hour >= 17 && hour < 20
        ? adjectives2_twilight
        : adjectives2_night;

    const randomPick = arr => arr[Math.floor(Math.random() * arr.length)];
    const phrase = (label) => `Wishing you a ${randomPick(adjectives1)} ${randomPick(adjectives2)} ${randomPick(adjectives3)} ${label}.`;

    if (timeDecimal >= 0 && timeDecimal < 3) return phrase("deep night");
    if (timeDecimal >= 3 && timeDecimal < 4) return phrase("dead of night");
    if (timeDecimal >= 4 && timeDecimal < 4.5) return phrase("pre-dawn");
    if (timeDecimal >= 4.5 && timeDecimal < 5.5) return phrase("Astronomical Twilight");
    if (timeDecimal >= 5.5 && timeDecimal < 6.25) return phrase("Nautical Twilight");
    if (timeDecimal >= 6.25 && timeDecimal < 7) return phrase("Civil Twilight");
    if (timeDecimal >= 7 && timeDecimal < 9) return phrase("morning");
    if (timeDecimal >= 9 && timeDecimal < 11) return phrase("mid-morning");
    if (timeDecimal >= 11 && timeDecimal < 12) return phrase("late morning");
    if (timeDecimal >= 12 && timeDecimal < 14) return phrase("early afternoon");
    if (timeDecimal >= 14 && timeDecimal < 17) return phrase("late afternoon");
    if (timeDecimal >= 17 && timeDecimal < 18.25) return phrase("Civil Twilight");
    if (timeDecimal >= 18.25 && timeDecimal < 19.15) return phrase("Nautical Twilight");
    if (timeDecimal >= 19.15 && timeDecimal < 20) return phrase("Astronomical Twilight");
    if (timeDecimal >= 20 && timeDecimal < 22) return phrase("evening");
    return phrase("night");
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: skyGradient,
        transition: "background 2s ease-in-out",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: inverseColor,
        textShadow: `0 0.2rem 1rem ${inverseColor}80, 0 0 2rem ${inverseColor}50`
      }}
    >
      <style>
        {`
        @font-face {
          font-family: 'ClockFont';
          src: url(${rainFont}) format('truetype');
        }
        @font-face {
          font-family: 'SkyFont';
          src: url(${skyFont}) format('truetype');
        }
      `}
      </style>

      {/* Clouds */}
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          style={{
            position: "absolute",
            top: `${cloud.top}vh`,
            left: "-40vw",
            width: `${cloud.size}vw`,
            height: `${cloud.size * 0.6}vw`,
            background: inverseColor,
            borderRadius: "50%",
            opacity: 0.3,
            filter: "blur(0.8vw)",
            animation: `moveCloud${cloud.id} ${cloud.duration}s linear forwards`
          }}
        />
      ))}

      <style>
        {clouds.map(c => `
          @keyframes moveCloud${c.id} {
            from { transform: translateX(0); opacity: 0.9; }
            to { transform: translateX(130vw); opacity: 0.3; }
          }
        `).join("\n")}
      </style>

      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            width: `${star.size}vw`,
            height: `${star.size}vw`,
            background: inverseColor,
            borderRadius: "50%",
            opacity: 0.8,
            animation: `twinkle${star.id} 2s infinite alternate`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      <style>
        {stars.map(s => `
          @keyframes twinkle${s.id} {
            from { opacity: 0.2; }
            to { opacity: 1; }
          }
        `).join("\n")}
      </style>

      {/* Centered text */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "SkyFont, system-ui", color: inverseColor }}>{skyPhrase}</div>
        <div style={{ fontSize: "12rem", fontFamily: "ClockFont, system-ui", color: inverseColor }}>{localTime}</div>
      </div>
    </div>
  );
}
