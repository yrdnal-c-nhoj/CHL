import { useEffect, useState } from "react";
import myFontUrl from "./go.otf";
import bgImage from "./24.webp"; // background image

const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu", "Europe/London",
  "Europe/Paris", "Europe/Berlin", "Europe/Moscow", "Asia/Dubai",
  "Asia/Kolkata", "Asia/Bangkok", "Asia/Hong_Kong", "Asia/Tokyo",
  "Australia/Sydney", "Pacific/Auckland", "Africa/Cairo", "Africa/Johannesburg",
  "America/Sao_Paulo", "America/Argentina/Buenos_Aires", "Europe/Istanbul", "Europe/Athens"
];

function useCustomFont(fontName, fontUrl) {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: '${fontName}';
        src: url(${fontUrl}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [fontName, fontUrl]);
}

// Analog clock component
function AnalogClock({ zone, clockSize, fontName }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const local = new Date(time.toLocaleString("en-US", { timeZone: zone }));
  const seconds = local.getSeconds();
  const minutes = local.getMinutes();
  const hours = local.getHours();

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  const clockStyle = {
    width: `${clockSize}px`,
    height: `${clockSize}px`,
    borderRadius: "50%",
    position: "relative",
    margin: "0 auto",
    flexShrink: 0,
  };

  const handCommon = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "bottom center",
  };

  const hourHandHeight = clockSize * 0.3;
  const minuteHandHeight = clockSize * 0.45;
  const secondHandHeight = clockSize * 0.48;

  const handShadow = "drop-shadow(-1px 0 white) drop-shadow(1px 0 black)";

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      height: "100%",
      width: "100%"
    }}>
      <div style={clockStyle}>
        <div
          style={{
            ...handCommon,
            width: "3px",
            height: `${hourHandHeight}px`,
            background: "#FB7C06FF",
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            filter: handShadow,
          }}
        />
        <div
          style={{
            ...handCommon,
            width: "2px",
            height: `${minuteHandHeight}px`,
            background: "#F6EF2CFF",
            transform: `translate(-50%, -100%) rotate(${minAngle}deg)`,
            filter: handShadow,
          }}
        />
        <div
          style={{
            ...handCommon,
            width: "1px",
            height: `${secondHandHeight}px`,
            background: "red",
            transform: `translate(-50%, -100%) rotate(${secAngle}deg)`,
            filter: handShadow,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "6px",
            height: "6px",
            background: "#444",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <div style={{ 
        fontSize: `${Math.max(8, clockSize * 0.25)}px`, 
        marginTop: "4px",
        textAlign: "center",
        lineHeight: "1.2",
        fontWeight: "500",
        fontFamily: fontName,
        filter: "saturate(3.5)", // saturation filter

        textShadow: `
          -2px 0 2px red,   /* red shadow to the left */
           2px 0 2px white  /* white shadow to the right */
        `
      }}>
        {zone.split('/').pop().replace(/_/g, " ")}
      </div>
    </div>
  );
}

export default function WorldClockGrid() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useCustomFont("MyCustomFont", myFontUrl);

  useEffect(() => {
    const handleResize = () => setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = dimensions.width < 768;
  const cols = isMobile ? 6 : 12;
  const rows = isMobile ? 4 : 2;

  const clockSize = Math.min(
    (dimensions.width - 20) / cols,
    (dimensions.height - 20) / rows
  ) - 10;

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: "5px",
    width: "100vw",
    height: "100vh",
    padding: "10px",
    boxSizing: "border-box",
    justifyItems: "center",
    alignItems: "center",
    placeContent: "center",
    fontFamily: "MyCustomFont",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat", 
    filter: "contrast(0.5) saturate(3.5)", // saturation filter

     };

  return (
    <div style={containerStyle}>
      {TIMEZONES.map((zone) => (
        <AnalogClock key={zone} zone={zone} clockSize={clockSize} fontName="MyCustomFont" />
      ))}
    </div>
  );
}
