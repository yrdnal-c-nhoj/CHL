import React, { useEffect, useState, useRef } from "react";
import rainFont from "./wish.otf";
import skyFont from "./wish.ttf";

export default function SkyClock() {
  const [localTime, setLocalTime] = useState("");
  const [skyGradient, setSkyGradient] = useState("");
  const [skyPhrase, setSkyPhrase] = useState("");
  const [fade, setFade] = useState(true);
  const [inverseGradient, setInverseGradient] = useState("linear-gradient(to bottom, #fff 0%, #fff 100%)");

  // Alphabetically sorted arrays
  const adjectives1 = [
    "a whimsically","a softly-harmonious","a joyfully","a gracefully","a miraculously",
    "a blissfully","a enchantingly","a softly","a magically-glimmering","a luminously",
    "a serenely","a exquisitely","a boundlessly","a softly-glowing","a dreamily",
    "a charmingly","a magically","a harmoniously","a serenely-glowing","a delicately",
    "a wondrously","a euphorically"
  ];

  const adjectives2_day = [
    "sunlit-lustrous","effulgently-lit","sparkling","radiantly-glowing","fiery",
    "luxuriantly-lit","glorious-lit","vibrant","majestic","effervescent","brightened",
    "radiantly-lit","gleamingly-bright","shiny-glistening","lively","prismatic","beaming",
    "sun-drenched","glimmering-lit","shiny-glimmering","splendiferous","illustrious",
    "radiantly-splendid","shiny","golden","bright","luxuriant","glorious-lit","glinting",
    "sun-kissed","dandy","sparklingly-bright","magnificent","effulgent-glow"
  ];

  const adjectives2_twilight = [
    "tranquil-lit","warm-glimmer","amber-lit","softly-tinted","resplendent","gentle-glimmering",
    "pastel-glow","hazy-lit","quiet-glow","mellow-lit","gentle","placid-lit","rosy-glow",
    "amber-hued","whispering","dusky","softly-glimmering","soft-glimmer-lit","quiet","tranquil-glimmer",
    "warm-hued","lavender-tinted","soft-hued","dusken","serenely-lit","pastel-tinted","roseate-lit",
    "hallowed","lavender-glow"
  ];

  const adjectives2_night = [
    "moonlit-glimmer","starlight-infused","moon-glimmering","ethereal-glow","glimmering",
    "moonbeam-lit","phantasmal-glow","twilight-lit","dim-lit","noctilucent","softly-radiant",
    "lunar","serenely-lit","dreamlike","hallowed-lit","starlight-lit","night-kissed","wispy",
    "ethereal-glimmer","celestial","mysteriously-lit","glacial-lit","moonlit-soft","quietly-glowing",
    "airy","phantasmic","starlit-glow","celestial-lit","phantasmal","lunar-lit","dreamy-lit",
    "enigmatic","silvery","gentle","silvery-lit","twilight-kissed","mystically-lit"
  ];

  const adjectives3 = [
    "gem of","thrill of","blessing of","radiance of","opulence of","zinger of","joy of",
    "catch of","bliss of","bloom of","masterpiece of","prize of","feast of","miracle of",
    "stunner of","luxe of","delight of","fantasy of","boon of","allure of",
    "paradise of","vision of","masterwork of","sensation of","mirage of","charmer of",
    "gemstone of","crown of","rhapsody of","elegance of","zest of","plum of","fire of",
    "epic of","thrill of","knockout of","panache of","boon of","wonderful of","elixir of",
    "divinity of","catch of","grandeur of","blessing of","sparkle of"
  ];

  // useRef to keep track of indexes for sequential cycling
  const index1 = useRef(0);
  const index2 = useRef(0);
  const index3 = useRef(0);

  useEffect(() => {
    updateTime();
    updatePhrase();

    const interval = setInterval(() => {
      updateTime();
      updatePhrase();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function updateTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeDecimal = hour + minute / 60;

    setLocalTime(`${String(hour).padStart(2,"0")}${String(minute).padStart(2,"0")}`);

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

    // Inverse gradient for text contrast
    const hexMatches = gradient.match(/#([0-9a-fA-F]{6})/g);
    if (hexMatches) {
      const invertedColors = hexMatches.map(hex => {
        const cleanHex = hex.replace('#','');
        const r = 255 - parseInt(cleanHex.substr(0,2),16);
        const g = 255 - parseInt(cleanHex.substr(2,2),16);
        const b = 255 - parseInt(cleanHex.substr(4,2),16);
        return `rgb(${r},${g},${b})`;
      });
      const percentages = gradient.match(/\d+%/g) || ['0%','33%','70%','100%'];
      const inverseGradientStops = invertedColors.map((color,i) =>
        `${color} ${percentages[i]||(i*100/(invertedColors.length-1))+'%'}`
      ).join(', ');
      setInverseGradient(`linear-gradient(to bottom, ${inverseGradientStops})`);
    }
  }

  function updatePhrase() {
    setFade(false);
    setTimeout(() => {
      setSkyPhrase(getNextPhrase());
      setFade(true);
    }, 1000);
  }

  function getNextPhrase() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeDecimal = hour + minute/60;

    let adjectives2;
    if (hour >= 7 && hour < 17) adjectives2 = adjectives2_day;
    else if ((hour >= 4 && hour < 7) || (hour >= 17 && hour < 20)) adjectives2 = adjectives2_twilight;
    else adjectives2 = adjectives2_night;

    // Each list advances independently
    const pick = arr => {
      let idxRef;
      if (arr === adjectives1) idxRef = index1;
      else if (arr === adjectives2) idxRef = index2;
      else idxRef = index3;

      const value = arr[idxRef.current];
      idxRef.current = (idxRef.current + 1) % arr.length;
      return value;
    };

    const phrase = label => `Wishing you<br>${pick(adjectives1)}<br>${pick(adjectives2)}<br>${pick(adjectives3)}<br>${label}.`;

    if (timeDecimal >= 0 && timeDecimal < 3) return phrase("a deep night");
    if (timeDecimal >= 3 && timeDecimal < 4) return phrase("the dead of night");
    if (timeDecimal >= 4 && timeDecimal < 4.5) return phrase("a pre-dawn");
    if (timeDecimal >= 4.5 && timeDecimal < 5.5) return phrase("an Astronomical Twilight");
    if (timeDecimal >= 5.5 && timeDecimal < 6.25) return phrase("a Nautical Twilight");
    if (timeDecimal >= 6.25 && timeDecimal < 7) return phrase("a Civil Twilight");
    if (timeDecimal >= 7 && timeDecimal < 9) return phrase("a morning");
    if (timeDecimal >= 9 && timeDecimal < 11) return phrase("a mid-morning");
    if (timeDecimal >= 11 && timeDecimal < 12) return phrase("a late morning");
    if (timeDecimal >= 12 && timeDecimal < 14) return phrase("an early afternoon");
    if (timeDecimal >= 14 && timeDecimal < 15.5) return phrase("a mid-afternoon");
    if (timeDecimal >= 15.5 && timeDecimal < 17) return phrase("a late afternoon");
    if (timeDecimal >= 17 && timeDecimal < 18.25) return phrase("a Civil Twilight");
    if (timeDecimal >= 18.25 && timeDecimal < 19.15) return phrase("a Nautical Twilight");
    if (timeDecimal >= 19.15 && timeDecimal < 20) return phrase("an Astronomical Twilight");
    if (timeDecimal >= 20 && timeDecimal < 22) return phrase("an evening");
    return phrase("night");
  }

  const today = new Date().toISOString().split('T')[0].replace(/-/g,'');
  const clockFontFamily = `ClockFont${today}`;
  const skyFontFamily = `SkyFont${today}`;

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
        textAlign: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <style>
        {`
          @font-face {
            font-family: '${clockFontFamily}';
            src: url(${rainFont}) format('opentype');
          }
          @font-face {
            font-family: '${skyFontFamily}';
            src: url(${skyFont}) format('truetype');
          }
        `}
      </style>

      <div
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity 1s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2vh",
          transform: "translateY(-5vh)",
        }}
      >
        {/* Time */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              fontSize: "16vh",
              fontFamily: `'${clockFontFamily}', system-ui`,
              color: "#000",
              textShadow: "1px 0 0 #000",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {localTime}
          </div>
          <div
            style={{
              fontSize: "16vh",
              fontFamily: `'${clockFontFamily}', system-ui`,
              color: "#fff",
              textShadow: "-1px 0 0 #fff",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {localTime}
          </div>
          <div
            style={{
              fontSize: "16vh",
              fontFamily: `'${clockFontFamily}', system-ui`,
              backgroundImage: inverseGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",
            }}
          >
            {localTime}
          </div>
        </div>

        {/* Phrase */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            dangerouslySetInnerHTML={{ __html: skyPhrase }}
            style={{
              fontSize: "7vh",
              fontFamily: `'${skyFontFamily}', system-ui`,
              lineHeight: "7.5vh",
              color: "#000",
              textShadow: "1px 0 0 #000",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <div
            dangerouslySetInnerHTML={{ __html: skyPhrase }}
            style={{
              fontSize: "7vh",
              fontFamily: `'${skyFontFamily}', system-ui`,
              lineHeight: "7.5vh",
              color: "#fff",
              textShadow: "-1px 0 0 #fff",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <div
            dangerouslySetInnerHTML={{ __html: skyPhrase }}
            style={{
              fontSize: "7vh",
              fontFamily: `'${skyFontFamily}', system-ui`,
              lineHeight: "7.5vh",
              backgroundImage: inverseGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",
            }}
          />
        </div>
      </div>
    </div>
  );
}