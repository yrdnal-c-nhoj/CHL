import React, { useEffect, useState } from "react";
import rainFont from "./wish.ttf";
import skyFont from "./aaa.ttf";

export default function SkyClock() {
  const [localTime, setLocalTime] = useState("");
  const [skyGradient, setSkyGradient] = useState("");
  const [skyPhrase, setSkyPhrase] = useState("");
  const [fade, setFade] = useState(true);
  const [inverseColor, setInverseColor] = useState("#fff");

  useEffect(() => {
    updateTime();
    fadePhrase();

    const interval = setInterval(() => {
      updateTime();
      fadePhrase();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function updateTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeDecimal = hour + minute / 60;

    setLocalTime(`${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}`);

    // Sky gradient based on time
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

    // Inverse color for text contrast
    const hexMatch = gradient.match(/#([0-9a-fA-F]{6})/);
    if (hexMatch) {
      const hex = hexMatch[1];
      const r = 255 - parseInt(hex.substr(0, 2), 16);
      const g = 255 - parseInt(hex.substr(2, 2), 16);
      const b = 255 - parseInt(hex.substr(4, 2), 16);
      setInverseColor(`rgb(${r},${g},${b})`);
    }
  }

  function fadePhrase() {
    setFade(false);
    setTimeout(() => {
      setSkyPhrase(getSkyDescription());
      setFade(true);
    }, 1000);
  }

  function getSkyDescription() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeDecimal = hour + minute / 60;

    const adjectives1 = ["an ethereally","a transcendently","a deeply","a profoundly","a vividly","an endlessly","a vastly","am infinitely","a boundlessly","an atmospherically"];
    const adjectives2_day = ["luminous","shimmering","dazzling","glowing","glistening","sparkling","gleaming","bright","splendid","lustrous","majestic","wonderous","magical","beautiful","exquisite","vibrant"];
    const adjectives2_night = ["glimmering","shimmering","sparkling","enigmatical","romantical","sweet","dreami","soft","fleeting","nocturnal","tender","incandescent","twinkling","gent","sublime","delicate","divine","enchanting","rapturous","entrancing"];
    const adjectives2_twilight = ["hazi","gent","warm","glowing","enigmatical","tender","resplendent","soft","fleeting","tender","incandescent","sparkling","twinkling","sweet","gent","sublime","delicate","divine","enchanting","rapturous","entrancing"];
    const adjectives3 = ["blissful","gleeful","brilliant","harmonious","serene","splendid","tranquil","enchanted","peaceful","jubilant","exuberant","effervescent","buoyant","lighthearted","euphoric","cheerful","delightful","joy-suffused","mirthful"];

    const adjectives2 =
      hour >= 7 && hour < 17
        ? adjectives2_day
        : hour >= 4 && hour < 7 || hour >= 17 && hour < 20
        ? adjectives2_twilight
        : adjectives2_night;

    const randomPick = arr => arr[Math.floor(Math.random() * arr.length)];
    const phrase = (label) => `Wishing you<br>
  ${randomPick(adjectives1)}<br>
  ${randomPick(adjectives2)}<br>
  and<br>
  ${randomPick(adjectives3)}<br>
  ${label}.`;

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
    if (timeDecimal >= 14 && timeDecimal < 15.5) return phrase("mid-afternoon");
    if (timeDecimal >= 15.5 && timeDecimal < 17) return phrase("late afternoon");
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
        textShadow: `0 0.2rem 1rem ${inverseColor}80, 0 0 2rem ${inverseColor}50`,
        textAlign: "center",
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

      <div
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        {/* Time */}
        <div
          style={{
            fontSize: "9vh",
            fontFamily: "ClockFont, system-ui",
            marginBottom: "2vh",
            color: inverseColor,
          }}
        >
          {localTime}
        </div>

        {/* Phrase */}
        <div
          dangerouslySetInnerHTML={{ __html: skyPhrase }}
          style={{
            fontSize: "7vh",
            fontFamily: "SkyFont, system-ui",
            lineHeight: "7.5vh",
            color: inverseColor,
          }}
        />
      </div>
    </div>
  );
}
