import React, { useEffect, useState } from "react";
import rainFont from "./wish.otf";
import skyFont from "./wish.ttf";

export default function SkyClock() {
  const [localTime, setLocalTime] = useState("");
  const [skyGradient, setSkyGradient] = useState("");
  const [skyPhrase, setSkyPhrase] = useState("");
  const [fade, setFade] = useState(true);
  const [inverseGradient, setInverseGradient] = useState("linear-gradient(to bottom, #fff 0%, #fff 100%)");

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

    // Inverse gradient for text contrast
    const hexMatches = gradient.match(/#([0-9a-fA-F]{6})/g);
    if (hexMatches) {
      const invertedColors = hexMatches.map(hex => {
        const cleanHex = hex.replace('#', '');
        const r = 255 - parseInt(cleanHex.substr(0, 2), 16);
        const g = 255 - parseInt(cleanHex.substr(2, 2), 16);
        const b = 255 - parseInt(cleanHex.substr(4, 2), 16);
        return `rgb(${r},${g},${b})`;
      });
      
      // Extract percentages from original gradient
      const percentages = gradient.match(/\d+%/g) || ['0%', '33%', '70%', '100%'];
      
      // Build inverse gradient
      const inverseGradientStops = invertedColors.map((color, i) => 
        `${color} ${percentages[i] || (i * 100 / (invertedColors.length - 1)) + '%'}`
      ).join(', ');
      
      setInverseGradient(`linear-gradient(to bottom, ${inverseGradientStops})`);
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
    
    const adjectives1 = [
      "an ethereally", "a transcendently", "a deeply", "a profoundly", "a vividly",
      "an endlessly", "a vastly", "am infinitely", "a boundlessly", "an atmospherically",
      "a magically", "a subtly", "a luminously", "an exquisitely", "a serenely",
      "a delicately", "a harmoniously", "an enchantingly", "a blissfully", "a radiantly",
      "a wondrously", "a dreamily", "a softly", "an elegantly", "a miraculously",
      "a gracefully", "a celestialy", "a charmingly", "a euphorically", "a sparklingly",
      "a luminously", "a joyfully", "a gloriously", "a luminously-lit", "a whimsically",
      "a melodiously", "a quietly", "a sweetly", "a tranquilly", "a serenely-lit",
      "a resplendently", "a luminously-glowing", "a harmoniously-blessed", "a blissfully-lighted",
      "a dreamlike", "a magically-lit", "a radiantly-bright", "a infinitely-luminous", "a softly-glowing",
      "a exquisitely-gentle", "a fantastically", "a splendidly-lit", "a beautifully-lit", "a enchantingly-soft",
      "a luminously-harmonious", "a celestial-lit", "a serenely-glowing", "a blissfully-soft", "a magically-glimmering",
      "a joy-suffused", "a harmoniously-lit", "a tranquilly-glowing", "a delightfully", "a peacefully-lit",
      "a luminous-glistening", "a gloriously-soft", "a splendidly-glowing", "a dreamily-lit", "a softly-harmonious",
      "a radiantly-harmonious", "a enchantingly-bright", "a blissfully-glowing", "a exquisitely-luminous", "a magically-harmonious",
      "a wondrously-soft", "a joyfully-glimmering", "a luminously-bright", "a serenely-harmonious", "a delicately-lit",
      "a charmingly-glowing", "a peacefully-bright", "a radiant-soft", "a euphorically-lit", "a whimsically-bright",
      "a gently-lit", "a glowingly", "a lightly-lit", "a serenely-bright", "a magnificently-soft",
      "a dreamily-bright", "a delightfully-glimmering", "a harmoniously-glimmering", "a luminously-glittering", "a blissfully-bright",
      "a gloriously-lit", "a soft-glimmering", "a splendidly-lit", "a beautifully-glowing", "a enchantingly-lit"
    ];

    const adjectives2_day = [
      "luminous", "shimmering", "dazzling", "glowing", "glistening", "sparkling",
      "gleaming", "bright", "splendid", "lustrous", "majestic", "wonderous",
      "magical", "beautiful", "exquisite", "vibrant", "radiant", "effulgent", "glorious",
      "brilliant", "resplendent", "sunlit", "illuminated", "glinting", "sparkly",
      "glaring", "fiery", "sun-drenched", "beaming", "scintillating", "polished",
      "glittering", "effervescent", "golden", "lively", "vivacious", "shiny", "brilliantly-colored",
      "radiantly-lit", "dandy", "luxuriant", "magnificent", "prismatic", "gleamy", "lustrously",
      "splendiferous", "flourishing", "illustrious", "sunshiny", "brilliance-filled", "radiantly-glowing",
      "glorious-lit", "sparklingly-bright", "sun-kissed", "brightened", "shiny-glimmering", "effulgently-lit",
      "shiny-glistening", "resplendently-lit", "vividly-lit", "sunbright", "shiny-splendid", "flaming", "fiery-glow",
      "brilliance-filled", "illuminantly", "radiant-sparkling", "sunshine-laden", "scintillatingly-lit", "glisteningly-bright",
      "radiantly-shining", "glimmering-lit", "sun-glowing", "gleamingly-bright", "dazzlingly-lit", "lustrous-lit",
      "effulgent-glow", "resplendent-glimmering", "sparklingly-glorious", "magnificently-lit", "luxuriantly-lit", "gloriously-bright",
      "bright-splendid", "vivid-lit", "resplendent-sparkling", "sun-drenched-glow", "shiny-glistening-lit", "radiantly-splendid",
      "glorious-glistening", "illustriously-lit", "sun-glimmered", "glowing-splendid", "sparklingly-vibrant", "luminous-glorious",
      "glistening-sparkling", "sunlit-lustrous", "shiny-lustrously", "effulgent-sparkling", "glimmering-radiant"
    ];

    const adjectives2_night = [
      "glimmering", "shimmering", "sparkling", "enigmatical", "romantical", "sweet",
      "dreami", "soft", "fleeting", "nocturnal", "tender", "incandescent",
      "twinkling", "gentle", "sublime", "delicate", "divine", "enchanting",
      "rapturous", "entrancing", "moonlit", "starlit", "mysterious", "ethereal",
      "phantasmal", "hushed", "silvery", "shadowy", "celestial", "quiet", "gossamer",
      "night-kissed", "tranquil", "mellow", "glacial", "softly-lit", "twilight-hued",
      "enrapturing", "melodious", "dreamlike", "sublimely-lit", "wispy", "lunar",
      "serene", "phantasmic", "airy", "glinting", "enveloping", "mysteriously-lit",
      "starlight-infused", "noctilucent", "celestially", "radiantly-dark", "enigmatic",
      "shadow-kissed", "moonbeam-lit", "softly-glimmering", "silvery-lit", "dimly-glowing",
      "twilight-lit", "ethereally-lit", "calmly-lit", "hushed-lit", "softly-radiant", "quietly-glowing",
      "starlight-lit", "moon-glimmering", "glacial-lit", "dreamy-lit", "serenely-lit", "delicately-lit",
      "nocturnally-lit", "celestial-lit", "gentle-glow", "lunar-lit", "shadowy-lit", "ethereal-glow",
      "mystically-lit", "moonlit-glimmer", "starlit-glow", "twilight-glow", "hallowed-lit", "softly-enchanted",
      "nightly-glimmering", "glimmer-lit", "dim-lit", "shadow-kissed-lit", "celestial-glimmer", "dreamily-lit",
      "silvery-glimmer", "phantasmal-glow", "twilight-kissed", "ethereal-glimmer", "moonlit-soft"
    ];

    const adjectives2_twilight = [
      "hazy", "gentle", "warm", "glowing", "enigmatical", "tender", "resplendent",
      "soft", "fleeting", "tender", "incandescent", "sparkling", "twinkling",
      "sweet", "gent", "sublime", "delicate", "divine", "enchanting", "rapturous",
      "entrancing", "dusky", "muted", "golden", "rosy", "tranquil", "mellow", "serene",
      "dreamlike", "whispering", "peaceful", "amber-hued", "honeyed", "sunset-kissed",
      "lavender-tinted", "roseate", "softly-glimmering", "gently-lit", "warm-hued",
      "shadowed", "faintly-glowing", "gilded", "calm", "simmering", "pastel-tinted",
      "twilight-infused", "hallowed", "dusken", "mystically-tinted", "golden-hued",
      "quiet", "placid", "soft-hued", "serenely-lit", "gentle-glimmering", "peacefully-lit",
      "amber-lit", "rose-lit", "dusky-glow", "tranquil-lit", "mellow-lit", "soft-glowing",
      "golden-lit", "rosy-glow", "warm-glimmer", "hazy-lit", "muted-lit", "serenely-glow",
      "softly-tinted", "gentle-glow", "peaceful-glimmer", "dusky-glimmer", "honeyed-lit",
      "pastel-glow", "tranquil-glimmer", "twilight-lit", "golden-glimmer", "lavender-glow",
      "roseate-lit", "soft-glimmer-lit", "mellow-glimmer", "quiet-glow", "serene-glimmer",
      "gilded-glow", "placid-lit", "calm-glimmer", "hallowed-glow"
    ];

    const adjectives3 = [
      "humdinger of", "beauty of", "gem of", "wonder of", "marvel of",
      "delight of", "treasure of", "jewel of", "masterpiece of", "miracle of",
      "splendor of", "blessing of", "magic of", "legend of", "wonderful of",
      "charm of", "dazzler of", "pearl of", "triumph of", "sparkle of",
      "glory of", "radiance of", "spectacle of", "gift of",
      "stunner of", "brilliance of", "whiz of", "sensation of", "dream of",
      "epic of", "paradise of", "vision of", "phenomenon of", "joy of",
      "star of", "knockout of", "masterwork of", "gemstone of", "rarity of",
      "bliss of", "grandeur of", "charmer of", "whopper of",
      "glimmer of", "awe of", "shine of", "luster of", "glamour of",
      "feast of", "thrill of", "crown of", "bounty of", "elegance of",
      "mirage of", "bloom of", "glitz of", "haven of", "spark of",
      "zinger of", "prize of", "delicacy of", "enchantment of", "fantasy of",
      "lark of", "gleam of", "whimsy of", "rapture of",
      "vibrance of", "pinnacle of", "allure of", "grace of",
      "divinity of", "opulence of", "panache of", "flair of",
      "jolt of", "oasis of", "rhapsody of", "boon of", "luxe of",
      "zest of",
      "sizzle of", "elixir of", "dash of", "fire of",
      "plum of", "score of", "catch of", "blooming of", "radiant of"
    ];

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
  ${randomPick(adjectives3)}<br>
  ${label}.`;

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

  // Generate unique font family names with today's date
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
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
      }}
    >
      <style>
        {`
          @font-face {
            font-family: '${clockFontFamily}';
            src: url(${rainFont}) format('truetype');
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
        }}
      >
        {/* Time */}
        <div
          style={{
            fontSize: "20vh",
            fontFamily: `'${clockFontFamily}', system-ui`,
            marginBottom: "2vh",
            backgroundImage: inverseGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            MozBackgroundClip: "text",
            MozTextFillColor: "transparent",
             textShadow: `
      1px 0 #fff,    /* white on the right */
      -1px 0 #000     /* black on the left */
    `,
          }}
        >
          {localTime}
        </div>

        {/* Phrase */}
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
            MozBackgroundClip: "text",
            MozTextFillColor: "transparent",
             textShadow: `
      1px 0 #fff,    /* white on the right */
      -1px 0 #000     /* black on the left */
    `,
          }}


          
        />
      </div>
    </div>
  );
}