// SkyClock.jsx
import React, { useEffect, useState } from "react";
import todayFont from "./rain.ttf"; // import your font here
import bgImage from "./words.jpg"; // import your background image

export default function SkyClock() {
  const [ready, setReady] = useState(false);
  const [skyColor, setSkyColor] = useState("black");
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    let cancelled = false;

    // Inject font dynamically
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @font-face {
        font-family: 'TodayFont';
        src: url(${todayFont}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(styleEl);

    // Preload background image
    const img = new Image();
    img.src = bgImage;
    img.onload = () => {
      if (cancelled) return;

      setReady(true); // everything is ready
      updateTime();
      const interval = setInterval(updateTime, 60 * 1000); // update every minute

      return () => {
        clearInterval(interval);
        document.head.removeChild(styleEl);
        cancelled = true;
      };
    };

    function updateTime() {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString());

      const hour = now.getHours();
      let color = "black";

      if (hour >= 5 && hour < 7) color = "#FFC0CB"; // pink
      else if (hour >= 7 && hour < 9) color = "#ADD8E6"; // lightblue
      else if (hour >= 9 && hour < 17) color = "#00BFFF"; // deepskyblue
      else if (hour >= 17 && hour < 19) color = "#FFA500"; // orange
      else if (hour >= 19 && hour < 21) color = "#800080"; // purple
      else color = "#191970"; // midnightblue

      setSkyColor(color);
    }

    return () => {
      cancelled = true;
      document.head.removeChild(styleEl);
    };
  }, []);

  if (!ready) return null;

  // Create a gradient based on sky color
  const gradientBackground = `linear-gradient(to bottom, ${skyColor} 0%, rgba(0,0,0,0.3) 100%)`;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bgImage}), ${gradientBackground}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "TodayFont, sans-serif",
        fontSize: "5vh",
        color: "white",
        textShadow: "0 0 1vh rgba(0,0,0,0.7)",
        transition: "background 1s ease",
      }}
    >
      The sky is {skyColor} now ({localTime})
    </div>
  );
}
